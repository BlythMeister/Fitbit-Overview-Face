import * as document from "document";
import { units } from "user-settings";
import { gettext } from "i18n";
import { msgq } from "./../shared/msgq.js";

export let weatherLocationEl = document.getElementById("weather-location");
export let weatherLocationTextEl = document.getElementById("weather-location-text");
export let weatherEl = document.getElementById("weather");
export let weatherCountEl = document.getElementById("weather-count");
export let weatherIconEl = document.getElementById("weather-icon");
export let startingEl = document.getElementById("starting");
export let weatherPosition = "NONE";
export let weatherLocationPosition = "NONE";
export let temperatureUnit = "C";
export let weatherInterval = 900000;
export let weatherLastUpdate = null;
export let weatherLastRequest = null;
export let currentWeatherData = null;

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

export function setWeatherPosition(pos) {
  weatherPosition = pos;
  if (weatherPosition == "NONE" && weatherLocationPosition == "NONE") {
    weatherLastUpdate = null;
  }
}

export function setWeatherLocationPosition(pos) {
  weatherLocationPosition = pos;
  if (weatherPosition == "NONE" && weatherLocationPosition == "NONE") {
    weatherLastUpdate = null;
  }
}

export function setTemperatureUnit(unit) {
  if (unit != temperatureUnit) {
    temperatureUnit = unit;
    forceFetchWeather();
  }
}

export function setRefreshInterval(interval) {
  if (interval < 900000) {
    interval = 900000;
  }

  if (interval != weatherInterval) {
    weatherInterval = interval;
  }
}

export function forceFetchWeather() {
  weatherLastUpdate = null;
  weatherLastRequest = null;
  fetchWeather();
}

export function fetchWeather() {
  if (startingEl.style.display == "inline" || (weatherPosition == "NONE" && weatherLocationPosition == "NONE")) {
    // Don't try and get weather when starting or hidden
    return;
  }

  var currentDate = Date.now();
  var currentWeatherAge = weatherLastUpdate == null ? 99999999 : currentDate - weatherLastUpdate;
  var lastRequestAge = weatherLastRequest == null ? 99999999 : currentDate - weatherLastRequest;

  if (currentWeatherData == null) {
    DrawWeather();
  } else if (currentWeatherAge >= weatherInterval * 2) {
    currentWeatherData.condition = -2;
    DrawWeather();
  }

  if (lastRequestAge >= 300000) {
    weatherLastRequest = Date.now();

    if (currentWeatherData == null || currentWeatherData.condition < 0 || currentWeatherAge >= weatherInterval) {
      try {
        let sendUnit = temperatureUnit;
        if (sendUnit == "auto") {
          sendUnit = units.temperature ? units.temperature.charAt(0).toUpperCase() : "C";
        }
        msgq.send("weather", { unit: sendUnit }, true);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export function processWeatherData(data) {
  var currentDate = Date.now();
  if (currentWeatherData != null && data != null && currentWeatherData.condition >= 0 && data.condition < 0) {
    var currentWeatherAge = weatherLastUpdate == null ? 99999999 : currentDate - weatherLastUpdate;
    if (currentWeatherAge < weatherInterval * 2) {
      return;
    }
  }
  weatherLastUpdate = currentDate;
  currentWeatherData = data;
  DrawWeather();
}

export function DrawWeather() {
  var count = "---";
  var location = "---";
  var icon = "weather_36px.png";
  var errorCode = 0;

  if (currentWeatherData == null) {
    location = gettext("weather-loading");
  } else if (currentWeatherData.condition === -1 && currentWeatherData.location === "The Weather Service is unavailable") {
    location = gettext("weather-unavailable");
    errorCode = 1;
  } else if (currentWeatherData.condition === -1) {
    location = gettext("weather-error");
    errorCode = 2;
  } else if (currentWeatherData.condition === -2) {
    location = gettext("weather-expired");
    errorCode = 3;
  } else {
    if (currentWeatherData.condition >= 1 && currentWeatherData.condition <= 44) {
      icon = weatherConditions[currentWeatherData.condition];
    }
    count = `${currentWeatherData.temperature}°${currentWeatherData.unit.charAt(0)}`;
    location = currentWeatherData.location;
  }

  if (errorCode > 0) {
    count = `-e${errorCode}-`;
  }

  weatherIconEl.href = icon;
  weatherCountEl.text = count;
  weatherLocationTextEl.text = location;
}
