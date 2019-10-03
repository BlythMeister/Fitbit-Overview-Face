import document from "document";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { user } from "user-profile";
import * as fs from "fs";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { me as device } from "device";
import { locale } from "user-settings";

import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as state from "./state.js"

// SETTINGS
export const SETTINGS_TYPE = "cbor";
export const SETTINGS_FILE = "settingsV1.cbor";
export let settings = loadSettings();
export let root = document.getElementById('root');
export let backgroundEl = document.getElementById('background');

export function applySettings() {
  if (!loadSettings) {
   return;
  }
  
  try {
    if (settings.hasOwnProperty("distanceUnit") && settings["distanceUnit"].values) {
      activity.distanceUnitSet(settings["distanceUnit"].values[0].value);
    } else {
      activity.distanceUnitSet("mi");
    }
            
    if (settings.hasOwnProperty("dateFormat") && settings["dateFormat"].values) {
      date.setDateFormat(settings["dateFormat"].values[0].value); 
    } else {
      date.setDateFormat("dd mmmm yy");
    }
            
    if (settings.hasOwnProperty("timeFormat") && settings["timeFormat"].values) {
      time.setTimeFormat(settings["timeFormat"].values[0].value); 
    } else {
      time.setTimeFormat("auto");
    } 
    
    if (settings.hasOwnProperty("isAmPm")) {
      time.setIsAmPm(!!settings["isAmPm"]); 
    } else {
      time.setIsAmPm(true);
    }  
    
    if (settings.hasOwnProperty("showSeconds")) {
      time.setShowSeconds(!!settings["showSeconds"]); 
    } else {
      time.setShowSeconds(true);
    } 
    
    if (settings.hasOwnProperty("showLeadingZero")) {
      time.setShowLeadingZero(!!settings["showLeadingZero"]); 
    } else {
      time.setShowLeadingZero(true);
    }
    
    if (settings.hasOwnProperty("flashDots")) {
      time.setFlashDots(!!settings["flashDots"]); 
    } else {
      time.setFlashDots(true);
    }
    
    if (settings.hasOwnProperty("hearRateZoneVis")) {
      hr.setHrZoneVis(!!settings["hearRateZoneVis"]); 
    } else {
      hr.setHrZoneVis(true);
    } 
    
    if (settings.hasOwnProperty("BMIVis")) {
      bm.setBMIVis(!!settings["BMIVis"]); 
    } else {
      bm.setBMIVis(true);
    } 
    
    if (settings.hasOwnProperty("BMRVis")) {
      bm.setBMRVis(!!settings["BMRVis"]); 
    } else {
      bm.setBMRVis(true);
    } 
    
    if (settings.hasOwnProperty("timeColour") && settings["timeColour"]) {
      time.timeHourEl.style.fill = settings["timeColour"];
      time.timeColonEl.style.fill = settings["timeColour"];
      time.timeMinuteEl.style.fill = settings["timeColour"];
      time.timeSecEl.style.fill = settings["timeColour"];
      time.timeAmPmEl.style.fill = settings["timeColour"];
    } else {
      time.timeHourEl.style.fill = "white";
      time.timeColonEl.style.fill = "white";
      time.timeMinuteEl.style.fill = "white";
      time.timeSecEl.style.fill = "white";
      time.timeAmPmEl.style.fill = "white";
    }

    if (settings.hasOwnProperty("dateColour") && settings["dateColour"]) {
      date.dateEl.style.fill = settings["dateColour"];
      date.dayEl.style.fill = settings["dateColour"];
    } else {
      date.dateEl.style.fill = "white";
      date.dayEl.style.fill = "white";
    }

    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      hr.isHeartbeatAnimationSet(!!settings.isHeartbeatAnimation); 
    } else {
      hr.isHeartbeatAnimationSet(true);
    }

    if (settings.hasOwnProperty("backgroundColour") && settings["backgroundColour"]) {
      backgroundEl.style.fill = settings["backgroundColour"];     
    } else {
      backgroundEl.style.fill = "black";
    }

    if (settings.hasOwnProperty("heartColour") && settings["heartColour"]) {
      hr.hrIconDiastoleEl.style.fill = settings["heartColour"];
      hr.hrIconSystoleEl.style.fill = settings["heartColour"];         
    } else {
      hr.hrIconDiastoleEl.style.fill = "white";
      hr.hrIconSystoleEl.style.fill = "white";
    }          

    if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
      hr.hrCountEl.style.fill = settings["heartRateColour"];    
      hr.hrRestingEl.style.fill = settings["heartRateColour"];
      hr.hrZoneEl.style.fill = settings["heartRateColour"];
    } else {
      hr.hrCountEl.style.fill = "white";    
      hr.hrRestingEl.style.fill = "white";
      hr.hrZoneEl.style.fill = "white";
    }          

    if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
      bm.bmrZoneEl.style.fill = settings["bmColour"];   
      bm.bmiZoneEl.style.fill = settings["bmColour"];
    } else {
      bm.bmrZoneEl.style.fill = "white";   
      bm.bmiZoneEl.style.fill = "white";
    } 
    
    if (settings.hasOwnProperty("showBatteryPercent")) {
      battery.setShowBatteryPercent(!!settings["showBatteryPercent"]); 
    } else {
      battery.setShowBatteryPercent(true);
    } 
        
    if (settings.hasOwnProperty("battery0Colour") && settings["battery0Colour"]) {
       battery.setColour0(settings["battery0Colour"]);
    } else {
       battery.setColour0("white");
    } 
        
    if (settings.hasOwnProperty("battery25Colour") && settings["battery25Colour"]) {
       battery.setColour25(settings["battery25Colour"]);
    } else {
       battery.setColour25("white");
    }
        
    if (settings.hasOwnProperty("battery50Colour") && settings["battery50Colour"]) {
       battery.setColour50(settings["battery50Colour"]);
    } else {
       battery.setColour50("white");
    }
        
    if (settings.hasOwnProperty("battery75Colour") && settings["battery75Colour"]) {
       battery.setColour75(settings["battery75Colour"]);
    } else {
       battery.setColour75("white");
    }
        
    if (settings.hasOwnProperty("batteryBackgroundColour") && settings["batteryBackgroundColour"]) {
       battery.batteryLineBack.style.fill = settings["batteryBackgroundColour"];
    } else {
       battery.batteryLineBack.style.fill = "black";
    }

    for (var i=0; i < activity.goalTypes.length; i++) {
      var goalType = activity.goalTypes[i];      
      var goalTypeColourProp = goalType + "Colour";
      if (settings.hasOwnProperty(goalTypeColourProp) && settings[goalTypeColourProp]) {
        activity.progressEls[i].count.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].icon.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].line.style.fill = settings[goalTypeColourProp];
      } else {
        activity.progressEls[i].count.style.fill = "white";
        activity.progressEls[i].icon.style.fill = "white";
        activity.progressEls[i].line.style.fill = "white";
      }

      if (settings.hasOwnProperty("progressBackgroundColour") && settings["progressBackgroundColour"]) {
        activity.progressEls[i].lineBack.style.fill = settings["progressBackgroundColour"];
      } else {
        activity.progressEls[i].lineBack.style.fill = "black";
      }

      var goalTypeLocationProp = goalType + "Location";
      if (settings.hasOwnProperty(goalTypeLocationProp) && settings[goalTypeLocationProp]) {
        setStatsLocation(activity.progressEls[i].container, settings[goalTypeLocationProp].values[0].value);
      } else {
        if(goalType == "steps"){
          setStatsLocation(activity.progressEls[i].container, "TL")
        }
        if(goalType == "distance"){
          setStatsLocation(activity.progressEls[i].container, "BL")
        }
        if(goalType == "elevationGain"){
          setStatsLocation(activity.progressEls[i].container, "BM")
        }
        if(goalType == "calories"){
          setStatsLocation(activity.progressEls[i].container, "TR")
        }
        if(goalType == "activeMinutes"){
          setStatsLocation(activity.progressEls[i].container, "BR")
        }
      }
    }
    
    if (settings.hasOwnProperty("BMLocation") && settings["BMLocation"]) {
        setStatsLocation(bm.bmEl, settings["BMLocation"].values[0].value);
    } else {
      setStatsLocation(bm.bmEl, "TM");
    }
    
    activity.resetProgressPrevState();
    state.applyState();
  } catch (ex) {
    console.log(ex);
  }
}

applySettings();

export function setStatsLocation(element, location)
{
    var maxWidth = device.screen.width;
    var maxHeight = device.screen.height;
  
    if(location == "TL")
    {
      element.style.display = "inline";
      element.x = (3 * maxWidth) / 100;
      element.y = maxHeight - 60;
      return;
    }
  
    if(location == "BL")
    {
      element.style.display = "inline";
      element.x = (3 * maxWidth) / 100;
      element.y = maxHeight - 30;
      return;
    }
  
    if(location == "TM")
    {
      element.style.display = "inline";
      element.x = (36 * maxWidth) / 100;
      element.y = maxHeight - 60;
      return;
    }
  
    if(location == "BM")
    {
      element.style.display = "inline";
      element.x = (36 * maxWidth) / 100;
      element.y = maxHeight - 30;
      return;
    }
  
    if(location == "TR")
    {
      element.style.display = "inline";
      element.x = (69 * maxWidth) / 100;
      element.y = maxHeight - 60;
      return;
    }
  
    if(location == "BR")
    {
      element.style.display = "inline";
      element.x = (69 * maxWidth) / 100;
      element.y = maxHeight - 30;
      return;
    }
  
    if(location == "NONE")
    {
      element.style.display = "none";
      return;
    }
}

export function onsettingschange(data) {
  if (!data) {
   return;
  }
  settings = data;
  applySettings();
  time.drawTime(new Date());
}

messaging.peerSocket.addEventListener("message", function(evt) {
  if (!settings) {
    settings = {};
  }
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
})

appbit.addEventListener("unload", saveSettings);

export function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.log(ex);
    var defaults = {};
    fs.writeFileSync(SETTINGS_FILE, defaults, SETTINGS_TYPE);
    return defaults;
  }
}

// Save settings to the filesystem
export function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}