"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
//import areas from './joined-fixed-crs-new-school-map-parcels.json'
var daycare_export_v4_correct_format_json_1 = __importDefault(require("./daycare-export-v4-correct-format.json"));
if (false) {
    var cleanedareafeatures = daycare_export_v4_correct_format_json_1["default"].features.map(function (eachFeature) {
        if (eachFeature.geometry.coordinates.length > 1) {
            console.log('multi');
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
var cleanedareafeatures = [];
daycare_export_v4_correct_format_json_1["default"].features.forEach(function (eachFeature) {
    if (eachFeature.geometry.coordinates.length > 1) {
        console.log('multi');
    }
    eachFeature.geometry.coordinates.forEach(function (eachCoordSystem) {
        if (false) {
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
            });
        }
        else {
            cleanedareafeatures.push({
                "type": "feature",
                "properties": {
                    "address": eachFeature.properties['facilityaddress'],
                    "place_name": eachFeature.properties['name'],
                    "set": 10,
                    "section": 1,
                    "date": '7/27/2022',
                    "category": "Daycare",
                    "autoadd": true
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": eachCoordSystem
                }
            });
        }
    });
});
var writeout = __assign(__assign({}, daycare_export_v4_correct_format_json_1["default"]), { features: cleanedareafeatures });
var fs = require('fs');
// Or
fs.writeFileSync('./output4118-autoschools-v2.json', JSON.stringify(writeout));
