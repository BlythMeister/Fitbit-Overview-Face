import * as document from "document";
import { asap } from "./lib-fitbit-asap.js";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
let pingInterval = null;
let lastPong = null;
let connectedColour = "white";
let disconnectedColour = "white";

export function setPhoneIconConnected(colour) {
  connectedColour = colour;
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
pingInterval = setInterval(sendPing, 60000);

export function sendPing() {
  if (phoneEl.style.display === "inline") {
    updateForPong();
    try {
      asap.send({ command: "ping" }, { timeout: 60000 });
    } catch (e) {
      console.log(`Ping error: ${e}`);
      lastPong = null;
      updateForPong();
    }
  }
}

export function gotPong() {
  lastPong = new Date();
  updateForPong();
}

function updateForPong() {
  if (lastPong == null || new Date() - lastPong > 240000) {
    phoneIconEl.style.fill = disconnectedColour;
  } else {
    phoneIconEl.style.fill = connectedColour;
  }
}

setTimeout(sendPing, 2000);
