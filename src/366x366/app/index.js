import * as document from "document";
import { me as appbit } from "appbit";

import { msgq } from "./../shared/msgq.js";
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
import * as connectivity from "./connectivity.js";

console.log(`Application ID: ${appbit.applicationId}`);
console.log(`Build ID: ${appbit.buildId}`);

let startingEl = document.getElementById("starting");

startingEl.style.display = "inline";

settings.applySettings();

if (settings.hasSettings()) {
  startingEl.style.display = "none";
} else {
  setTimeout(() => {
    if (startingEl.style.display == "inline") {
      startingEl.style.display = "none";
      console.log(`Hiding loading spinner after 120 seconds if still shown`);
    }
  }, 120000);
}

msgq.send("send-all-settings", {}, true);

msgq.onmessage = (messageKey, message) => {
  var key = messageKey.split(":")[0];
  if (key === "weather") {
    weather.processWeatherData(message);
  } else if (key === "settingChange") {
    settings.settingUpdate(message);
  } else if (key === "all-settings-sent") {
    startingEl.style.display = "none";
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
