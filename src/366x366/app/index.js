import * as document from "document";

import { asap } from "./asap.js";
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

settings.applySettings();
asap.send("send-settings", {});

asap.onmessage = (messageKey, message) => {
  var key = messageKey.split(":")[0];
  if (key === "weather") {
    weather.processWeatherData(message);
  } else if (key === "pong") {
    ping.gotPong();
  } else if (key === "settingChange") {
    settings.settingUpdate(message);
  }
};
