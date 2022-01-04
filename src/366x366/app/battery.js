import * as document from "document";
import { battery } from "power";

//Battery - START
export let root = document.getElementById('root')
export const screenWidth = root.width

export let batteryLine = document.getElementById("battery-line");
export let batteryLineFront = document.getElementById("battery-line-front");
export let batteryLineBack = document.getElementById("battery-line-back");
export let batteryIconCharge = document.getElementById("battery-icon-charge");
export let batteryIcon = document.getElementById("battery-icon");
export let batteryPercent = document.getElementById("battery-percent");
export let batteryPercentBlock = document.getElementById("battery");

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

export let colour0 = '#FF0000';
export let colour25 = 'darkorange';
export let colour50 = 'gold';
export let colour75 = '#00FF00';
//Battery - END

export function setPosition(pos){
  batteryStatposition = pos;
}

export function setShowBatteryPercent(visibility) {
  batteryPercentBlock.style.display = (!visibility ? "none" : "inline");
}

export function setShowBatteryBar(visibility) {
  batteryLine.style.display = (!visibility ? "none" : "inline");
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

//Battery Draw - START
export function drawBat() {
  let level = battery.chargeLevel;

  isCharging();

  let batteryPercentage = Math.floor(level);
  batteryPercent.text = `${batteryPercentage}%`;  
  batteryStatCountStraight.text = `${batteryPercentage}%`;
  batteryStatCountArc.text = `${batteryPercentage}%`;
  batteryStatCountRing.text = `${batteryPercentage}%`;
  
  let batteryDecimal = batteryPercentage/100
  var maxLine = screenWidth /100 * 28;
  batteryLineFront.sweepAngle = Math.floor(180*batteryDecimal);
  batteryStatLineStraight.width = maxLine*batteryDecimal;
  batteryStatLineArc.sweepAngle = Math.floor(225*batteryDecimal);
  batteryStatLineRing.sweepAngle = Math.floor(360*batteryDecimal);    

  if (batteryPercentage >= 75)
  {
    setColour(colour75);
  }
  else if (batteryPercentage >= 50)
  {
    setColour(colour50);
  }
  else if (batteryPercentage >= 25)
  {
    setColour(colour25);
  }
  else
  {
    setColour(colour0);
  }
}

export function setColour(colour){
  batteryLineFront.style.fill = colour;
  batteryIconCharge.style.fill = colour;
  batteryIcon.style.fill = colour;
  batteryPercent.style.fill = colour;
}

export function isCharging(){
  if(battery.charging){
    batteryIconCharge.style.display = "inline";
    batteryIcon.style.display = "none";
  }
  else{
    batteryIconCharge.style.display = "none";
    batteryIcon.style.display = "inline";
  }
}

drawBat();

//Battery Draw - END
