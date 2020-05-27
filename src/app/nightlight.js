import document from "document";

import { display } from "display";

export let nightlightEl = document.getElementById('nightlight');

export let nightlightEnabled = false;
export let firstTouch = false;
export let nightlightOn = false;

export function setEnabled(val) { nightlightEnabled = val}

nightlightEl.onclick = function(e) {
  if(nightlightEnabled)
  {
    if(firstTouch) {
      if(nightlightOn){
        nightlightEl.style.opacity = 0;
        display.brightnessOverride = undefined;
        nightlightOn = false;
      } else {
        nightlightEl.style.opacity = 1;
        display.brightnessOverride = "max";
        nightlightOn = true;
      }  
    } else {
      firstTouch = true;
      setTimeout(function () {firstTouch = false;}, 500);
    }
  }
}
