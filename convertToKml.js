var locationsImport = require('./src/features.json')
var turf = require('@turf/turf')
var tokml = require('tokml')
const fs = require('fs')

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


function isStringOneThousandFt(stringInput) {
  console.log('stringinput', stringInput)
  return (stringInput.match(/Design/gi) || stringInput.match(/Navigation/gi))
}

function splitIntoYellowAndRed(geojsonobj) {
  //console.log('splitInto', geojsonobj)
  var thousands = {
    features: [],
      type: "FeatureCollection"
  }

  var fivehundreds = {
    features: [],
    type: "FeatureCollection"
  }

  var featuresTotal =  {
    features: [],
    type: "FeatureCollection"
  }

  geojsonobj.features.forEach((eachFeature, eachFeatureIndex) => {

    if (isStringOneThousandFt(eachFeature.properties.category)) {
   
      eachFeature.properties['buffer'] = '1000'
      
      console.log()
      thousands['features'].push(eachFeature)
    } else {
      eachFeature.properties['buffer'] = '500'
      fivehundreds['features'].push(eachFeature)
    }

    featuresTotal['features'].push(eachFeature)
  })
  
  return {thousands, fivehundreds, featuresTotal}
}

var locations =  {
  features:  locationsRemoveSections,
  type: "FeatureCollection"
}

var locationsCorrected = {
    features:  [],
  type: "FeatureCollection"
}

var locationsBuffered = locations.features.map((eachFeature,eachFeatureIndex) => {
  var polygon = turf.polygon(eachFeature.geometry.coordinates);
  //console.log(polygon)

  var buffered;

 // console.log(eachFeatureIndex)
 // console.log(locations.features[eachFeatureIndex].properties.category)
  if (isStringOneThousandFt(eachFeature.properties.category)) {
    buffered = turf.buffer(polygon, 1000, { units: 'feet' });
  //  console.log('1000ft', locations.features[eachFeatureIndex].properties.address)
  } else {
  buffered = turf.buffer(polygon, 500, { units: 'feet' });
  }

  buffered.properties = eachFeature.properties;
  return buffered;
})

var geoJsonBoundary = {
  features: locationsBuffered,
  type: "FeatureCollection"
}

function geoJsonToKmlDesc(geoJson) {
  var geoJsonFeaturesImport = geoJson.features;

  var geoJsonFeaturesExport = []

  geoJsonFeaturesImport.each((item) => {
    var feature = item;

    feature.properties.name = item.properties.address
    feature.properties.description = item.properties.category
  })
}

var areaKml = tokml(locations, {
  name: 'address',
  description: 'category'
});

var bufferKml = tokml(geoJsonBoundary, {
  name: 'address',
  description: 'category'
});

var dir = './kmlexport';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

try {
  const data = fs.writeFileSync('kmlexport/area.kml', areaKml)
  //file written successfully
} catch (err) {
  console.error(err)
}

try {
  const data = fs.writeFileSync('kmlexport/buffer.kml', bufferKml)
  //file written successfully
} catch (err) {
  console.error(err)
}
