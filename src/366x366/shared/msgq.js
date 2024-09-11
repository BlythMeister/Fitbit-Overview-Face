import { messaging } from "./msgSender.js";

//====================================================================================================
// Initialize
//====================================================================================================

let debugMessages = false;
let queue = [];
let otherQueueSize = 0;
let waitingForId = null;
let lastSent = null;
let lastReceived = null;
let delayedProcessCallTimeout = null;
let delayedProcessCallAt = null;
let consecutiveQueueEmpty = 0;
let messageOpen = false;

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
  return queue.length;
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

function enqueue(messageKey, message, timeout, highPriority) {
  const uuid = CreateUUID();
  const id = `${messageKey}#${uuid}`;
  const timeoutDate = timeout > 0 ? Date.now() + timeout : null;

  const data = { id: id, timeout: timeoutDate, uuid: uuid, messageKey: messageKey, message: message };

  dequeue(null, messageKey);
  if (highPriority) {
    queue.unshift(data);
  } else {
    queue.push(data);
  }

  if (debugMessages) {
    console.log(`Enqueued message ${id} - ${messageKey} - ${JSON.stringify(message)} - QueueSize: ${queue.length}`);
  }

  delayedProcess(100);
}

//====================================================================================================
// Dequeue
//====================================================================================================

function dequeue(messageId, messageKey) {
  if (queue.length == 0) {
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
    if (queue[0].id == messageId) {
      if (debugMessages) {
        console.log(`Top message in queue is match for id ${messageId}`);
      }
      queue.splice(0, 1);
      dequeueResult = true;
    } else {
      for (var i = queue.length - 1; i >= 0; i--) {
        var id = queue[i].id;
        if (id === messageId) {
          queue.splice(i, 1);
          dequeueResult = true;
          break;
        }
      }
    }

    if (dequeueResult) {
      if (debugMessages) {
        console.log(`Dequeued message ${messageId} - QueueSize: ${queue.length}`);
      }
    } else {
      console.log(`Unable to dequeue message ${messageId} - QueueSize: ${queue.length}`);
    }
  } else if (messageKey) {
    if (debugMessages) {
      console.log(`Try dequeue message with key ${messageKey}`);
    }
    for (var i = queue.length - 1; i >= 0; i--) {
      var key = queue[i].messageKey;
      if (key === messageKey) {
        queue.splice(i, 1);
        if (debugMessages) {
          console.log(`Dequeued message ${messageId} from key ${messageKey} - QueueSize: ${queue.length}`);
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
  if (queue.length == 0) {
    if (debugMessages) {
      console.log("Requeue when queue empty, skipping");
    }
    return;
  }

  if (queue.length == 1) {
    if (debugMessages) {
      console.log(`Requeue when 1 message has no impact - QueueSize: ${queue.length}`);
    }
    return;
  }

  var data = null;
  if (queue[0].id == messageId) {
    if (debugMessages) {
      console.log(`Top message in queue is match for id ${messageId}`);
    }
    data = queue.splice(0, 1)[0];
  } else {
    for (var i = queue.length - 1; i >= 0; i--) {
      var id = queue[i].id;
      if (id === messageId) {
        data = queue.splice(i, 1);
        break;
      }
    }
  }

  if (data != null) {
    if (debugMessages) {
      console.log(`Dequeued message (for requeue) ${messageId} - QueueSize: ${queue.length}`);
    }

    queue.push(data);

    if (debugMessages) {
      console.log(`Enqueued message (for requeue) ${messageId} - ${JSON.stringify(data)} - QueueSize: ${queue.length}`);
    }
  } else {
    console.log(`Unable to dequeue message (for requeue) ${messageId} - QueueSize: ${queue.length}`);
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
    if (debugMessages) {
      console.log(`prev delay end ${msToEnd}ms`);
    }

    if (msToEnd < 0) {
      process();
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

  if (!messageOpen) {
    if (debugMessages) {
      console.log("Messaging not open, try process again in 1 sec");
    }
    delayedProcess(1000);
  }

  if (queue.length === 0) {
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
      console.log(`Waiting for receipt (${waitingForId}) for over 4 seconds, resending!`);
      var requeueId = waitingForId;
      waitingForId = null;
      requeue(requeueId);
      delayedProcess(50);
    } else {
      console.log(`Waiting for a receipt (${waitingForId}) call process again in 500ms`);
      delayedProcess(500);
    }
    return;
  }

  const queueItem = queue[0];

  if (queueItem == null) {
    console.log(`Top queue item is null, call process again in 1 second`);
    queue.splice(0, 1);
    delayedProcess(1000);
    return;
  }

  if (queueItem.timeout != null && queueItem.timeout < Date.now()) {
    console.log(`Message timeout: ${queueItem.id}`);
    dequeue(queueItem.id, null);
    delayedProcess(250);
    return;
  } else {
    try {
      if (debugMessages) {
        console.log(`Sending message ${queueItem.id} - ${queueItem.messageKey} - ${JSON.stringify(queueItem.message)}`);
      }
      messaging.send(`m_${queueItem.uuid}`, { msgqType: "msgq_message", qSize: Math.max(0, queue.length - 1), id: queueItem.id, msgqMessage: queueItem });
      waitingForId = queueItem.id;
      lastSent = Date.now();
    } catch (e) {
      waitingForId = null;
      console.warn(e.message);
      console.log(`Send error, call process again in 1 seconds`);
      delayedProcess(1000);
    }
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
      console.error(e.message);
    }

    try {
      if (debugMessages) {
        console.log(`Sending receipt for ${id}`);
      }
      messaging.send(`r_${uuid}`, { msgqType: "msgq_receipt", qSize: Math.max(0, queue.length - 1), id: id });
    } catch (e) {
      console.error(e.message);
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
    console.warn(e.message);
  }
});

//====================================================================================================
// Exports
//====================================================================================================

const msgq = {
  send: enqueue,
  onmessage: (messageKey, message) => {
    console.log(`Unprocessed msgq key: ${messageKey} - ${JSON.stringify(message)}`);
  },
  getQueueSize: GetQueueSize,
  getOtherQueueSize: GetOtherQueueSize,
  getLastSent: GetLastSent,
  getLastReceived: GetLastReceived,
  getIsWaitingForResponse: IsWaitingForResponse,
};

export { msgq };
