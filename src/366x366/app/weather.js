import * as document from "document";
import { units } from "user-settings";
import { asap } from "./lib-fitbit-asap.js";

export let weatherEl = document.getElementById("weather");
export let weatherCountEl = document.getElementById("weather-count");
export let weatherIconEl = document.getElementById("weather-icon");
export let weatherPosition = "NONE";
export let temperatureUnit = "C";
export let weatherInterval = 60000;
export let weatherLastUpdate = null;
export let weatherLastRequest = null;

export function setWeatherPosition(pos) {
  weatherPosition = pos;
  if (weatherPosition == "NONE") {
    weatherLastUpdate = null;
  }
  fetchWeather();
}

export function setTemperatureUnit(unit) {
  if (unit != temperatureUnit) {
    temperatureUnit = unit;
    fetchWeather();
  }
}

export function setRefreshInterval(interval) {
  if (interval < 60000) {
    interval = 60000;
  }
  weatherInterval = interval;
  fetchWeather();
}

export function fetchWeather() {
  var currentDate = new Date();
  var currentWeatherAge = weatherLastUpdate == null ? -1 : currentDate - weatherLastUpdate;
  var lastRequestAge = weatherLastRequest == null ? -1 : currentDate - weatherLastRequest;

  if (weatherPosition != "NONE" && currentWeatherAge >= weatherInterval + 300000) {
    weatherCountEl.text = "----";
    weatherIconEl.href = "weather_36px.png";
    weatherLastRequest = null;
  }

  if (weatherPosition != "NONE" && (lastRequestAge == -1 || lastRequestAge >= 30000 || currentWeatherAge == -1)) {
    if (weatherIconEl.href == "weather_36px.png" || currentWeatherAge == -1 || currentWeatherAge >= weatherInterval) {
      try {
        let sendUnit = temperatureUnit;
        if (sendUnit == "auto") {
          sendUnit = units.temperature;
        }

        weatherLastRequest = new Date();

        asap.send(
          {
            command: "weather",
            unit: sendUnit,
          },
          {
            timeout: 30000,
          }
        );
      } catch (e) {
        console.log(`Weather error: ${e}`);
      }
    }
  }
}

export function processWeatherData(data) {
  if (data.condition === -1) {
    weatherCountEl.text = "----";
    weatherIconEl.href = "weather_36px.png";
  } else {
    weatherCountEl.text = `${data.temperature}°${data.unit.charAt(0)}`;
    weatherIconEl.href = data.image;
    weatherLastUpdate = new Date();
  }
}
