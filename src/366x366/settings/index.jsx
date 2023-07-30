function hasActivity(props, activity) {
  try {
    let statsTL = getStatValue(props, "TL");
    let statsBL = getStatValue(props, "BL");
    let statsTM = getStatValue(props, "TM");
    let statsMM = getStatValue(props, "MM");
    let statsBM = getStatValue(props, "BM");
    let statsTR = getStatValue(props, "TR");
    let statsBR = getStatValue(props, "BR");

    //console.log(`statsTL: ${statsTL}`);
    //console.log(`statsBL: ${statsBL}`);
    //console.log(`statsTM: ${statsTM}`);
    //console.log(`statsMM: ${statsMM}`);
    //console.log(`statsBM: ${statsBM}`);
    //console.log(`statsTR: ${statsTR}`);
    //console.log(`statsBR: ${statsBR}`);
    //console.log(`activity: ${activity}`);

    return statsTL === activity || statsBL === activity || statsTM === activity || statsMM === activity || statsBM === activity || statsTR === activity || statsBR === activity;
  } catch (e) {
    console.error(e.message);
    return true;
  }
}

function hasProgressStat(props) {
  try {
    let statsTL = getStatValue(props, "TL");
    let statsBL = getStatValue(props, "BL");
    let statsTM = getStatValue(props, "TM");
    let statsMM = getStatValue(props, "MM");
    let statsBM = getStatValue(props, "BM");
    let statsTR = getStatValue(props, "TR");
    let statsBR = getStatValue(props, "BR");

    //console.log(`statsTL: ${statsTL}`);
    //console.log(`statsBL: ${statsBL}`);
    //console.log(`statsTM: ${statsTM}`);
    //console.log(`statsMM: ${statsMM}`);
    //console.log(`statsBM: ${statsBM}`);
    //console.log(`statsTR: ${statsTR}`);
    //console.log(`statsBR: ${statsBR}`);

    let progressStats = ["steps", "distance", "elevationGain", "calories", "activeMinutes", "activeMinutesWeek", "BATTERY"];

    return progressStats.includes(statsTL) || progressStats.includes(statsBL) || progressStats.includes(statsTM) || progressStats.includes(statsMM) || progressStats.includes(statsBM) || progressStats.includes(statsTR) || progressStats.includes(statsBR);
  } catch (e) {
    console.error(e.message);
    return true;
  }
}

function getStatValue(props, position) {
  try {
    var setting = props.settingsStorage.getItem(`Stats${position}`);
    if (!setting) {
      //console.log(`No setting for stat ${position}`);
      return "NONE";
    }
    return JSON.parse(setting).values[0].value;
  } catch (e) {
    console.error(e.message);
    return "NONE";
  }
}

function getSetting(props, key, defaultValue) {
  try {
    var setting = props.settingsStorage.getItem(key);
    if (!setting) {
      //console.log(`No setting for ${key}`);
      return defaultValue;
    }
    return JSON.parse(setting);
  } catch (e) {
    console.error(e.message);
    return defaultValue;
  }
}

function hasBatteryIcon(props) {
  return getSetting(props, "showBatteryPercent", true);
}

function hasBatteryBar(props) {
  return getSetting(props, "showBatteryBar", true);
}

function hasHeartRate(props) {
  return getSetting(props, "showHeartRate", true);
}

function hasDate(props) {
  return getSetting(props, "showDate", true);
}

function hasTime(props) {
  return getSetting(props, "showTime", true);
}

function hasPhoneStatus(props) {
  return getSetting(props, "showPhoneStatus", true);
}

function mySettings(props) {
  let colourSet = [
    { color: "mediumvioletred" },
    { color: "deeppink" },
    { color: "hotpink" },
    { color: "pink" },
    { color: "lightcoral" },
    { color: "salmon" },

    { color: "red" },
    { color: "crimson" },
    { color: "tomato" },
    { color: "orangered" },
    { color: "darkorange" },
    { color: "orange" },

    { color: "gold" },
    { color: "yellow" },
    { color: "tan" },
    { color: "peru" },
    { color: "saddlebrown" },
    { color: "maroon" },

    { color: "green" },
    { color: "mediumseagreen" },
    { color: "lime" },
    { color: "lightgreen" },
    { color: "turquoise" },
    { color: "teal" },

    { color: "cyan" },
    { color: "blue" },
    { color: "deepskyblue" },
    { color: "lightskyblue" },
    { color: "cornflowerblue" },
    { color: "darkblue" },

    { color: "powderblue" },
    { color: "mediumslateblue" },
    { color: "violet" },
    { color: "magenta" },
    { color: "darkviolet" },
    { color: "purple" },

    { color: "lavender" },
    { color: "beige" },
    { color: "mistyrose" },
    { color: "honeydew" },
    { color: "azure" },
    { color: "lightyellow" },

    { color: "white" },
    { color: "lightgray" },
    { color: "darkgray" },
    { color: "gray" },
    { color: "dimgray" },
    { color: "black" },
  ];

  let timeFormats = [
    { value: "auto", name: "Automatic (Use Fitbit Setting)" },
    { value: "12h", name: "12 hour" },
    { value: "24h", name: "24 hour" },
  ];

  let dateFormats = [
    { value: "dd.mm.yy", name: "dd.mm.yy" },
    { value: "dd mmm yy", name: "dd mmm yy" },
    { value: "dd mmmm yy", name: "dd mmmm yy" },
    { value: "dd/mm/yy", name: "dd/mm/yy" },
    { value: "mm/dd/yy", name: "mm/dd/yy" },
    { value: "mm.dd.yy", name: "mm.dd.yy" },
    { value: "mmm dd yy", name: "mmm dd yy" },
    { value: "mmmm dd yy", name: "mmmm dd yy" },
    { value: "yy/mm/dd", name: "yy/mm/dd" },
    { value: "dd.mm.yyyy", name: "dd.mm.yyyy" },
    { value: "dd mmm yyyy", name: "dd mmm yyyy" },
    { value: "dd mmmm yyyy", name: "dd mmmm yyyy" },
    { value: "dd/mm/yyyy", name: "dd/mm/yyyy" },
    { value: "mm/dd/yyyy", name: "mm/dd/yyyy" },
    { value: "mm.dd.yyyy", name: "mm.dd.yyyy" },
    { value: "mmm dd yyyy", name: "mmm dd yyyy" },
    { value: "mmmm dd yyyy", name: "mmmm dd yyyy" },
    { value: "yyyy/mm/dd", name: "yyyy/mm/dd" },
    { value: "mmm dd, yyyy", name: "mmm dd, yyyy" },
    { value: "mmmm dd, yyyy", name: "mmmm dd, yyyy" },
  ];

  let availableStats = [
    { value: "NONE", name: "Empty" },
    { value: "BMIBMR", name: "BMI & BMR" },
    { value: "BMI", name: "BMI" },
    { value: "BMR", name: "BMR" },
    { value: "steps", name: "Steps" },
    { value: "distance", name: "Distance" },
    { value: "elevationGain", name: "Floors" },
    { value: "calories", name: "Calories" },
    { value: "activeMinutes", name: "Active Zone Minutes" },
    { value: "activeMinutesWeek", name: "Weekly Active Zone Minutes" },
    { value: "BATTERY", name: "Battery" },
    { value: "WEATHER", name: "Weather" },
  ];

  let availableStatsBottomMiddleOnly = [
    { value: "NONE", name: "Empty" },
    { value: "BMIBMR", name: "BMI & BMR" },
    { value: "BMI", name: "BMI" },
    { value: "BMR", name: "BMR" },
    { value: "steps", name: "Steps" },
    { value: "distance", name: "Distance" },
    { value: "elevationGain", name: "Floors" },
    { value: "calories", name: "Calories" },
    { value: "activeMinutes", name: "Active Zone Minutes" },
    { value: "activeMinutesWeek", name: "Weekly Active Zone Minutes" },
    { value: "BATTERY", name: "Battery" },
    { value: "WEATHER", name: "Weather" },
    { value: "WEATHER-LOCATION", name: "Weather Location" },
  ];

  let progressBarsFormat = [
    { value: "none", name: "None" },
    { value: "bars", name: "Bars" },
    { value: "arc", name: "Arc" },
    { value: "ring", name: "Ring" },
  ];

  let distanceUnits = [
    { value: "auto", name: "Automatic (Use Fitbit Setting)" },
    { value: "m", name: "meters" },
    { value: "km", name: "kilometers" },
    { value: "ft", name: "feet" },
    { value: "mi", name: "miles" },
  ];

  let weatherRefresh = [
    { value: "600000", name: "10 minutes" },
    { value: "900000", name: "15 minutes" },
    { value: "1800000", name: "30 minutes" },
    { value: "3600000", name: "60 minutes" },
  ];

  let temperatureUnits = [
    { value: "auto", name: "Automatic (Use Fitbit Setting)" },
    { value: "C", name: "Celcius" },
    { value: "F", name: "Fahrenheit" },
  ];

  let torchAutoOff = [
    { value: "-1", name: "Never" },
    { value: "1", name: "1 Second" },
    { value: "2", name: "2 Seconds" },
    { value: "5", name: "5 Seconds" },
    { value: "15", name: "15 Seconds" },
    { value: "30", name: "30 Seconds" },
    { value: "60", name: "60 Seconds" },
  ];

  return (
    <Page>
      <Section title="Clock">
        <Toggle settingsKey="showTime" label="Show Time" />
        {hasTime(props) && <Toggle settingsKey="isAmPm" label="AM/PM Indication On 12hr Clock" />}
        {hasTime(props) && <Toggle settingsKey="showSeconds" label="Show Seconds Value" />}
        {hasTime(props) && <Toggle settingsKey="showLeadingZero" label="Show Leading Zero On Hours" />}
        {hasTime(props) && <Toggle settingsKey="flashDots" label="Flash : In Time" />}
        {hasTime(props) && <Select label="Time Format" settingsKey="timeFormat" options={timeFormats} />}
      </Section>

      <Section title="Date">
        <Toggle settingsKey="showDate" label="Show Date" />
        {hasDate(props) && <Toggle settingsKey="showDay" label="Show Day" />}
        {hasDate(props) && <Select label="Date Format" settingsKey="dateFormat" options={dateFormats} />}
      </Section>

      <Section title="Battery">
        <Toggle settingsKey="showBatteryPercent" label="Show Battery Percentage" />
        <Toggle settingsKey="showBatteryBar" label="Show Battery Bar" />
      </Section>

      <Section title="Heart Rate">
        <Toggle settingsKey="showHeartRate" label="Show Heart Rate" />
        {hasHeartRate(props) && <Toggle settingsKey="isHeartbeatAnimation" label="Heartbeat Animation" />}
        {hasHeartRate(props) && <Toggle settingsKey="heartRateZoneVis" label="Show Heart Rate Zone" />}
      </Section>

      <Section title="Connection">
        <Toggle settingsKey="showPhoneStatus" label="Show phone connection status" />
        <Toggle settingsKey="showMsgQSize" label="Show MsgQ size (Debug)" />
      </Section>

      <Section title="Stats">
        <Select label="Top Left" settingsKey="StatsTL" options={availableStats} />
        <Select label="Bottom Left" settingsKey="StatsBL" options={availableStats} />
        <Select label="Top Middle" settingsKey="StatsTM" options={availableStats} />
        <Select label="Middle Middle" settingsKey="StatsMM" options={availableStats} />
        <Select label="Bottom Middle" settingsKey="StatsBM" options={availableStatsBottomMiddleOnly} />
        <Select label="Top Right" settingsKey="StatsTR" options={availableStats} />
        <Select label="Bottom Right" settingsKey="StatsBR" options={availableStats} />
      </Section>

      {hasProgressStat(props) && (
        <Section title="Stats Progress">
          <Select label="Progress Bars" settingsKey="progressBars" options={progressBarsFormat} />
        </Section>
      )}

      {hasActivity(props, "distance") && (
        <Section title="Distance">
          <Select label="Distance Unit" settingsKey="distanceUnit" options={distanceUnits} />
        </Section>
      )}

      {(hasActivity(props, "WEATHER") || hasActivity(props, "WEATHER-LOCATION")) && (
        <Section title="Weather">
          <Select label="Refresh Interval" settingsKey="weatherRefreshInterval" options={weatherRefresh} />
          {hasActivity(props, "WEATHER") && <Select label="Temperature Unit" settingsKey="weatherTemperatureUnit" options={temperatureUnits} />}
        </Section>
      )}

      <Section title="Torch/Always On">
        <Toggle settingsKey="torchEnabled" label="Enable always on with double tap" />
        <Select settingsKey="torchAutoOff" label="Automatically off after" options={torchAutoOff} />
        <Toggle settingsKey="torchOverlay" label="Set torch when always on" />
      </Section>

      <Section title="Background Colour">
        <ColorSelect settingsKey="backgroundColour" colors={colourSet} />
      </Section>

      {hasTime(props) && (
        <Section title="Time Colour">
          <ColorSelect settingsKey="timeColour" colors={colourSet} />
        </Section>
      )}

      {hasDate(props) && (
        <Section title="Date Colour">
          <ColorSelect settingsKey="dateColour" colors={colourSet} />
        </Section>
      )}

      {hasHeartRate(props) && (
        <Section title="Heart Colour">
          <ColorSelect settingsKey="heartColour" colors={colourSet} />
        </Section>
      )}

      {hasHeartRate(props) && (
        <Section title="Heart Rate Colour">
          <ColorSelect settingsKey="heartRateColour" colors={colourSet} />
        </Section>
      )}

      {hasProgressStat(props) && (
        <Section title="Progress Background Colour">
          <ColorSelect settingsKey="progressBackgroundColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "steps") && (
        <Section title="Steps Colour">
          <ColorSelect settingsKey="stepsColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "distance") && (
        <Section title="Distance Colour">
          <ColorSelect settingsKey="distanceColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "elevationGain") && (
        <Section title="Floors Colour">
          <ColorSelect settingsKey="elevationGainColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "calories") && (
        <Section title="Calories Colour">
          <ColorSelect settingsKey="caloriesColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "activeMinutes") && (
        <Section title="Active Zone Minutes Colour">
          <ColorSelect settingsKey="activeMinutesColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "activeMinutesWeek") && (
        <Section title="Weekly Active Zone Minutes Colour">
          <ColorSelect settingsKey="activeMinutesWeekColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "BMIBMR") && (
        <Section title="BMI/BMR Colour">
          <ColorSelect settingsKey="bmColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "BMI") && (
        <Section title="BMI Colour">
          <ColorSelect settingsKey="bmiColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "BMR") && (
        <Section title="BMR Colour">
          <ColorSelect settingsKey="bmrColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "BATTERY") && (
        <Section title="Battery Stat Colour">
          <ColorSelect settingsKey="batteryStatColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "WEATHER") && (
        <Section title="Weather Colour">
          <ColorSelect settingsKey="weatherColour" colors={colourSet} />
        </Section>
      )}

      {hasActivity(props, "WEATHER-LOCATION") && (
        <Section title="Weather Location Colour">
          <ColorSelect settingsKey="weatherLocationColour" colors={colourSet} />
        </Section>
      )}

      {hasPhoneStatus(props) && (
        <Section title="Phone Connected Colour">
          <ColorSelect settingsKey="phoneStatusConnected" colors={colourSet} />
        </Section>
      )}

      {hasPhoneStatus(props) && (
        <Section title="Phone Disconnected Colour">
          <ColorSelect settingsKey="phoneStatusDisconnected" colors={colourSet} />
        </Section>
      )}

      {hasBatteryIcon(props) && (
        <Section title="Battery Icon 0% - 25% Colour">
          <ColorSelect settingsKey="batteryIcon0Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryIcon(props) && (
        <Section title="Battery Icon 25% - 50% Colour">
          <ColorSelect settingsKey="batteryIcon25Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryIcon(props) && (
        <Section title="Battery Icon 50% - 75% Colour">
          <ColorSelect settingsKey="batteryIcon50Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryIcon(props) && (
        <Section title="Battery Icon 75% - 100% Colour">
          <ColorSelect settingsKey="batteryIcon75Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryBar(props) && (
        <Section title="Battery bar background Colour">
          <ColorSelect settingsKey="batteryBackgroundColour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryBar(props) && (
        <Section title="Battery Bar 0% - 25% Colour">
          <ColorSelect settingsKey="battery0Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryBar(props) && (
        <Section title="Battery Bar 25% - 50% Colour">
          <ColorSelect settingsKey="battery25Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryBar(props) && (
        <Section title="Battery Bar 50% - 75% Colour">
          <ColorSelect settingsKey="battery50Colour" colors={colourSet} />
        </Section>
      )}

      {hasBatteryBar(props) && (
        <Section title="Battery Bar 75% - 100% Colour">
          <ColorSelect settingsKey="battery75Colour" colors={colourSet} />
        </Section>
      )}
    </Page>
  );
}

try {
  registerSettingsPage(mySettings);
} catch (e) {
  console.error(e.message);
}
