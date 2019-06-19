let bmi = {
  'en': 'BMI',
  'fr': 'IMC',
  'it': 'BMI',
  'de': 'BMI',
  'es': 'IMC',
  'ja': 'BMI',
  'ko': 'BMI',
  'chs': 'BMI',
  'cht': 'BMI'
}

let bmr = {
  'en': 'BMR',
  'fr': 'BMR',
  'it': 'BMR',
  'de': 'BMR',
  'es': 'BMR',
  'ja': 'BMR',
  'ko': 'BMR',
  'chs': 'BMR',
  'cht': 'BMR'
}

export function getBMI(language) {
  return bmi[language];  
}

export function getBMR(language) {
  return bmr[language];  
}