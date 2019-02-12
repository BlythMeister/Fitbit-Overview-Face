let monthsShort = {
  'en': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'fr': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'it': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'de': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'es': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'ja': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'ko': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'chs': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
  'cht': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
}

let monthsLong = {
  'en': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'fr': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'it': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'de': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'es': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'ja': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'ko': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'chs': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'],
  'cht': ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December']
}

export function getMonthAbrv(language, number) {
  return monthsShort[language][number];  
}

export function getMonthName(language, number) {
  return monthsLong[language][number];  
}