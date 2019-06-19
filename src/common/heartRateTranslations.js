let heartRates = {
  'en': {'out-of-range':'Regular','fat-burn':'Fat Burn','cardio':'Cardio','peak':'Peak','below-custom':'Low','custom':'OK','above-custom':'High'},
  'fr': {'out-of-range':'Ordinaire','fat-burn':'Bruler les graisses','cardio':'Cardio','peak':'De pointe','below-custom':'Faible','custom':'D\'accord','above-custom':'Haut'},
  'it': {'out-of-range':'Regolare','fat-burn':'Bruciare grassi','cardio':'Cardio','peak':'Picco','below-custom':'Basso','custom':'Bene','above-custom':'Alto'},
  'de': {'out-of-range':'Regulär','fat-burn':'Fettverbrennung','cardio':'Cardio','peak':'Gipfel','below-custom':'Niedrig','custom':'In Ordnung','above-custom':'Hoch'},
  'es': {'out-of-range':'Regular','fat-burn':'Quemar grasa','cardio':'Cardio','peak':'Pico','below-custom':'Bajo','custom':'Bueno','above-custom':'Alto'},
  'ja': {'out-of-range':'定期的','fat-burn':'脂肪燃焼','cardio':'カーディオ','peak':'ピーク','below-custom':'低い','custom':'승인','above-custom':'高い'},
  'ko': {'out-of-range':'정규병','fat-burn':'지방 연소','cardio':'심장병','peak':'피크','below-custom':'낮은','custom':'승인','above-custom':'높은'},
  'chs': {'out-of-range':'定期','fat-burn':'脂肪燃烧','cardio':'有氧运动','peak':'峰','below-custom':'低','custom':'好','above-custom':'杲'},
  'cht': {'out-of-range':'定期','fat-burn':'脂肪燃燒','cardio':'有氧運動','peak':'峰','below-custom':'低','custom':'好','above-custom':'杲'},
  'nl': {'out-of-range':'Regelmatig','fat-burn':'Vetverbranding','cardio':'Cardio','peak':'Top','below-custom':'Laag','custom':'OK','above-custom':'Hoog'},
  'sv': {'out-of-range':'Regelbunden','fat-burn':'Fettförbränning','cardio':'Cardio','peak':'Topp','below-custom':'Låg','custom':'OK','above-custom':'Hög'}
}

export function getHeartRateZone(language, zone) {
  return heartRates[language][zone];  
}