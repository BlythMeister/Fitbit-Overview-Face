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
    return;
  }
  
  if(!settings) {
    console.log("No settings loaded");
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
    
    if (settings.hasOwnProperty("heartRateZoneVis")) {
      hr.setHrZoneVis(!!settings["heartRateZoneVis"]); 
    } else {
      hr.setHrZoneVis(true);
    } 
    
    if (settings.hasOwnProperty("torchEnabled")) {
      torch.setEnabled(!!settings["torchEnabled"]); 
    } else {
      torch.setEnabled(false);
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
    
    let clockFont = getFont("SYS");
    if (settings.hasOwnProperty("clockFont") && settings["clockFont"]) {
      clockFont = getFont(settings["clockFont"]);
    }
    time.timeHourEl.style.fontFamily = clockFont;
    time.timeColonEl.style.fontFamily = clockFont;
    time.timeMinuteEl.style.fontFamily = clockFont;
    time.timeSecEl.style.fontFamily = clockFont;
    time.timeAmPmEl.style.fontFamily = clockFont;
    
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
    
    let dateFont = getFont("SYS");
    if (settings.hasOwnProperty("dateFont") && settings["dateFont"]) {
      dateFont = getFont(settings["dateFont"]);
    }
    date.dateEl.style.fontFamily = dateFont;
    date.dayEl.style.fontFamily = dateFont;

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
      hr.hrIconDiastoleEl.style.fill = "crimson";
      hr.hrIconSystoleEl.style.fill = "crimson"; 
    }          

    let heartRateFont = getFont("SYS");
    if (settings.hasOwnProperty("heartRateFont") && settings["heartRateFont"]) {
      heartRateFont = getFont(settings["heartRateFont"]);
    }
    hr.hrCountEl.style.fontFamily = heartRateFont;
    hr.hrRestingEl.style.fontFamily = heartRateFont;
    hr.hrZoneEl.style.fontFamily = heartRateFont;
    
    if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
      hr.hrCountEl.style.fill = settings["heartRateColour"];
      hr.hrRestingEl.style.fill = settings["heartRateColour"];
      hr.hrZoneEl.style.fill = settings["heartRateColour"];
    } else {
      hr.hrCountEl.style.fill = "white";
      hr.hrRestingEl.style.fill = "white";
      hr.hrZoneEl.style.fill = "white";
    }          
    
    let batteryFont = getFont("SYS");
    if (settings.hasOwnProperty("batteryFont") && settings["batteryFont"]) {
      batteryFont = getFont(settings["batteryFont"]);
    }
    battery.setFont(batteryFont);
    
    if (settings.hasOwnProperty("showBatteryPercent")) {
      battery.setShowBatteryPercent(!!settings["showBatteryPercent"]); 
    } else {
      battery.setShowBatteryPercent(true);
    } 
    
    if (settings.hasOwnProperty("showBatteryBar")) {
      battery.setShowBatteryBar(!!settings["showBatteryBar"]); 
    } else {
      battery.setShowBatteryBar(true);
    } 
        
    if (settings.hasOwnProperty("battery0Colour") && settings["battery0Colour"]) {
      battery.setColour0(settings["battery0Colour"]);
    } else {
      battery.setColour0("#FF0000");
    } 
        
    if (settings.hasOwnProperty("battery25Colour") && settings["battery25Colour"]) {
      battery.setColour25(settings["battery25Colour"]);
    } else {
      battery.setColour25("darkorange");
    }
        
    if (settings.hasOwnProperty("battery50Colour") && settings["battery50Colour"]) {
      battery.setColour50(settings["battery50Colour"]);
    } else {
      battery.setColour50("gold");
    }
        
    if (settings.hasOwnProperty("battery75Colour") && settings["battery75Colour"]) {
      battery.setColour75(settings["battery75Colour"]);
    } else {
      battery.setColour75("#00FF00");
    }
        
    if (settings.hasOwnProperty("batteryBackgroundColour") && settings["batteryBackgroundColour"]) {
      battery.batteryLineBack.style.fill = settings["batteryBackgroundColour"];
    } else {
      battery.batteryLineBack.style.fill = "#969696"
    }    
    
    let statsFont = getFont("SYS");
    if (settings.hasOwnProperty("statsFont") && settings["statsFont"]) {
      statsFont = getFont(settings["statsFont"]);
    }
    bm.bmrZoneEl.style.fontFamily = statsFont; 
    bm.bmiZoneEl.style.fontFamily = statsFont; 
    for (var i=0; i < activity.goalTypes.length; i++) {
      activity.progressEls[i].count.style.fontFamily = statsFont;
    }

    if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
      bm.bmrZoneEl.style.fill = settings["bmColour"];
      bm.bmiZoneEl.style.fill = settings["bmColour"]; 
      
    } else {
      bm.bmrZoneEl.style.fill = "white";
      bm.bmiZoneEl.style.fill = "white"; 
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
        activity.progressEls[i].lineBack.style.fill = "#969696";
      }
      
      var progressVisibility = "inline";
      if (settings.hasOwnProperty("showStatsProgress")) {
        progressVisibility = (settings["showStatsProgress"] ? "inline" : "none");
      } 
      activity.progressEls[i].line.style.display = progressVisibility;
      activity.progressEls[i].lineBack.style.display = progressVisibility; 
    }
    
    let positions = ["TL","BL","TM","BM","TR","BR"];
    
    for (var i=0; i < positions.length; i++) {
      var position = positions[i];  
            
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
      
      var positionProp = "Stats" + position;
      var stat = "";
      if (settings.hasOwnProperty(positionProp) && settings[positionProp]) {
        stat = settings[positionProp];
      } else {
        if(position == "TL"){
          stat = "steps";
        } else if(position == "BL"){
          stat = "distance";
        } else if(position == "TM"){
          stat = "BMIBMR";
        } else if(position == "BM"){
          stat = "calories";
        } else if(position == "TR"){
          stat = "elevationGain";
        } else if(position == "BR"){
          stat = "activeMinutes";
        } 
      }
        
      if(stat == "BMIBMR") {        
        bm.setPosition(position);
        setStatsLocation(bm.bmEl, position);  
      } else {
      for (var x=0; x < activity.goalTypes.length; x++) {
        if(activity.goalTypes[x] == stat) {
          activity.progressEls[x].position = position;
          setStatsLocation(activity.progressEls[x].container, position);
        }
      }
      }
    }
    
    activity.resetProgressPrevState();
    state.reApplyState();
  } catch (ex) {
    console.error(ex);
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
      return {};
    }
    return fileContent;
  } catch (ex) {
    console.log(ex);
    return {};
  }
}

// Save settings to the filesystem
export function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
