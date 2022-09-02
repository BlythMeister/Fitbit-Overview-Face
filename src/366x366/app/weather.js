import * as document from "document";
import * as messaging from "messaging";
import { units } from "user-settings";

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

  if (weatherPosition != "NONE" && currentWeatherAge >= weatherInterval + 120000) {
    weatherCountEl.text = "----";
    weatherIconEl.href = "weather_36px.png";
    weatherLastRequest = null;
  }

  if (weatherPosition != "NONE" && (lastRequestAge == -1 || lastRequestAge >= 30000)) {
    if (weatherIconEl.href == "weather_36px.png" || currentWeatherAge == -1 || currentWeatherAge >= weatherInterval) {
      try {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          let sendCommand = "weather";
          if (weatherIconEl.href == "weather_36px.png") {
            sendCommand = "initial-weather";
          }

          let sendUnit = temperatureUnit;
          if (sendUnit == "auto") {
            sendUnit = units.temperature;
          }

          messaging.peerSocket.send({
            command: sendCommand,
            unit: sendUnit,
          });

          weatherLastRequest = new Date();
        }
      } catch (e) {
        console.log(`Weather error: ${e}`);
      }
    }
  }
}

function processWeatherData(data) {
  if (data.condition == null) {
    weatherCountEl.text = "----";
    weatherIconEl.href = "weather_36px.png";
  } else {
    weatherCountEl.text = `${data.temperature}°${data.unit.charAt(0)}`;
    weatherIconEl.href = `weather_${data.condition}_36px.png`;
    weatherLastUpdate = new Date();
  }
}

messaging.peerSocket.addEventListener("open", (evt) => {
  fetchWeather();
});

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data && (evt.data.dataType === "weatherUpdate" || evt.data.dataType === "weatherData")) {
    processWeatherData(evt.data);
  }
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});
