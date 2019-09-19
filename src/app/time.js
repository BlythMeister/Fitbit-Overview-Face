import document from "document";
import { preferences } from "user-settings";
import { me as device } from "device";

export let root = document.getElementById('root')
export let timeEl = getElement("time");
export let secEl = getElement("second");
export let amPmEl = getElement("am-pm");
export let isAmPm = false;
export let showSeconds = true;
export let showLeadingZero = true;
export let timeFormat = 'auto'
export function setIsAmPm(val) { isAmPm = val}
export function setShowSeconds(val) { showSeconds = val }
export function setShowLeadingZero(val) { showLeadingZero = val }
export function setTimeFormat(val) { timeFormat = val }

export function getElement(type){
    switch(device.modelId) {
    case '27':
      return document.getElementById("ionic-" + type)
    case '32':
      return document.getElementById("versa-" + type)
    case '38':
      return document.getElementById("versalite-" + type)
    default:
      console.log("DEVICE UNKNOWN");
      return null;
  }
}

//Time Draw - START
export function drawTime(now) {
  var hours = setHours(now);
  let mins = setMinutes(now);
  let secs = setSeconds(now);
  timeEl.text = `${hours}:${mins}`;
  secEl.text = `${secs}`;  
}

export function setSeconds(now){
  if (showSeconds)
  {
    secEl.style.display= 'inline';
    return zeroPad(now.getSeconds());    
  }
  else
  {
      secEl.style.display= 'none';
  }  
}

export function setMinutes(now){
  return zeroPad(now.getMinutes());
}

export function setHours(now) {
  var hours = now.getHours();
  let clockFormat = timeFormat;
  if(timeFormat === "auto")
  {
    clockFormat = preferences.clockDisplay;    
  }
  
  if (clockFormat === "12h") {
    // 12h format    
    if (isAmPm) {
      if (hours < 12) {
        amPmEl.text = " AM";
      } else {
        amPmEl.text = " PM";        
      }
      amPmEl.style.display= 'inline';
    }
    else
    {
      amPmEl.style.display= 'none';
    }
    
    if (hours === 0)
    {
      hours = 12;  
    } else if (hours > 12) {
      hours = hours - 12;
    }
  } else {
    // 24h format
    amPmEl.style.display= 'none';
  }
  
  if(showLeadingZero)
  {
      return zeroPad(hours);
  }
  else
  {
    return hours;
  }
}
//Time Draw - END

export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}