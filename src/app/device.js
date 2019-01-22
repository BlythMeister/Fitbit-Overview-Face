import document from "document";

export function deviceSetup() {
  let root = document.getElementById('root');
  const screenHeight = root.height //250 - Ionic, 300 - Versa
  if (screenHeight === 300) {
    console.log("Versa");
    setIonicTimes('none');
    setVersaTimes('inline');  
  }
  else {
    console.log("Ionic");
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
