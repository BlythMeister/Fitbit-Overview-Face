import document from "document";
import { battery } from "power";

//Battery - START
export let root = document.getElementById('root')
export const screenWidth = root.width

export let batteryLine = document.getElementById("battery-line");
export let batteryLineFront = document.getElementById("battery-line-front");
export let batteryLineBack = document.getElementById("battery-line-back");
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

  let batteryPercentage = Math.floor(level);
  batteryPercent.text = `${batteryPercentage}%`;  
  batteryStatCountStraight.text = `${batteryPercentage}%`;
  batteryStatCountArc.text = `${batteryPercentage}%`;
  batteryStatCountRing.text = `${batteryPercentage}%`;
  
  let batteryDecimal = batteryPercentage/100
  var statMaxLine = screenWidth /100 * 28;
  batteryLineFront.width = Math.floor(screenWidth*batteryDecimal)
  batteryStatLineStraight.width = statMaxLine*batteryDecimal;
  batteryStatLineArc.sweepAngle = Math.floor(225*batteryDecimal);
  batteryStatLineRing.sweepAngle = Math.floor(360*batteryDecimal);    

  let colourToUse = "";
  let iconToUse = "";
  
  if (batteryPercentage >= 75)
  {
    colourToUse = colour75;
    iconToUse = "battery_full_36px.png";
  }
  else if (batteryPercentage >= 50)
  {
    colourToUse = colour50;
    iconToUse = "battery_slight_empty_36px.png";
  }
  else if (batteryPercentage >= 25)
  {
    colourToUse = colour25;
    iconToUse = "battery_half_36px.png";
  }
  else
  {
    colourToUse = colour0;
    iconToUse = "battery_empty_36px.png";
  }  
  
  if(battery.charging){
    iconToUse = "battery_charging_36px.png";    
  }   
    
  batteryLineFront.style.fill = colourToUse;
  batteryIcon.style.fill = colourToUse;
  batteryPercent.style.fill = colourToUse;
  batteryIcon.href = iconToUse;
}

drawBat();

//Battery Draw - END
