let monthsShort = {
  'en': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  'fr': ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],
  'it': ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'],
  'de': ['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
  'es': ['ene.','feb.','mar.','abr.','may.','jun.','jul.','ago.','sep.','oct.','nov.','dic.'],
  'ja': ['1','2','3','4','5','6','7','8','9','10','11','12'],
  'ko': ['1','2','3','4','5','6','7','8','9','10','11','12'],
  'chs': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  'cht': ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  'nl': ['jan','feb','mrt','apr','mei','juni','juli','aug','sept','okt','nov','dec'],
  'sv': ['jan','febr','mars','april','maj','juni','juli','aug','sept','okt','nov','dec']
}

let monthsLong = {
  'en': ['January','February','March','April','May','June','July','August','September','October','November','December'],
  'fr': ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
  'it': ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
  'de': ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  'es': ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  'ja': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  'ko': ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  'chs': ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  'cht': ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  'nl': ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
  'sv': ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december']
}

let weekdays = {
  'en': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'fr': ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
  'it': ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'],
  'de': ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
  'es': ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
  'ja': ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
  'ko': ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  'chs': ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
  'cht': ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
  'nl': ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],
  'sv': ['söndag','måndag','tisdag','onsdag','torsdag','fredag','lördag']
}

export function getMonthAbrv(language, number) {
  return monthsShort[language][number];  
}

export function getMonthName(language, number) {
  return monthsLong[language][number];  
}

export function getWeekdayName(language, number) {
  return weekdays[language][number];  
}