import * as document from "document";
import { me as appbit } from "appbit";
import { vibration } from "haptics";
import { msgq } from "./../shared/msgq.js";

export let phoneEl = document.getElementById("phone");
export let phoneIconEl = document.getElementById("phone-icon");
export let queueSizeEl = document.getElementById("queue-size");
export let lastMsgSentEl = document.getElementById("last-msg-sent");
export let lastMsgReceivedEl = document.getElementById("last-msg-received");
let connectedColour = "white";
let disconnectedColour = "white";
let disconnected = true;
let firstTouch = false;

export function setPhoneIconConnected(colour) {
  connectedColour = colour;
  drawState();
}

export function setPhoneIconDisconnected(colour) {
  disconnectedColour = colour;
  drawState();
}

export function setShowPhoneStatus(visibility) {
  phoneEl.style.display = !visibility ? "none" : "inline";
}

export function setQueueSize(visibility) {
  queueSizeEl.style.display = !visibility ? "none" : "inline";
}

export function setShowLastMsg(visibility) {
  lastMsgSentEl.style.display = !visibility ? "none" : "inline";
  lastMsgReceivedEl.style.display = !visibility ? "none" : "inline";
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

export function drawState() {
  var lastSent = msgq.getLastSent();
  var lastReceived = msgq.getLastReceived();

  var lastSentAge = lastSent == null ? 99999999 : Date.now() - lastSent;
  var lastReceivedAge = lastReceived == null ? 99999999 : Date.now() - lastReceived;

  var sentAgeDisplay = lastSentAge / 1000 / 60;
  if (sentAgeDisplay >= 100) {
    lastMsgSentEl.text = `<< 100+`;
  } else {
    lastMsgSentEl.text = `<< ${sentAgeDisplay.toFixed(1)}`;
  }

  var receivedAgeDisplay = lastReceivedAge / 1000 / 60;
  if (receivedAgeDisplay >= 100) {
    lastMsgReceivedEl.text = `>> 100+`;
  } else {
    lastMsgReceivedEl.text = `>> ${receivedAgeDisplay.toFixed(1)}`;
  }
   
  queueSizeEl.text = `A:${msgq.getQueueSize()} / C:${msgq.getOtherQueueSize()}`;
  if(msgq.getIsWaitingForResponse())
  {
    queueSizeEl.text += " / W"
  }
  
  if (lastReceivedAge >= 900000) {
    disconnected = true;
    phoneIconEl.style.fill = disconnectedColour;
    queueSizeEl.style.fill = disconnectedColour;
    lastMsgSentEl.style.fill = disconnectedColour;
    lastMsgReceivedEl.style.fill = disconnectedColour;
  } else {
    disconnected = false;
    phoneIconEl.style.fill = connectedColour;
    queueSizeEl.style.fill = connectedColour;
    lastMsgSentEl.style.fill = connectedColour;
    lastMsgReceivedEl.style.fill = connectedColour;
  }
}
