import document from "document";
import { me as device } from "device";

export function deviceSetup() {
  let root = document.getElementById('root');
  console.log(device.modelId);
   
  switch(device.modelId) {
    case '27':
      setIonic(); 
      break;  
    case '32':
      setVersa();
      break;
    case '38':
      setVersaLite(); 
      break;
    default:
      console.log("DEVICE UNKNOWN")
  }
}

export function setVersa(){
  setIonicTimes('none');
  setVersaTimes('inline');
  setVersaLiteTimes('none');
}

export function setIonic(){
  setIonicTimes('inline');
  setVersaTimes('none');
  setVersaLiteTimes('none');
}

export function setVersaLite(){
  setIonicTimes('none');
  setVersaTimes('none');
  setVersaLiteTimes('inline');
  document.getElementById('elevationGain').style.display = 'none';
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
    var time = document.getElementById('versalite-time');
    var sec = document.getElementById('versalite-second');
    var amPm = document.getElementById('versalite-am-pm');
    setElements(time, sec, amPm, value);
}

export function setElements(time, sec, ampm, value){
  time.style.display = value;
  sec.style.display = value;
  ampm.style.display = value;
}
