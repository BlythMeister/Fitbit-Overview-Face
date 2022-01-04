import * as document from "document";
import { goals } from "user-activity";
import { today } from "user-activity";
import { units } from "user-settings";
import { me as device } from "device";

//Progress - START
export let root = document.getElementById('root')
export const screenWidth = root.width
export var distanceUnit = "auto";
export function distanceUnitSet(val) { distanceUnit = val; drawAllProgress(); }
export function getProgressEl(prefix, officialType) {
  let containerEl = document.getElementById(prefix);
  let containerArcEl = document.getElementById(prefix + "-arc");
  let containerRingEl = document.getElementById(prefix + "-ring");
  return {
    prefix: prefix,
    type: officialType,
    prevProgressVal: null,
    container: containerEl,
    containerArc: containerArcEl,
    containerRing: containerRingEl,
    position:"NONE",
    count: containerEl.getElementById(prefix + "-count"),
    icon: containerEl.getElementById(prefix + "-icon"),
    line: containerEl.getElementById(prefix + "-line"),
    lineBack: containerEl.getElementById(prefix + "-line-back"),
    countArc: containerArcEl.getElementById(prefix + "-arc-count"),
    iconArc: containerArcEl.getElementById(prefix + "-arc-icon"),
    lineArc: containerArcEl.getElementById(prefix + "-arc-line"),
    lineBackArc: containerArcEl.getElementById(prefix + "-arc-line-back"),
    countRing: containerRingEl.getElementById(prefix + "-ring-count"),
    iconRing: containerRingEl.getElementById(prefix + "-ring-icon"),
    lineRing: containerRingEl.getElementById(prefix + "-ring-line"),
    lineBackRing: containerRingEl.getElementById(prefix + "-ring-line-back")
  }
}

export let goalTypes = [];
export let goalOfficialTypes = [];

export function pushGoalTypeIfSupported(type, officialType)
{
  if(today.adjusted[officialType] != undefined)
  {
    goalTypes.push(type);
    goalOfficialTypes.push(officialType);
  }
}

pushGoalTypeIfSupported("steps", "steps");
pushGoalTypeIfSupported("distance", "distance");
pushGoalTypeIfSupported("elevationGain", "elevationGain");
pushGoalTypeIfSupported("calories", "calories");
pushGoalTypeIfSupported("activeMinutes", "activeZoneMinutes");

export let progressEls = [];

for (var i=0; i < goalTypes.length; i++) {
  var goalType = goalTypes[i];
  var goalOfficialType = goalOfficialTypes[i];
  progressEls.push(getProgressEl(goalType, goalOfficialType));
}
//Progress - END


//Progress Draw - START
export function drawProgress(progressEl) {
  let type = progressEl.type;

  let actual = 0;
  var goal = 0;
  if(type == "activeZoneMinutes") {
    actual = today.adjusted[type].total
    goal = goals[type].total
  } else if(today.adjusted[type]) {
    actual = today.adjusted[type]
    goal = goals[type]
  }

  if (progressEl.prevProgressVal == actual) {
    return;
  }
  progressEl.prevProgressVal = actual;

  var displayValue = actual;
  if (!actual || actual < 0)
  {
      displayValue = "0";
  }
  else if (type === "distance" && actual)
  {
    if ((distanceUnit === "auto" && units.distance === "metric") || distanceUnit === "km") {
      displayValue = (actual / 1000.).toFixed(2);
    } else if ((distanceUnit === "auto" && units.distance === "us") || distanceUnit === "mi") {
      displayValue = (actual / 1609.344).toFixed(2);
    } else if (distanceUnit === "ft") {
      displayValue = Math.round(actual * 3.2808).toFixed(2);
    } else if (distanceUnit === "m") {
      displayValue = Math.round(actual);
    }
  }
  progressEl.count.text = `${displayValue}`;
  progressEl.countArc.text = `${displayValue}`;
  progressEl.countRing.text = `${displayValue}`;

  var maxLine = screenWidth /100 * 28;
  if(!goal || goal < 0 || !actual || actual < 0)
  {
    progressEl.line.width = 0;
    progressEl.lineArc.sweepAngle = 0;
    progressEl.lineRing.sweepAngle = 0;
  }
  else
  {
    var complete = (actual / goal);
    if (complete > 1) complete = 1;
    progressEl.line.width = maxLine*complete;
    progressEl.lineArc.sweepAngle = Math.floor(225*complete);
    progressEl.lineRing.sweepAngle = Math.floor(360*complete);
  }
}

export function drawAllProgress() {
  for (var i=0; i < goalTypes.length; i++) {
    drawProgress(progressEls[i]);
  }
}

export function resetProgressPrevState() {
  for (var i=0; i < goalTypes.length; i++) {
    progressEls[i].prevProgressVal = null;
  }
}

//Progress Draw - END
