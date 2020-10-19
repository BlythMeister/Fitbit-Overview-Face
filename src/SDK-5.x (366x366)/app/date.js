import document from "document"; 
import { gettext } from "i18n";
//Date - START

export let dayEl = document.getElementById("day");
export let dateEl = document.getElementById("date");
export let dateFormat = "dd mmm yy";
export function setDateFormat(val) { dateFormat = val}

//Date - END

export function drawDate(now) {
  let date = getDateInFormat(now);
  let dayName = gettext(`day-${now.getDay()}`);

  dayEl.text = `${dayName}`;
  dateEl.text =  `${date}`;
}

export function getDateInFormat(now){
  let day = now.getDate();
  let monthName = gettext(`month-long-${now.getMonth()}`);
  let monthAbrv = gettext(`month-short-${now.getMonth()}`);
  let monthIndex = now.getMonth() + 1;
  let year = now.getYear() % 100;
  let fullyear = now.getYear() + 1900;

  switch(dateFormat) {
    case "dd.mm.yy":
      return zeroPad(day) + "." + zeroPad(monthIndex) + "." + year;
    case "dd/mm/yy":
      return zeroPad(day) + "/" + zeroPad(monthIndex) + "/" + year;
    case "mm/dd/yy":
      return zeroPad(monthIndex) + "/" + zeroPad(day) + "/" + year;
    case "dd mmm yy":
      return zeroPad(day) + " " + monthAbrv + " " + year;
    case "dd mmmm yy":
      return zeroPad(day) + " " + monthName + " " + year;
    case "mm.dd.yy":
      return zeroPad(monthIndex) + "." + zeroPad(day) + "." + year;
    case "mmm dd yy":
      return monthAbrv + " " + zeroPad(day) + " " + year;
    case "mmmm dd yy":
      return monthName + " " + zeroPad(day) + " " + year;
    case "yy/mm/dd":
      return year + "/" + zeroPad(monthIndex) + "/" + + zeroPad(day);
    case "dd.mm.yyyy":
      return zeroPad(day) + "." + zeroPad(monthIndex) + "." + fullyear;
    case "dd/mm/yyyy":
      return zeroPad(day) + "/" + zeroPad(monthIndex) + "/" + fullyear;
    case "mm/dd/yyyy":
      return zeroPad(monthIndex) + "/" + zeroPad(day) + "/" + fullyear;
    case "dd mmm yyyy":
      return zeroPad(day) + " " + monthAbrv + " " + fullyear;
    case "dd mmmm yyyy":
      return zeroPad(day) + " " + monthName + " " + fullyear;
    case "mm.dd.yyyy":
      return zeroPad(monthIndex) + "." + zeroPad(day) + "." + fullyear;
    case "mmm dd yyyy":
      return monthAbrv + " " + zeroPad(day) + " " + fullyear;
    case "mmmm dd yyyy":
      return monthName + " " + zeroPad(day) + " " + fullyear;
    case "yyyy/mm/dd":
      return fullyear + "/" + zeroPad(monthIndex) + "/" + + zeroPad(day);
    case "mmm dd, yyyy":
      return monthAbrv + " " + zeroPad(day) + "," + fullyear;
    case "mmmm dd, yyyy":
      return monthName + " " + zeroPad(day) + ", " + fullyear;
  }  
}

export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}