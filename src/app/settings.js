import document from "document";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { user } from "user-profile";
import * as fs from "fs";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { me as device } from "device";
import { locale } from "user-settings";
import { gettext } from "i18n";

import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as state from "./state.js"
import * as nightlight from "./nightlight.js"

// SETTINGS
export const SETTINGS_TYPE = "cbor";
export const SETTINGS_FILE = "settingsV1.cbor";
export let root = document.getElementById('root');
export let backgroundEl = document.getElementById('background');
export let noSettingsEl = document.getElementById('noSettings');
export let noSettingsTextEl = document.getElementById('noSettingsText');
export let settings = loadSettings();

export function applySettings() {
  if (!loadSettings) {
   return;
  }
  
  if(!settings) {
    return;    
  }
  
  try {
    if (settings.hasOwnProperty("distanceUnit") && settings["distanceUnit"]) {
      activity.distanceUnitSet(settings["distanceUnit"]);
    } else {
      activity.distanceUnitSet("auto");
    }
            
    if (settings.hasOwnProperty("dateFormat") && settings["dateFormat"]) {
      date.setDateFormat(settings["dateFormat"]); 
    } else {
      date.setDateFormat("dd mmmm yy");
    }
            
    if (settings.hasOwnProperty("timeFormat") && settings["timeFormat"]) {
      time.setTimeFormat(settings["timeFormat"]); 
    } else {
      time.setTimeFormat("auto");
    } 
    
    if (settings.hasOwnProperty("isAmPm")) {
      time.setIsAmPm(!!settings["isAmPm"]); 
    } else {
      time.setIsAmPm(false);
    }  
    
    if (settings.hasOwnProperty("showSeconds")) {
      time.setShowSeconds(!!settings["showSeconds"]); 
    } else {
      time.setShowSeconds(false);
    } 
    
    if (settings.hasOwnProperty("showLeadingZero")) {
      time.setShowLeadingZero(!!settings["showLeadingZero"]); 
    } else {
      time.setShowLeadingZero(false);
    }
    
    if (settings.hasOwnProperty("flashDots")) {
      time.setFlashDots(!!settings["flashDots"]); 
    } else {
      time.setFlashDots(false);
    }
    
    if (settings.hasOwnProperty("hearRateZoneVis")) {
      hr.setHrZoneVis(!!settings["hearRateZoneVis"]); 
    } else {
      hr.setHrZoneVis(false);
    } 
    
    if (settings.hasOwnProperty("nightlightEnabled")) {
      nightlight.setEnabled(!!settings["nightlightEnabled"]); 
    } else {
      nightlight.setEnabled(false);
    } 
    
    if (settings.hasOwnProperty("BMIVis")) {
      bm.setBMIVis(!!settings["BMIVis"]); 
    } else {
      bm.setBMIVis(false);
    } 
    
    if (settings.hasOwnProperty("BMRVis")) {
      bm.setBMRVis(!!settings["BMRVis"]); 
    } else {
      bm.setBMRVis(false);
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
      hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"]); 
    } else {
      hr.isHeartbeatAnimationSet(false);
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
      battery.setShowBatteryPercent(false);
    } 
    
    if (settings.hasOwnProperty("showBatteryBar")) {
      battery.setShowBatteryBar(!!settings["showBatteryBar"]); 
    } else {
      battery.setShowBatteryBar(false);
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
      
      var progressVisibility = true;
      if (settings.hasOwnProperty("showStatsProgress")) {
        progressVisibility = !!settings["showStatsProgress"];
      }
      
      activity.progressEls[i].line.style.display = (!progressVisibility ? "none" : "inline");
      activity.progressEls[i].lineBack.style.display = (!progressVisibility ? "none" : "inline");

      var goalTypeLocationProp = goalType + "Location";
      if (settings.hasOwnProperty(goalTypeLocationProp) && settings[goalTypeLocationProp]) {
        setStatsLocation(activity.progressEls[i].container, settings[goalTypeLocationProp]);
      } else {
        setStatsLocation(activity.progressEls[i].container, "NONE")
      }
    }
    
    if (settings.hasOwnProperty("BMLocation") && settings["BMLocation"]) {
        setStatsLocation(bm.bmEl, settings["BMLocation"]);
    } else {
      setStatsLocation(bm.bmEl, "NONE");
    } 
    
    activity.resetProgressPrevState();
    state.reApplyState();
  } catch (ex) {
    console.error(ex);
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
  saveSettings();
  time.drawTime(new Date());
  noSettingsEl.style.display = "none";
}

messaging.peerSocket.addEventListener("message", function(evt) {
  if(evt.data.dataType === "settingChange")
  {
    if (!settings) {
      settings = {};
    }
    
    if(typeof evt.data.value === "object") {
      console.log(`Setting update - key:${evt.data.key} value:${evt.data.value.values[0].value}`);
      settings[evt.data.key] = evt.data.value.values[0].value; 
    } else {
      console.log(`Setting update - key:${evt.data.key} value:${evt.data.value}`);
      settings[evt.data.key] = evt.data.value;
    }
    
    onsettingschange(settings);
  }  
})

appbit.addEventListener("unload", saveSettings);

export function loadSettings() {
  try {
    var fileContent = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    if(fileContent === null || Object.keys(fileContent).length === 0)
    {
      noSettingsEl.style.display = "inline";
      noSettingsTextEl.text = gettext("settings-required");
      return null
    }  
    noSettingsEl.style.display = "none";
    return fileContent;
  } catch (ex) {
    console.log(ex);
    noSettingsEl.style.display = "inline";
    noSettingsTextEl.text = gettext("settings-required");
    return null;
  }
}

// Save settings to the filesystem
export function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}