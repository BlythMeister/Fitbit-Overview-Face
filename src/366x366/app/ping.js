import * as document from "document";
import { asap } from "./lib-fitbit-asap.js";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
let lastPing = null;
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

export function sendPing() {
  var lastPingAge = lastPing == null ? -1 : Date.now() - lastPing;
  updateForPong();
  if (phoneEl.style.display === "inline" && (lastPingAge == -1 || lastPingAge >= 60000)) {
    try {
      asap.send({ command: "ping" }, { timeout: 60000 });
      lastPing = Date.now();
    } catch (e) {
      console.log(`Ping error: ${e}`);
      lastPong = null;
      updateForPong();
    }
  }
}

export function gotPong() {
  lastPong = Date.now();
  updateForPong();
}

function updateForPong() {
  var currentDate = Date.now();
  var lastPongAge = lastPong == null ? -1 : Date.now() - lastPong;
  if (lastPongAge == -1 || lastPongAge >= 300000) {
    phoneIconEl.style.fill = disconnectedColour;
  } else {
    phoneIconEl.style.fill = connectedColour;
  }
}
