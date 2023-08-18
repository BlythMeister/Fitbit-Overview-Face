//import { me as appbit } from "appbit";
import { peerSocket } from "messaging";

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
let aliveType = "msgq_alive_companion";
let socketClosedOrErrorSince = null;
let consecutiveQueueEmpty = 0;

if (peerSocket.readyState != peerSocket.OPEN) {
  socketClosedOrErrorSince = Date.now();
}

enqueue(aliveType, {size:queue.length});
setInterval(function () {
  try {
    enqueue(aliveType, {size:queue.length});
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

function GetCompanionResponderQueueSize() {
  return otherQueueSize;
}

function GetLastSent() {
  return lastSent;
}

function GetLastReceived() {
  return lastReceived;
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

function enqueue(messageKey, message, timeout = 600000) {
  const uuid = CreateUUID();
  const id = `${messageKey}#${uuid}`;
  const timeoutDate = Date.now() + timeout;

  const data = { id: id, timeout: timeoutDate, messageKey: messageKey, message: message };

  dequeue(null, messageKey);

  queue.push(data);

  delayedProcess(250);

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
    for (var i = queue.length-1; i >= 0; i--) {
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
    for (var i = queue.length-1; i >= 0; i--) {
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
// Clear Queue
//====================================================================================================

function clearQueue() {
  if (debugMessages) {
    console.log(`Pre Clear QueueSize: ${queue.length}`);
    queue = [];
  }
}

//====================================================================================================
// Process Queue
//====================================================================================================

function delayedProcess(delay) {
  let setNewTime = false;
  if (delayedProcessCallTimeout == null) {
    setNewTime = true;
  } else {
    let msToEnd = delayedProcessCallAt - new Date().getTime();
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
    if(consecutiveQueueEmpty >= 3) {
      return;
    }

    if (debugMessages) {
      console.log(`Queue empty, call process again in 30 seconds`);
    }
    delayedProcess(30000);
    return;
  } else {
    consecutiveQueueEmpty = 0;
  }

  if (peerSocket.readyState != peerSocket.OPEN || socketClosedOrErrorSince != null) {
    if (socketClosedOrErrorSince == null) {
      socketClosedOrErrorSince = Date.now();
    }

    var socketClosedDuration = Date.now() - socketClosedOrErrorSince;
    if (socketClosedDuration >= 900000) {
      console.log("Socket not open for over 15 minutes. - Clear queue");
      clearQueue();
      delayedProcess(5000);
    } else {
      console.log(`Socket not open (Closed for ${socketClosedDuration}ms) call process again in 5 seconds`);
      delayedProcess(5000);
      return;
    }
  }

  if (waitingForId != null) {
    if (lastSent == null || Date.now() - lastSent >= 15000) {
      console.log("Waiting for receipt for over 15 seconds, giving up!");
      dequeue(waitingForId, null);
      waitingForId = null
    } else {
      console.log(`Waiting for a receipt, call process again in 5 seconds`);
      delayedProcess(5000);
      return;
    }
  }

  const queueItem = queue[0];

  if (queueItem == null) {
    console.log(`Top queue item is null, call process again in 2 seconds`);
    delayedProcess(2000);
    return;
  }

  if (queueItem.timeout < Date.now()) {
    console.log(`Message timeout: ${queueItem.id}`);
    dequeue(queueItem.id, null);
    waitingForId = null;
    delayedProcess(250);
  } else {
    try {
      waitingForId = queueItem.id;
      lastSent = Date.now();
      if (debugMessages) {
        console.log(`Sending message ${queueItem.id} - ${queueItem.messageKey} - ${JSON.stringify(queueItem.message)}`);
      }
      peerSocket.send({ msgqType: "msgq_message", id: queueItem.id, msgqMessage: queueItem });
      socketClosedOrErrorSince = null;
      delayedProcess(15000);
    } catch (e) {
      waitingForId = null;
      console.warn(e.message);
      socketClosedOrErrorSince = Date.now();
      console.log(`Socket send error, call process again in 2 seconds`);
      delayedProcess(2000);
    }
  }
}

//====================================================================================================
// Socket handling
//====================================================================================================

peerSocket.addEventListener("open", () => {
  console.log("Peer socket opened");
  waitingForId = null;
  socketClosedOrErrorSince = null;
  delayedProcess(250);
});

peerSocket.addEventListener("closed", (event) => {
  console.log(`Peer socket closed. - Code ${event.code}. Message ${event.reason}`);
  waitingForId = null;
  socketClosedOrErrorSince = Date.now();
  delayedProcess(250);
});

peerSocket.addEventListener("error", (event) => {
  console.error(`Peer socket error. - Code ${event.code}. Message ${event.message}`);
  waitingForId = null;
  socketClosedOrErrorSince = Date.now();
  delayedProcess(250);
});

peerSocket.addEventListener("message", (event) => {
  socketClosedOrErrorSince = null;
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
    try {
      if (debugMessages) {
        console.log(`Sending receipt for ${id}`);
      }
      peerSocket.send({ msgqType: "msgq_receipt", id: id });
    } catch (e) {
      console.error(e.message);
    }

    if (messageKey.substring(0,10) == "msgq_alive") {
      otherQueueSize = message.size;
    } else {
      try {
        msgq.onmessage(messageKey, message);
      } catch (e) {
        console.error(e.message);
      }
    }
  } else if (type == "msgq_receipt") {
    if (debugMessages) {
      console.log(`Got receipt for ${id}`);
    }
    dequeue(id, null);
    waitingForId = null;
    delayedProcess(250);
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
  getCompanionResponderQueueSize: GetCompanionResponderQueueSize,
  getLastSent: GetLastSent,
  getLastReceived: GetLastReceived
};

export { msgq };
