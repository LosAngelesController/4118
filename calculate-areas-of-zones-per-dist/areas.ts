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


  console.log()

  const dissolved = turf.dissolve(
    turf.featureCollection(
   bansBuffered.filter((eachItem:any) => eachItem.geometry.type === "Polygon")
  ));


  console.log(dissolved)
council.features.forEach((feature:any) => {

    var total = 0;

    var councilturf = turf.multiPolygon(feature.geometry.coordinates);

    console.log(dissolved)

    dissolved.features.forEach((eachpark:any) => {

        const parkPoly =  turf.multiPolygon(eachpark.geometry.coordinates);

        var intersect = turf.intersect(councilturf, parkPoly);



           if (intersect != null) {
            total = total + turf.area(intersect);
   
        }

    })

//    console.log('Total area of 4118 in ' + feature.properties.district + ' is ' + total);
  //  console.log(feature.properties.district + " land area is " + turf.area(turf.multiPolygon(feature.geometry.coordinates)))


    console.log(feature.properties.district + ":" + total + ":" + turf.area(councilturf));
})