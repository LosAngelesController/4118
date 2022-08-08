const bans = require('./features.json');
const council = require('./CouncilDistricts.json');

import * as turf from '@turf/turf'

function isStringOneThousandFt(stringInput: string) {
    // console.log('stringinput', stringInput)
    return (stringInput.match(/Design/gi) || stringInput.match(/Navigation/gi))
  }

  var bansBuffered = bans.features.map(feature => {

    var buffered: any;

    var polygon = turf.polygon(feature.geometry.coordinates);

    // console.log(eachFeatureIndex)
    // console.log(locations.features[eachFeatureIndex].properties.category)
    if (isStringOneThousandFt(feature.properties.category)) {
      buffered = turf.buffer(polygon, 1000, { units: 'feet' });
      //  console.log('1000ft', locations.features[eachFeatureIndex].properties.address)
    } else {
      buffered = turf.buffer(polygon, 500, { units: 'feet' });
    }

    return buffered;

  });

  var bufferedPerPolygon:any = [];




  console.log(bansBuffered.length)


  console.log(bansBuffered.filter((eachItem:any) => eachItem.geometry.type === "Polygon").length)

  console.log(bansBuffered.filter((eachItem:any) => eachItem.geometry.type === "MultiPolygon"))


// Write "Hello World" to output.txt
await Bun.write("bruh.geojson", JSON.stringify(turf.featureCollection(bansBuffered)));