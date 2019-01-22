import document from "document"; 
import * as weekday from "../common/weekday"
import * as monthname from "../common/monthname"
import * as util from "../common/utils";
//Date - START

export let dayEl = document.getElementById("day");
export let dateEl = document.getElementById("date"); 
export let dateFormat = "dd mmm yy";
export function setDateFormat(val) { dateFormat = val}

export let language = "en";
export function setLanguage(val) { 
  language = val
  drawDate(new Date());
}
//Date - END

export function drawDate(now) {
  let date = getDateInFormat(now, language);
  let dayName = weekday.getWeekdayName(language, now.getDay());

  dayEl.text = `${dayName}`;
  dateEl.text =  `${date}`;
}

export function getDateInFormat(now){
  let day = now.getDate();
  let monthName = monthname.getMonthName(language, now.getMonth());
  let monthAbrv = monthname.getMonthAbrv(language, now.getMonth());
  let monthIndex = now.getMonth() + 1;
  let year = now.getYear() % 100;  

  switch(dateFormat) {
    case "dd.mm.yy":
      return util.zeroPad(day) + "." + util.zeroPad(monthIndex) + "." + year;
    case "dd/mm/yy":
      return util.zeroPad(day) + "/" + util.zeroPad(monthIndex) + "/" + year;
    case "dd mmm yy":
      return util.zeroPad(day) + " " + monthAbrv + " " + year;
    case "dd mmmm yy":
      return util.zeroPad(day) + " " + monthName + " " + year;
    case "mm.dd.yy":
      return util.zeroPad(monthIndex) + "." + util.zeroPad(day) + "." + year;
    case "mmm dd yy":
      return monthAbrv + " " + util.zeroPad(day) + " " + year;
    case "mmmm dd yy":
      return monthName + " " + util.zeroPad(day) + " " + year;
  }  
}