let weekdays = {
  'en': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'fr': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'it': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'de': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'es': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'ja': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'ko': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'chs': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  'cht': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
}

export function getWeekdayName(language, number) {
  return weekdays[language][number];  
}