import { display } from "display";
import { battery as powerBattery } from "power";
import { charger as powerCharger } from "power";
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";

import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"

const hrm = new HeartRateSensor();
const body = new BodyPresenceSensor();

clock.granularity = "seconds";

if (display.on) {
  body.start();
}

if (body.present) {
    hrm.start(); 
}

display.onchange = (evt) => {
  if (display.on) {
    body.start();
    if (body.present) {
      hrm.start();
      hr.newHrm(0);
    }
  } else {
    hrm.stop();
    body.stop();
  }
  
  reApplyState();
}

body.onreading = (evt) => {
  if (body.present) {
    hrm.start(); 
    hr.newHrm(0);
  } else {
    hrm.stop();
    hr.newHrm(0);    
  }
  
  reApplyState();
}

clock.ontick = (evt) => {  
  time.drawTime(evt.date);
  date.drawDate(evt.date);
  activity.drawAllProgress();
}

powerBattery.onchange = (evt) => {
  battery.drawBat();
  hr.batteryCharger();
}

powerCharger.onchange = (evt) => {
  battery.isCharging();
  hr.batteryCharger();
}

hrm.onreading = (evt) => {
  hr.newHrm(hrm.heartRate);
};

export function reApplyState() {
  hr.batteryCharger();
  hr.drawHrm();
  activity.drawAllProgress();  
  bm.drawBMR();
  bm.drawBMI();
}
