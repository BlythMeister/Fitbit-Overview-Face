import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { peerSocket } from "messaging";

//====================================================================================================
// Initialize Queue
//====================================================================================================

let queue = [];

// Attempt to load a saved queue on startup
try {
  queue = readFileSync("_asap_queue", "cbor");
  // Ensure that the queue is an array
  if (!Array.isArray(queue)) {
    queue = [];
  }
} catch (error) {
  // If a saved queue could not be loaded
  // Continue with an empty queue
  queue = [];
}

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

function enqueue(message, options) {
  const id = CreateUUID();
  const timeout = Date.now() + (options && options.timeout ? options.timeout : 86400000);
  // Construct the message
  const data = ["asap_message", id, timeout, message];
  // Save the message to disk
  writeFileSync("_asap_" + id, data, "cbor");
  // Add the message ID to the queue
  queue.push(id);
  // Persist the queue to disk
  writeFileSync("_asap_queue", queue, "cbor");
  // If the queue was previously empty
  if (queue.length === 1) {
    // Begin processing the queue
    process();
  }
  console.log("Enqueued message " + id + " - " + JSON.stringify(message));
}

//====================================================================================================
// Dequeue
//====================================================================================================

function dequeue(id) {
  // If an ID is provided
  if (id) {
    // Iterate over the queue
    for (let i in queue) {
      // If a match is found
      if (queue[i] === id) {
        // Delete the message from disk
        try {
          unlinkSync("_asap_" + id);
        } catch (error) {
          console.log(error);
        }
        // Remove the message ID from the queue
        queue.splice(i, 1);
        break;
      }
    }
    console.log("Dequeued message " + id);
  }
  // If an ID is not provided
  else {
    // Delete all messages from disk
    for (let i in queue) {
      unlinkSync("_asap_" + queue[i]);
    }
    // Reset the queue
    queue = [];
    console.log("Dequeued all messages");
  }
  // Persist the queue to disk
  writeFileSync("_asap_queue", queue, "cbor");
  // Continue processing the queue
  process();
}

//====================================================================================================
// Process Queue
//====================================================================================================

let retryTimeout = null;

function process() {
  if (retryTimeout != null) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  // If the queue is not empty
  if (queue.length > 0) {
    // Get the next message ID
    const id = queue[0];
    // Attempt to read the message from disk
    try {
      const message = readFileSync("_asap_" + id, "cbor");
      const timeout = message[2];
      // If the message has expired
      if (timeout < Date.now()) {
        // Dequeue the message
        dequeue(id);
      }
      // If the message has not expired
      else {
        // Attempt to send the message
        try {
          peerSocket.send(message);
        } catch (error) {
          console.log(error);
          retryTimeout = setTimeout(process, 5000);
        }
      }
    } catch {
      // If the message could not be read from disk
      // Dequeue the message
      dequeue(id);
    }
  }
}

// Begin processing the queue when a connection opens
peerSocket.addEventListener("open", () => {
  console.log("Peer socket opened");
  // Begin processing the queue
  process();
});

//====================================================================================================
// Incoming Messages
//====================================================================================================

// When a message is recieved from the peer
peerSocket.addEventListener("message", (event) => {
  const type = event.data[0];
  const id = event.data[1];
  const timeout = event.data[2];
  const message = event.data[3];
  // If this is a message
  if (type == "asap_message") {
    console.log("Process message " + id + " - " + JSON.stringify(message));
    asap.onmessage(message);
    // Send a receipt
    try {
      peerSocket.send(["asap_receipt", id]);
    } catch (error) {
      console.log(error);
    }
  }
  // If this is a receipt
  else if (type == "asap_receipt") {
    // Dequeue the message
    dequeue(id);
  }
});

//====================================================================================================
// Exports
//====================================================================================================

const asap = {
  send: enqueue,
  cancel: dequeue,
  onmessage: () => {},
};

export { asap };
