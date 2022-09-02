import * as document from "document";
import * as messaging from "messaging";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
let pingInterval = null;
let lastPong = null;
let remainingMessages = 0;
let connectedColour = "white";
let problemColour = "white";
let disconnectedColour = "white";

export function setPhoneIconConnected(colour) {
  connectedColour = colour;
  updateForPong();
}

export function setPhoneIconProblem(colour) {
  problemColour = colour;
  updateForPong();
}

export function setPhoneIconDisconnected(colour) {
  disconnectedColour = colour;
  updateForPong();
}

export function setShowPhoneStatus(visibility) {
  phoneEl.style.display = !visibility ? "none" : "inline";
  sendPing();
}

if (pingInterval != null) {
  clearInterval(pingInterval);
}
pingInterval = setInterval(sendPing, 30000);

messaging.peerSocket.addEventListener("open", (evt) => {
  sendPing();
});

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data && evt.data.dataType === "pong") {
    lastPong = new Date();
    remainingMessages = evt.data.remainingMessages;
    updateForPong();
  }
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
  lastPong = null;
  updateForPong();
});

export function sendPing() {
  if (phoneEl.style.display === "inline") {
    updateForPong();
    try {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
          command: "ping",
        });
      }
    } catch (e) {
      console.log(`Weather error: ${e}`);
      lastPong = null;
      updateForPong();
    }
  }
}

function updateForPong() {
  if (lastPong == null) {
    phoneIconEl.style.fill = disconnectedColour;
  } else if (new Date() - lastPong > 90000) {
    phoneIconEl.style.fill = disconnectedColour;
  } else if (remainingMessages > 10) {
    phoneIconEl.style.fill = problemColour;
  } else {
    phoneIconEl.style.fill = connectedColour;
  }
}
