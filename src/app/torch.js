import document from "document";

import { display } from "display";

export let torchEl = document.getElementById('torch');

export let torchEnabled = false;
export let firstTouch = false;
export let torchOn = false;

export function setEnabled(val) { torchEnabled = val}

torchEl.onclick = function(e) {
  if(torchEnabled)
  {
    if(firstTouch) {
      if(torchOn){
        TurnOffTorch()
      } else {
        TurnOnTorch();
      }  
    } else {
      firstTouch = true;
      setTimeout(function () {firstTouch = false;}, 500);
    }
  }
}

export function TurnOnTorch()
{
  torchEl.style.opacity = 1;
  display.brightnessOverride = "max";
  display.autoOff = false;
  display.on = true;
  torchOn = true;
}

export function TurnOffTorch()
{
  torchEl.style.opacity = 0;
  display.brightnessOverride = undefined;
  display.autoOff = true;
  torchOn = false;
}
