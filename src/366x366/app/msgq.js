import { me as appbit } from "appbit";
import { peerSocket } from "messaging";

//====================================================================================================
// Initialize
//====================================================================================================

let debugMessages = true;
let queue = [];
let waitingForReceipt = false;
let lastSend = null;
let delayedProcessCallTimeout = null;
let aliveType = "msgq-alive-app";
let socketClosedSince = null;

if (peerSocket.readyState != peerSocket.OPEN) {
  socketClosedSince = Date.now();
}

enqueue(aliveType, {});
setInterval(function () {
  try {
    enqueue(aliveType, {});
  } catch (e) {
    //Do Nothing
  }
}, 180000);

//====================================================================================================
// Helpers
//====================================================================================================

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

function enqueue(messageKey, message, timeout = 1800000) {
  const uuid = CreateUUID();
  const id = `${messageKey}_${uuid}`;
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
    for (let i in queue) {
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
    for (let i in queue) {
      var messageId = queue[i].id;
      var key = messageId.split("_")[0];
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
// Process Queue
//====================================================================================================

function process() {
  if (delayedProcessCallTimeout != null) {
    clearTimeout(delayedProcessCallTimeout);
    delayedProcessCallTimeout = null;
  }

  if (queue.length === 0) {
    return;
  }

  if (waitingForReceipt == true) {
    if (lastSend == null || Date.now() - lastSend >= 30000) {
      console.log("Waiting for receipt for over 30 seconds, giving up!");
      waitingForReceipt = false;
    } else {
      return;
    }
  }

  if (peerSocket.readyState != peerSocket.OPEN) {
    if (socketClosedSince != null) {
      var socketClosedDuration = Date.now() - socketClosedSince;
      if (socketClosedDuration > 600000) {
        console.log(`Socket not open for over 10 minutes, killing app`);
        appbit.exit();
      }
    } else {
      socketClosedSince = Date.now();
    }

    console.log(`Socket not open, call process again in 5 seconds`);
    delayedProcessCallTimeout = setTimeout(process, 5000);
    return;
  }

  const queueItem = queue[0];
  if (queueItem.timeout < Date.now()) {
    console.log(`Message timeout: ${queueItem.id}`);
    dequeue(queueItem.id, null);
    waitingForReceipt = false;
    process();
  } else {
    try {
      waitingForReceipt = true;
      lastSend = Date.now();
      if (debugMessages) {
        console.log(`Sending message ${queueItem.id} - ${queueItem.messageKey} - ${JSON.stringify(queueItem.message)}`);
      }
      peerSocket.send({ msgqType: "msgq_message", id: queueItem.id, msgqMessage: queueItem });
      delayedProcessCallTimeout = setTimeout(process, 15000);
    } catch (e) {
      waitingForReceipt = false;
      console.warn(e.message);
      console.log(`Socket send error, call process again in 2 seconds`);
      delayedProcessCallTimeout = setTimeout(process, 2000);
    }
  }
}

//====================================================================================================
// Socket handling
//====================================================================================================

peerSocket.addEventListener("open", () => {
  console.log("Peer socket opened");
  waitingForReceipt = false;
  socketClosedSince = null;
  process();
});

peerSocket.addEventListener("closed", (event) => {
  console.log(`Peer socket closed. - Code ${event.code}. Message ${event.reason}`);
  waitingForReceipt = false;
  socketClosedSince = Date.now();
  process();
});

peerSocket.addEventListener("error", (event) => {
  console.error(`Peer socket error. - Code ${event.code}. Message ${event.message}`);
  waitingForReceipt = false;
  socketClosedSince = Date.now();
  process();
});

peerSocket.addEventListener("message", (event) => {
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

    if (messageKey.substring(10) != "msgq-alive") {
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
    waitingForReceipt = false;
    process();
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
};

export { msgq };
