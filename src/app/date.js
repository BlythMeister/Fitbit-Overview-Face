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

  switch(dateFormat) {
    case "dd.mm.yy":
      return zeroPad(day) + "." + zeroPad(monthIndex) + "." + year;
    case "dd/mm/yy":
      return zeroPad(day) + "/" + zeroPad(monthIndex) + "/" + year;
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
    case "yyyy/mm/dd":
      return year + "/" + zeroPad(monthIndex) + "/" + + zeroPad(day);
  }  
}

export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}