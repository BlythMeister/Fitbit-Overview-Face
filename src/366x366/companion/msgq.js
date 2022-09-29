import { peerSocket } from "messaging";

//====================================================================================================
// Initialize
//====================================================================================================

let debugMessages = false;
let queue = [];
let waitingForReceipt = false;
let lastSend = null;
let retryTimeout = null;
let aliveType = "msgq-alive-companion";

enqueue(aliveType, {}, 30000);
setInterval(function () {
  enqueue(aliveType, {}, 30000);
}, 150000);

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
    if (debugMessages) {
      if (dequeueResult) {
        console.log(`Dequeued message ${id} - QueueSize: ${queue.length}`);
      } else {
        console.log(`Unable to dequeue message ${id} - QueueSize: ${queue.length}`);
      }
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
  if (retryTimeout != null) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }

  if (queue.length === 0) {
    return;
  }

  if (peerSocket.readyState != peerSocket.OPEN) {
    if (debugMessages) {
      console.log(`Socket not open, call process again in 1 seconds`);
    }
    retryTimeout = setTimeout(process, 1000);
  }

  if (waitingForReceipt == true) {
    if (lastSend == null || Date.now() - lastSend >= 15000) {
      if (debugMessages) {
        console.log("Waiting for receipt for over 15 seconds, giving up!");
      }
      waitingForReceipt = false;
    } else {
      return;
    }
  }

  const queueItem = queue[0];
  if (queueItem.timeout < Date.now()) {
    if (debugMessages) {
      console.log(`Message timeout: ${queueItem.id}`);
    }
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
      peerSocket.send({ msgqType: "msgq_message", msgqMessage: queueItem });
    } catch (e) {
      waitingForReceipt = false;
      console.warn(e.message);
      if (debugMessages) {
        console.log(`Socket send error, call process again in 2 seconds`);
      }
      retryTimeout = setTimeout(process, 2000);
    }
  }
}

//====================================================================================================
// Socket handling
//====================================================================================================

peerSocket.addEventListener("open", () => {
  console.log("Peer socket opened");
  waitingForReceipt = false;
  process();
});

peerSocket.addEventListener("closed", (event) => {
  console.log(`Peer socket closed. - Code ${event.code}. Message ${event.reason}`);
  waitingForReceipt = false;
  process();
});

peerSocket.addEventListener("error", (event) => {
  console.error(`Peer socket error. - Code ${event.code}. Message ${event.message}`);
  waitingForReceipt = false;
  process();
});

peerSocket.addEventListener("message", (event) => {
  const type = event.data.msgqType;

  if (type == "msgq_message") {
    const id = event.data.msgqMessage.id;
    const messageKey = event.data.msgqMessage.messageKey;
    const message = event.data.msgqMessage.message;

    if (debugMessages) {
      console.log(`Recieved message ${id} - ${messageKey} - ${JSON.stringify(message)}`);
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
    const id = event.data.id;
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
