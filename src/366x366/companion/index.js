import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me as companion } from "companion";
import { device } from "peer";
import { weather,WeatherCondition,TemperatureUnit } from "weather";

let initialOpen = true;
let messageQueue = [];
let sendingData = null;
CheckQueue();

function CheckQueue()
{
  if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN && messageQueue.length > 0)
  {
    sendingData = messageQueue.shift();
    messaging.peerSocket.send(sendingData);
    sendingData = null;
  }
  
  setTimeout(() => {CheckQueue();}, 200);
}

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
  sendSettingValue(evt.key, evt.newValue);
});

//Message socket error
messaging.peerSocket.addEventListener("error", (evt) => {
  console.log(`Companion Socket Error:${evt.message}`);
  if(sendingData != null)
  {
    messageQueue.unshift(sendingData);
    sendingData = null;
  }
});

messaging.peerSocket.addEventListener("close", (evt) => {
  console.log(`Companion Socket Close:${evt.message}`);
  if(sendingData != null)
  {
    messageQueue.unshift(sendingData);
    sendingData = null;
  }
});

messaging.peerSocket.addEventListener("open", (evt) => {
  setDefaultSettings();
  if(initialOpen == true)
  {
    initialOpen = false;
    console.log("Sending all settings");
    for (var i=0; i < settingsStorage.length; i++) {
      var key = settingsStorage.key(i);
      var value = settingsStorage.getItem(key);
      sendSettingValue(key, value)
    }
  }
});

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data && evt.data.command === "weather" && companion.permissions.granted("access_location")) {
    sendWeather(evt.data.unit);
  }
});

function setDefaultSettings() {
  console.log("Set Default Settings");
  setDefaultSetting("deviceModelId", device.modelId);
  setDefaultSetting("distanceUnit", {"values":[{"value":"auto","name":"Automatic (Use Fitbit Setting)"}],"selected":[0]});
  setDefaultSetting("dateFormat", {"values":[{"value":"dd mmmm yyyy","name":"dd mmmm yyyy"}],"selected":[11]});
  setDefaultSetting("timeFormat", {"values":[{"value":"auto","name":"Automatic (Use Fitbit Setting)"}],"selected":[0]});
  setDefaultSetting("showHeartRate",true);
  setDefaultSetting("isHeartbeatAnimation",true);
  setDefaultSetting("heartRateZoneVis",true);
  setDefaultSetting("showTime",true);
  setDefaultSetting("isAmPm",true);
  setDefaultSetting("showSeconds",true);
  setDefaultSetting("showLeadingZero",true);
  setDefaultSetting("flashDots",true);
  setDefaultSetting("showDate",true);
  setDefaultSetting("showDay",true);
  setDefaultSetting("StatsTL",{"values":[{"value":"steps","name":"Steps"}],"selected":[4]});
  setDefaultSetting("StatsBL",{"values":[{"value":"distance","name":"Distance"}],"selected":[5]});
  setDefaultSetting("StatsTM",{"values":[{"value":"NONE","name":"Empty"}],"selected":[0]});
  setDefaultSetting("StatsMM",{"values":[{"value":"calories","name":"Calories"}],"selected":[7]});
  setDefaultSetting("StatsBM",{"values":[{"value":"BMIBMR","name":"BMI/BMR"}],"selected":[1]});
  setDefaultSetting("StatsTR",{"values":[{"value":"elevationGain","name":"Floors"}],"selected":[6]});
  setDefaultSetting("StatsBR",{"values":[{"value":"activeMinutes","name":"Active Zone Minutes"}],"selected":[8]});
  setDefaultSetting("progressBars",{"values":[{"value":"ring","name":"Ring"}],"selected":[3]});
  setDefaultSetting("showBatteryPercent",true);
  setDefaultSetting("showBatteryBar",true);
  setDefaultSetting("torchEnabled",true);
  setDefaultSetting("torchAutoOff",{"values":[{"value":"15","name":"15 Seconds"}],"selected":[4]});
  setDefaultSetting("torchOverlay",true);  
  setDefaultSetting("timeColour","white");
  setDefaultSetting("dateColour","white");
  setDefaultSetting("stepsColour","darkorange");
  setDefaultSetting("distanceColour","green");
  setDefaultSetting("elevationGainColour","darkviolet");
  setDefaultSetting("caloriesColour","deeppink");
  setDefaultSetting("activeMinutesColour","deepskyblue");
  setDefaultSetting("activeMinutesWeekColour","deepskyblue");
  setDefaultSetting("batteryStatColour","lime");
  setDefaultSetting("heartColour","crimson");
  setDefaultSetting("heartRateColour","white");
  setDefaultSetting("bmColour","gold");
  setDefaultSetting("bmiColour","gold");
  setDefaultSetting("bmrColour","gold");
  setDefaultSetting("progressBackgroundColour","dimgrey");
  setDefaultSetting("batteryIcon0Colour","red");
  setDefaultSetting("batteryIcon25Colour","darkorange");
  setDefaultSetting("batteryIcon50Colour","gold");
  setDefaultSetting("batteryIcon75Colour","lime");
  setDefaultSetting("battery0Colour","red");
  setDefaultSetting("battery25Colour","darkorange");
  setDefaultSetting("battery50Colour","gold");
  setDefaultSetting("battery75Colour","lime");
  setDefaultSetting("batteryBackgroundColour","dimgrey");
  setDefaultSetting("backgroundColour","black");
  setDefaultSetting("weatherColour","white");
  setDefaultSetting("weatherRefreshInterval",{"values":[{"value":"3600000","name":"60 minutes"}],"selected":[5]});
  setDefaultSetting("weatherTemperatureUnit",{"values":[{"value":"C","name":"Celcius"}],"selected":[0]});
}

function setDefaultSetting(key, value) {
  let existingValue = settingsStorage.getItem(key);
  if (existingValue == null) {
    setSetting(key, value);
  } else {
    console.log(`Companion Existing Setting - key:${key} existingValue:${existingValue}`);
  }
}

function setSetting(key, value) {
  let jsonValue = JSON.stringify(value)
  console.log(`Companion Set - key:${key} val:${jsonValue}`);
  settingsStorage.setItem(key, jsonValue);
  sendSettingValue(key, jsonValue);
}

function sendSettingValue(key, val) {
  if (val) {
    var data = {
      dataType: "settingChange",
      key: key,
      value: JSON.parse(val)
    };
    
    console.log(`Queue Sending Setting - key:${data.key} val:${data.value}`);
    messageQueue.push(data);
  }
  else
  {
    console.log(`value was null, not sending ${key}`)
  }
}

function sendWeather(unit) {
  let unitKey = "celsius";
  if(unit == "F")
  {
    unitKey = "fahrenheit";
  }

  weather.getWeatherData({temperatureUnit:unitKey})
         .then((data) => {
          if (data.locations.length > 0) {
            var sendData = {
              dataType: "weatherUpdate",
              temperature: Math.floor(data.locations[0].currentWeather.temperature),
              unit: data.temperatureUnit,
              loc: data.locations[0].name,
              condition: findWeatherConditionName(WeatherCondition,data.locations[0].currentWeather.weatherCondition)
            };
            messageQueue.push(sendData);
          }
        })
        .catch((ex) => {
          console.error(ex.message);
        });
}

function findWeatherConditionName(WeatherCondition, conditionCode) {
  for (const condition of Object.keys(WeatherCondition)) {
    if (conditionCode === WeatherCondition[condition]) return condition;
  }
}