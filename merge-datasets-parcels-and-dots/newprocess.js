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
var joined_fixed_crs_new_school_map_parcels_json_1 = __importDefault(require("./joined-fixed-crs-new-school-map-parcels.json"));
var cleanedareafeatures = joined_fixed_crs_new_school_map_parcels_json_1["default"].features.map(function (eachFeature) {
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
var writeout = __assign(__assign({}, joined_fixed_crs_new_school_map_parcels_json_1["default"]), { features: cleanedareafeatures });
var fs = require('fs');
// Or
fs.writeFileSync('./output4118', JSON.stringify(writeout));
