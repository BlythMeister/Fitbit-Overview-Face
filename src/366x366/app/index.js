import * as document from "document";
import { me as appbit } from "appbit";
import { gettext } from "i18n";

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
let startingTextTopEl = document.getElementById("starting-text-top");
let startingTextBottomEl = document.getElementById("starting-text-bottom");

startingEl.style.display = "inline";
startingTextTopEl.text = `${gettext("installing")} - 0%`;
startingTextBottomEl.text = gettext("please-wait");

settings.applySettings();

if (settings.hasSettings()) {
  startingEl.style.display = "none";
}

msgq.addEventListener("message", (messageKey, message) => {
  try {
    var key = messageKey.split(":")[0];
    if (key === "weather") {
      weather.processWeatherData(message);
    } else if (key === "settingChange") {
      settings.settingUpdate(message);
      settings.applySettings();
    } else if (key === "settingsChunk") {
      for (let index = 0; index < message.data.length; index++) {
        const element = message.data[index];
        try {
          settings.settingUpdate(element);
          if (index == message.data.length - 1) {
            settings.applySettings();
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (message.chunk == message.totalChunks) {
        startingEl.style.display = "none";
        settings.applySettings();
        settings.saveSettings();
      } else {
        var percent = Math.round((message.chunk / message.totalChunks) * 100);
        startingTextTopEl.text = `${gettext("installing")} - ${percent}%`;
      }
    }
  } catch (e) {
    console.error(e);
  }
});

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

msgq.send("send-all-settings", {}, true);
msgq.send("app-launch", {}, false);
