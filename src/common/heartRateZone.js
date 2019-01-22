let heartRates = {
  'en': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Below Range','custom':'In Range','above-custom':'Above Range'}
}

export function getHeartRateZone(language, zone) {
  return heartRates[language][zone];  
}