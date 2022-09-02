import { settingsStorage } from "settings";
import { localStorage } from "local-storage";
import * as messaging from "messaging";
import { me as companion } from "companion";
import { device } from "peer";
import { weather, WeatherCondition } from "weather";

let messageQueue = [];
let sendingData = null;
let queueCheckInterval = null;
let lastWeatherUnit = null;

//Wake every 5 minutes
console.log("Set companion wake interval to 5 minutes");
companion.wakeInterval = 300000;

// Monitor for significant changes in physical location
console.log("Enable monitoring of significant location changes");
companion.monitorSignificantLocationChanges = true;

//Check messages every 100ms
if (queueCheckInterval != null) {
  console.log("Clearing queue check interval");
  clearInterval(queueCheckInterval);
}
console.log("Set queue check interval to 100ms");
queueCheckInterval = setInterval(checkQueue, 100);

// Listen for the significant location change event
companion.addEventListener("significantlocationchange", (evt) => {
  locationChange(false);
});

// Listen for the event
companion.addEventListener("wakeinterval", (evt) => {
  wokenUp(false);
});

// check launch reason
console.log(`Companion launch reason: ${JSON.stringify(companion.launchReasons)}`);
if (companion.launchReasons.locationChanged) {
  locationChange(true);
} else if (companion.launchReasons.wokenUp) {
  wokenUp(true);
}

sendSettingsWithDefaults();

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
  sendSettingValue(evt.key, evt.newValue);
});

//Message socket error
messaging.peerSocket.addEventListener("error", (evt) => {
  console.log(`Companion Socket Error:${evt.message}`);
  if (sendingData != null) {
    messageQueue.unshift(sendingData);
    sendingData = null;
  }
});

messaging.peerSocket.addEventListener("close", (evt) => {
  console.log(`Companion Socket Close:${evt.message}`);
  if (sendingData != null) {
    messageQueue.unshift(sendingData);
    sendingData = null;
  }
});

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data && evt.data.command === "send-settings") {
    sendSettingsWithDefaults();
  } else if (evt.data && evt.data.command === "ping") {
    sendPong();
  } else if (evt.data && evt.data.command === "weather" && companion.permissions.granted("access_location")) {
    sendWeather(evt.data.unit);
  } else if (evt.data && evt.data.command === "initial-weather" && companion.permissions.granted("access_location")) {
    sendSavedWeather("weatherData");
    sendWeather(evt.data.unit);
  }
});

function sendSettingsWithDefaults() {
  console.log("Set Default Settings");
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
  setDefaultSettingOrSendExisting("StatsTM", { values: [{ value: "WEATHER", name: "Weather" }], selected: [11] });
  setDefaultSettingOrSendExisting("StatsMM", { values: [{ value: "calories", name: "Calories" }], selected: [7] });
  setDefaultSettingOrSendExisting("StatsBM", { values: [{ value: "BMI", name: "BMI" }], selected: [2] });
  setDefaultSettingOrSendExisting("StatsTR", { values: [{ value: "elevationGain", name: "Floors" }], selected: [6] });
  setDefaultSettingOrSendExisting("StatsBR", { values: [{ value: "activeMinutes", name: "Active Zone Minutes" }], selected: [8] });
  setDefaultSettingOrSendExisting("progressBars", { values: [{ value: "ring", name: "Ring" }], selected: [3] });
  setDefaultSettingOrSendExisting("showBatteryPercent", true);
  setDefaultSettingOrSendExisting("showBatteryBar", true);
  setDefaultSettingOrSendExisting("showPhoneStatus", false);
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
  setDefaultSettingOrSendExisting("activeMinutesWeekColour", "deepskyblue");
  setDefaultSettingOrSendExisting("batteryStatColour", "lime");
  setDefaultSettingOrSendExisting("heartColour", "crimson");
  setDefaultSettingOrSendExisting("heartRateColour", "white");
  setDefaultSettingOrSendExisting("bmColour", "gold");
  setDefaultSettingOrSendExisting("bmiColour", "gold");
  setDefaultSettingOrSendExisting("bmrColour", "gold");
  setDefaultSettingOrSendExisting("phoneStatusDisconnected", "red");
  setDefaultSettingOrSendExisting("phoneStatusProblem", "darkorange");
  setDefaultSettingOrSendExisting("phoneStatusConnected", "lime");
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
  setDefaultSettingOrSendExisting("weatherRefreshInterval", { values: [{ value: "1800000", name: "30 minutes" }], selected: [3] });
  setDefaultSettingOrSendExisting("weatherTemperatureUnit", { values: [{ value: "auto", name: "Automatic (Use Fitbit Setting)" }], selected: [0] });
}

function setDefaultSettingOrSendExisting(key, value) {
  let existingValue = settingsStorage.getItem(key);
  if (existingValue == null) {
    setSetting(key, value);
  } else {
    console.log(`Companion Existing Setting - key:${key} existingValue:${existingValue}`);
    sendSettingValue(key, existingValue);
  }
}

function setSetting(key, value) {
  let jsonValue = JSON.stringify(value);
  console.log(`Companion Set - key:${key} val:${jsonValue}`);
  settingsStorage.setItem(key, jsonValue);
  sendSettingValue(key, jsonValue);
}

function sendSettingValue(key, val) {
  if (val) {
    var data = {
      dataType: "settingChange",
      key: key,
      value: JSON.parse(val),
    };

    console.log(`Queue Sending Setting - key:${data.key} val:${data.value}`);
    pushToMessageQueue(data);
  } else {
    console.log(`value was null, not sending ${key}`);
  }
}

function sendWeather(unit) {
  let unitKey = "celsius";
  if (unit == "F") {
    unitKey = "fahrenheit";
  }
  lastWeatherUnit = unit;

  weather
    .getWeatherData({ temperatureUnit: unitKey })
    .then((data) => {
      if (data.locations.length > 0) {
        var sendData = {
          temperature: Math.floor(data.locations[0].currentWeather.temperature),
          unit: data.temperatureUnit,
          condition: findWeatherConditionName(WeatherCondition, data.locations[0].currentWeather.weatherCondition),
        };
        let jsonValue = JSON.stringify(sendData);
        localStorage.setItem("weather", jsonValue);
        sendSavedWeather("weatherUpdate");
      }
    })
    .catch((ex) => {
      console.error(ex.message);
      var sendData = {
        temperature: 0,
        unit: "celcius",
        condition: null,
      };
      let jsonValue = JSON.stringify(sendData);
      localStorage.setItem("weather", jsonValue);
      sendSavedWeather("weatherUpdate");
    });
}

function findWeatherConditionName(WeatherCondition, conditionCode) {
  for (const condition of Object.keys(WeatherCondition)) {
    if (conditionCode === WeatherCondition[condition]) return condition;
  }
}

function sendSavedWeather(dataType) {
  var savedWeather = localStorage.getItem("weather");
  if (savedWeather != null) {
    var savedData = JSON.parse(savedWeather);
    var sendData = {
      dataType: dataType,
      temperature: savedData.temperature,
      unit: savedData.unit,
      condition: savedData.condition,
    };
    pushToMessageQueue(sendData);
  }
}

function sendPong() {
  var sendData = {
    dataType: "pong",
  };
  pushToMessageQueue(sendData);
}

function checkQueue() {
  try {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN && messageQueue.length > 0) {
      sendingData = messageQueue.shift();
      if (sendingData.dataType === "pong") {
        sendingData.remainingMessages = messageQueue.length;
      }

      console.log(`MQ Send (size ${messageQueue.length}): ${JSON.stringify(sendingData)}`);
      messaging.peerSocket.send(sendingData);
      sendingData = null;
    }
  } catch (e) {
    console.log(`Error processing queue: ${e}`);
    if (sendingData != null) {
      messageQueue.unshift(sendingData);
      sendingData = null;
    }
  }
}

function pushToMessageQueue(message) {
  messageQueue.push(message);
  console.log(`MQ Add (size ${messageQueue.length}): ${JSON.stringify(message)}`);
}

function locationChange(initial) {
  console.log(`LocationChangeEvent fired. - Initial: ${initial}`);
  if (lastWeatherUnit != null) {
    sendWeather(lastWeatherUnit);
  }
}

function wokenUp(initial) {
  console.log(`WakeEvent fired. - Initial: ${initial}`);
}
