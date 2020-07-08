import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

setDefaultSettings();

// Settings have been changed
settingsStorage.onchange = function(evt) {
  sendSettingValue(evt.key, evt.newValue);
}

//Message socket error
messaging.peerSocket.onerror = function(evt) {
  sendAllSettings();
}

function sendAllSettings() {
  for (var i=0; i < settingsStorage.length; i++) {  
    var key = settingsStorage.key(i);
    var value = settingsStorage.getItem(key);
    sendSettingValue(key, value);
  }
}

function setDefaultSettings() {
  setDefaultSetting("distanceUnit", {"values":[{"value":"auto","name":"Automatic (Use Fitbit Setting)"}],"selected":[0]});
  setDefaultSetting("dateFormat", {"values":[{"value":"dd mmmm yy","name":"dd mmmm yy"}],"selected":[2]});
  setDefaultSetting("timeFormat", {"values":[{"value":"auto","name":"Automatic (Use Fitbit Setting)"}],"selected":[0]});
  setDefaultSetting("isHeartbeatAnimation",true);
  setDefaultSetting("heartRateZoneVis",true);
  setDefaultSetting("isAmPm",true);
  setDefaultSetting("showSeconds",true);
  setDefaultSetting("showLeadingZero",true);
  setDefaultSetting("flashDots",true);
  setDefaultSetting("StatsTL",{"values":[{"value":"steps","name":"Steps"}],"selected":[2]});
  setDefaultSetting("StatsBL",{"values":[{"value":"distance","name":"Distance"}],"selected":[3]});
  setDefaultSetting("StatsTM",{"values":[{"value":"BMIBMR","name":"BMR/BMI"}],"selected":[1]});
  setDefaultSetting("StatsBM",{"values":[{"value":"calories","name":"Calories"}],"selected":[5]});
  setDefaultSetting("StatsTR",{"values":[{"value":"elevationGain","name":"Floors"}],"selected":[4]});
  setDefaultSetting("StatsBR",{"values":[{"value":"activeMinutes","name":"Active Minutes"}],"selected":[6]});
  setDefaultSetting("BMRVis",true);
  setDefaultSetting("BMIVis",true);
  setDefaultSetting("showStatsProgress",true);
  setDefaultSetting("showBatteryPercent",true);
  setDefaultSetting("showBatteryBar",true);
  setDefaultSetting("torchEnabled",false);
  setDefaultSetting("heartRateFont",{"values":[{"value":"SYS","name":"System"}],"selected":[0]});
  setDefaultSetting("dateFont",{"values":[{"value":"SYS","name":"System"}],"selected":[0]});
  setDefaultSetting("clockFont",{"values":[{"value":"SYS","name":"System"}],"selected":[0]});
  setDefaultSetting("statsFont",{"values":[{"value":"SYS","name":"System"}],"selected":[0]});
  setDefaultSetting("batteryFont",{"values":[{"value":"SYS","name":"System"}],"selected":[0]});
  setDefaultSetting("timeColour","white");
  setDefaultSetting("dateColour","#969696");
  setDefaultSetting("stepsColour","white");
  setDefaultSetting("distanceColour","white");
  setDefaultSetting("elevationGainColour","white");
  setDefaultSetting("caloriesColour","white");
  setDefaultSetting("activeMinutesColour","white");
  setDefaultSetting("heartColour","crimson");
  setDefaultSetting("heartRateColour","#969696");
  setDefaultSetting("bmColour","white");
  setDefaultSetting("progressBackgroundColour","#494949");
  setDefaultSetting("battery0Colour","#FF0000");
  setDefaultSetting("battery25Colour","darkorange");
  setDefaultSetting("battery50Colour","gold");
  setDefaultSetting("battery75Colour","#00FF00");
  setDefaultSetting("batteryBackgroundColour","#494949");
  setDefaultSetting("backgroundColour","black");
}

function setDefaultSetting(key, value) {
  let extantValue = settingsStorage.getItem(key);
  if (extantValue === null) {
    let jsonValue = JSON.stringify(value)
    console.log(`Companion Set Default - key:${key} val:${jsonValue}`);
    settingsStorage.setItem(key, jsonValue);
  }
}

function sendSettingValue(key, val) {
  if (val) {
    var data = {
      dataType: "settingChange",
      key: key,
      value: JSON.parse(val)
    };
    
    // If we have a MessageSocket, send the data to the device
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    } else {
      console.log("No peerSocket connection");
      sendSettingValue(key, val);
    }
  }
}