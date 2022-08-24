import * as document from "document";
import * as messaging from "messaging";
import { units } from "user-settings";

export let weatherEl = document.getElementById("weather");
export let weatherCountEl = document.getElementById("weather-count");
export let weatherIconEl = document.getElementById("weather-icon");
export let weatherPosition = "NONE";
export let temperatureUnit = "C";
export let weatherInterval = undefined;

export function setWeatherPosition(pos){
  weatherPosition = pos;
}

export function setTemperatureUnit(unit){
  temperatureUnit = unit;
  fetchWeather();
}

export function setRefreshInterval(interval){
  if(weatherInterval != undefined)
  {
    clearInterval(weatherInterval);
  }
  weatherInterval = setInterval(fetchWeather, interval);
  fetchWeather();
}

function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN && weatherPosition != "NONE") {
    // Send a command to the companion
    let sendUnit = temperatureUnit;
    if(sendUnit == "auto") {
      sendUnit = units.temperature
    }
    messaging.peerSocket.send({
      command: "weather",
      unit: sendUnit
    });
  }
}

function processWeatherData(data) {
  if(data.condition == null){
    weatherCountEl.text = "----"
    weatherIconEl.href = "weather_36px.png";
  } else {
    weatherCountEl.text = `${data.temperature}°${data.unit.charAt(0)}`;
    weatherIconEl.href = `weather_${data.condition}_36px.png`;
  }  
}

messaging.peerSocket.addEventListener("open", (evt) => {
  fetchWeather();
});

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data && evt.data.dataType === "weatherUpdate") {
    processWeatherData(evt.data);
  }
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});