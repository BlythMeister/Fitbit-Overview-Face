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
      console.log("Missing setting 'distanceUnit'");
      showHideSettingsError(true);
      return;
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
      console.log("Missing setting 'timeFormat'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("isAmPm")) {
      time.setIsAmPm(!!settings["isAmPm"]); 
    } else {
      console.log("Missing setting 'isAmPm'");
      showHideSettingsError(true);
      return;
    }  
    
    if (settings.hasOwnProperty("showSeconds")) {
      time.setShowSeconds(!!settings["showSeconds"]); 
    } else {
      console.log("Missing setting 'showSeconds'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("showLeadingZero")) {
      time.setShowLeadingZero(!!settings["showLeadingZero"]); 
    } else {
      console.log("Missing setting 'showLeadingZero'");
      showHideSettingsError(true);
      return;
    }
    
    if (settings.hasOwnProperty("flashDots")) {
      time.setFlashDots(!!settings["flashDots"]); 
    } else {
      console.log("Missing setting 'flashDots'");
      showHideSettingsError(true);
      return;
    }
    
    if (settings.hasOwnProperty("heartRateZoneVis")) {
      hr.setHrZoneVis(!!settings["heartRateZoneVis"]); 
    } else {
      console.log("Missing setting 'heartRateZoneVis'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("torchEnabled")) {
      torch.setEnabled(!!settings["torchEnabled"]); 
    } else {
      console.log("Missing setting 'torchEnabled'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("BMIVis")) {
      bm.setBMIVis(!!settings["BMIVis"]); 
    } else {
      console.log("Missing setting 'BMIVis'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("BMRVis")) {
      bm.setBMRVis(!!settings["BMRVis"]); 
    } else {
      console.log("Missing setting 'BMRVis'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("clockFont") && settings["clockFont"]) {
      let clockFont = getFont(settings["clockFont"]);
      time.timeHourEl.style.fontFamily = clockFont;
      time.timeColonEl.style.fontFamily = clockFont;
      time.timeMinuteEl.style.fontFamily = clockFont;
      time.timeSecEl.style.fontFamily = clockFont;
      time.timeAmPmEl.style.fontFamily = clockFont;
    } else {
      console.log("Missing setting 'clockFont'");
      showHideSettingsError(true);
      return;
    }
    
    if (settings.hasOwnProperty("timeColour") && settings["timeColour"]) {      
      time.timeHourEl.style.fill = settings["timeColour"];
      time.timeColonEl.style.fill = settings["timeColour"];
      time.timeMinuteEl.style.fill = settings["timeColour"];
      time.timeSecEl.style.fill = settings["timeColour"];
      time.timeAmPmEl.style.fill = settings["timeColour"];
    } else {
      console.log("Missing setting 'timeColour'");
      showHideSettingsError(true);
      return;
    }
    
    if (settings.hasOwnProperty("dateFont") && settings["dateFont"]) {
      let dateFont = getFont(settings["dateFont"]);
      date.dateEl.style.fontFamily = dateFont;
      date.dayEl.style.fontFamily = dateFont;
    } else {
      console.log("Missing setting 'dateFont'");
      showHideSettingsError(true);
      return;
    }

    if (settings.hasOwnProperty("dateColour") && settings["dateColour"]) {
      date.dateEl.style.fill = settings["dateColour"];
      date.dayEl.style.fill = settings["dateColour"];      
    } else {
      console.log("Missing setting 'dateColour'");
      showHideSettingsError(true);
      return;
    }

    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"]); 
    } else {
      console.log("Missing setting 'isHeartbeatAnimation'");
      showHideSettingsError(true);
      return;
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

    if (settings.hasOwnProperty("heartRateFont") && settings["heartRateFont"]) {
      let heartRateFont = getFont(settings["heartRateFont"]);
      hr.hrCountEl.style.fontFamily = heartRateFont;
      hr.hrRestingEl.style.fontFamily = heartRateFont;
      hr.hrZoneEl.style.fontFamily = heartRateFont;
    } else {
      console.log("Missing setting 'heartRateFont'");
      showHideSettingsError(true);
      return;
    }
    
    if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
      hr.hrCountEl.style.fill = settings["heartRateColour"];
      hr.hrRestingEl.style.fill = settings["heartRateColour"];
      hr.hrZoneEl.style.fill = settings["heartRateColour"];
    } else {
      console.log("Missing setting 'heartRateColour'");
      showHideSettingsError(true);
      return;
    }          
            
    if (settings.hasOwnProperty("batteryFont") && settings["batteryFont"]) {
      battery.setFont(getFont(settings["batteryFont"]));
    } else {
      console.log("Missing setting 'batteryFont'");
      showHideSettingsError(true);
      return;
    }
    
    if (settings.hasOwnProperty("showBatteryPercent")) {
      battery.setShowBatteryPercent(!!settings["showBatteryPercent"]); 
    } else {
      console.log("Missing setting 'showBatteryPercent'");
      showHideSettingsError(true);
      return;
    } 
    
    if (settings.hasOwnProperty("showBatteryBar")) {
      battery.setShowBatteryBar(!!settings["showBatteryBar"]); 
    } else {
      console.log("Missing setting 'showBatteryBar'");
      showHideSettingsError(true);
      return;
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
    
    if (settings.hasOwnProperty("statsFont") && settings["statsFont"]) {
      let statsFont = getFont(settings["statsFont"]);
      bm.bmrZoneEl.style.fontFamily = statsFont; 
      bm.bmiZoneEl.style.fontFamily = statsFont; 
      for (var i=0; i < activity.goalTypes.length; i++) {
        activity.progressEls[i].count.style.fontFamily = statsFont;
      }
    } else {
      console.log("Missing setting 'statsFont'");
      showHideSettingsError(true);
      return;
    }

    if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
      bm.bmrZoneEl.style.fill = settings["bmColour"];
      bm.bmiZoneEl.style.fill = settings["bmColour"]; 
      
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
        let progressVisibility = (settings["showStatsProgress"] ? "inline" : "none");
        activity.progressEls[i].line.style.display = progressVisibility;
        activity.progressEls[i].lineBack.style.display = progressVisibility;   
      } else {
        console.log("Missing setting 'showStatsProgress'");
        showHideSettingsError(true);
        return;
      }  
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
    return "Colfax-Medium";
  }
  if(key == "FAB"){
    return "Fabrikat-Black";
  }
  if(key == "SEV"){
    return "Seville-Bold";
  }
  if(key == "SEVC"){
    return "Seville-Bold-Condensed";
  } 
  if(key == "SEVS"){
    return "SevilleSharp-Bold";
  } 
  
  return "System-Bold";
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
    
    var newValue = "";
    if(typeof evt.data.value === "object") {
      newValue = evt.data.value.values[0].value; 
    } else {
      newValue = evt.data.value;
    }
    
    if(settings[evt.data.key] != newValue)
    {
      console.log(`Setting update - key:${evt.data.key} value:${newValue}`);
      settings[evt.data.key] = newValue
    } else {
      return;
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
    noSettingsEl.style.display = "inline";
    noSettingsTextEl.text = gettext("settings-error");
  } else {
    noSettingsEl.style.display = "none";
  }  
}
