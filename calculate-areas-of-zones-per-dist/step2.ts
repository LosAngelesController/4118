const bans = require('./dissolved-4118-buffered-08-07.json');
const council = require('./CouncilDistricts.json');
import * as turf from '@turf/turf'

council.features.forEach((feature:any) => {

    var total = 0;

    var councilturf = turf.multiPolygon(feature.geometry.coordinates);

    bans.features.forEach((eachzone:any) => {

        const parkPoly =  turf.multiPolygon(eachzone.geometry.coordinates);

        var intersect = turf.intersect(councilturf, parkPoly);



           if (intersect != null) {
            total = total + turf.area(intersect);
   
        }

    })

//    console.log('Total area of 4118 in ' + feature.properties.district + ' is ' + total);
  //  console.log(feature.properties.district + " land area is " + turf.area(turf.multiPolygon(feature.geometry.coordinates)))


    console.log(feature.properties.district + ":" + total + ":" + turf.area(councilturf));
})