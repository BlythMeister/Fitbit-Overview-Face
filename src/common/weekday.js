let weekdays = {
  'en': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
}

export function getWeekdayName(language, number) {
  return weekdays[language][number];  
}