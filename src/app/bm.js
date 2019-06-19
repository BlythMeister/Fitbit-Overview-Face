import document from "document"; 
import { user } from "user-profile";
import * as bmTranslations from "../common/bmTranslations"

//BM - START
export let bmrZoneEl = document.getElementById("bmr-zone");
export let bmiZoneEl = document.getElementById("bmi-zone");
//BM - END

export let language = "en";
export function setLanguage(val) { 
  language = val
  drawBMR();
  drawBMI();
}

//BM Draw - START
export function drawBMR() {
  let bmrLabel = bmTranslations.getBMR(language);
  bmrZoneEl.text = `${bmrLabel}: ${user.bmr}`;
}

export function drawBMI() {
  let bmiLabel = bmTranslations.getBMI(language);
  var bmi = (user.weight/(user.height*user.height)).toFixed(2);
  bmiZoneEl.text = `${bmiLabel}: ${bmi}`;
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
