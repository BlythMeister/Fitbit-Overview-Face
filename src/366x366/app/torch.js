import * as document from "document";
import { display } from "display";
import { vibration } from "haptics";

export let torchEl = document.getElementById('torch');

export let torchEnabled = false;
export let firstTouch = false;
export let torchOn = false;
export let autoOffTimer = undefined;
export let torchOnNudgeTimer = undefined;
export let torchAutoOff = -1;

export function setEnabled(val) { torchEnabled = val}
export function setAutoOff(val) { torchAutoOff = val}

torchEl.onclick = function(e) {
  if(torchEnabled)
  {
    if(firstTouch) {
      if(torchOn){
        TurnOffTorch();
      } else {
        TurnOnTorch();
      }
    } else {
      firstTouch = true;
      setTimeout(function () {firstTouch = false;}, 500);
    }
  }
}

display.onchange = (evt) => {
  if(display.on == false && torchOn == true){
    TurnOffTorch();
  }
}

export function TurnOnTorch()
{
  torchEl.style.opacity = 1;
  display.brightnessOverride = "max";
  display.autoOff = false;
  display.on = true;
  torchOn = true;

  torchOnNudgeTimer = setInterval(function () { vibration.start("nudge-max"); }, 2000);

  if(torchAutoOff > 0)
  {
    autoOffTimer = setTimeout(function () {TurnOffTorch();}, torchAutoOff * 1000);
  }

}

export function TurnOffTorch()
{
  torchEl.style.opacity = 0;
  display.brightnessOverride = undefined;
  display.autoOff = true;
  torchOn = false;
  clearInterval(torchOnNudgeTimer);
  if(autoOffTimer != undefined){
    clearTimeout(autoOffTimer);
    autoOffTimer = undefined;
  }
}
