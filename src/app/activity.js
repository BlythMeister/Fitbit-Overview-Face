import document from "document";
import { goals } from "user-activity";
import { today } from "user-activity";

//Progress - START
export let root = document.getElementById('root')
export const screenWidth = root.width
export var distanceUnit = "m";
export function distanceUnitSet(val) { distanceUnit = val; drawAllProgress(); }
export function getProgressEl(prefix) {  
  let containerEl = document.getElementById(prefix);
  return {
    prefix: prefix,
    prevProgressVal: null,
    container: containerEl,
    count: containerEl.getElementById(prefix + "-count"),
    icon: containerEl.getElementById(prefix + "-icon"),
    line: containerEl.getElementById(prefix + "-line"),
    lineBack: containerEl.getElementById(prefix + "-line-back")
  }
}

export let goalTypes = [
  "steps",
  "distance",
  "elevationGain",
  "calories",
  "activeMinutes"
];

export let progressEls = [];

for (var i=0; i < goalTypes.length; i++) {
  var goalType = goalTypes[i];
  progressEls.push(getProgressEl(goalType)); 
}  
//Progress - END


//Progress Draw - START
export function drawProgress(progressEl) {
  let prefix = progressEl.prefix;
  
  let actual = (today.local[prefix] || 0);
  if (progressEl.prevProgressVal == actual) {
    return;
  }  
  progressEl.prevProgressVal = actual;
  
  var displayValue = actual;
  if (prefix === "distance" && actual) {    
    if (distanceUnit === "km") {
      displayValue = (actual / 1000.).toFixed(2);
    } else if (distanceUnit === "ft") {
      displayValue = Math.round(actual * 3.2808); 
    } else if (distanceUnit === "mi") {
      displayValue = (actual / 1609.344).toFixed(2);
    }
    else {
      displayValue = Math.round(actual);
    }
  }  
  progressEl.count.text = `${displayValue}`;
  
  var goal = (goals[prefix] || 0);
  var maxLine = screenWidth /100 * 28;
  if(goal > 0) {    
    var complete = (actual / goal);
    if (complete > 1) complete = 1;
    progressEl.line.width = maxLine*complete;
  }
  else
  {
      progressEl.line.width = maxLine;
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