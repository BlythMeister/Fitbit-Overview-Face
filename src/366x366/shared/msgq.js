import { inbox, outbox } from "file-transfer";
import { encode } from "cbor";

//====================================================================================================
// Initialize
//====================================================================================================

let debugSentReceive = false;
let debugMessages = false;
let debugFileTransferMessages = false;
let queueHp = [];
let queueLp = [];
let onMessageHandler = null;
let otherQueueSize = 0;
let waitingForId = null;
let lastSent = null;
let lastReceived = null;
let delayedProcessCallTimeout = null;
let delayedProcessCallAt = null;
let consecutiveQueueEmpty = 0;

//====================================================================================================
// Helpers
//====================================================================================================
function GetQueueSize() {
  return queueHp.length + queueLp.length;
}

function GetOtherQueueSize() {
  return otherQueueSize;
}

function GetLastSent() {
  return lastSent;
}

function GetLastReceived() {
  return lastReceived;
}

function IsWaitingForResponse() {
  return waitingForId != null;
}

function CreateUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

//====================================================================================================
// Enqueue
//====================================================================================================

function enqueue(messageKey, message, highPriority) {
  if (queueHp.length + queueLp.length >= 99) {
    throw "Queue too big";
  }

  const uuid = CreateUUID();
  const id = `${messageKey}#${uuid}`;

  const data = { id: id, uuid: uuid, messageKey: messageKey, message: message };

  dequeue(null, messageKey);
  if (highPriority) {
    queueHp.push(data);
  } else {
    queueLp.push(data);
  }

  if (debugMessages) {
    console.log(`MQ::Enqueued message ${id} - ${messageKey} - ${JSON.stringify(message)} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
  }

  delayedProcess(1000);
}

//====================================================================================================
// Dequeue
//====================================================================================================

function dequeue(messageId, messageKey) {
  if (queueHp.length == 0 && queueLp.length == 0) {
    if (debugMessages) {
      console.log("MQ::Dequeue when queue empty, skipping");
    }
    return;
  }

  if (messageId) {
    if (debugMessages) {
      console.log(`MQ::Try dequeue message ${messageId}`);
    }

    var dequeueResult = false;
    if (queueHp.length > 0 && queueHp[0].id == messageId) {
      if (debugMessages) {
        console.log(`MQ::Top message in queue is match for id ${messageId}`);
      }
      queueHp.splice(0, 1);
      dequeueResult = true;
    } else {
      for (var i = queueHp.length - 1; i >= 0; i--) {
        var id = queueHp[i].id;
        if (id === messageId) {
          queueHp.splice(i, 1);
          dequeueResult = true;
          break;
        }
      }
    }
    if (!dequeueResult) {
      if (queueLp.length > 0 && queueLp[0].id == messageId) {
        if (debugMessages) {
          console.log(`MQ::Top message in queue is match for id ${messageId}`);
        }
        queueLp.splice(0, 1);
        dequeueResult = true;
      } else {
        for (var i = queueLp.length - 1; i >= 0; i--) {
          var id = queueLp[i].id;
          if (id === messageId) {
            queueLp.splice(i, 1);
            dequeueResult = true;
            break;
          }
        }
      }
    }

    if (debugMessages) {
      if (dequeueResult) {
        console.log(`MQ::Dequeued message ${messageId} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
      } else {
        console.warn(`MQ::Message not queued with ID ${messageId} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
      }
    }
  } else if (messageKey) {
    if (debugMessages) {
      console.log(`MQ::Try dequeue message with key ${messageKey}`);
    }
    for (var i = queueHp.length - 1; i >= 0; i--) {
      var key = queueHp[i].messageKey;
      if (key === messageKey) {
        var data = queueHp.splice(i, 1)[0];
        if (debugMessages) {
          console.log(`MQ::Dequeued message ${data.id} from key ${messageKey} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
        }
      }
    }
    for (var i = queueLp.length - 1; i >= 0; i--) {
      var key = queueLp[i].messageKey;
      if (key === messageKey) {
        var data = queueLp.splice(i, 1)[0];
        if (debugMessages) {
          console.log(`MQ::Dequeued message ${data.id} from key ${messageKey} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
        }
      }
    }
  } else {
    if (debugMessages) {
      console.log("MQ::No ID or MessageKey to dequeue");
    }
  }
}

//====================================================================================================
// Requeue
//====================================================================================================

function requeue(messageId) {
  var isHp = true;
  var data = null;

  if (queueHp.length > 0 && queueHp[0].id == messageId) {
    if (debugMessages) {
      console.log(`MQ::Top message in queue is match for id ${messageId}`);
    }
    data = queueHp.splice(0, 1)[0];
  } else {
    for (var i = queueHp.length - 1; i >= 0; i--) {
      var id = queueHp[i].id;
      if (id === messageId) {
        data = queueHp.splice(i, 1)[0];
        break;
      }
    }
  }

  if (data == null) {
    isHp = false;
    if (queueLp.length > 0 && queueLp[0].id == messageId) {
      if (debugMessages) {
        console.log(`MQ::Top message in queue is match for id ${messageId}`);
      }
      data = queueLp.splice(0, 1)[0];
    } else {
      for (var i = queueLp.length - 1; i >= 0; i--) {
        var id = queueLp[i].id;
        if (id === messageId) {
          data = queueLp.splice(i, 1)[0];
          break;
        }
      }
    }
  }

  if (data != null) {
    if (debugMessages) {
      console.log(`MQ::Dequeued message (for requeue) ${messageId} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
    }

    var newUuid = CreateUUID();
    if (debugMessages) {
      console.log(`MQ::Update UUID. - Old: ${data.uuid} / New: ${newUuid}`);
    }
    data.uuid = newUuid;
    data.id = `${data.messageKey}#${newUuid}`;

    if (isHp) {
      queueHp.push(data);
    } else {
      queueLp.push(data);
    }

    if (debugMessages) {
      console.log(`MQ::Enqueued message (for requeue) ${messageId} - ${JSON.stringify(data)} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
    }
  } else {
    console.warn(`MQ::Message ${messageId} not on queue so not requeued - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
  }
}

//====================================================================================================
// Process Queue
//====================================================================================================

function delayedProcess(delay) {
  let setNewTime = false;
  if (delayedProcessCallTimeout == null) {
    if (debugMessages) {
      console.log(`MQ::no current delay`);
    }
    setNewTime = true;
  } else {
    let msToEnd = delayedProcessCallAt - new Date().getTime();

    if (msToEnd > delay) {
      setNewTime = true;
    }
  }

  if (setNewTime) {
    if (debugMessages) {
      console.log(`MQ::Calling process in ${delay}ms`);
    }

    if (delayedProcessCallTimeout != null) {
      clearTimeout(delayedProcessCallTimeout);
      delayedProcessCallTimeout = null;
      delayedProcessCallAt = null;
    }

    delayedProcessCallTimeout = setTimeout(process, delay);
    delayedProcessCallAt = new Date().getTime() + delay;
  }
}

function process() {
  if (delayedProcessCallTimeout != null) {
    clearTimeout(delayedProcessCallTimeout);
    delayedProcessCallTimeout = null;
    delayedProcessCallAt = null;
  }

  if (queueHp.length + queueLp.length === 0) {
    consecutiveQueueEmpty++;
    if (consecutiveQueueEmpty >= 3) {
      return;
    }

    if (debugMessages) {
      console.log(`MQ::Queue empty, call process again in 5 seconds`);
    }
    delayedProcess(5000);
    return;
  } else {
    consecutiveQueueEmpty = 0;
  }

  var lastSentAge = Date.now() - lastSent;
  if (lastSentAge < 500) {
    var delay = 500 - lastSentAge;
    if (debugMessages) {
      console.log(`MQ::Less than 500ms since last send, backoff ${delay}ms`);
    }
    delayedProcess(delay);
    return;
  }

  if (waitingForId != null) {
    if (lastSent == null || Date.now() - lastSent >= 10000) {
      console.warn(`MQ::Waiting for receipt (${waitingForId}) for over 10 seconds, resending!`);
      requeue(waitingForId);
      waitingForId = null;
      delayedProcess(1000);
    } else {
      if (debugMessages) {
        console.log(`MQ::Waiting for a receipt (${waitingForId}) call process again in 1 second`);
      }
      delayedProcess(1000);
    }
    return;
  }

  let queueItem = null;
  if (queueHp.length > 0) {
    if (queueHp[0] == null) {
      if (debugMessages) {
        console.log(`MQ::Top queue item is null, removing & call process again`);
      }
      queueHp.splice(0, 1);
      delayedProcess(1000);
      return;
    } else {
      queueItem = queueHp[0];
    }
  } else if (queueLp.length > 0) {
    if (queueLp[0] == null) {
      if (debugMessages) {
        console.log(`MQ::Top queue item is null, removing & call process again`);
      }
      queueLp.splice(0, 1);
      delayedProcess(1000);
      return;
    } else {
      queueItem = queueLp[0];
    }
  }

  if (queueItem == null) {
    console.warn(`MQ::Queue item is null, call delay process in 1 second`);
    delayedProcess(1000);
    return;
  }

  try {
    if (debugSentReceive) {
      console.log(`MQ::Sending message ${queueItem.id} - ${queueItem.messageKey} - ${JSON.stringify(queueItem.message)}`);
    }
    waitingForId = queueItem.id;
    lastSent = Date.now();
    send(`m_${queueItem.messageKey}`, { msgqType: "msgq_message", qSize: Math.max(0, queueHp.length + queueLp.length - 1), id: queueItem.id, msgqKey: queueItem.messageKey, msgqMessage: queueItem.message });
  } catch (e) {
    waitingForId = null;
    console.warn(`MQ::Send error, call process again in 2 seconds.${e}`);
    delayedProcess(2000);
  }
}

function onMessage(event) {
  lastReceived = Date.now();
  const type = event.data.msgqType;
  const id = event.data.id;
  otherQueueSize = event.data.qSize;

  if (debugSentReceive) {
    console.log(`MQ::Got message ${id} - type ${type}. - Other QSize: ${otherQueueSize}`);
  }

  if (type == "msgq_message") {
    const messageKey = event.data.msgqKey;
    const message = event.data.msgqMessage;

    if (debugMessages) {
      console.log(`MQ::Message content ${id} - ${messageKey} -> ${JSON.stringify(message)}`);
    }

    try {
      if (debugSentReceive) {
        console.log(`MQ::Sending receipt for ${id}`);
      }
      send(`r_${messageKey}`, { msgqType: "msgq_receipt", qSize: Math.max(0, queueHp.length + queueLp.length - 1), id: id });
    } catch (e) {
      console.error(`MQ::${e}`);
    }

    try {
      onMessageHandler(messageKey, message);
    } catch (e) {
      console.error(`MQ::Error handling ${id} - ${messageKey} -> ${JSON.stringify(message)}. ${e}`);
    }
  } else if (type == "msgq_receipt") {
    if (debugSentReceive) {
      console.log(`MQ::Got receipt for ${id}`);
    }
    dequeue(id, null);
    if (waitingForId == id) {
      waitingForId = null;
      delayedProcess(1000);
    }
  }
}

//====================================================================================================
// File transfer
//====================================================================================================

const MESSAGE_FILE_NAME = "omsgq";

function send(key, data) {
  let name = `${MESSAGE_FILE_NAME}.${key.replace(":", "_")}.cbor`;
  if (debugFileTransferMessages) {
    console.log(`FT::Queuing '${name}' : ${JSON.stringify(data)}`);
  }
  outbox
    .enqueue(name, encode(data))
    .then((ft) => {
      if (debugFileTransferMessages) {
        console.log(`FT::Queued '${name}'`);
      }
    })
    .catch((e) => {
      console.error(`FT::Error enqueue. ${e}`);
    });
}

async function initFileListener(isCompanion) {
  if (isCompanion) {
    async function processCompanionFiles() {
      try {
        let file;
        while ((file = await inbox.pop())) {
          try {
            if (file != null) {
              let searchFileName = file.name.substring(0, file.name.indexOf("."));
              if (debugFileTransferMessages) {
                console.log(`FT::Inbox Pop file '${file.name}' search: ${searchFileName}`);
              }

              if (searchFileName === MESSAGE_FILE_NAME) {
                const payload = {};
                payload.data = await file.cbor();
                if (debugFileTransferMessages) {
                  console.log(`FT::Call On Message: ${JSON.stringify(payload)}`);
                }

                onMessage(payload);
              }
            }
          } catch (e) {
            console.error(`Error processing file: ${e}`);
          }
        }
      } catch (e) {
        console.error(`Error processing files: ${e}`);
      }
    }

    if (debugMessages) {
      console.log(`FT::Starting companion file listener`);
    }
    inbox.addEventListener("newfile", processCompanionFiles);
    await processCompanionFiles();
  } else {
    const { readFileSync } = require("fs");

    function processDeviceFiles() {
      try {
        let fileName;
        while ((fileName = inbox.nextFile())) {
          try {
            if (fileName != null) {
              let searchFileName = fileName.substring(0, fileName.indexOf("."));
              if (debugFileTransferMessages) {
                console.log(`FT::Inbox Pop file '${fileName}' search: ${searchFileName}`);
              }

              if (searchFileName === MESSAGE_FILE_NAME) {
                const payload = {};
                payload.data = readFileSync(fileName, "cbor");
                if (debugFileTransferMessages) {
                  console.log(`FT::Call On Message: ${JSON.stringify(payload)}`);
                }
                onMessage(payload);
              }
            }
          } catch (e) {
            console.error(`Error processing file: ${e}`);
          }
        }
      } catch (e) {
        console.error(`Error processing files: ${e}`);
      }
    }

    if (debugMessages) {
      console.log(`FT::Starting app file listener`);
    }
    inbox.addEventListener("newfile", processDeviceFiles);
    processDeviceFiles();
  }
}

//====================================================================================================
// Exports
//====================================================================================================
let initCalled = false;
const msgq = {
  send: enqueue,
  addEventListener: function (event, handler) {
    if (event == "message") {
      onMessageHandler = handler;
    } else {
      throw `Unknown event ${event}`;
    }

    if (!initCalled) {
      initCalled = true;
      initFileListener(inbox.pop).catch((e) => {
        console.error(`MSGQ::Init error. ${e}`);
      });
    }
  },
  getQueueSize: GetQueueSize,
  getOtherQueueSize: GetOtherQueueSize,
  getLastSent: GetLastSent,
  getLastReceived: GetLastReceived,
  getIsWaitingForResponse: IsWaitingForResponse,
};

export { msgq };
