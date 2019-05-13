
import document from "document";
import { display } from "display";
import { battery as powerBattery } from "power";
import { charger as powerCharger } from "power";
import clock from "clock";

import * as device from "./device.js"
import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as settings from "./settings.js"
import * as state from "./state.js"

clock.granularity = "seconds";
settings.loadSettings();
device.deviceSetup();

display.onchange = (evt) => {
  state.applyState();
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