//run in node js

//tsc process.ts --resolveJsonModule --esModuleInterop
import areas from './retainednewschoolmapparcels.json'
import dots from './new-school-map-1.json'

import * as turf from '@turf/turf'

//console.log(areas)

var areasarray = areas.features;

var dotsarray:Array<any> = dots.features;

    console.log(dotsarray)

areasarray.forEach(eachArea => {
    var coordsforpoly = turf.polygon(eachArea.geometry.coordinates[0]);
    //console.log(coordsforpoly);
    var dotforthisarray = dotsarray.find(eachDot => {
      //  console.log(eachDot)

      var turfpoint = turf.point(eachDot.geometry.coordinates);
       var answer = turf.booleanPointInPolygon(turfpoint, coordsforpoly);

       // console.log(answer);

       return answer;
    });

    console.log('found dot', dotforthisarray);
})