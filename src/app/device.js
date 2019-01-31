import document from "document";
import { me as device } from "device";

export function deviceSetup() {
  let root = document.getElementById('root');
  console.log(device.modelName);
  
  if (device.modelName === 'Versa') {    
    setIonicTimes('none');
    setVersaTimes('inline');  
  } else {
    setIonicTimes('inline');
    setVersaTimes('none');  
  }
}

export function setIonicTimes(value){
    var ionicTime = document.getElementById('ionic-time');
    var ionicSec = document.getElementById('ionic-second');
    var ionicAmPm = document.getElementById('ionic-am-pm');
    
    ionicTime.style.display = value;
    ionicSec.style.display = value;
    ionicAmPm.style.display = value;
}

export function setVersaTimes(value){
    var versaTime = document.getElementById('versa-time');
    var versaSec = document.getElementById('versa-second');
    var versaAmPm = document.getElementById('versa-am-pm');
    
    versaTime.style.display = value;
    versaSec.style.display = value;
    versaAmPm.style.display = value;
}
