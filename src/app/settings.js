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
import * as torch from "./torch.js"

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
    console.log("No settings loaded");
    showHideSettingsError(true);
    return;
  }
  
  if(!settings) {
    console.log("No settings loaded");
    showHideSettingsError(true);
    return;
  }
  
  try {
    if (settings.hasOwnProperty("distanceUnit") && settings["distanceUnit"]) {
      activity.distanceUnitSet(settings["distanceUnit"]);
    } else {
      activity.distanceUnitSet('auto');
    }
            
    if (settings.hasOwnProperty("dateFormat") && settings["dateFormat"]) {
      date.setDateFormat(settings["dateFormat"]); 
    } else {
      console.log("Missing setting 'dateFormat'");
      showHideSettingsError(true);
      return;
    }
            
    if (settings.hasOwnProperty("timeFormat") && settings["timeFormat"]) {
      time.setTimeFormat(settings["timeFormat"]); 
    } else {
      time.setTimeFormat('auto');
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
    
    if (settings.hasOwnProperty("heartRateZoneVis")) {
      hr.setHrZoneVis(!!settings["heartRateZoneVis"]); 
    } else {
      hr.setHrZoneVis(false);
    } 
    
    if (settings.hasOwnProperty("torchEnabled")) {
      torch.setEnabled(!!settings["torchEnabled"]); 
    } else {
      torch.setEnabled(false);
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
    
    let clockFont = getFont("SYS")
    if (settings.hasOwnProperty("clockFont") && settings["clockFont"]) {
      clockFont = getFont(settings["clockFont"]);
    }
    
    if (settings.hasOwnProperty("timeColour") && settings["timeColour"]) {
      
      time.timeHourEl.style.fill = settings["timeColour"];
      time.timeHourEl.style.fontFamily = clockFont;
      time.timeColonEl.style.fill = settings["timeColour"];
      time.timeColonEl.style.fontFamily = clockFont;
      time.timeMinuteEl.style.fill = settings["timeColour"];
      time.timeMinuteEl.style.fontFamily = clockFont;
      time.timeSecEl.style.fill = settings["timeColour"];
      time.timeSecEl.style.fontFamily = clockFont;
      time.timeAmPmEl.style.fill = settings["timeColour"];
      time.timeAmPmEl.style.fontFamily = clockFont;
    } else {
      console.log("Missing setting 'timeColour'");
      showHideSettingsError(true);
      return;
    }
    
    let dateFont = getFont("SYS")
    if (settings.hasOwnProperty("dateFont") && settings["dateFont"]) {
      dateFont = getFont(settings["dateFont"]);
    }

    if (settings.hasOwnProperty("dateColour") && settings["dateColour"]) {
      date.dateEl.style.fill = settings["dateColour"];
      date.dateEl.style.fontFamily = dateFont;
      date.dayEl.style.fill = settings["dateColour"];
      date.dayEl.style.fontFamily = dateFont;
    } else {
      console.log("Missing setting 'dateColour'");
      showHideSettingsError(true);
      return;
    }

    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"]); 
    } else {
      hr.isHeartbeatAnimationSet(false);
    }
    
    if (settings.hasOwnProperty("backgroundColour") && settings["backgroundColour"]) {
      backgroundEl.style.fill = settings["backgroundColour"];     
    } else {
      console.log("Missing setting 'backgroundColour'");
      showHideSettingsError(true);
      return;
    }

    if (settings.hasOwnProperty("heartColour") && settings["heartColour"]) {
      hr.hrIconDiastoleEl.style.fill = settings["heartColour"];
      hr.hrIconSystoleEl.style.fill = settings["heartColour"];         
    } else {
      console.log("Missing setting 'heartColour'");
      showHideSettingsError(true);
      return;
    }          

    let heartRateFont = getFont("SYS")
    if (settings.hasOwnProperty("heartRateFont") && settings["heartRateFont"]) {
      heartRateFont = getFont(settings["heartRateFont"]);
    }
    
    if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
      hr.hrCountEl.style.fill = settings["heartRateColour"]; 
      hr.hrCountEl.style.fontFamily = heartRateFont;
      hr.hrRestingEl.style.fill = settings["heartRateColour"];
      hr.hrRestingEl.style.fontFamily = heartRateFont;
      hr.hrZoneEl.style.fill = settings["heartRateColour"];
      hr.hrZoneEl.style.fontFamily = heartRateFont;
    } else {
      console.log("Missing setting 'heartRateColour'");
      showHideSettingsError(true);
      return;
    }          
            
    let batteryFont = getFont("SYS")
    if (settings.hasOwnProperty("batteryFont") && settings["batteryFont"]) {
      batteryFont = getFont(settings["batteryFont"]);
    }
    battery.setFont(batteryFont);
    
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
      console.log("Missing setting 'battery0Colour'");
      showHideSettingsError(true);
      return;
    } 
        
    if (settings.hasOwnProperty("battery25Colour") && settings["battery25Colour"]) {
      battery.setColour25(settings["battery25Colour"]);
    } else {
      console.log("Missing setting 'battery25Colour'");
      showHideSettingsError(true);
      return;
    }
        
    if (settings.hasOwnProperty("battery50Colour") && settings["battery50Colour"]) {
      battery.setColour50(settings["battery50Colour"]);
    } else {
      console.log("Missing setting 'battery50Colour'");
      showHideSettingsError(true);
      return;
    }
        
    if (settings.hasOwnProperty("battery75Colour") && settings["battery75Colour"]) {
      battery.setColour75(settings["battery75Colour"]);
    } else {
      console.log("Missing setting ''");
      showHideSettingsError(true);
      return;
    }
        
    if (settings.hasOwnProperty("batteryBackgroundColour") && settings["batteryBackgroundColour"]) {
      battery.batteryLineBack.style.fill = settings["batteryBackgroundColour"];
    } else {
      console.log("Missing setting 'batteryBackgroundColour'");
      showHideSettingsError(true);
      return;
    }    
    
    let statsFont = getFont("SYS")
    if (settings.hasOwnProperty("statsFont") && settings["statsFont"]) {
      statsFont = getFont(settings["statsFont"]);
    }

    if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
      bm.bmrZoneEl.style.fill = settings["bmColour"];  
      bm.bmrZoneEl.style.fontFamily = statsFont; 
      bm.bmiZoneEl.style.fill = settings["bmColour"]; 
      bm.bmiZoneEl.style.fontFamily = statsFont; 
    } else {
      console.log("Missing setting 'bmColour'");
      showHideSettingsError(true);
      return;
    } 
    
    for (var i=0; i < activity.goalTypes.length; i++) {
      var goalType = activity.goalTypes[i];      
      var goalTypeColourProp = goalType + "Colour";
      if (settings.hasOwnProperty(goalTypeColourProp) && settings[goalTypeColourProp]) {
        activity.progressEls[i].count.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].count.style.fontFamily = statsFont;
        activity.progressEls[i].icon.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].line.style.fill = settings[goalTypeColourProp];
      } else {
        console.log("Missing setting '" + goalTypeColourProp + "'");
        showHideSettingsError(true);
        return;
      }

      if (settings.hasOwnProperty("progressBackgroundColour") && settings["progressBackgroundColour"]) {
        activity.progressEls[i].lineBack.style.fill = settings["progressBackgroundColour"];
      } else {
        console.log("Missing setting 'progressBackgroundColour'");
        showHideSettingsError(true);
        return;
      }
      
      var progressVisibility = true;
      if (settings.hasOwnProperty("showStatsProgress")) {
        progressVisibility = !!settings["showStatsProgress"];
      }
      
      activity.progressEls[i].line.style.display = (!progressVisibility ? "none" : "inline");
      activity.progressEls[i].lineBack.style.display = (!progressVisibility ? "none" : "inline");      
    }
    
    let positions = ["TL","BL","TM","BM","TR","BR"];
    
    for (var i=0; i < positions.length; i++) {
      var position = positions[i];  
      var positionProp = "Stats" + position;
      
      if (settings.hasOwnProperty(positionProp) && settings[positionProp]) {
        //Remove item from position
        if(bm.position == position) {
          setStatsLocation(bm.bmEl, "NONE")
          bm.setPosition("NONE");
        }
        
        for (var x=0; x < activity.goalTypes.length; x++) {
           if(activity.progressEls[x].position == position) {
             setStatsLocation(activity.progressEls[x].container, "NONE");
             activity.progressEls[x].position = "NONE";
           }
        }
        
        if(settings[positionProp] == "BMIBMR") {        
          if(bm.position == "NONE" || bm.position == position) {
            bm.setPosition(position);
            setStatsLocation(bm.bmEl, position);  
          } else {
            console.log("BMI/BMR in 2 positions");
            showHideSettingsError(true);
            return;
          }
        } else {
          for (var x=0; x < activity.goalTypes.length; x++) {
           if(activity.goalTypes[x] == settings[positionProp]) {
            if(activity.progressEls[x].position == "NONE" || activity.progressEls[x].position == position) {
              activity.progressEls[x].position = position;
              setStatsLocation(activity.progressEls[x].container, position);
            } else {
              console.log(activity.goalTypes[x] + " in 2 positions");
              showHideSettingsError(true);
              return;
            }
           }
          }
        }
      } else {
        console.log("Missing setting '" + positionProp + "'");
        showHideSettingsError(true);
        return;
      }
    }
    
    activity.resetProgressPrevState();
    state.reApplyState();
  } catch (ex) {
    console.error(ex);
    showHideSettingsError(true);
  }
}

applySettings();

export function getFont(key)
{
  if(key == "SYS"){
    return "System-Bold";
  }
  if(key == "COL"){
    return "Colfax-Bold";
  }
  if(key == "FAB"){
    return "Fabrikat-Bold";
  }
  if(key == "SEV"){
    return "Seville-Bold";
  }
  if(key == "SEVC"){
    return "Seville-Bold-Condensed";
  } 
}

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
  showHideSettingsError(false);
  settings = data;
  applySettings();
  saveSettings();
  time.drawTime(new Date());  
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
      showHideSettingsError(true);
      return null;
    }  
    showHideSettingsError(false);
    return fileContent;
  } catch (ex) {
    console.log(ex);
    showHideSettingsError(true);
    return null;
  }
}

// Save settings to the filesystem
export function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

export function showHideSettingsError(show) {
  if(show){
    console.log("Show settings error");
    noSettingsEl.style.display = "inline";
    noSettingsTextEl.text = gettext("settings-error");
  } else {
    console.log("Hide settings error");
    noSettingsEl.style.display = "none";
  }  
}
