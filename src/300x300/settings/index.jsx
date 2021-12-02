function hasActivity(props, activity)
{
  try
  { 
    let statsTL = JSON.parse(props.settingsStorage.getItem("StatsTL")).values[0].value;
    let statsBL = JSON.parse(props.settingsStorage.getItem("StatsBL")).values[0].value;
    let statsTM = JSON.parse(props.settingsStorage.getItem("StatsTM")).values[0].value;
    let statsBM = JSON.parse(props.settingsStorage.getItem("StatsBM")).values[0].value;
    let statsTR = JSON.parse(props.settingsStorage.getItem("StatsTR")).values[0].value;
    let statsBR = JSON.parse(props.settingsStorage.getItem("StatsBR")).values[0].value;

    //console.log(`statsTL: ${statsTL}`);
    //console.log(`statsBL: ${statsBL}`);
    //console.log(`statsTM: ${statsTM}`);
    //console.log(`statsBM: ${statsBM}`);
    //console.log(`statsTR: ${statsTR}`);
    //console.log(`statsBR: ${statsBR}`);
    //console.log(`activity: ${activity}`);

    return statsTL === activity ||
           statsBL === activity ||
           statsTM === activity ||
           statsBM === activity ||
           statsTR === activity ||
           statsBR === activity;
  } catch(e) { 
    console.log(`Error on hasActivity (${activity}): ${e}`); 
    return true;
  }  
}

function hasStat(props)
{
    try
    { 
      let statsTL = JSON.parse(props.settingsStorage.getItem("StatsTL")).values[0].value;
      let statsBL = JSON.parse(props.settingsStorage.getItem("StatsBL")).values[0].value;
      let statsTM = JSON.parse(props.settingsStorage.getItem("StatsTM")).values[0].value;
      let statsBM = JSON.parse(props.settingsStorage.getItem("StatsBM")).values[0].value;
      let statsTR = JSON.parse(props.settingsStorage.getItem("StatsTR")).values[0].value;
      let statsBR = JSON.parse(props.settingsStorage.getItem("StatsBR")).values[0].value;

      //console.log(`statsTL: ${statsTL}`);
      //console.log(`statsBL: ${statsBL}`);
      //console.log(`statsTM: ${statsTM}`);
      //console.log(`statsBM: ${statsBM}`);
      //console.log(`statsTR: ${statsTR}`);
      //console.log(`statsBR: ${statsBR}`);

      return (statsTL != "NONE" && statsTL != "BMIBMR") ||
             (statsBL != "NONE" && statsBL != "BMIBMR") ||
             (statsTM != "NONE" && statsTM != "BMIBMR") ||
             (statsBM != "NONE" && statsBM != "BMIBMR") ||
             (statsTR != "NONE" && statsTR != "BMIBMR") ||
             (statsBR != "NONE" && statsBR != "BMIBMR");
    } catch(e) { 
      console.log(`Error on hasStat: ${e}`); 
      return true;
    }
}

function hasBattery(props, barOnly)
{
  try
  {
    let batteryPercent = JSON.parse(props.settingsStorage.getItem("showBatteryPercent"));
    let batteryBar = JSON.parse(props.settingsStorage.getItem("showBatteryBar"));

    if(barOnly)
    {
    return batteryBar;  
    }
    else
    {
     return batteryPercent || batteryBar;
    }
  } catch(e) { 
    console.log(`Error on hasBattery: ${e}`); 
    return true;
  }
}

function hasHeartRate(props)
{
  try
  {
    return JSON.parse(props.settingsStorage.getItem("showHeartRate"));
  } catch(e) { 
    console.log(`Error on hasHeartRate: ${e}`); 
    return true;
  }
}

function hasDate(props)
{
  try
  {
    return JSON.parse(props.settingsStorage.getItem("showDate"));
  } catch(e) { 
    console.log(`Error on hasHeartRate: ${e}`); 
    return true;
  }
}

function hasTime(props)
{
  try
  {
    return JSON.parse(props.settingsStorage.getItem("showTime"));
  } catch(e) { 
    console.log(`Error on hasHeartRate: ${e}`); 
    return true;
  }
}

function mySettings(props) {
  let colourSet = [
  {color: "#FF00FF"},   
  {color: "#FFFF00"},  
  {color: "#00FFFF"},  
  {color: "#FF0000"},  
  {color: "#00FF00"},  
  {color: "#0000FF"},  
    
  {color: "white"} ,
  {color: 'black'},
  {color: 'cornsilk'},
  {color: 'gold'},
  {color: 'aquamarine'},
  {color: 'deepskyblue'},
     
  {color: 'teal'},
  {color: 'violet'},
  {color: 'midnightblue'},
  {color: 'yellowgreen'},
  {color: 'crimson'},
  {color: 'lightseagreen'},
    
  {color: 'salmon'},
  {color: '#00FA9A'},  
  {color: 'darkred'},  
  {color: 'darkslategrey'},      
  {color: 'darkorchid'},
  {color: 'darkorange'},
    
  {color: 'lightsteelblue'},
  {color: 'skyblue'},
  {color: '#8B4513'},
  {color: 'khaki'}, 
  {color: 'palegoldenrod'},  
  {color: 'navy'},
    
  {color: 'deeppink'},
  {color: 'royalblue'},
  {color: 'orangered'},
  {color: 'greenyellow'}, 
  {color: 'tomato'},  
  {color: 'forestgreen'},
    
  {color: '#00163a'},
  {color: '#21003a'},
  {color: '#3a1d00'},
  {color: '#969696'}, 
  {color: '#494949'}, 
  {color: '#2d2d2d'}
];
      
  let modelId = JSON.parse(props.settingsStorage.getItem("deviceModelId"));
  let availiableStats = [ {value:"NONE", name:"Empty"}, 
                          {value:"BMIBMR", name:"BMR/BMI"}, {value:"steps", name:"Steps"}, {value:"distance", name:"Distance"},
                          {value:"elevationGain", name:"Floors"}, {value:"calories", name:"Calories"}, {value:"activeMinutes", name:"Active Zone Minutes"}]
  
  if(modelId === "38") {
    availiableStats = [ {value:"NONE", name:"Empty"}, 
                        {value:"BMIBMR", name:"BMR/BMI"}, {value:"steps", name:"Steps"}, {value:"distance", name:"Distance"},
                        {value:"NONE", name:"Floors (Not Supported On Versa Lite)"}, {value:"calories", name:"Calories"}, {value:"activeMinutes", name:"Active Zone Minutes"}]
  } 
  
  return (
    <Page>     
      <Section title="Clock">
        <Toggle settingsKey="showTime" label="Show Time" />
        { hasTime(props) && <Toggle settingsKey="isAmPm" label="AM/PM indication on 12-hour clock" /> }     
        { hasTime(props) && <Toggle settingsKey="showSeconds" label="Show seconds value" /> }
        { hasTime(props) && <Toggle settingsKey="showLeadingZero" label="Show leading zero on hours" /> }
        { hasTime(props) && <Toggle settingsKey="flashDots" label="Flash the : in time" /> } 
        { hasTime(props) && <Select label="Time Format" settingsKey="timeFormat" options={[ {value:"auto", name:"Automatic (Use Fitbit Setting)"}, {value:"12h", name:"12 hour"}, {value:"24h", name:"24 hour"} ]} /> }
      </Section>   
      
      <Section title="Date">
        <Toggle settingsKey="showDate" label="Show Date" />
        { hasDate(props) && <Toggle settingsKey="showDay" label="Show Day" /> }
        { hasDate(props) && <Select label="Date Format" settingsKey="dateFormat" options={[ {value:"dd.mm.yy", name:"dd.mm.yy"}, {value:"dd mmm yy", name:"dd mmm yy"}, {value:"dd mmmm yy", name:"dd mmmm yy"}, {value:"dd/mm/yy", name:"dd/mm/yy"}, {value:"mm/dd/yy", name:"mm/dd/yy"}, {value:"mm.dd.yy", name:"mm.dd.yy"}, {value:"mmm dd yy", name:"mmm dd yy"}, {value:"mmmm dd yy", name:"mmmm dd yy"}, {value:"yy/mm/dd", name:"yy/mm/dd"}, {value:"dd.mm.yyyy", name:"dd.mm.yyyy"}, {value:"dd mmm yyyy", name:"dd mmm yyyy"}, {value:"dd mmmm yyyy", name:"dd mmmm yyyy"}, {value:"dd/mm/yyyy", name:"dd/mm/yyyy"}, {value:"mm/dd/yyyy", name:"mm/dd/yyyy"}, {value:"mm.dd.yyyy", name:"mm.dd.yyyy"}, {value:"mmm dd yyyy", name:"mmm dd yyyy"}, {value:"mmmm dd yyyy", name:"mmmm dd yyyy"}, {value:"yyyy/mm/dd", name:"yyyy/mm/dd"}, {value:"mmm dd, yyyy", name:"mmm dd, yyyy"}, {value:"mmmm dd, yyyy", name:"mmmm dd, yyyy"} ]} /> }
      </Section>
      
      <Section title="Heart Rate">
        <Toggle settingsKey="showHeartRate" label="Show Heart rate" />
        { hasHeartRate(props) && <Toggle settingsKey="isHeartbeatAnimation" label="Heartbeat animation" /> }   
        { hasHeartRate(props) && <Toggle settingsKey="heartRateZoneVis" label="Show heart rate zone" /> }
      </Section>
            
      <Section title="Stats">
        <Select label="Top Left" settingsKey="StatsTL" options={availiableStats} />
        <Select label="Bottom Left" settingsKey="StatsBL" options={availiableStats} />
        <Select label="Top Middle" settingsKey="StatsTM" options={availiableStats} />
        <Select label="Bottom Middle" settingsKey="StatsBM" options={availiableStats} />
        <Select label="Top Right" settingsKey="StatsTR" options={availiableStats} />
        <Select label="Bottom Right" settingsKey="StatsBR" options={availiableStats} />
      </Section>
      
      { hasActivity(props, "BMIBMR") && <Section title="BMR/BMI">
        <Toggle settingsKey="BMRVis" label="Show BMR" />
        <Toggle settingsKey="BMIVis" label="Show BMI" />
      </Section> }
      
      { hasActivity(props, "distance") && <Section title="Distance">   
        <Select label="Distance Unit" settingsKey="distanceUnit" options={[ {value:"auto", name:"Automatic (Use Fitbit Setting)"}, {value:"m", name:"meters"}, {value:"km", name:"kilometers"}, {value:"ft", name:"feet"}, {value:"mi", name:"miles"} ]} />        
      </Section> }
      
      { hasStat(props) && <Section title="Stats Progress">
        <Select label="Progress Bars" settingsKey="progressBars" options={[ {value:"none", name:"None"}, {value:"bars", name:"Bars"}, {value:"arc", name:"Arc"} ]} /> 
      </Section> }
      
      <Section title="Battery">
        <Toggle settingsKey="showBatteryPercent" label="Show battery percentage" />
        <Toggle settingsKey="showBatteryBar" label="Show battery bar" />
      </Section>
      
      <Section title="Torch">
        <Toggle settingsKey="torchEnabled" label="Enable on torch on double tap" />
        <Select settingsKey="torchAutoOff" label="Automatically turn torch off after" options={[{value:"-1", name: "Never" }, {value:"1", name:"1 Second"}, {value: "2", name: "2 Seconds"}, {value: "5", name: "5 Seconds"}, {value: "15", name: "15 Seconds"}, {value: "30", name: "30 Seconds"}, {value: "60", name: "60 Seconds"}]} />
      </Section>
      
      { hasTime(props) && <Section title="Time colour">
        <ColorSelect settingsKey="timeColour" colors={colourSet}/>
      </Section> }
      
      { hasDate(props) && <Section title="Date colour">
        <ColorSelect settingsKey="dateColour" colors={colourSet} />
      </Section> }
      
      { hasActivity(props, "steps") && <Section title="Steps colour">
        <ColorSelect settingsKey="stepsColour" colors={colourSet} />
      </Section> }
      
      { hasActivity(props, "distance") && <Section title="Distance colour">
        <ColorSelect settingsKey="distanceColour" colors={colourSet} />
      </Section> }
       
      { hasActivity(props, "elevationGain") && <Section title="Floors colour">
        <ColorSelect settingsKey="elevationGainColour" colors={colourSet} />
      </Section> }
       
      { hasActivity(props, "calories") && <Section title="Calories colour">
        <ColorSelect settingsKey="caloriesColour" colors={colourSet} />
      </Section> }
      
      { hasActivity(props, "activeMinutes") && <Section title="Active Zone Minutes colour">
        <ColorSelect settingsKey="activeMinutesColour" colors={colourSet} />
      </Section> }
      
      { hasHeartRate(props) && <Section title="Heart colour">
        <ColorSelect settingsKey="heartColour" colors={colourSet} />
      </Section> }
      
      { hasHeartRate(props) && <Section title="Heart rate colour">
        <ColorSelect settingsKey="heartRateColour" colors={colourSet} />
      </Section> }
      
      { hasActivity(props, "BMIBMR") && <Section title="BMI/BMR colour">
        <ColorSelect settingsKey="bmColour" colors={colourSet} />
      </Section> }
      
      { hasStat(props) && <Section title="Progress background colour">
        <ColorSelect settingsKey="progressBackgroundColour" colors={colourSet} />
      </Section> }
      
      { hasBattery(props, false) && <Section title="Battery 0% - 25% colour">
        <ColorSelect settingsKey="battery0Colour" colors={colourSet} />
      </Section> } 
      
      { hasBattery(props, false) && <Section title="Battery 25% - 50% colour">
        <ColorSelect settingsKey="battery25Colour" colors={colourSet} />
      </Section> }
      
      { hasBattery(props, false) && <Section title="Battery 50% - 75% colour">
        <ColorSelect settingsKey="battery50Colour" colors={colourSet} />
      </Section> }  
      
      { hasBattery(props, false) && <Section title="Battery 75% - 100% colour">
        <ColorSelect settingsKey="battery75Colour" colors={colourSet} />
      </Section> }
      
      { hasBattery(props, true) && <Section title="Battery bar background colour">
        <ColorSelect settingsKey="batteryBackgroundColour" colors={colourSet} />
      </Section> }
      
      <Section title="Background colour">
        <ColorSelect settingsKey="backgroundColour" colors={colourSet} />
      </Section>         
    </Page>    
  );
}

try
{ 
  registerSettingsPage(mySettings);
} catch(e) { 
  console.log(`Error on settings: ${e}`); 
}

