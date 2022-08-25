import * as document from "document";
import { battery } from "power";

//Battery - START
export let root = document.getElementById("root");
export const screenWidth = root.width;

export let batteryLine = document.getElementById("battery-line");
export let batteryLineFront = document.getElementById("battery-line-front");
export let batteryLineBack = document.getElementById("battery-line-back");
export let batteryIcon = document.getElementById("battery-icon");
export let batteryPercent = document.getElementById("battery-percent");
export let batteryPercentBlock = document.getElementById("battery");

export let batteryStatContainerNoProgress = document.getElementById("battery-noProgress");
export let batteryStatIconNoProgress = document.getElementById("battery-noProgress-icon");
export let batteryStatCountNoProgress = document.getElementById("battery-noProgress-count");
export let batteryStatContainerStraight = document.getElementById("battery-straight");
export let batteryStatLineStraight = document.getElementById("battery-straight-line");
export let batteryStatLineBackStraight = document.getElementById("battery-straight-line-back");
export let batteryStatIconStraight = document.getElementById("battery-straight-icon");
export let batteryStatCountStraight = document.getElementById("battery-straight-count");
export let batteryStatContainerArc = document.getElementById("battery-arc");
export let batteryStatLineArc = document.getElementById("battery-arc-line");
export let batteryStatLineBackArc = document.getElementById("battery-arc-line-back");
export let batteryStatIconArc = document.getElementById("battery-arc-icon");
export let batteryStatCountArc = document.getElementById("battery-arc-count");
export let batteryStatContainerRing = document.getElementById("battery-ring");
export let batteryStatLineRing = document.getElementById("battery-ring-line");
export let batteryStatLineBackRing = document.getElementById("battery-ring-line-back");
export let batteryStatIconRing = document.getElementById("battery-ring-icon");
export let batteryStatCountRing = document.getElementById("battery-ring-count");
export let batteryStatposition = "NONE";

export let colour0 = "red";
export let colour25 = "darkorange";
export let colour50 = "gold";
export let colour75 = "lime";
export let colour0Icon = "red";
export let colour25Icon = "darkorange";
export let colour50Icon = "gold";
export let colour75Icon = "lime";
//Battery - END

export function setPosition(pos) {
  batteryStatposition = pos;
}

export function setShowBatteryPercent(visibility) {
  batteryPercentBlock.style.display = !visibility ? "none" : "inline";
}

export function setShowBatteryBar(visibility) {
  batteryLine.style.display = !visibility ? "none" : "inline";
}

export function setFont(font) {
  batteryPercent.style.fontFamily = font;
}

export function setColour0(colour) {
  colour0 = colour;
  drawBat();
}

export function setColour25(colour) {
  colour25 = colour;
  drawBat();
}

export function setColour50(colour) {
  colour50 = colour;
  drawBat();
}

export function setColour75(colour) {
  colour75 = colour;
  drawBat();
}

export function setColour0Icon(colour) {
  colour0Icon = colour;
  drawBat();
}

export function setColour25Icon(colour) {
  colour25Icon = colour;
  drawBat();
}

export function setColour50Icon(colour) {
  colour50Icon = colour;
  drawBat();
}

export function setColour75Icon(colour) {
  colour75Icon = colour;
  drawBat();
}

//Battery Draw - START
export function drawBat() {
  let level = battery.chargeLevel;

  let batteryPercentage = Math.floor(level);
  batteryPercent.text = `${batteryPercentage}%`;
  batteryStatCountNoProgress.text = `${batteryPercentage}%`;
  batteryStatCountStraight.text = `${batteryPercentage}%`;
  batteryStatCountArc.text = `${batteryPercentage}%`;
  batteryStatCountRing.text = `${batteryPercentage}%`;

  let batteryDecimal = batteryPercentage / 100;
  var statMaxLine = (screenWidth / 100) * 28;
  batteryLineFront.sweepAngle = Math.floor(180 * batteryDecimal);
  batteryStatLineStraight.width = statMaxLine * batteryDecimal;
  batteryStatLineArc.sweepAngle = Math.floor(225 * batteryDecimal);
  batteryStatLineRing.sweepAngle = Math.floor(360 * batteryDecimal);

  let colourToUseBar = "";
  let colourToUseIcon = "";
  let iconToUse = "";

  if (batteryPercentage >= 75) {
    colourToUseBar = colour75;
    colourToUseIcon = colour75Icon;
    iconToUse = "battery_full_36px.png";
  } else if (batteryPercentage >= 50) {
    colourToUseBar = colour50;
    colourToUseIcon = colour50Icon;
    iconToUse = "battery_slight_empty_36px.png";
  } else if (batteryPercentage >= 25) {
    colourToUseBar = colour25;
    colourToUseIcon = colour25Icon;
    iconToUse = "battery_half_36px.png";
  } else {
    colourToUseBar = colour0;
    colourToUseIcon = colour0Icon;
    iconToUse = "battery_empty_36px.png";
  }

  if (battery.charging) {
    iconToUse = "battery_charging_36px.png";
  }

  batteryLineFront.style.fill = colourToUseBar;
  batteryIcon.style.fill = colourToUseIcon;
  batteryPercent.style.fill = colourToUseIcon;
  batteryIcon.href = iconToUse;
}

drawBat();

//Battery Draw - END
