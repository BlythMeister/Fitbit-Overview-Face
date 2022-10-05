import * as document from "document";
import { me as appbit } from "appbit";

import { msgq } from "./msgq.js";
import * as bm from "./bm.js";
import * as date from "./date.js";
import * as battery from "./battery.js";
import * as time from "./time.js";
import * as hr from "./hr.js";
import * as activity from "./activity.js";
import * as settings from "./settings.js";
import * as state from "./state.js";
import * as torch from "./torch.js";
import * as weather from "./weather.js";
import * as ping from "./ping.js";

console.log(`Application ID: ${appbit.applicationId}`);
console.log(`Build ID: ${appbit.buildId}`);

settings.applySettings();
msgq.send("app-launch", {});
msgq.send("send-settings", {});

msgq.onmessage = (messageKey, message) => {
  var key = messageKey.split(":")[0];
  if (key === "weather") {
    weather.processWeatherData(message);
  } else if (key === "pong") {
    ping.gotPong();
  } else if (key === "settingChange") {
    settings.settingUpdate(message);
  }
};

let prereleaseEl = document.getElementById("pr");

if (appbit.applicationId == "6d80c169-94c5-4105-b9dc-98df99b798cd") {
  prereleaseEl.style.display = "inline";
  prereleaseEl.text = "PRE";
} else if (appbit.applicationId == "cdef6b20-1559-44a5-a574-3441154e8ebd") {
  prereleaseEl.style.display = "inline";
  prereleaseEl.text = "SIDE";
} else {
  prereleaseEl.style.display = "none";
}
