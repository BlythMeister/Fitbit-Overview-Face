import { settingsStorage } from "settings";
import { me as companion } from "companion";
import { device } from "peer";
import { weather, WeatherCondition } from "weather";

import { msgq } from "./msgq.js";

let lastWeatherUnit = null;

var weatherConditions = {};
weatherConditions[1] = "weather_Sunny_36px.png";
weatherConditions[2] = "weather_IntermittentCloudyDay_36px.png";
weatherConditions[3] = "weather_IntermittentCloudyDay_36px.png";
weatherConditions[4] = "weather_IntermittentCloudyDay_36px.png";
weatherConditions[5] = "weather_HazySunshine_36px.png";
weatherConditions[6] = "weather_IntermittentCloudyDay_36px.png";
weatherConditions[7] = "weather_Cloudy_36px.png";
weatherConditions[8] = "weather_Cloudy_36px.png";
weatherConditions[9] = "weather_36px.png";
weatherConditions[10] = "weather_36px.png";
weatherConditions[11] = "weather_Fog_36px.png";
weatherConditions[12] = "weather_Showers_36px.png";
weatherConditions[13] = "weather_CloudyWithShowersDay_36px.png";
weatherConditions[14] = "weather_CloudyWithShowersDay_36px.png";
weatherConditions[15] = "weather_Thunderstorms_36px.png";
weatherConditions[16] = "weather_CloudyWithThunderstormsDay_36px.png";
weatherConditions[17] = "weather_CloudyWithThunderstormsDay_36px.png";
weatherConditions[18] = "weather_Rain_36px.png";
weatherConditions[19] = "weather_Sleet_36px.png";
weatherConditions[20] = "weather_CloudyWithSleetDay_36px.png";
weatherConditions[21] = "weather_CloudyWithSleetDay_36px.png";
weatherConditions[22] = "weather_Snow_36px.png";
weatherConditions[23] = "weather_CloudyWithSnowDay_36px.png";
weatherConditions[24] = "weather_Ice_36px.png";
weatherConditions[25] = "weather_Sleet_36px.png";
weatherConditions[26] = "weather_FreezingRain_36px.png";
weatherConditions[27] = "weather_36px.png";
weatherConditions[28] = "weather_36px.png";
weatherConditions[29] = "weather_RainAndSnow_36px.png";
weatherConditions[30] = "weather_Hot_36px.png";
weatherConditions[31] = "weather_Cold_36px.png";
weatherConditions[32] = "weather_Windy_36px.png";
weatherConditions[33] = "weather_ClearNight_36px.png";
weatherConditions[34] = "weather_IntermittentCloudyNight_36px.png";
weatherConditions[35] = "weather_IntermittentCloudyNight_36px.png";
weatherConditions[36] = "weather_IntermittentCloudyNight_36px.png";
weatherConditions[37] = "weather_HazyMoonlight_36px.png";
weatherConditions[38] = "weather_IntermittentCloudyNight_36px.png";
weatherConditions[39] = "weather_CloudyWithShowersNight_36px.png";
weatherConditions[40] = "weather_CloudyWithShowersNight_36px.png";
weatherConditions[41] = "weather_CloudyWithThunderstormsNight_36px.png";
weatherConditions[42] = "weather_CloudyWithThunderstormsNight_36px.png";
weatherConditions[43] = "weather_CloudyWithSleetNight_36px.png";
weatherConditions[44] = "weather_CloudyWithSnowNight_36px.png";

//Wake every 5 minutes
console.log("Set companion wake interval to 5 minutes");
companion.wakeInterval = 300000;

// Monitor for significant changes in physical location
console.log("Enable monitoring of significant location changes");
companion.monitorSignificantLocationChanges = true;

msgq.onmessage = (messageKey, message) => {
  if (messageKey === "send-settings") {
    sendSettingsWithDefaults();
  } else if (messageKey === "ping") {
    sendPong();
  } else if (messageKey === "weather") {
    sendWeather(message.unit);
  }
};

// Listen for the significant location change event
companion.addEventListener("significantlocationchange", (evt) => {
  locationChange(false);
});

// check launch reason
console.log(`Companion launch reason: ${JSON.stringify(companion.launchReasons)}`);
if (companion.launchReasons.locationChanged) {
  locationChange(true);
}
msgq.send("companion-launch", companion.launchReasons);

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
  sendSettingValue(evt.key, evt.newValue);
});

function sendSettingsWithDefaults() {
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
  setDefaultSettingOrSendExisting("StatsMM", { values: [{ value: "activeMinutes", name: "Active Zone Minutes" }], selected: [8] });
  setDefaultSettingOrSendExisting("StatsBM", { values: [{ value: "activeMinutesWeek", name: "Weekly Active Zone Minutes" }], selected: [9] });
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
    //console.log(`Companion Existing Setting - key:${key} existingValue:${existingValue}`);
    sendSettingValue(key, existingValue);
  }
}

function setSetting(key, value) {
  let jsonValue = JSON.stringify(value);
  //console.log(`Companion Set - key:${key} val:${jsonValue}`);
  settingsStorage.setItem(key, jsonValue);
  sendSettingValue(key, jsonValue);
}

function sendSettingValue(key, val) {
  if (val) {
    var data = {
      key: key,
      value: JSON.parse(val),
    };

    msgq.send(`settingChange:${data.key}`, data);
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
      //console.log(`RawWeather:${JSON.stringify(data)}`);
      if (data.locations.length > 0) {
        var sendData = {
          unit: data.temperatureUnit,
          temperature: Math.floor(data.locations[0].currentWeather.temperature),
          condition: data.locations[0].currentWeather.weatherCondition,
          image: weatherConditions[data.locations[0].currentWeather.weatherCondition],
          location: data.locations[0].name,
        };
        //console.log(`Weather:${JSON.stringify(sendData)}`);
        msgq.send("weather", sendData);
      }
    })
    .catch((ex) => {
      console.error(ex.message);
      var sendData = {
        temperature: -999,
        unit: "celcius",
        condition: -1,
        image: "weather_36px.png",
      };
      msgq.send("weather", sendData);
    });
}

function sendPong() {
  msgq.send("pong", {size:msgq.getQueueSize()});
}

function locationChange(initial) {
  if (lastWeatherUnit != null) {
    sendWeather(lastWeatherUnit);
  }
}
