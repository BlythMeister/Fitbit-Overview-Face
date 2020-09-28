import document from "document"; 
import { display } from "display";
import { user } from "user-profile";
import { battery } from "power";
import { charger } from "power";
import { gettext } from "i18n";
//HR - START

export var isHeartbeatAnimation  = true;
export var hrmAnimationPhase = false;
export var prevHrmRate = null;
export var hrmRate = null;
export var hrAnimated = true;
export var hrAnimatedInterval = null;
export var hrMonitoring = true;
export let hrEl = document.getElementById("top-left");
export let hrIconSystoleEl = document.getElementById("hr-icon-systole");
export let hrIconDiastoleEl = document.getElementById("hr-icon-diastole");
export let hrCountEl = document.getElementById("hr-count");
export let hrRestingEl = document.getElementById("hr-resting");
export let hrZoneEl = document.getElementById("hr-zone");

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

export function setMonitoring(monitoring) {
  hrMonitoring = monitoring;
}

export function initHrInterval() {
  clearInterval(hrAnimatedInterval);
  hrAnimatedInterval = setInterval(animateHr, ((60/hrmRate)*1000)/2);
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

export function newHrm(rate) { 
  hrmRate = rate;
  drawHrm();
}

export function drawHrm() {  
  if (hrmRate == null || hrmRate <= 0 || hrMonitoring)
  {
      hrCountEl.text = "-";  
      hrRestingEl.text = `(${user.restingHeartRate})`;
      hrZoneEl.text = "";
      stopHrAnimation();
  }
  else
  {
    if (hrmRate) {
      hrCountEl.text = `${hrmRate}`;  
      hrRestingEl.text = `(${user.restingHeartRate})`;
      hrZoneEl.text = `${gettext(user.heartRateZone(hrmRate))}`;  

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
}
//HR Draw - END