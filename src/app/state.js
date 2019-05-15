import { display } from "display";
import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"

export function applyState() {
  if (display.on) {    
    applyHRState();
    applyProgressState();
    applyBmState();
  } else {
    applyStopHRState();
  }  
}

export  function applyStopHRState() {
    hr.hrm.stop()
}

export function applyHRState() {
    hr.hrm.start();
    hr.drawHrm();
}

export function applyProgressState() {
    activity.drawAllProgress();    
}

export function applyBmState() {
  bm.drawBMR();
  bm.drawBMI();
}