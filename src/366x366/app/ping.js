import * as document from "document";
import { msgq } from "./msgq.js";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
let lastPingSent = null;
let lastPongReceived = null;
let lastPingReceived = null;
let connectedColour = "white";
let disconnectedColour = "white";

export function setPhoneIconConnected(colour) {
  connectedColour = colour;
  updateConnectionIndicator();
}

export function setPhoneIconDisconnected(colour) {
  disconnectedColour = colour;
  updateConnectionIndicator();
}

export function setShowPhoneStatus(visibility) {
  phoneEl.style.display = !visibility ? "none" : "inline";
  sendPing();
}

export function sendPing() {
  var lastPingAge = lastPingSent == null ? 99999999 : Date.now() - lastPingSent;
  updateConnectionIndicator();
  if (phoneEl.style.display === "inline" && lastPingAge >= 60000) {
    try {
      msgq.send("app-ping", {}, 60000);
      lastPingSent = Date.now();
    } catch (e) {
      console.error(e, e.stack);
    }
  }
}

export function gotPong() {
  lastPongReceived = Date.now();
  updateConnectionIndicator();
}

export function gotPing() {
  lastPingReceived = Date.now();
  updateConnectionIndicator();
}

function updateConnectionIndicator() {
  var lastPongAge = lastPongReceived == null ? 99999999 : Date.now() - lastPongReceived;
  var lastPingAge = lastPingReceived == null ? 99999999 : Date.now() - lastPingReceived;
  if (lastPongAge >= 300000 || lastPingAge >= 1200000) {
    phoneIconEl.style.fill = disconnectedColour;
  } else {
    phoneIconEl.style.fill = connectedColour;
  }
}
