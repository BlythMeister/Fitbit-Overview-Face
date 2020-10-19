import document from "document"; 
import { user } from "user-profile";
import { gettext } from "i18n";

//BM - START
export let bmEl = document.getElementById("bm");
export let bmrZoneEl = document.getElementById("bmr-zone");
export let bmiZoneEl = document.getElementById("bmi-zone");
export let position = "NONE";

export function setPosition(pos){
  position = pos;
}
//BM - END

//BM Draw - START
export function drawBMR() {
  let bmrLabel = gettext("bmr");
  bmrZoneEl.text = `${bmrLabel}: ${user.bmr}`;
}

export function drawBMI() {
  let bmiLabel = gettext("bmi");
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
