let monthsShort = {
  'en': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
}

let monthsLong = {
  'en': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December']
}

export function getMonthAbrv(language, number) {
  return monthsShort[language][number];  
}

export function getMonthName(language, number) {
  return monthsLong[language][number];  
}