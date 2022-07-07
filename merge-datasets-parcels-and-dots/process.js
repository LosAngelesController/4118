"use strict";
//run in node js
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
//tsc process.ts --resolveJsonModule --esModuleInterop
var retainednewschoolmapparcels_json_1 = __importDefault(require("./retainednewschoolmapparcels.json"));
var new_school_map_1_json_1 = __importDefault(require("./new-school-map-1.json"));
var turf = __importStar(require("@turf/turf"));
//console.log(areas)
var areasarray = retainednewschoolmapparcels_json_1["default"].features;
var dotsarray = new_school_map_1_json_1["default"].features;
console.log(dotsarray);
areasarray.forEach(function (eachArea) {
    var coordsforpoly = turf.polygon(eachArea.geometry.coordinates[0]);
    //console.log(coordsforpoly);
    var dotforthisarray = dotsarray.find(function (eachDot) {
        //  console.log(eachDot)
        var turfpoint = turf.point(eachDot.geometry.coordinates);
        var answer = turf.booleanPointInPolygon(turfpoint, coordsforpoly);
        // console.log(answer);
        return answer;
    });
    console.log('found dot', dotforthisarray);
});
