import { settingsStorage } from "settings";
import { me as companion } from "companion";
import { weather } from "weather";

import { msgq } from "./../shared/msgq.js";

let lastWeather = null;
let settingsKeys = [];

//Wake every 15 minutes
console.log("Set companion wake interval to 5 minutes");
companion.wakeInterval = 300000;

// Monitor for significant changes in physical location
console.log("Enable monitoring of significant location changes");
companion.monitorSignificantLocationChanges = true;

msgq.addEventListener("message", (messageKey, message) => {
  if (messageKey === "send-all-settings") {
    setDefaultSettings();
    sendAllSettings();
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
setDefaultSettings();

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
  sendSettingValue(evt.key, evt.newValue);
});

function setDefaultSettings() {
  setDefaultSetting("distanceUnit", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
  setDefaultSetting("dateFormat", { values: [{ value: "dd mmmm yyyy", name: "dd mmmm yyyy" }], selected: [11] });
  setDefaultSetting("timeFormat", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
  setDefaultSetting("showHeartRate", true);
  setDefaultSetting("isHeartbeatAnimation", true);
  setDefaultSetting("heartRateZoneVis", true);
  setDefaultSetting("showTime", true);
  setDefaultSetting("isAmPm", true);
  setDefaultSetting("showSeconds", true);
  setDefaultSetting("showLeadingZero", true);
  setDefaultSetting("flashDots", true);
  setDefaultSetting("showDate", true);
  setDefaultSetting("showDay", true);
  setDefaultSetting("StatsTL", { values: [{ value: "steps", name: "Steps" }], selected: [4] });
  setDefaultSetting("StatsBL", { values: [{ value: "distance", name: "Distance" }], selected: [5] });
  setDefaultSetting("StatsTM", { values: [{ value: "activeMinutes", name: "Active Zone Minutes" }], selected: [8] });
  setDefaultSetting("StatsMM", { values: [{ value: "WEATHER", name: "Weather" }], selected: [11] });
  setDefaultSetting("StatsBM", { values: [{ value: "WEATHER-LOCATION", name: "Weather Location" }], selected: [12] });
  setDefaultSetting("StatsTR", { values: [{ value: "elevationGain", name: "Floors" }], selected: [6] });
  setDefaultSetting("StatsBR", { values: [{ value: "calories", name: "Calories" }], selected: [7] });
  setDefaultSetting("progressBars", { values: [{ value: "ring", name: "Ring" }], selected: [3] });
  setDefaultSetting("showBatteryPercent", true);
  setDefaultSetting("showBatteryBar", true);
  setDefaultSetting("showPhoneStatus", true);
  setDefaultSetting("showMsgQSize", false);
  setDefaultSetting("showLastMsg", false);
  setDefaultSetting("torchEnabled", true);
  setDefaultSetting("torchAutoOff", { values: [{ value: "15", name: "15 Seconds" }], selected: [4] });
  setDefaultSetting("torchOverlay", true);
  setDefaultSetting("timeColour", "white");
  setDefaultSetting("dateColour", "white");
  setDefaultSetting("stepsColour", "darkorange");
  setDefaultSetting("distanceColour", "green");
  setDefaultSetting("elevationGainColour", "darkviolet");
  setDefaultSetting("caloriesColour", "deeppink");
  setDefaultSetting("activeMinutesColour", "deepskyblue");
  setDefaultSetting("activeMinutesWeekColour", "gold");
  setDefaultSetting("batteryStatColour", "lime");
  setDefaultSetting("heartColour", "crimson");
  setDefaultSetting("heartRateColour", "white");
  setDefaultSetting("bmColour", "gold");
  setDefaultSetting("bmiColour", "gold");
  setDefaultSetting("bmrColour", "gold");
  setDefaultSetting("phoneStatusDisconnected", "red");
  setDefaultSetting("phoneStatusConnected", "black");
  setDefaultSetting("progressBackgroundColour", "dimgray");
  setDefaultSetting("batteryIcon0Colour", "red");
  setDefaultSetting("batteryIcon25Colour", "darkorange");
  setDefaultSetting("batteryIcon50Colour", "gold");
  setDefaultSetting("batteryIcon75Colour", "lime");
  setDefaultSetting("battery0Colour", "red");
  setDefaultSetting("battery25Colour", "darkorange");
  setDefaultSetting("battery50Colour", "gold");
  setDefaultSetting("battery75Colour", "lime");
  setDefaultSetting("batteryBackgroundColour", "dimgray");
  setDefaultSetting("backgroundColour", "black");
  setDefaultSetting("weatherColour", "tan");
  setDefaultSetting("weatherLocationColour", "tan");
  setDefaultSetting("weatherRefreshInterval", { values: [{ value: "1800000", name: "30 minutes" }], selected: [2] });
  setDefaultSetting("weatherTemperatureUnit", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
}

function setDefaultSetting(key, value) {
  settingsKeys.push(key);
  let existingValue = settingsStorage.getItem(key);
  if (existingValue == null) {
    let jsonValue = JSON.stringify(value);
    console.log(`Companion Set - key:${key} val:${jsonValue}`);
    settingsStorage.setItem(key, jsonValue);
  }
}

function sendSettingValue(key, val) {
  if (val) {
    var data = {
      key: key,
      value: JSON.parse(val),
    };

    msgq.send(`settingChange:${data.key}`, data, true);
  } else {
    console.log(`value was null, not sending ${key}`);
  }
}

function sendAllSettings() {
  var data = [];
  var counter = 0;
  for (let index = 0; index < settingsKeys.length; index++) {
    const key = settingsKeys[index];
    const value = settingsStorage.getItem(key);
    if (value) {
      data.push({
        key: key,
        value: JSON.parse(value),
      });
      counter++;
    }
  }

  var chunks = [];
  while (data.length > 0) {
    chunks.push(data.splice(0, Math.min(15, data.length)));
  }

  for (let index = 0; index < chunks.length; index++) {
    msgq.send(`settingsChunk:${index + 1}`, { chunk: index + 1, totalChunks: chunks.length, data: chunks[index] }, false);
  }
}

function sendWeather(unit) {
  let unitKey = "celsius";
  if (unit == "F") {
    unitKey = "fahrenheit";
  }

  if (lastWeather != null && lastWeather.condition >= 0 && new Date() - lastWeather.date < 300000) {
    console.warn("Weather requested again within 5 minutes, returning old weather");
    msgq.send("weather", lastWeather, true);
    return;
  }

  console.log("Trying to get weather as last weather no good");
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
          date: new Date(),
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
          date: new Date(),
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
      date: new Date(),
    };
    msgq.send("weather", lastWeather, true);
  }
}

function locationChange() {
  if (lastWeather != null && lastWeather.unit != null) {
    sendWeather(lastWeather.unit.substring(0, 1).toUpperCase());
  }
}
