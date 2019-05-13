import document from "document";
import { me as device } from "device";

export function deviceSetup() {
  let root = document.getElementById('root');
  console.log(device.modelName);
  
  setIonicTimes('none');
  setVersaTimes('none');
  setVersaLiteTimes('none');
  
  switch(device.modelName.toLowerCase()) {
    case 'versa':
      setVersaTimes('inline'); 
      break;
    case 'versa lite':
      setVersaLiteTimes('inline'); 
      break;
    case 'ionic':
      setIonicTimes('inline'); 
      break;  
    default:
      console.log("DEVICE UNKNOWN")
  }
}

export function setIonicTimes(value){
    var time = document.getElementById('ionic-time');
    var sec = document.getElementById('ionic-second');
    var amPm = document.getElementById('ionic-am-pm');
    setElements(time, sec, amPm, value);
}

export function setVersaTimes(value){
    var time = document.getElementById('versa-time');
    var sec = document.getElementById('versa-second');
    var amPm = document.getElementById('versa-am-pm');
    setElements(time, sec, amPm, value);
}

export function setVersaLiteTimes(value){
    var time = document.getElementById('versa-lite-time');
    var sec = document.getElementById('versa-lite-second');
    var amPm = document.getElementById('versa-lite-am-pm');
    setElements(time, sec, amPm, value);
}

export function setElements(time, sec, ampm, value){
  time.style.display = value;
  sec.style.display = value;
  ampm.style.display = value;
}
