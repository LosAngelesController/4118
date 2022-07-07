import areas from './joined-fixed-crs-new-school-map-parcels.json'

var cleanedareafeatures = areas.features.map((eachFeature) => {
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

var writeout = {...areas, features: cleanedareafeatures}

const fs = require('fs');

// Or
fs.writeFileSync('./output4118', JSON.stringify(writeout));