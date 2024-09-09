import { messaging } from "./fitbit-file-messaging.js";

//====================================================================================================
// Initialize
//====================================================================================================

let debugMessages = true;
let queue = [];
let otherQueueSize = 0;
let waitingForId = null;
let lastSent = null;
let lastReceived = null;
let delayedProcessCallTimeout = null;
let delayedProcessCallAt = null;
let consecutiveQueueEmpty = 0;

enqueue("msgq_alive", {size:null}, 120000);
setInterval(function () {
  try {
    enqueue("msgq_alive", {size:null}, 120000);
  } catch (e) {
    //Do Nothing
  }
}, 120000);

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

function enqueue(messageKey, message, timeout = 60000) {
  const uuid = CreateUUID();
  const id = `${messageKey}#${uuid}`;
  const timeoutDate = Date.now() + timeout;

  const data = { id: id, timeout: timeoutDate, messageKey: messageKey, message: message };

  dequeue(null, messageKey);

  queue.push(data);

  process();

  if (debugMessages) {
    console.log(`Enqueued message ${id} - ${messageKey} - ${JSON.stringify(message)} - QueueSize: ${queue.length}`);
  }
}

//====================================================================================================
// Dequeue
//====================================================================================================

function dequeue(id, messageKey) {
  if (id) {
    var dequeueResult = false;
    for (var i = queue.length - 1; i >= 0; i--) {
      if (queue[i].id === id) {
        queue.splice(i, 1);
        dequeueResult = true;
        break;
      }
    }
    if (dequeueResult) {
      if (debugMessages) {
        console.log(`Dequeued message ${id} - QueueSize: ${queue.length}`);
      }
    } else {
      console.log(`Unable to dequeue message ${id} - QueueSize: ${queue.length}`);
    }
  } else if (messageKey) {
    for (var i = queue.length - 1; i >= 0; i--) {
      var key = queue[i].messageKey;
      if (key === messageKey) {
        queue.splice(i, 1);
        if (debugMessages) {
          console.log(`Dequeued message ${id} from key ${messageKey} - QueueSize: ${queue.length}`);
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

function requeue(id) {
  if (queue.length == 1) {
    if (debugMessages) {
      console.log(`Requeue when 1 message has no impact - QueueSize: ${queue.length}`);
    }
    return;
  }

  var data = null;
  for (var i = queue.length - 1; i >= 0; i--) {
    if (queue[i].id === id) {
      data = queue.splice(i, 1)[0];
      break;
    }
  }

  if (data != null) {
    if (debugMessages) {
      console.log(`Dequeued message (for requeue) ${id} - QueueSize: ${queue.length}`);
    }

    queue.push(data);

    process();

    if (debugMessages) {
      console.log(`Enqueued message (for requeue) ${id} - ${JSON.stringify(message)} - QueueSize: ${queue.length}`);
    }
  } else {
    console.log(`Unable to dequeue message (for requeue) ${id} - QueueSize: ${queue.length}`);
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

  var lastSentAge = Date.now() - lastSent
  if(lastSentAge < 50)
  {
    var delay = 50 - lastSentAge;
    if (debugMessages) {
      console.log(`Less than 50ms since last send, backoff ${delay}ms`);
    }
    delayedProcess(delay);
    return;
  }

  if (waitingForId != null) {
    if (lastSent == null || Date.now() - lastSent >= 30000) {
      console.log("Waiting for receipt for over 30 seconds, resending!");
      requeue(waitingForId);
      waitingForId = null;
    } else {
      console.log(`Waiting for a receipt, call process again in 2 seconds`);
      delayedProcess(2000);
      return;
    }
  }

  const queueItem = queue[0];

  if (queueItem == null) {
    console.log(`Top queue item is null, call process again in 2 seconds`);
    queue.splice(0, 1);
    delayedProcess(2000);
    return;
  }

  if (queueItem.timeout < Date.now()) {
    console.log(`Message timeout: ${queueItem.id}`);
    dequeue(queueItem.id, null);
    delayedProcess(250);
    return;
  } else {
    try {
      if(queueItem.messageKey == "msgq_alive") {
        // Update queue length at time of sending
        // Don't count the msgq_alive message being sent
        queueItem.message.size = queue.length - 1 
      }
      if (debugMessages) {
        console.log(`Sending message ${queueItem.id} - ${queueItem.messageKey} - ${JSON.stringify(queueItem.message)}`);
      }
      messaging.send({ msgqType: "msgq_message", id: queueItem.id, msgqMessage: queueItem });
      waitingForId = queueItem.id;
      lastSent = Date.now();
    } catch (e) {
      waitingForId = null;
      console.warn(e.message);
      console.log(`Send error, call process again in 2 seconds`);
      delayedProcess(2000);
    }
  }
}

function onMessagingOpen() {
  console.log("Messaging opened");
  waitingForId = null;
  delayedProcess(50);
}

function onMessagingClosed(event) {
  console.log(`Messaging closed. - Code ${event.code}. Message ${event.reason}`);
  waitingForId = null;
  delayedProcess(50);
}

function onMessagingError(event) {
  console.error(`Messaging error. - Code ${event.code}. Message ${event.message}`);
  waitingForId = null;
  delayedProcess(250);
}

function onMessage(event) {
  lastReceived = Date.now();
  const type = event.data.msgqType;
  const id = event.data.id;
  if (debugMessages) {
    console.log(`Got message ${id} - type ${type}`);
  }

  if (type == "msgq_message") {
    const messageKey = event.data.msgqMessage.messageKey;
    const message = event.data.msgqMessage.message;

    if (debugMessages) {
      console.log(`Message content ${id} - ${messageKey} -> ${JSON.stringify(message)}`);
    }
    
    if (messageKey == "msgq_alive") {
      otherQueueSize = message.size;
      if (debugMessages) {
        console.log(`Other queue size = ${otherQueueSize}`);
      }
    } else {
      try {
        msgq.onmessage(messageKey, message);
      } catch (e) {
        console.error(e.message);
      }
    }

    try {
      if (debugMessages) {
        console.log(`Sending receipt for ${id}`);
      }
      messaging.send({ msgqType: "msgq_receipt", id: id });
    } catch (e) {
      console.error(e.message);
    }
  } else if (type == "msgq_receipt") {
    if (debugMessages) {
      console.log(`Got receipt for ${id}`);
    }
    dequeue(id, null);
    waitingForId = null;
    delayedProcess(500);
  }
}

//====================================================================================================
// Messaging handling
//====================================================================================================

messaging.addEventListener("open", () => {
  try {
    onMessagingOpen();
  } catch (e) {
    console.warn(e.message);
  }
});

messaging.addEventListener("close", (event) => {
  try {
    onMessagingClosed(event);
  } catch (e) {
    console.warn(e.message);
  }
});

messaging.addEventListener("error", (event) => {
  try {
    onMessagingError(event);
  } catch (e) {
    console.warn(e.message);
  }
});

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
  getIsWaitingForResponse: IsWaitingForResponse
};

export { msgq };
