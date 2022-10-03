import * as document from "document";
import { units } from "user-settings";
import { msgq } from "./msgq.js";

export let weatherLocationEl = document.getElementById("weather-location");
export let weatherLocationTextEl = document.getElementById("weather-location-text");
export let weatherEl = document.getElementById("weather");
export let weatherCountEl = document.getElementById("weather-count");
export let weatherIconEl = document.getElementById("weather-icon");
export let weatherPosition = "NONE";
export let weatherLocationPosition = "NONE";
export let temperatureUnit = "C";
export let weatherInterval = 60000;
export let weatherLastUpdate = null;
export let weatherLastRequest = null;
export let currentWeatherData = null;

export function setWeatherPosition(pos) {
  weatherPosition = pos;
  if (weatherPosition == "NONE") {
    weatherLastUpdate = null;
  }
  fetchWeather();
}

export function setWeatherLocationPosition(pos) {
  weatherLocationPosition = pos;
  if (weatherLocationPosition == "NONE") {
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

  if (interval != weatherInterval) {
    weatherInterval = interval;
    fetchWeather();
  }
}

export function fetchWeather() {
  var currentDate = Date.now();
  var currentWeatherAge = weatherLastUpdate == null ? 99999999 : currentDate - weatherLastUpdate;
  var lastRequestAge = weatherLastRequest == null ? 99999999 : currentDate - weatherLastRequest;

  if (weatherPosition != "NONE" && currentWeatherAge >= weatherInterval * 2) {
    currentWeatherData = null;
  }

  DrawWeather();

  if (weatherPosition != "NONE" && lastRequestAge >= 30000) {
    if (weatherIconEl.href == "weather_36px.png" || currentWeatherAge >= weatherInterval) {
      try {
        let sendUnit = temperatureUnit;
        if (sendUnit == "auto") {
          sendUnit = units.temperature ? units.temperature : "C";
        }

        msgq.send(
          "weather",
          {
            unit: sendUnit,
          },
          {
            timeout: 30000,
          }
        );
        weatherLastRequest = Date.now();
      } catch (e) {
        console.error(e.message);
      }
    }
  }
}

export function processWeatherData(data) {
  if (data.condition === -1) {
    currentWeatherData = null;
    weatherLastUpdate = null;
  } else {
    currentWeatherData = data;
    weatherLastUpdate = Date.now();
  }
  DrawWeather();
}

export function DrawWeather() {
  if (currentWeatherData == null) {
    weatherCountEl.text = "----";
    weatherIconEl.href = "weather_36px.png";
    weatherLocationTextEl.text = "----";
  } else {
    var age = new Date() - new Date(currentWeatherData.epochTime * 1000);
    weatherCountEl.text = `${currentWeatherData.temperature}°${currentWeatherData.unit.charAt(0)}`;
    weatherIconEl.href = currentWeatherData.image;
    weatherLocationTextEl.text = currentWeatherData.location;
  }
}
