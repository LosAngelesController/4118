const editJsonFile = require("edit-json-file");

// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/features.json`);
// If the file doesn't exist, the content will be an empty object by default.
let fileToSave = editJsonFile(`${__dirname}/save.json`);

var jsonObj = file.get()

var featuresToWrite = []

jsonObj.features.forEach((eachFeature) => {
    eachFeature.properties['set'] = "1";
    eachFeature.properties['date'] = "10/20/2021";

    featuresToWrite.push(eachFeature)
})

fileToSave.set("features", featuresToWrite);
fileToSave.set("type", "FeatureCollection");

fileToSave.save();