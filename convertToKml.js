var locationsImport = require('./features.json')

var locationsRemoveSections = locationsImport.features.filter((location) => {
  if (location.properties.section) {
    if ([16, 17, 18, 19].includes(location.properties.section)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
})

var locations =  {
  features:  locationsRemoveSections,
  type: "FeatureCollection"
}

var locationsCorrected = {
    features:  [],
  type: "FeatureCollection"
}
