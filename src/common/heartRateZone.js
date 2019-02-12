let heartRates = {
  'en': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'fr': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'it': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'de': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'es': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'ja': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'ko': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'chs': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'},
  'cht': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'}
}

export function getHeartRateZone(language, zone) {
  return heartRates[language][zone];  
}