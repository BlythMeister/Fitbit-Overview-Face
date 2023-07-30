import * as document from "document";
import { me as appbit } from "appbit";
import { vibration } from "haptics";
import { msgq } from "./msgq.js";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
export let queueSizeEl = document.getElementById("queue-size");
export let lastMsgEl = document.getElementById("last-msg");
let lastPingSent = null;
let lastPongReceived = null;
let lastPongQueueSize = 0;
let connectedColour = "white";
let disconnectedColour = "white";
let disconnected = true;
let firstTouch = false;

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

export function setQueueSize(visibility) {
  queueSizeEl.style.display = !visibility ? "none" : "inline";
}

export function setShowLastMsg(visibility) {
  lastMsgEl.style.display = !visibility ? "none" : "inline";
}

phoneIconEl.onclick = function (e) {
  if (disconnected) {
    if (firstTouch) {
      console.log("Restarting");
      vibration.start("nudge-max");
      appbit.exit();
    } else {
      firstTouch = true;
      setTimeout(function () {
        firstTouch = false;
      }, 500);
    }
  }
};

export function sendPing() {
  var lastPingAge = lastPingSent == null ? 99999999 : Date.now() - lastPingSent;
  updateConnectionIndicator();
  if (phoneEl.style.display === "inline" && lastPingAge >= 120000) {
    try {
      lastPingSent = Date.now();
      msgq.send("ping", {});
    } catch (e) {
      console.error(e.message);
    }
  }
}

export function gotPong(message) {
  lastPongQueueSize = message.size;
  lastPongReceived = Date.now();
  updateConnectionIndicator();
}

function updateConnectionIndicator() {
  queueSizeEl.text = `${msgq.getQueueSize()}/${lastPongQueueSize}`;
  var lastPongAge = lastPongReceived == null ? 99999999 : Date.now() - lastPongReceived;
  lastMsgEl.text = `${((lastPongAge/1000)/60).toFixed(1)}`
  if (lastPongAge >= 900000) {
    disconnected = true;
    phoneIconEl.style.fill = disconnectedColour;
    queueSizeEl.style.fill = disconnectedColour;
    lastMsgEl.style.fill = disconnectedColour;
  } else {
    disconnected = false;
    phoneIconEl.style.fill = connectedColour;    
    queueSizeEl.style.fill = connectedColour;
    lastMsgEl.style.fill = connectedColour;
  }
}
