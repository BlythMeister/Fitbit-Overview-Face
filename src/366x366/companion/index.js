import { settingsStorage } from "settings";
import { me as companion } from "companion";
import { weather } from "weather";

import { msgq } from "./../shared/msgq.js";

let lastWeather = null;
let lastSendAllSettings = null;

//Wake every 15 minutes
console.log("Set companion wake interval to 5 minutes");
companion.wakeInterval = 300000;

// Monitor for significant changes in physical location
console.log("Enable monitoring of significant location changes");
companion.monitorSignificantLocationChanges = true;

msgq.addEventListener("message", (messageKey, message) => {
  if (messageKey === "send-all-settings") {
    sendSettingsWithDefaults();
    msgq.send(`all-settings-sent`, {}, false);
  } else if (messageKey === "weather") {
    sendWeather(message.unit);
  }
});

// Listen for the significant location change event
companion.addEventListener("significantlocationchange", (evt) => {
  locationChange();
});

// check launch reason
console.log(`Companion launch reason: ${JSON.stringify(companion.launchReasons)}`);
if (companion.launchReasons.locationChanged) {
  locationChange();
}
msgq.send("companion-launch", companion.launchReasons, false);

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
  sendSettingValue(evt.key, evt.newValue);
});

function sendSettingsWithDefaults() {
  var currentDate = Date.now();
  var lastSendAllSettingsAge = lastSendAllSettings == null ? 99999999 : currentDate - lastSendAllSettings;
  if (lastSendAllSettingsAge <= 300000) {
    return;
  }
  lastSendAllSettings = currentDate;
  setDefaultSettingOrSendExisting("distanceUnit", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
  setDefaultSettingOrSendExisting("dateFormat", { values: [{ value: "dd mmmm yyyy", name: "dd mmmm yyyy" }], selected: [11] });
  setDefaultSettingOrSendExisting("timeFormat", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
  setDefaultSettingOrSendExisting("showHeartRate", true);
  setDefaultSettingOrSendExisting("isHeartbeatAnimation", true);
  setDefaultSettingOrSendExisting("heartRateZoneVis", true);
  setDefaultSettingOrSendExisting("showTime", true);
  setDefaultSettingOrSendExisting("isAmPm", true);
  setDefaultSettingOrSendExisting("showSeconds", true);
  setDefaultSettingOrSendExisting("showLeadingZero", true);
  setDefaultSettingOrSendExisting("flashDots", true);
  setDefaultSettingOrSendExisting("showDate", true);
  setDefaultSettingOrSendExisting("showDay", true);
  setDefaultSettingOrSendExisting("StatsTL", { values: [{ value: "steps", name: "Steps" }], selected: [4] });
  setDefaultSettingOrSendExisting("StatsBL", { values: [{ value: "distance", name: "Distance" }], selected: [5] });
  setDefaultSettingOrSendExisting("StatsTM", { values: [{ value: "activeMinutes", name: "Active Zone Minutes" }], selected: [8] });
  setDefaultSettingOrSendExisting("StatsMM", { values: [{ value: "WEATHER", name: "Weather" }], selected: [11] });
  setDefaultSettingOrSendExisting("StatsBM", { values: [{ value: "WEATHER-LOCATION", name: "Weather Location" }], selected: [12] });
  setDefaultSettingOrSendExisting("StatsTR", { values: [{ value: "elevationGain", name: "Floors" }], selected: [6] });
  setDefaultSettingOrSendExisting("StatsBR", { values: [{ value: "calories", name: "Calories" }], selected: [7] });
  setDefaultSettingOrSendExisting("progressBars", { values: [{ value: "ring", name: "Ring" }], selected: [3] });
  setDefaultSettingOrSendExisting("showBatteryPercent", true);
  setDefaultSettingOrSendExisting("showBatteryBar", true);
  setDefaultSettingOrSendExisting("showPhoneStatus", true);
  setDefaultSettingOrSendExisting("showMsgQSize", false);
  setDefaultSettingOrSendExisting("showLastMsg", false);
  setDefaultSettingOrSendExisting("torchEnabled", true);
  setDefaultSettingOrSendExisting("torchAutoOff", { values: [{ value: "15", name: "15 Seconds" }], selected: [4] });
  setDefaultSettingOrSendExisting("torchOverlay", true);
  setDefaultSettingOrSendExisting("timeColour", "white");
  setDefaultSettingOrSendExisting("dateColour", "white");
  setDefaultSettingOrSendExisting("stepsColour", "darkorange");
  setDefaultSettingOrSendExisting("distanceColour", "green");
  setDefaultSettingOrSendExisting("elevationGainColour", "darkviolet");
  setDefaultSettingOrSendExisting("caloriesColour", "deeppink");
  setDefaultSettingOrSendExisting("activeMinutesColour", "deepskyblue");
  setDefaultSettingOrSendExisting("activeMinutesWeekColour", "gold");
  setDefaultSettingOrSendExisting("batteryStatColour", "lime");
  setDefaultSettingOrSendExisting("heartColour", "crimson");
  setDefaultSettingOrSendExisting("heartRateColour", "white");
  setDefaultSettingOrSendExisting("bmColour", "gold");
  setDefaultSettingOrSendExisting("bmiColour", "gold");
  setDefaultSettingOrSendExisting("bmrColour", "gold");
  setDefaultSettingOrSendExisting("phoneStatusDisconnected", "red");
  setDefaultSettingOrSendExisting("phoneStatusConnected", "black");
  setDefaultSettingOrSendExisting("progressBackgroundColour", "dimgray");
  setDefaultSettingOrSendExisting("batteryIcon0Colour", "red");
  setDefaultSettingOrSendExisting("batteryIcon25Colour", "darkorange");
  setDefaultSettingOrSendExisting("batteryIcon50Colour", "gold");
  setDefaultSettingOrSendExisting("batteryIcon75Colour", "lime");
  setDefaultSettingOrSendExisting("battery0Colour", "red");
  setDefaultSettingOrSendExisting("battery25Colour", "darkorange");
  setDefaultSettingOrSendExisting("battery50Colour", "gold");
  setDefaultSettingOrSendExisting("battery75Colour", "lime");
  setDefaultSettingOrSendExisting("batteryBackgroundColour", "dimgray");
  setDefaultSettingOrSendExisting("backgroundColour", "black");
  setDefaultSettingOrSendExisting("weatherColour", "tan");
  setDefaultSettingOrSendExisting("weatherLocationColour", "tan");
  setDefaultSettingOrSendExisting("weatherRefreshInterval", { values: [{ value: "1800000", name: "30 minutes" }], selected: [2] });
  setDefaultSettingOrSendExisting("weatherTemperatureUnit", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
}

function setDefaultSettingOrSendExisting(key, value) {
  let existingValue = settingsStorage.getItem(key);
  if (existingValue == null) {
    setSetting(key, value);
  } else {
    console.log(`Companion Existing Setting - key:${key} existingValue:${existingValue}`);
    sendSettingValue(key, existingValue, false);
  }
}

function setSetting(key, value) {
  let jsonValue = JSON.stringify(value);
  console.log(`Companion Set - key:${key} val:${jsonValue}`);
  settingsStorage.setItem(key, jsonValue);
  sendSettingValue(key, jsonValue, true);
}

function sendSettingValue(key, val, updatedValue) {
  if (val) {
    var data = {
      key: key,
      value: JSON.parse(val),
    };

    msgq.send(`settingChange:${data.key}`, data, updatedValue);
  } else {
    console.log(`value was null, not sending ${key}`);
  }
}

function sendWeather(unit) {
  let unitKey = "celsius";
  if (unit == "F") {
    unitKey = "fahrenheit";
  }

  if (lastWeather != null && lastWeather.condition >= 0 && (new Date() - lastWeather.date) < 300000) {
    console.warn("Weather requested again within 5 minutes, returning old weather")
    msgq.send("weather", lastWeather, true);
    return
  }

  console.log("Trying to get weather as last weather no good")
  try {
    weather
      .getWeatherData({ temperatureUnit: unitKey })
      .then((data) => {
        //console.log(`RawWeather:${JSON.stringify(data)}`);
        if (data.locations.length == 0) {
          throw new Error("No locations");
        }

        var location = data.locations[0];

        lastWeather = {
          unit: data.temperatureUnit,
          temperature: Math.floor(location.currentWeather.temperature),
          condition: location.currentWeather.weatherCondition,
          location: location.name,
          date: new Date()
        };
        //console.log(`Weather:${JSON.stringify(sendData)}`);
        msgq.send("weather", lastWeather, true);
      })
      .catch((e) => {
        console.error(e);
        lastWeather = {
          temperature: -999,
          unit: unitKey,
          condition: -1,
          location: e.message,
          date: new Date()
        };
        msgq.send("weather", lastWeather, true);
      });
  } catch (e) {
    console.error(e);
    lastWeather = {
      temperature: -999,
      unit: unitKey,
      condition: -1,
      location: e.message,
      date: new Date()
    };
    msgq.send("weather", lastWeather, true);
  }
}

function locationChange() {
  if (lastWeather != null && lastWeather.unit != null) {
    sendWeather(lastWeather.unit.substring(0,1).toUpperCase());
  }
}
