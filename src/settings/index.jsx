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
      
  let availiableStats = [ {value:"NONE", name:"Empty"}, 
                          {value:"BMIBMR", name:"BMR/BMI"}, {value:"steps", name:"Steps"}, {value:"distance", name:"Distance"},
                          {value:"elevationGain", name:"Floors"}, {value:"calories", name:"Calories"}, {value:"activeMinutes", name:"Active Minutes"}]
      
  return (
    <Page> 
      <Section title="Localisation">   
        <Select label="Distance Unit" settingsKey="distanceUnit" options={[ {value:"auto", name:"Automatic (Use Fitbit Setting)"}, {value:"m", name:"meters"}, {value:"km", name:"kilometers"}, {value:"ft", name:"feet"}, {value:"mi", name:"miles"} ]} />
        <Select label="Date Format" settingsKey="dateFormat" options={[ {value:"dd.mm.yy", name:"dd.mm.yy"}, {value:"dd mmm yy", name:"dd mmm yy"}, {value:"dd mmmm yy", name:"dd mmmm yy"}, {value:"dd/mm/yy", name:"dd/mm/yy"}, {value:"mm/dd/yy", name:"mm/dd/yy"}, {value:"mm.dd.yy", name:"mm.dd.yy"}, {value:"mmm dd yy", name:"mmm dd yy"}, {value:"mmmm dd yy", name:"mmmm dd yy"}, {value:"yy/mm/dd", name:"yy/mm/dd"}, {value:"dd.mm.yyyy", name:"dd.mm.yyyy"}, {value:"dd mmm yyyy", name:"dd mmm yyyy"}, {value:"dd mmmm yyyy", name:"dd mmmm yyyy"}, {value:"dd/mm/yyyy", name:"dd/mm/yyyy"}, {value:"mm/dd/yyyy", name:"mm/dd/yyyy"}, {value:"mm.dd.yyyy", name:"mm.dd.yyyy"}, {value:"mmm dd yyyy", name:"mmm dd yyyy"}, {value:"mmmm dd yyyy", name:"mmmm dd yyyy"}, {value:"yyyy/mm/dd", name:"yyyy/mm/dd"} ]} />
        <Select label="Time Format" settingsKey="timeFormat" options={[ {value:"auto", name:"Automatic (Use Fitbit Setting)"}, {value:"12h", name:"12 hour"}, {value:"24h", name:"24 hour"} ]} />
      </Section>
      
      <Section title="Heart Rate">
        <Toggle settingsKey="isHeartbeatAnimation" label="Heartbeat animation" />    
        <Toggle settingsKey="heartRateZoneVis" label="Heart rate zone Visibility" />
      </Section>
      
      <Section title="Clock">
        <Toggle settingsKey="isAmPm" label="AM/PM indication on 12-hour clock" />      
        <Toggle settingsKey="showSeconds" label="Show seconds value" />
        <Toggle settingsKey="showLeadingZero" label="Show leading zero on hours" />
        <Toggle settingsKey="flashDots" label="Flash the : in time" />
      </Section>   
            
      <Section title="Stats">
        <Select label="Top Left" settingsKey="StatsTL" options={availiableStats} />
        <Select label="Bottom Left" settingsKey="StatsBL" options={availiableStats} />
        <Select label="Top Middle" settingsKey="StatsTM" options={availiableStats} />
        <Select label="Bottom Middle" settingsKey="StatsBM" options={availiableStats} />
        <Select label="Top Right" settingsKey="StatsTR" options={availiableStats} />
        <Select label="Bottom Right" settingsKey="StatsBR" options={availiableStats} />
      </Section>
      
      <Section title="BMR/BMI">
        <Toggle settingsKey="BMRVis" label="Show BMR" />
        <Toggle settingsKey="BMIVis" label="Show BMI" />
      </Section>
      
      <Section title="Stats Progress">
        <Toggle settingsKey="showStatsProgress" label="Show progress bars" />
      </Section>
      
      <Section title="Battery">
        <Toggle settingsKey="showBatteryPercent" label="Show battery percentage" />
        <Toggle settingsKey="showBatteryBar" label="Show battery bar" />
      </Section>
      
      <Section title="Torch">
        <Toggle settingsKey="torchEnabled" label="Enable on torch on double tap" />
      </Section>
      
      <Section title="Fonts">
        <Select label="Heart Rate Font" settingsKey="heartRateFont" options={[{value:"SYS", name: "System" }, {value:"COL", name:"Colfax"}, {value: "SEV", name: "Seville"}, {value: "SEVC", name: "Seville Condensed"}, {value: "SEVS", name: "Seville Sharp"}]} />
        <Select label="Date Font" settingsKey="dateFont" options={[{value:"SYS", name: "System" }, {value:"COL", name:"Colfax"}, {value: "SEV", name: "Seville"}, {value: "SEVC", name: "Seville Condensed"}, {value: "SEVS", name: "Seville Sharp"}]} />
        <Select label="Clock Font" settingsKey="clockFont" options={[{value:"SYS", name: "System" }, {value:"COL", name:"Colfax"}, {value: "SEV", name: "Seville"}, {value: "SEVC", name: "Seville Condensed"}, {value: "SEVS", name: "Seville Sharp"}, {value: "FAB", name: "Fabrikat"}]} />
        <Select label="Stats Font" settingsKey="statsFont" options={[{value:"SYS", name: "System" }, {value:"COL", name:"Colfax"}, {value: "SEV", name: "Seville"}, {value: "SEVC", name: "Seville Condensed"}, {value: "SEVS", name: "Seville Sharp"}]} />
        <Select label="Battery Font" settingsKey="batteryFont" options={[{value:"SYS", name: "System" }, {value:"COL", name:"Colfax"}, {value: "SEV", name: "Seville"}, {value: "SEVC", name: "Seville Condensed"}, {value: "SEVS", name: "Seville Sharp"}]} />
      </Section>
      
      <Section title="Time colour">
        <ColorSelect settingsKey="timeColour" colors={colourSet}/>
      </Section>
      
      <Section title="Date colour">
        <ColorSelect settingsKey="dateColour" colors={colourSet} />
      </Section>
      
      <Section title="Steps colour">
        <ColorSelect settingsKey="stepsColour" colors={colourSet} />
      </Section>
      
      <Section title="Distance colour">
        <ColorSelect settingsKey="distanceColour" colors={colourSet} />
      </Section>
       
      <Section title="Elevation colour">
        <ColorSelect settingsKey="elevationGainColour" colors={colourSet} />
      </Section>
       
      <Section title="Calories colour">
        <ColorSelect settingsKey="caloriesColour" colors={colourSet} />
      </Section>
      
      <Section title="Active Minutes colour">
        <ColorSelect settingsKey="activeMinutesColour" colors={colourSet} />
      </Section>
      
      <Section title="Heart colour">
        <ColorSelect settingsKey="heartColour" colors={colourSet} />
      </Section>
      
      <Section title="Heart rate colour">
        <ColorSelect settingsKey="heartRateColour" colors={colourSet} />
      </Section>
      
      <Section title="BMI/BMR colour">
        <ColorSelect settingsKey="bmColour" colors={colourSet} />
      </Section>
      
      <Section title="Progress background colour">
        <ColorSelect settingsKey="progressBackgroundColour" colors={colourSet} />
      </Section>  
      
      <Section title="Battery 0% - 25% colour">
        <ColorSelect settingsKey="battery0Colour" colors={colourSet} />
      </Section>  
      
      <Section title="Battery 25% - 50% colour">
        <ColorSelect settingsKey="battery25Colour" colors={colourSet} />
      </Section>  
      
      <Section title="Battery 50% - 75% colour">
        <ColorSelect settingsKey="battery50Colour" colors={colourSet} />
      </Section>  
      
      <Section title="Battery 75% - 100% colour">
        <ColorSelect settingsKey="battery75Colour" colors={colourSet} />
      </Section>  
      
      <Section title="Battery bar background colour">
        <ColorSelect settingsKey="batteryBackgroundColour" colors={colourSet} />
      </Section> 
      
      <Section title="Background colour">
        <ColorSelect settingsKey="backgroundColour" colors={colourSet} />
      </Section>         
    </Page>    
  );
}

registerSettingsPage(mySettings);