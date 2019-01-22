import document from "document"; 
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { user } from "user-profile";
import * as heartRateZone from "../common/heartRateZone"
//HR - START

export let hrm = new HeartRateSensor();
export let body = new BodyPresenceSensor();
export var isHeartbeatAnimation  = true;
export var hrmAnimationPhase = false;
export var prevHrmRate = null;
export var hrmRate = null;
export var hrAnimated = true;
export var hrAnimatedInterval = null;
export let hrEl = document.getElementById("hr");
export let hrIconSystoleEl = document.getElementById("hr-icon-systole");
export let hrIconDiastoleEl = document.getElementById("hr-icon-diastole");
export let hrCountEl = document.getElementById("hr-count");
export let hrRestingEl = document.getElementById("hr-resting");
export let hrZoneEl = document.getElementById("hr-zone");

export let language = "en";
export function setLanguage(val) { 
  language = val
  drawHrm();
}

export function isHeartbeatAnimationSet(val) { 
  isHeartbeatAnimation = val;
  if(val){
    drawHrm();
  }
  else{
    stopHrAnimation();
  }
}
//HR - END

//HR Draw - START

export function setHrZoneVis(visibility) {
  hrZoneEl.style.display = (!visibility ? "none" : "inline");
}

export function initHrInterval() {
  clearInterval(hrAnimatedInterval);
  hrAnimatedInterval = setInterval(animateHr, 30000/hrmRate);
}

export function stopHrAnimation() {
  hrAnimated = false;
  clearInterval(hrAnimatedInterval);
  hrIconDiastoleEl.style.display = "inline";
  hrIconSystoleEl.style.display = "none";
}

export function hideHr() {
   hrmRate = null;
   prevHrmRate = null;   
   stopHrAnimation();
   hrEl.style.display = "none";
}

export function animateHr() {   
    if (hrmAnimationPhase) {
      hrIconDiastoleEl.style.display = "none";
      hrIconSystoleEl.style.display = "inline";
    } else {
      hrIconDiastoleEl.style.display = "inline";
      hrIconSystoleEl.style.display = "none";
    }
  
    hrmAnimationPhase =!hrmAnimationPhase;
  
    if (prevHrmRate != hrmRate) {
      clearInterval(hrAnimatedInterval);
      if (isHeartbeatAnimation) {
        prevHrmRate = hrmRate;
        initHrInterval();
      }
    }     
    prevHrmRate = hrmRate;
}

export function drawHrm() { 
  hrmRate = hrm.heartRate;
  if (hrmRate && display.on) {
    hrCountEl.text = `${hrmRate}`;  
    hrRestingEl.text = `(${user.restingHeartRate})`;
    hrZoneEl.text = heartRateZone.getHeartRateZone(language, user.heartRateZone(hrmRate));
    
    if (!prevHrmRate) {
      hrEl.style.display = "inline";    
    }
    if (!hrAnimated && isHeartbeatAnimation) {
      clearInterval(hrAnimatedInterval);   
      prevHrmRate = hrmRate;
      initHrInterval();
      hrAnimated = true;      
    }
  } else {
    hideHr();
  }
}

drawHrm();
hrm.onreading = drawHrm;
body.onreading = () => {
  if (!body.present) {
    hrm.stop();
    hrEl.style.display = "none";
  } else {
    hrm.start();
    hrEl.style.display = "inline";
  }
};
body.start();
//HR Draw - END