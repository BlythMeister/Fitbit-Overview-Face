import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";


// Settings have been changed
settingsStorage.onchange = function(evt) {
  sendSettingValue(evt.key, evt.newValue);
}

// Message socket opened
messaging.peerSocket.onopen = function(evt) {
  for (var i=0; i < settingsStorage.length; i++) {  
    var key = settingsStorage.key(i);
    var value = settingsStorage.getItem(key);
    sendSettingValue(key, value);
  }
}

function sendSettingValue(key, val) {
  if (val) {
    sendSettingData({
      dataType: "settingChange",
      key: key,
      value: JSON.parse(val)
    });
  }
}
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}