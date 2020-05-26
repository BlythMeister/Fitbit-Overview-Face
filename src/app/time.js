import document from "document";
import { preferences } from "user-settings";
import { me as device } from "device";

export let root = document.getElementById('root')
export let timeHourEl = getElement("time-hour");
export let timeColonEl = getElement("time-colon");
export let timeMinuteEl = getElement("time-minute");
export let timeSecEl = getElement("second");
export let timeAmPmEl = getElement("am-pm");
export let isAmPm = false;
export let showSeconds = true;
export let showLeadingZero = true;
export let timeFormat = 'auto'
export var flashDotsInterval = null;
export function setIsAmPm(val) { isAmPm = val}
export function setShowSeconds(val) { showSeconds = val }
export function setShowLeadingZero(val) { showLeadingZero = val }
export function setTimeFormat(val) { timeFormat = val }

timeColonEl.text = ":";
timeColonEl.style.display = 'inline';

export function setFlashDots(val) { 
  if(val)
  {
    clearInterval(flashDotsInterval);
    flashDotsInterval = setInterval(animateColon, 500);
  }
  else
  {
    clearInterval(flashDotsInterval);
    timeColonEl.style.display = 'inline';
  }
}

export function animateColon()
{
  if(timeColonEl.style.display == 'none')
  {
    timeColonEl.style.display = 'inline';
  }
  else
  {
    timeColonEl.style.display = 'none';  
  }    
}

export function getElement(type){
    return document.getElementById(device.screen.width + "-" + type)
}

//Time Draw - START
export function drawTime(now) {
  setHours(now);
  setMinutes(now);
  setSeconds(now);
}

export function setSeconds(now){
  if (showSeconds)
  {
    timeSecEl.style.display= 'inline';
    timeSecEl.text = zeroPad(now.getSeconds());
  }
  else
  {
    timeSecEl.style.display= 'none';
  }  
}

export function setMinutes(now){
  timeMinuteEl.style.display= 'inline';
  timeMinuteEl.text = zeroPad(now.getMinutes());
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
        timeAmPmEl.text = " AM";
      } else {
        timeAmPmEl.text = " PM";        
      }
      timeAmPmEl.style.display= 'inline';
    }
    else
    {
      timeAmPmEl.style.display= 'none';
    }
    
    if (hours === 0)
    {
      hours = 12;  
    } else if (hours > 12) {
      hours = hours - 12;
    }
  } else {
    // 24h format
    timeAmPmEl.style.display= 'none';
  }
  
  timeHourEl.style.display= 'inline';
  if(showLeadingZero)
  {
    timeHourEl.text = zeroPad(hours);
  }
  else
  {
    timeHourEl.text = hours;
  }
}
//Time Draw - END

export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}