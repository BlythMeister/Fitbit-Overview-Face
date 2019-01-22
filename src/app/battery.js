import document from "document"; 
import { battery } from "power";

//Battery - START
export let batteryLine = document.getElementById("battery-line");
export let batteryLineBack = document.getElementById("battery-line-back");
//Battery - END

export let root = document.getElementById('root')
export const screenWidth = root.width

//Battery Draw - START
export function drawBat() {
  let level = battery.chargeLevel;
  let batteryPercentage = Math.floor(level);
  let lineWidth = Math.floor(screenWidth*(batteryPercentage/100));
  batteryLine.width = lineWidth;
  
  if (batteryPercentage >= 75)
  {
    batteryLine.style.fill = 'lime';
  }
  else if (batteryPercentage >= 50)
  {
      batteryLine.style.fill = 'yellow';
  }
  else if (batteryPercentage >= 25)
  {
      batteryLine.style.fill = 'orange';
  }
  else
  {
     batteryLine.style.fill = 'crimson';     
  }  
}

//Battery Draw - END