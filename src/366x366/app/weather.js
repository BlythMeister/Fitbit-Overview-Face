import * as document from "document";
import { units } from "user-settings";
import { msgq } from "./msgq.js";

export let weatherLocationEl = document.getElementById("weather-location");
export let weatherLocationTextEl = document.getElementById("weather-location-text");
export let weatherAgeEl = document.getElementById("weather-age");
export let weatherAgeTextEl = document.getElementById("weather-age-text");
export let weatherEl = document.getElementById("weather");
export let weatherCountEl = document.getElementById("weather-count");
export let weatherIconEl = document.getElementById("weather-icon");
export let weatherThisHourEl = document.getElementById("weather-thisHour");
export let weatherThisHourCountEl = document.getElementById("weather-thisHour-count");
export let weatherThisHourIconEl = document.getElementById("weather-thisHour-icon");
export let weatherNextHourEl = document.getElementById("weather-nextHour");
export let weatherNextHourCountEl = document.getElementById("weather-nextHour-count");
export let weatherNextHourIconEl = document.getElementById("weather-nextHour-icon");
export let weatherTodayEl = document.getElementById("weather-today");
export let weatherTodayCountEl = document.getElementById("weather-today-count");
export let weatherTodayIconEl = document.getElementById("weather-today-icon");
export let weatherRainEl = document.getElementById("weather-rain");
export let weatherRainCountEl = document.getElementById("weather-rain-count");
export let weatherRainIconEl = document.getElementById("weather-rain-icon");
export let weatherPosition = "NONE";
export let weatherThisHourPosition = "NONE";
export let weatherNextHourPosition = "NONE";
export let weatherTodayPosition = "NONE";
export let weatherLocationPosition = "NONE";
export let weatherAgePosition = "NONE";
export let weatherRainPosition = "NONE";
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

export function setWeatherThisHourPosition(pos) {
  weatherThisHourPosition = pos;
  if (weatherThisHourPosition == "NONE") {
    weatherLastUpdate = null;
  }
  fetchWeather();
}

export function setWeatherNextHourPosition(pos) {
  weatherNextHourPosition = pos;
  if (weatherNextHourPosition == "NONE") {
    weatherLastUpdate = null;
  }
  fetchWeather();
}

export function setWeatherTodayPosition(pos) {
  weatherTodayPosition = pos;
  if (weatherTodayPosition == "NONE") {
    weatherLastUpdate = null;
  }
  fetchWeather();
}

export function setWeatherRainPosition(pos) {
  weatherRainPosition = pos;
  if (weatherRainPosition == "NONE") {
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

export function setWeatherAgePosition(pos) {
  weatherAgePosition = pos;
  if (weatherAgePosition == "NONE") {
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
    weatherLastUpdate = new Date(data.epochTime * 1000);
  }
  DrawWeather();
}

export function DrawWeather() {
  if (currentWeatherData == null) {
    weatherCountEl.text = "----";
    weatherIconEl.href = "weather_36px.png";
    weatherThisHourCountEl.text = "----";
    weatherThisHourIconEl.href = "weather_36px.png";
    weatherNextHourCountEl.text = "----";
    weatherNextHourIconEl.href = "weather_36px.png";
    weatherTodayCountEl.text = "----";
    weatherTodayIconEl.href = "weather_36px.png";
    weatherLocationTextEl.text = "----";
    weatherAgeTextEl.text = "----";
    weatherRainCountEl.text = "----";
  } else {
    var age = new Date() - new Date(currentWeatherData.epochTime * 1000);
    weatherCountEl.text = `${currentWeatherData.temperature}°${currentWeatherData.unit.charAt(0)}`;
    weatherIconEl.href = currentWeatherData.image;
    weatherThisHourCountEl.text = `${currentWeatherData.thisHourTemperature}°${currentWeatherData.unit.charAt(0)}`;
    weatherThisHourIconEl.href = currentWeatherData.thisHourImage;
    weatherNextHourCountEl.text = `${currentWeatherData.nextHourTemperature}°${currentWeatherData.unit.charAt(0)}`;
    weatherNextHourIconEl.href = currentWeatherData.nextHourImage;
    weatherTodayCountEl.text = `${currentWeatherData.dayTemperatureHigh}°${currentWeatherData.unit.charAt(0)} / ${currentWeatherData.dayTemperatureHigh}°${currentWeatherData.unit.charAt(0)}`;
    weatherTodayIconEl.href = currentWeatherData.dayImage;
    weatherLocationTextEl.text = currentWeatherData.location;
    weatherAgeTextEl.text = msToTime(age);
    weatherRainCountEl.text = `${currentWeatherData.dayRain}%`;
  }
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return `${zeroPad(hrs)}:${zeroPad(mins)}:${zeroPad(secs)}`;
}

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
