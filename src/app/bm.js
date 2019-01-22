import document from "document"; 
import { user } from "user-profile";

//BM - START
export let bmrZoneEl = document.getElementById("bmr-zone");
export let bmiZoneEl = document.getElementById("bmi-zone");
//BM - END
  
//BM Draw - START
export function drawBMR() {
  bmrZoneEl.text = `BMR: ${user.bmr}`;
}

export function drawBMI() {
  var bmi = (user.weight/(user.height*user.height)).toFixed(2);
  bmiZoneEl.text = `BMI: ${bmi}`;
}

export function setBMIVis(visibility) {
  bmiZoneEl.style.display = (!visibility ? "none" : "inline");
}

export function setBMRVis(visibility) {
  bmrZoneEl.style.display = (!visibility ? "none" : "inline")
}

drawBMR();
drawBMI();
//BM Draw - END
