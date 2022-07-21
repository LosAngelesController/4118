//import areas from './joined-fixed-crs-new-school-map-parcels.json'
import areas from './missing-daycares-like-15-of-them.json'
//import areas from './v5-daycare-retained-commerical-export.json'

// proper case function (JScript 5.5+)
function toProperCase(s)
{
  return s.toLowerCase().replace(/^(.)|\s(.)/g, 
          function($1) { return $1.toUpperCase(); });
}

if (false ) {
    
var cleanedareafeatures = areas.features.map((eachFeature) => {

    if (eachFeature.geometry.coordinates.length > 1) {
        console.log(
            'multi'
        )
    }

    return {
        "type": "feature",
        "properties": {
            "address": eachFeature.properties['StreetAbr'],
            "place_name": eachFeature.properties['School'],
            "set": 10,
            "section": 1,
            "date": '7/27/2022',
            "category": "School",
            "autoadd": true
        },
        "geometry": eachFeature.geometry
    };
});
 }

 var cleanedareafeatures = []

 areas.features.forEach((eachFeature) => {

    if (eachFeature.geometry.coordinates.length > 1) {
        console.log(
            'multi'
        )
    }

    eachFeature.geometry.coordinates.forEach((eachCoordSystem) => {
        if (false) {
            cleanedareafeatures.push({
                "type": "feature",
                "properties": {
                    "address": eachFeature.properties['Street_Address'],
                    "place_name": eachFeature.properties['School'],
                    "set": 10,
                    "section": 1,
                    "date": '7/27/2022',
                    "category": "School",
                    "autoadd": true,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": eachCoordSystem
                }
            })
        } else {
            cleanedareafeatures.push({
                "type": "feature",
                "properties": {
                    "address": toProperCase(eachFeature.properties['Facility_Address']),
                    "place_name": toProperCase(eachFeature.properties['Facility_Name']),
                    "set": 10,
                    "section": 1,
                    "date": '7/27/2022',
                    "category": "Daycare",
                    "autoadd": true,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": eachCoordSystem
                }
            })
        } 
        
    })

  
});
 

var writeout = {...areas, features: cleanedareafeatures}

const fs = require('fs');

// Or
fs.writeFileSync('./output4118-missing-daycares-v1.json', JSON.stringify(writeout));