const sean1 = require('./inputs/sean-dec-8-4118.json');
const kyler1 = require('./inputs/kyler-dec-8-4118.json');
const kyleroriginal = require('./inputs/features.json');
const s4 = require('./inputs/s4-4118.json');
const autoinputschools = require('./inputs/output4118-autoschools.json')

const s5 = require('./inputs/220615-kyler.json');
const sean2 = require('./inputs/sean-2-corrected.json');
const feb16seanimport = require('./inputs/4118_02_19_2022-sean.json');
const feb16kylerimport = require('./inputs/4118-02-19-2022-kyler.json');
const editJsonFile = require("edit-json-file");
var fs = require('fs');
// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/features.json`);

var arrayOfFilesBatchFeb16 = [feb16seanimport,feb16kylerimport]

var locationsBatchFeb16 = []

arrayOfFilesBatchFeb16.forEach((eachFile, itemIndex) => {
        var mappedImports = eachFile.features.map((eachItem) => {
            
            eachItem.properties['category'] = "Public Safety";
            eachItem.properties['section'] = 26;

            if (!eachItem.properties.address) {
                console('what the fuck no addy')
            }

            return eachItem;
        });

        locationsBatchFeb16 = [...locationsBatchFeb16, ...mappedImports];

})

var locationsBatchCompilefeb16 =  {
    features: locationsBatchFeb16,
    type: "FeatureCollection"
  }


var arrayOfFiles = [ autoinputschools, locationsBatchCompilefeb16, sean1,kyler1,kyleroriginal,sean2, s4,s5]

var locations =  {
    features: [],
    type: "FeatureCollection"
  }
  
arrayOfFiles.forEach((eachFile, itemIndex) => {
    console.log(itemIndex + " has " + eachFile.features.length + " locs")

        var filteredEachFiles = eachFile.features.filter((eachItem) => {
          //  console.log(eachItem.properties.address)
         //   console.log(eachItem)
         //   console.log(eachItem.geometry.coordinates)
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
fs.writeFile("features-new.json", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
});