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
  
  return (
    <Page> 
      <Section title="Localisation">
        <Select label="Language" settingsKey="language" options={[ {value:"en", name:"English"} ]} />     
        <Select label="Distance Unit" settingsKey="distanceUnit" options={[ {value:"m", name:"meters"}, {value:"km", name:"kilometers"}, {value:"ft", name:"feet"}, {value:"mi", name:"miles"} ]} />
        <Select label="Date Format" settingsKey="dateFormat" options={[ {value:"dd.mm.yy", name:"dd.mm.yy"}, {value:"dd mmm yy", name:"dd mmm yy"}, {value:"dd mmmm yy", name:"dd mmmm yy"}, {value:"dd/mm/yy", name:"dd/mm/yy"}, {value:"mm.dd.yy", name:"mm.dd.yy"}, {value:"mmm dd yy", name:"mmm dd yy"}, {value:"mmmm dd yy", name:"mmmm dd yy"} ]} />
      </Section>
      
      <Section title="Heart Rate">
        <Toggle settingsKey="isHeartbeatAnimation" label="Heartbeat animation" />    
        <Toggle settingsKey="hearRateZoneVis" label="Heart rate zone Visibility" />
      </Section>
      
      <Section title="Clock">
        <Toggle settingsKey="isAmPm" label="AM/PM indication on 12-hour clock" />      
        <Toggle settingsKey="showSeconds" label="Show seconds value" />
        <Toggle settingsKey="showLeadingZero" label="Show leading zero on hours" />
      </Section>       
      
      <Section title="BMR/BMI">
        <Toggle settingsKey="BMRVis" label="BMR Visibility" />
        <Toggle settingsKey="BMIVis" label="BMI Visibility" />
      </Section>
      
      <Section title="Time colour">
        <ColorSelect settingsKey="timeColour" colors={colourSet} />
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