import areas from './joined-fixed-crs-new-school-map-parcels.json'
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
        cleanedareafeatures.push({
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
            "geometry": {
                "type": "Polygon",
                "coordinates": eachCoordSystem
            }
        })
    })

  
});
 

var writeout = {...areas, features: cleanedareafeatures}

const fs = require('fs');

// Or
fs.writeFileSync('./output4118-autoschools-v2.json', JSON.stringify(writeout));