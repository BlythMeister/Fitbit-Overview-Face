import * as document from "document";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { user } from "user-profile";
import * as fs from "fs";
import { me as appbit } from "appbit";
import { me as device } from "device";
import { locale } from "user-settings";
import { gettext } from "i18n";

import * as bm from "./bm.js";
import * as date from "./date.js";
import * as battery from "./battery.js";
import * as time from "./time.js";
import * as hr from "./hr.js";
import * as activity from "./activity.js";
import * as state from "./state.js";
import * as torch from "./torch.js";
import * as weather from "./weather.js";
import * as connectivity from "./connectivity.js";
import { msgq } from "./msgq.js";

// SETTINGS
export const SETTINGS_TYPE = "cbor";
export const SETTINGS_FILE = "settingsV1.cbor";
export let root = document.getElementById("root");
export let backgroundEl = document.getElementById("background");
export let settings = loadSettings();

export function hasSettings(){
  if (!settings) {
    return false;
  }
  return true;
}

export function applySettings() {
  if (!settings) {
    settings = loadSettings();
    if (!settings) {
      console.log("No settings loaded");
      return;
    }
  }

  if (settings.hasOwnProperty("distanceUnit") && settings["distanceUnit"]) {
    activity.distanceUnitSet(settings["distanceUnit"]);
  } else {
    activity.distanceUnitSet("auto");
  }

  if (settings.hasOwnProperty("dateFormat") && settings["dateFormat"]) {
    date.setDateFormat(settings["dateFormat"]);
  } else {
    date.setDateFormat("dd mmmm yy");
  }

  if (settings.hasOwnProperty("timeFormat") && settings["timeFormat"]) {
    time.setTimeFormat(settings["timeFormat"]);
  } else {
    time.setTimeFormat("auto");
  }

  if (settings.hasOwnProperty("showTime")) {
    if (settings.hasOwnProperty("isAmPm")) {
      time.setIsAmPm(!!settings["isAmPm"] && !!settings["showTime"]);
    } else {
      time.setIsAmPm(!!settings["showTime"]);
    }
  } else {
    if (settings.hasOwnProperty("isAmPm")) {
      time.setIsAmPm(!!settings["isAmPm"]);
    } else {
      time.setIsAmPm(true);
    }
  }

  if (settings.hasOwnProperty("showTime")) {
    if (settings.hasOwnProperty("showSeconds")) {
      time.setShowSeconds(!!settings["showSeconds"] && !!settings["showTime"]);
    } else {
      time.setShowSeconds(!!settings["showTime"]);
    }
  } else {
    if (settings.hasOwnProperty("showSeconds")) {
      time.setShowSeconds(!!settings["showSeconds"]);
    } else {
      time.setShowSeconds(true);
    }
  }

  if (settings.hasOwnProperty("showTime")) {
    if (settings.hasOwnProperty("flashDots")) {
      time.setFlashDots(!!settings["flashDots"] && !!settings["showTime"]);
    } else {
      time.setFlashDots(!!settings["showTime"]);
    }
  } else {
    if (settings.hasOwnProperty("flashDots")) {
      time.setFlashDots(!!settings["flashDots"]);
    } else {
      time.setFlashDots(true);
    }
  }

  if (settings.hasOwnProperty("showLeadingZero")) {
    time.setShowLeadingZero(!!settings["showLeadingZero"]);
  } else {
    time.setShowLeadingZero(true);
  }

  if (settings.hasOwnProperty("heartRateZoneVis")) {
    hr.setHrZoneVis(!!settings["heartRateZoneVis"]);
  } else {
    hr.setHrZoneVis(true);
  }

  if (settings.hasOwnProperty("torchEnabled")) {
    torch.setEnabled(!!settings["torchEnabled"]);
  } else {
    torch.setEnabled(false);
  }

  if (settings.hasOwnProperty("torchAutoOff")) {
    torch.setAutoOff(settings["torchAutoOff"]);
  } else {
    torch.setAutoOff(-1);
  }

  if (settings.hasOwnProperty("torchOverlay")) {
    torch.setTorchOverlay(settings["torchOverlay"]);
  } else {
    torch.setTorchOverlay(false);
  }

  if (settings.hasOwnProperty("timeColour") && settings["timeColour"]) {
    time.timeHourEl.style.fill = settings["timeColour"];
    time.timeColonEl.style.fill = settings["timeColour"];
    time.timeMinuteEl.style.fill = settings["timeColour"];
    time.timeSecEl.style.fill = settings["timeColour"];
    time.timeAmPmEl.style.fill = settings["timeColour"];
  } else {
    time.timeHourEl.style.fill = "white";
    time.timeColonEl.style.fill = "white";
    time.timeMinuteEl.style.fill = "white";
    time.timeSecEl.style.fill = "white";
    time.timeAmPmEl.style.fill = "white";
  }

  if (settings.hasOwnProperty("showTime")) {
    time.timeHourEl.style.display = !!settings["showTime"] ? "inline" : "none";
    time.timeColonEl.style.display = !!settings["showTime"] ? "inline" : "none";
    time.timeMinuteEl.style.display = !!settings["showTime"] ? "inline" : "none";
  } else {
    time.timeHourEl.style.display = "inline";
    time.timeColonEl.style.display = "inline";
    time.timeMinuteEl.style.display = "inline";
  }

  if (settings.hasOwnProperty("dateColour") && settings["dateColour"]) {
    date.dateEl.style.fill = settings["dateColour"];
    date.dayEl.style.fill = settings["dateColour"];
  } else {
    date.dateEl.style.fill = "#969696";
    date.dayEl.style.fill = "#969696";
  }

  if (settings.hasOwnProperty("showDate")) {
    date.dateEl.style.display = !!settings["showDate"] ? "inline" : "none";

    if (settings["showDate"]) {
      if (settings.hasOwnProperty("showDay")) {
        date.dayEl.style.display = !!settings["showDay"] ? "inline" : "none";
      } else {
        date.dayEl.style.display = "inline";
      }
    } else {
      date.dayEl.style.display = "none";
    }
  } else {
    date.dateEl.style.display = "inline";
  }

  if (settings.hasOwnProperty("showHeartRate")) {
    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"] && !!settings["showHeartRate"]);
    } else {
      hr.isHeartbeatAnimationSet(!!settings["showHeartRate"]);
    }
  } else {
    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"]);
    } else {
      hr.isHeartbeatAnimationSet(true);
    }
  }

  if (settings.hasOwnProperty("backgroundColour") && settings["backgroundColour"]) {
    backgroundEl.style.fill = settings["backgroundColour"];
  } else {
    backgroundEl.style.fill = "black";
  }

  if (settings.hasOwnProperty("heartColour") && settings["heartColour"]) {
    hr.hrIconDiastoleEl.style.fill = settings["heartColour"];
    hr.hrIconSystoleEl.style.fill = settings["heartColour"];
  } else {
    hr.hrIconDiastoleEl.style.fill = "crimson";
    hr.hrIconSystoleEl.style.fill = "crimson";
  }

  if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
    hr.hrCountEl.style.fill = settings["heartRateColour"];
    hr.hrZoneEl.style.fill = settings["heartRateColour"];
  } else {
    hr.hrCountEl.style.fill = "#969696";
    hr.hrZoneEl.style.fill = "#969696";
  }

  if (settings.hasOwnProperty("showHeartRate")) {
    hr.hrIconDiastoleEl.style.display = !!settings["showHeartRate"] ? "inline" : "none";
    hr.hrIconSystoleEl.style.display = !!settings["showHeartRate"] ? "inline" : "none";
    hr.hrCountEl.style.display = !!settings["showHeartRate"] ? "inline" : "none";
  } else {
    hr.hrIconDiastoleEl.style.display = "inline";
    hr.hrIconSystoleEl.style.display = "inline";
    hr.hrCountEl.style.display = "inline";
  }

  if (settings.hasOwnProperty("showHeartRate")) {
    if (settings.hasOwnProperty("heartRateZoneVis")) {
      hr.setHrZoneVis(!!settings["heartRateZoneVis"] && !!settings["showHeartRate"]);
    } else {
      hr.setHrZoneVis(!!settings["showHeartRate"]);
    }
  } else {
    if (settings.hasOwnProperty("heartRateZoneVis")) {
      hr.setHrZoneVis(!!settings["heartRateZoneVis"]);
    } else {
      hr.setHrZoneVis(true);
    }
  }

  if (settings.hasOwnProperty("showPhoneStatus")) {
    connectivity.setShowPhoneStatus(!!settings["showPhoneStatus"]);
  } else {
    connectivity.setShowPhoneStatus(false);
  }

  if (settings.hasOwnProperty("showMsgQSize")) {
    connectivity.setQueueSize(!!settings["showMsgQSize"]);
  } else {
    connectivity.setQueueSize(false);
  }

  if (settings.hasOwnProperty("showLastMsg")) {
    connectivity.setShowLastMsg(!!settings["showLastMsg"]);
  } else {
    connectivity.setShowLastMsg(false);
  }

  if (settings.hasOwnProperty("phoneStatusConnected") && settings["phoneStatusConnected"]) {
    connectivity.setPhoneIconConnected(settings["phoneStatusConnected"]);
  } else {
    connectivity.setPhoneIconConnected("white");
  }

  if (settings.hasOwnProperty("phoneStatusDisconnected") && settings["phoneStatusDisconnected"]) {
    connectivity.setPhoneIconDisconnected(settings["phoneStatusDisconnected"]);
  } else {
    connectivity.setPhoneIconDisconnected("white");
  }

  if (settings.hasOwnProperty("showBatteryPercent")) {
    battery.setShowBatteryPercent(!!settings["showBatteryPercent"]);
  } else {
    battery.setShowBatteryPercent(true);
  }

  if (settings.hasOwnProperty("showBatteryBar")) {
    battery.setShowBatteryBar(!!settings["showBatteryBar"]);
  } else {
    battery.setShowBatteryBar(true);
  }

  if (settings.hasOwnProperty("batteryIcon0Colour") && settings["batteryIcon0Colour"]) {
    battery.setColour0Icon(settings["batteryIcon0Colour"]);
  } else {
    battery.setColour0Icon("red");
  }

  if (settings.hasOwnProperty("batteryIcon25Colour") && settings["batteryIcon25Colour"]) {
    battery.setColour25Icon(settings["batteryIcon25Colour"]);
  } else {
    battery.setColour25Icon("darkorange");
  }

  if (settings.hasOwnProperty("batteryIcon50Colour") && settings["batteryIcon50Colour"]) {
    battery.setColour50Icon(settings["batteryIcon50Colour"]);
  } else {
    battery.setColour50Icon("gold");
  }

  if (settings.hasOwnProperty("batteryIcon75Colour") && settings["batteryIcon75Colour"]) {
    battery.setColour75Icon(settings["batteryIcon75Colour"]);
  } else {
    battery.setColour75Icon("lime");
  }

  if (settings.hasOwnProperty("battery0Colour") && settings["battery0Colour"]) {
    battery.setColour0(settings["battery0Colour"]);
  } else {
    battery.setColour0("red");
  }

  if (settings.hasOwnProperty("battery25Colour") && settings["battery25Colour"]) {
    battery.setColour25(settings["battery25Colour"]);
  } else {
    battery.setColour25("darkorange");
  }

  if (settings.hasOwnProperty("battery50Colour") && settings["battery50Colour"]) {
    battery.setColour50(settings["battery50Colour"]);
  } else {
    battery.setColour50("gold");
  }

  if (settings.hasOwnProperty("battery75Colour") && settings["battery75Colour"]) {
    battery.setColour75(settings["battery75Colour"]);
  } else {
    battery.setColour75("lime");
  }

  if (settings.hasOwnProperty("batteryBackgroundColour") && settings["batteryBackgroundColour"]) {
    battery.batteryLineBack.style.fill = settings["batteryBackgroundColour"];
  } else {
    battery.batteryLineBack.style.fill = "#494949";
  }

  if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
    bm.bmrZoneEl.style.fill = settings["bmColour"];
    bm.bmiZoneEl.style.fill = settings["bmColour"];
  } else {
    bm.bmrZoneEl.style.fill = "white";
    bm.bmiZoneEl.style.fill = "white";
  }

  if (settings.hasOwnProperty("bmiColour") && settings["bmiColour"]) {
    bm.bmiCountEl.style.fill = settings["bmiColour"];
    bm.bmiIconEl.style.fill = settings["bmiColour"];
  } else {
    bm.bmiCountEl.style.fill = "white";
    bm.bmiIconEl.style.fill = "white";
  }

  if (settings.hasOwnProperty("bmrColour") && settings["bmrColour"]) {
    bm.bmrCountEl.style.fill = settings["bmrColour"];
    bm.bmrIconEl.style.fill = settings["bmrColour"];
  } else {
    bm.bmrCountEl.style.fill = "white";
    bm.bmrIconEl.style.fill = "white";
  }

  if (settings.hasOwnProperty("weatherColour") && settings["weatherColour"]) {
    weather.weatherCountEl.style.fill = settings["weatherColour"];
    weather.weatherIconEl.style.fill = settings["weatherColour"];
  } else {
    weather.weatherCountEl.style.fill = "white";
    weather.weatherIconEl.style.fill = "white";
  }

  if (settings.hasOwnProperty("weatherLocationColour") && settings["weatherLocationColour"]) {
    weather.weatherLocationTextEl.style.fill = settings["weatherLocationColour"];
  } else {
    weather.weatherLocationTextEl.style.fill = "white";
  }

  if (settings.hasOwnProperty("weatherRefreshInterval") && settings["weatherRefreshInterval"]) {
    weather.setRefreshInterval(settings["weatherRefreshInterval"]);
  } else {
    weather.setRefreshInterval(3600000);
  }

  if (settings.hasOwnProperty("weatherTemperatureUnit") && settings["weatherTemperatureUnit"]) {
    weather.setTemperatureUnit(settings["weatherTemperatureUnit"]);
  } else {
    weather.setTemperatureUnit("C");
  }

  if (settings.hasOwnProperty("batteryStatColour") && settings["batteryStatColour"]) {
    battery.batteryStatIconNoProgress.style.fill = settings["batteryStatColour"];
    battery.batteryStatCountNoProgress.style.fill = settings["batteryStatColour"];
    battery.batteryStatLineStraight.style.fill = settings["batteryStatColour"];
    battery.batteryStatIconStraight.style.fill = settings["batteryStatColour"];
    battery.batteryStatCountStraight.style.fill = settings["batteryStatColour"];
    battery.batteryStatLineArc.style.fill = settings["batteryStatColour"];
    battery.batteryStatIconArc.style.fill = settings["batteryStatColour"];
    battery.batteryStatCountArc.style.fill = settings["batteryStatColour"];
    battery.batteryStatLineRing.style.fill = settings["batteryStatColour"];
    battery.batteryStatIconRing.style.fill = settings["batteryStatColour"];
    battery.batteryStatCountRing.style.fill = settings["batteryStatColour"];
  } else {
    battery.batteryStatIconNoProgress.style.fill = "white";
    battery.batteryStatCountNoProgress.style.fill = "white";
    battery.batteryStatLineStraight.style.fill = "white";
    battery.batteryStatIconStraight.style.fill = "white";
    battery.batteryStatCountStraight.style.fill = "white";
    battery.batteryStatLineArc.style.fill = "white";
    battery.batteryStatIconArc.style.fill = "white";
    battery.batteryStatCountArc.style.fill = "white";
    battery.batteryStatLineRing.style.fill = "white";
    battery.batteryStatIconRing.style.fill = "white";
    battery.batteryStatCountRing.style.fill = "white";
  }

  if (settings.hasOwnProperty("progressBackgroundColour") && settings["progressBackgroundColour"]) {
    battery.batteryStatLineBackStraight.style.fill = settings["progressBackgroundColour"];
    battery.batteryStatLineBackArc.style.fill = settings["progressBackgroundColour"];
    battery.batteryStatLineBackRing.style.fill = settings["progressBackgroundColour"];
  } else {
    battery.batteryStatLineBackStraight.style.fill = "#494949";
    battery.batteryStatLineBackArc.style.fill = "#494949";
    battery.batteryStatLineBackRing.style.fill = "#494949";
  }

  var progressBarType = "bars";
  if (settings.hasOwnProperty("progressBars") && settings["progressBars"]) {
    progressBarType = settings["progressBars"];
  }

  for (var i = 0; i < activity.goalTypes.length; i++) {
    var goalType = activity.goalTypes[i];
    var goalTypeColourProp = goalType + "Colour";
    if (settings.hasOwnProperty(goalTypeColourProp) && settings[goalTypeColourProp]) {
      activity.progressEls[i].countNoProgress.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].iconNoProgress.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].countStraight.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].iconStraight.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].lineStraight.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].countArc.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].iconArc.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].lineArc.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].countRing.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].iconRing.style.fill = settings[goalTypeColourProp];
      activity.progressEls[i].lineRing.style.fill = settings[goalTypeColourProp];
    } else {
      activity.progressEls[i].countNoProgress.style.fill = "white";
      activity.progressEls[i].iconNoProgress.style.fill = "white";
      activity.progressEls[i].countStraight.style.fill = "white";
      activity.progressEls[i].iconStraight.style.fill = "white";
      activity.progressEls[i].lineStraight.style.fill = "white";
      activity.progressEls[i].countArc.style.fill = "white";
      activity.progressEls[i].iconArc.style.fill = "white";
      activity.progressEls[i].lineArc.style.fill = "white";
      activity.progressEls[i].countRing.style.fill = "white";
      activity.progressEls[i].iconRing.style.fill = "white";
      activity.progressEls[i].lineRing.style.fill = "white";
    }

    if (settings.hasOwnProperty("progressBackgroundColour") && settings["progressBackgroundColour"]) {
      activity.progressEls[i].lineBackStraight.style.fill = settings["progressBackgroundColour"];
      activity.progressEls[i].lineBackArc.style.fill = settings["progressBackgroundColour"];
      activity.progressEls[i].lineBackRing.style.fill = settings["progressBackgroundColour"];
    } else {
      activity.progressEls[i].lineBackStraight.style.fill = "#494949";
      activity.progressEls[i].lineBackArc.style.fill = "#494949";
      activity.progressEls[i].lineBackRing.style.fill = "#494949";
    }
  }

  var positions = ["TL", "BL", "TM", "MM", "BM", "TR", "BR"];

  for (var i = 0; i < positions.length; i++) {
    var position = positions[i];

    var positionProp = "Stats" + position;
    var stat = "";
    if (settings.hasOwnProperty(positionProp) && settings[positionProp]) {
      stat = settings[positionProp];
    }

    //Remove item from position
    if (bm.bmPosition == position && stat != "BMIBMR") {
      setStatsLocation(bm.bmEl, "NONE");
      bm.setBMPosition("NONE");
    }

    if (bm.bmiPosition == position && stat != "BMI") {
      setStatsLocation(bm.bmiEl, "NONE");
      bm.setBMIPosition("NONE");
    }

    if (bm.bmrPosition == position && stat != "BMR") {
      setStatsLocation(bm.bmrEl, "NONE");
      bm.setBMRPosition("NONE");
    }

    if (weather.weatherPosition == position && stat != "WEATHER") {
      setStatsLocation(weather.weatherEl, "NONE");
      weather.setWeatherPosition("NONE");
    }

    if (weather.weatherLocationPosition == position && stat != "WEATHER-LOCATION") {
      setStatsLocation(weather.weatherLocationEl, "NONE");
      weather.setWeatherLocationPosition("NONE");
    }

    if (battery.batteryStatposition == position && stat != "BATTERY") {
      setStatsLocation(battery.batteryStatContainerNoProgress, "NONE");
      setStatsLocation(battery.batteryStatContainerStraight, "NONE");
      setStatsLocation(battery.batteryStatContainerArc, "NONE");
      setStatsLocation(battery.batteryStatContainerRing, "NONE");
      battery.setPosition("NONE");
    }

    for (var x = 0; x < activity.goalTypes.length; x++) {
      if (activity.progressEls[x].position == position && stat != activity.progressEls[x].prefix) {
        setStatsLocation(activity.progressEls[x].containerNoProgress, "NONE");
        setStatsLocation(activity.progressEls[x].containerStraight, "NONE");
        setStatsLocation(activity.progressEls[x].containerArc, "NONE");
        setStatsLocation(activity.progressEls[x].containerRing, "NONE");
        activity.progressEls[x].position = "NONE";
      }
    }

    var positionProp = "Stats" + position;
    var stat = "";
    if (settings.hasOwnProperty(positionProp) && settings[positionProp]) {
      stat = settings[positionProp];
    } else {
      if (position == "TL") {
        stat = "steps";
      } else if (position == "BL") {
        stat = "distance";
      } else if (position == "TM") {
        stat = "BMIBMR";
      } else if (position == "MM") {
        stat = "calories";
      } else if (position == "TR") {
        stat = "elevationGain";
      } else if (position == "BR") {
        stat = "activeMinutes";
      }
    }

    if (stat == "BMIBMR") {
      bm.setBMPosition(position);
      setStatsLocation(bm.bmEl, position);
    } else if (stat == "BMI") {
      bm.setBMIPosition(position);
      setStatsLocation(bm.bmiEl, position);
    } else if (stat == "BMR") {
      bm.setBMRPosition(position);
      setStatsLocation(bm.bmrEl, position);
    } else if (stat == "WEATHER") {
      weather.setWeatherPosition(position);
      setStatsLocation(weather.weatherEl, position);
    } else if (stat == "WEATHER-LOCATION") {
      weather.setWeatherLocationPosition(position);
      setStatsLocation(weather.weatherLocationEl, position, true);
    } else if (stat == "BATTERY") {
      setStatsLocation(battery.batteryStatContainerNoProgress, "NONE");
      setStatsLocation(battery.batteryStatContainerStraight, "NONE");
      setStatsLocation(battery.batteryStatContainerArc, "NONE");
      setStatsLocation(battery.batteryStatContainerRing, "NONE");
      if (progressBarType == "bars") {
        setStatsLocation(battery.batteryStatContainerStraight, position);
      } else if (progressBarType == "arc") {
        setStatsLocation(battery.batteryStatContainerArc, position);
      } else if (progressBarType == "ring") {
        setStatsLocation(battery.batteryStatContainerRing, position);
      } else {
        setStatsLocation(battery.batteryStatContainerNoProgress, position);
      }
      battery.setPosition(position);
    } else {
      for (var x = 0; x < activity.goalTypes.length; x++) {
        if (activity.goalTypes[x] == stat) {
          activity.progressEls[x].position = position;
          setStatsLocation(activity.progressEls[x].containerNoProgress, "NONE");
          setStatsLocation(activity.progressEls[x].containerStraight, "NONE");
          setStatsLocation(activity.progressEls[x].containerArc, "NONE");
          setStatsLocation(activity.progressEls[x].containerRing, "NONE");
          if (progressBarType == "bars") {
            setStatsLocation(activity.progressEls[x].containerStraight, position);
          } else if (progressBarType == "arc") {
            setStatsLocation(activity.progressEls[x].containerArc, position);
          } else if (progressBarType == "ring") {
            setStatsLocation(activity.progressEls[x].containerRing, position);
          } else {
            setStatsLocation(activity.progressEls[x].containerNoProgress, position);
          }
        }
      }
    }
  }

  activity.resetProgressPrevState();
  state.reApplyState();
}

applySettings();

export function setStatsLocation(element, location, centre = false) {
  var maxWidth = device.screen.width;
  var maxHeight = device.screen.height;

  if (location == "TL") {
    element.style.display = "inline";
    element.x = (5 * maxWidth) / 100;
    element.y = maxHeight - 116;
    return;
  }

  if (location == "BL") {
    element.style.display = "inline";
    element.x = (5 * maxWidth) / 100;
    element.y = maxHeight - 76;
    return;
  }

  if (location == "TM") {
    element.style.display = "inline";
    element.x = (36 * maxWidth) / 100;
    element.y = maxHeight - 116;
    return;
  }

  if (location == "MM") {
    element.style.display = "inline";
    element.x = (36 * maxWidth) / 100;
    element.y = maxHeight - 76;
    return;
  }

  if (location == "BM" && centre) {
    element.style.display = "inline";
    element.x = maxWidth / 2;
    element.y = maxHeight - 37;
    return;
  }

  if (location == "BM") {
    element.style.display = "inline";
    element.x = (36 * maxWidth) / 100;
    element.y = maxHeight - 37;
    return;
  }

  if (location == "TR") {
    element.style.display = "inline";
    element.x = (67 * maxWidth) / 100;
    element.y = maxHeight - 116;
    return;
  }

  if (location == "BR") {
    element.style.display = "inline";
    element.x = (67 * maxWidth) / 100;
    element.y = maxHeight - 76;
    return;
  }

  if (location == "NONE") {
    element.style.display = "none";
    return;
  }
}

export function onsettingschange(data) {
  if (!data) {
    return;
  }
  settings = data;
  applySettings();
  saveSettings();
  time.drawTime(new Date());
}

export function settingUpdate(message) {
  if (!settings) {
    settings = {};
  }

  var newValue = "";
  if (typeof message.value === "object") {
    newValue = message.value.values[0].value;
  } else {
    newValue = message.value;
  }

  if (settings[message.key] != newValue) {
    console.log(`Setting update - key:${message.key} value:${newValue}`);
    settings[message.key] = newValue;
  } else {
    return;
  }

  onsettingschange(settings);
}

appbit.addEventListener("unload", saveSettings);

export function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      var fileContent = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
      if (fileContent != null || Object.keys(fileContent).length > 0) {
        return fileContent;
      }
    }
  } catch (e) {
    console.error(e.message);
    return null;
  }

  return null;
}

// Save settings to the filesystem
export function saveSettings() {
  if (settings != null && Object.keys(settings) != null && Object.keys(settings).length > 0) {
    fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
  }
}
