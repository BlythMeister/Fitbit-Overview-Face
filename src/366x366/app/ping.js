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
  var lastPingAge = lastPing == null ? 99999999 : new Date() - lastPing;
  updateForPong();
  if (phoneEl.style.display === "inline" && lastPingAge >= 60000) {
    try {
      lastPing = new Date();
      asap.send("ping", {}, 60000);      
    } catch (e) {
      console.error(e, e.stack);
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
  var lastPongAge = lastPong == null ? 99999999 : new Date() - lastPong;
  if (lastPongAge >= 300000) {
    phoneIconEl.style.fill = disconnectedColour;
  } else {
    phoneIconEl.style.fill = connectedColour;
  }
}
