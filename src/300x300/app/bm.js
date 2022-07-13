import document from "document";
import { user } from "user-profile";
import { gettext } from "i18n";

//BM - START
export let bmEl = document.getElementById("bm");
export let bmrZoneEl = document.getElementById("bmr-zone");
export let bmiZoneEl = document.getElementById("bmi-zone");
export let bmrEl = document.getElementById("bmr");
export let bmiEl = document.getElementById("bmi");
export let bmrCountEl = document.getElementById("bmr-count");
export let bmiCountEl = document.getElementById("bmi-count");
export let bmrIconEl = document.getElementById("bmr-icon");
export let bmiIconEl = document.getElementById("bmi-icon");
export let bmPosition = "NONE";
export let bmiPosition = "NONE";
export let bmrPosition = "NONE";

export function setBMPosition(pos){
  bmPosition = pos;
}

export function setBMIPosition(pos){
  bmiPosition = pos;
}

export function setBMRPosition(pos){
  bmrPosition = pos;
}
//BM - END

//BM Draw - START
export function drawBMR() {
  let bmrLabel = gettext("bmr");
  bmrZoneEl.text = `${bmrLabel}: ${user.bmr}`;
  bmrCountEl.text = `${user.bmr}`;
}

export function drawBMI() {
  let bmiLabel = gettext("bmi");
  var bmi = (user.weight/(user.height*user.height)).toFixed(2);
  bmiZoneEl.text = `${bmiLabel}: ${bmi}`;
  bmiCountEl.text = `${bmi}`;
}

drawBMR();
drawBMI();
//BM Draw - END
