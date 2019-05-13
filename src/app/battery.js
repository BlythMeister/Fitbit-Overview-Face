import document from "document"; 
import { battery } from "power";

//Battery - START
export let batteryLine = document.getElementById("battery-line");
export let batteryIconCharge = document.getElementById("battery-icon-charge");
export let batteryIcon = document.getElementById("battery-icon");
export let batteryPercent = document.getElementById("battery-percent");
export let batteryLineBack = document.getElementById("battery-line-back");
export let batteryPercentBlock = document.getElementById("battery");

export let colour0 = 'crimson';
export let colour25 = 'orange';
export let colour50 = 'yellow';
export let colour75 = 'lime';
//Battery - END

export let root = document.getElementById('root')
export const screenWidth = root.width

export function setShowBatteryPercent(visibility) {
  batteryPercentBlock.style.display = (!visibility ? "none" : "inline");
}

export function setColour0(colour) {
  colour0 = colour;
}

export function setColour25(colour) {
  colour25 = colour;
}

export function setColour50(colour) {
  colour50 = colour;
}

export function setColour75(colour) {
  colour75 = colour;
}

//Battery Draw - START
export function drawBat() {
  let level = battery.chargeLevel;
  
  isCharging();   
  
  let batteryPercentage = Math.floor(level);
  batteryPercent.text = `${batteryPercentage}%`
  let lineWidth = Math.floor(screenWidth*(batteryPercentage/100));
  batteryLine.width = lineWidth;
  
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
  batteryLine.style.fill = colour;
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