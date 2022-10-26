import * as document from "document";
import { me as appbit } from "appbit";
import { vibration } from "haptics";
import { msgq } from "./msgq.js";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
let lastPingSent = null;
let lastPongReceived = null;
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
      msgq.send("ping", {});
      lastPingSent = Date.now();
    } catch (e) {
      console.error(e.message);
    }
  }
}

export function gotPong() {
  lastPongReceived = Date.now();
  updateConnectionIndicator();
}

function updateConnectionIndicator() {
  var lastPongAge = lastPongReceived == null ? 99999999 : Date.now() - lastPongReceived;
  if (lastPongAge >= 900000) {
    disconnected = true;
    phoneIconEl.style.fill = disconnectedColour;
  } else {
    disconnected = false;
    phoneIconEl.style.fill = connectedColour;
  }
}
