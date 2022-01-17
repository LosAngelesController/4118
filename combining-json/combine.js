const sean1 = require('./inputs/sean-dec-8-4118.json');
const kyler1 = require('./inputs/kyler-dec-8-4118.json');
const kyleroriginal = require('./inputs/features.json');

const sean2 = require('./inputs/sean-2-corrected.json');
const editJsonFile = require("edit-json-file");
var fs = require('fs');
// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/features.json`);

var arrayOfFiles = [sean1,kyler1,kyleroriginal,sean2]

var locations =  {
    features:  [],
    type: "FeatureCollection"
  }
  
arrayOfFiles.forEach((eachFile, itemIndex) => {
    console.log(itemIndex + " has " + eachFile.features.length + " locs")

        var filteredEachFiles = eachFile.features.filter((eachItem) => {
            console.log(eachItem.properties.address)
            console.log(eachItem)
            console.log(eachItem.geometry.coordinates)
           return  eachItem.properties.address.trim() != "Shatto Recreation Center – 3191 West 4th Street"
        })
        .map((eachItem) => {
            if (eachItem.properties.set === undefined) {
                eachItem.properties.set = 0;
            }
            if (eachItem.properties.section === undefined) {
                eachItem.properties.section = 0;
            }
            return eachItem;
        })
    locations.features = [...locations.features, ...filteredEachFiles]
})

console.log(locations.features.length)

var jsonData = JSON.stringify(locations);
fs.writeFile("features.json", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
});