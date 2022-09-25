import * as document from "document";
import { msgq } from "./msgq.js";

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
  var lastPingAge = lastPing == null ? 99999999 : Date.now() - lastPing;
  updateForPong();
  if (phoneEl.style.display === "inline" && lastPingAge >= 60000) {
    try {
      lastPing = Date.now();
      msgq.send("ping", {}, 60000);
    } catch (e) {
      console.error(e, e.stack);
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
  var lastPongAge = lastPong == null ? 99999999 : Date.now() - lastPong;
  if (lastPongAge >= 300000) {
    phoneIconEl.style.fill = disconnectedColour;
  } else {
    phoneIconEl.style.fill = connectedColour;
  }
}
