import { messaging } from "./msgSender.js";

//====================================================================================================
// Initialize
//====================================================================================================

let debugMessages = false;
let queueHp = [];
let queueLp = [];
let otherQueueSize = 0;
let waitingForId = null;
let lastSent = null;
let lastReceived = null;
let delayedProcessCallTimeout = null;
let delayedProcessCallAt = null;
let consecutiveQueueEmpty = 0;

setInterval(function () {
  var lastSentAge = lastSent == null ? 999999 : Date.now() - lastSent;
  var lastReceivedAge = lastReceived == null ? 999999 : Date.now() - lastReceived;
  if (lastSentAge > 120000 && lastReceivedAge > 120000) {
    try {
      enqueue("msgq_nudge", {}, -1, false);
    } catch (e) {
      //Do Nothing
    }
  }
}, 60000);

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
    console.log(`Enqueued message ${id} - ${messageKey} - ${JSON.stringify(message)} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
  }

  delayedProcess(100);
}

//====================================================================================================
// Dequeue
//====================================================================================================

function dequeue(messageId, messageKey) {
  if (queueHp.length == 0 && queueLp.length == 0) {
    if (debugMessages) {
      console.log("Dequeue when queue empty, skipping");
    }
    return;
  }

  if (messageId) {
    if (debugMessages) {
      console.log(`Try dequeue message ${messageId}`);
    }

    var dequeueResult = false;
    if (queueHp.length > 0 && queueHp[0].id == messageId) {
      if (debugMessages) {
        console.log(`Top message in queue is match for id ${messageId}`);
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
          console.log(`Top message in queue is match for id ${messageId}`);
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
        console.log(`Dequeued message ${messageId} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
      } else {
        console.warn(`Message not queued with ID ${messageId} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
      }
    }
  } else if (messageKey) {
    if (debugMessages) {
      console.log(`Try dequeue message with key ${messageKey}`);
    }
    for (var i = queueHp.length - 1; i >= 0; i--) {
      var key = queueHp[i].messageKey;
      if (key === messageKey) {
        queueHp.splice(i, 1);
        if (debugMessages) {
          console.log(`Dequeued message ${messageId} from key ${messageKey} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
        }
      }
    }
    for (var i = queueLp.length - 1; i >= 0; i--) {
      var key = queueLp[i].messageKey;
      if (key === messageKey) {
        queueLp.splice(i, 1);
        if (debugMessages) {
          console.log(`Dequeued message ${messageId} from key ${messageKey} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
        }
      }
    }
  } else {
    if (debugMessages) {
      console.log("No ID or MessageKey to dequeue");
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
      console.log(`Top message in queue is match for id ${messageId}`);
    }
    data = queueHp.splice(0, 1)[0];
  } else {
    for (var i = queueHp.length - 1; i >= 0; i--) {
      var id = queueHp[i].id;
      if (id === messageId) {
        data = queueHp.splice(i, 1);
        break;
      }
    }
  }

  if (data == null) {
    isHp = false;
    if (queueLp.length > 0 && queueLp[0].id == messageId) {
      if (debugMessages) {
        console.log(`Top message in queue is match for id ${messageId}`);
      }
      data = queueLp.splice(0, 1)[0];
    } else {
      for (var i = queueLp.length - 1; i >= 0; i--) {
        var id = queueLp[i].id;
        if (id === messageId) {
          data = queueLp.splice(i, 1);
          break;
        }
      }
    }
  }

  if (data != null) {
    if (debugMessages) {
      console.log(`Dequeued message (for requeue) ${messageId} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
    }

    if (isHp) {
      queueHp.push(data);
    } else {
      queueLp.push(data);
    }

    if (debugMessages) {
      console.log(`Enqueued message (for requeue) ${messageId} - ${JSON.stringify(data)} - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
    }
  } else {
    console.warn(`Message ${messageId} not on queue so not requeued - QueueSizeHp: ${queueHp.length}/QueueSizeLp: ${queueLp.length}`);
  }
}

//====================================================================================================
// Process Queue
//====================================================================================================

function delayedProcess(delay) {
  let setNewTime = false;
  if (delayedProcessCallTimeout == null) {
    if (debugMessages) {
      console.log(`no current delay`);
    }
    setNewTime = true;
  } else {
    let msToEnd = delayedProcessCallAt - new Date().getTime();

    if (msToEnd < 0) {
      if (debugMessages) {
        console.log(`Calling process as delay due in under 0ms`);
      }
      process();
      return;
    }

    if (msToEnd > delay) {
      setNewTime = true;
    }
  }

  if (setNewTime) {
    if (debugMessages) {
      console.log(`Calling process in ${delay}ms`);
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
      console.log(`Queue empty, call process again in 5 seconds`);
    }
    delayedProcess(5000);
    return;
  } else {
    consecutiveQueueEmpty = 0;
  }

  var lastSentAge = Date.now() - lastSent;
  if (lastSentAge < 50) {
    var delay = 50 - lastSentAge;
    if (debugMessages) {
      console.log(`Less than 50ms since last send, backoff ${delay}ms`);
    }
    delayedProcess(delay);
    return;
  }

  if (waitingForId != null) {
    if (lastSent == null || Date.now() - lastSent >= 4000) {
      console.warn(`Waiting for receipt (${waitingForId}) for over 4 seconds, resending!`);
      var requeueId = waitingForId;
      waitingForId = null;
      requeue(requeueId);
      delayedProcess(50);
    } else {
      if (debugMessages) {
        console.log(`Waiting for a receipt (${waitingForId}) call process again in 250ms`);
      }
      delayedProcess(250);
    }
    return;
  }

  let queueItem = null;
  if (queueHp.length > 0) {
    if (queueHp[0] == null) {
      if (debugMessages) {
        console.log(`Top queue item is null, removing & call process again`);
      }
      queueHp.splice(0, 1);
      process();
      return;
    } else {
      queueItem = queueHp[0];
    }
  } else if (queueLp.length > 0) {
    if (queueLp[0] == null) {
      if (debugMessages) {
        console.log(`Top queue item is null, removing & call process again`);
      }
      queueLp.splice(0, 1);
      process();
      return;
    } else {
      queueItem = queueLp[0];
    }
  }

  if (queueItem == null) {
    console.warn(`Queue item is null, call delay process in 1 second`);
    delayedProcess(1000);
    return;
  }

  try {
    if (debugMessages) {
      console.log(`Sending message ${queueItem.id} - ${queueItem.messageKey} - ${JSON.stringify(queueItem.message)}`);
    }
    messaging.send(`m_${queueItem.uuid}`, { msgqType: "msgq_message", qSize: Math.max(0, queueHp.length + queueLp.length - 1), id: queueItem.id, msgqMessage: queueItem });
    waitingForId = queueItem.id;
    lastSent = Date.now();
  } catch (e) {
    waitingForId = null;
    console.warn(e);
    console.warn(`Send error, call process again in 1 seconds`);
    delayedProcess(1000);
  }
}

function onMessage(event) {
  lastReceived = Date.now();
  const type = event.data.msgqType;
  const id = event.data.id;
  const uuid = event.data.uuid;
  otherQueueSize = event.data.qSize;

  if (debugMessages) {
    console.log(`Got message ${id} - type ${type}. - Other QSize: ${otherQueueSize}`);
  }

  if (type == "msgq_message") {
    const messageKey = event.data.msgqMessage.messageKey;
    const message = event.data.msgqMessage.message;

    if (debugMessages) {
      console.log(`Message content ${id} - ${messageKey} -> ${JSON.stringify(message)}`);
    }

    try {
      msgq.onmessage(messageKey, message);
    } catch (e) {
      console.error(`Error handling ${id} - ${messageKey} -> ${JSON.stringify(message)}`);
      console.error(e);
    }

    try {
      if (debugMessages) {
        console.log(`Sending receipt for ${id}`);
      }
      messaging.send(`r_${uuid}`, { msgqType: "msgq_receipt", qSize: Math.max(0, queueHp.length + queueLp.length - 1), id: id });
    } catch (e) {
      console.error(e);
    }
  } else if (type == "msgq_receipt") {
    if (debugMessages) {
      console.log(`Got receipt for ${id}`);
    }
    dequeue(id, null);
    waitingForId = null;
    delayedProcess(100);
  }
}

//====================================================================================================
// Messaging handling
//====================================================================================================

messaging.addEventListener("message", (event) => {
  try {
    onMessage(event);
  } catch (e) {
    console.warn(e);
  }
});

//====================================================================================================
// Exports
//====================================================================================================

const msgq = {
  send: enqueue,
  onmessage: (messageKey, message) => {
    console.error(`Unprocessed msgq key: ${messageKey} - ${JSON.stringify(message)}`);
  },
  getQueueSize: GetQueueSize,
  getOtherQueueSize: GetOtherQueueSize,
  getLastSent: GetLastSent,
  getLastReceived: GetLastReceived,
  getIsWaitingForResponse: IsWaitingForResponse,
};

export { msgq };
