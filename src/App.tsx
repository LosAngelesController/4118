import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
 
import * as turf from '@turf/turf'

    // added the following 6 lines.
    import mapboxgl from 'mapbox-gl';

    // The following is required to stop "npm build" from transpiling mapbox code.
    // notice the exclamation point in the import.
    // @ts-ignore
    // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
//import locations from './features.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoiY29tcmFkZWt5bGVyIiwiYSI6ImNrdjBkOXNyeDdscnoycHE2cDk4aWJraTIifQ.77Gid9mgpEdLpFszO5n4oQ';
 
const locations = require('./features.json')

console.log(locations)

var locationsBuffered = locations.features.map((eachFeature:any,eachFeatureIndex:any) => {
  var polygon = turf.polygon(eachFeature.geometry.coordinates);
  //console.log(polygon)

  var buffered;

  console.log(eachFeatureIndex)
  console.log(locations.features[eachFeatureIndex].properties.category)
  if (locations.features[eachFeatureIndex].properties.category.match(/Design/gi) || locations.features[eachFeatureIndex].properties.category.match(/Navigation/gi)) {
    buffered = turf.buffer(polygon, 1000, { units: 'feet' });
    console.log('1000ft', locations.features[eachFeatureIndex].properties.address)
  } else {

  buffered = turf.buffer(polygon, 500, { units: 'feet' });
  }
  return buffered;
})

console.log(locationsBuffered)

var geoJsonBoundary:any = {
  features: locationsBuffered,
  type: "FeatureCollection"
}

function isStringOneThousandFt(stringInput:string) {
  return (stringInput.match(/Design/gi) || stringInput.match(/Navigation/gi))
}

function splitIntoYellowAndRed(geojsonobj: any) {
  console.log('splitInto', geojsonobj)
  var thousands:any = {
    features: [],
      type: "FeatureCollection"
  }

  var fivehundreds:any = {
    features: [],
    type: "FeatureCollection"
  }

  geojsonobj.features.forEach((eachFeature: any, eachFeatureIndex: any) => {
    if( isStringOneThousandFt(locations.features[eachFeatureIndex].properties.category)) {
      thousands['features'].push(eachFeature)
    } else {
      fivehundreds['features'].push(eachFeature)
    }
  })
  
  return {thousands, fivehundreds}
}

const { thousands, fivehundreds } = splitIntoYellowAndRed(locations)
const {thousands : thousandsBuffer, fivehundreds : fivehundredsBuffer} = splitIntoYellowAndRed(geoJsonBoundary)



const formulaForZoom = () => {
  if (window.innerWidth > 700) {
    return 10
  } else { 
    return 9.1
  }
}

export default class App extends React.PureComponent {
  mapContainer: any;
  state: any;
constructor(props:any) {
super(props);
this.state = {
lng: -118.41,
lat: 34,
  zoom: formulaForZoom()
};
this.mapContainer = React.createRef();
}
componentDidMount() {
  const { lng, lat, zoom } = this.state;
  const map = new mapboxgl.Map({
    container: this.mapContainer.current,
    //style: 'mapbox://styles/comradekyler/ckv0iinpk1tlj15o2y6v1cur9',
    style: 'mapbox://styles/comradekyler/ckv1ai7fb27w614s0d4tfbsac',
    center: [lng, lat],
    zoom: zoom,
    attributionControl: false
  }).addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Paid for by Mejia for City Controller 2022, FPPC ID#: 1435234 1001 Wilshire Blvd. Suite 102, Los Angeles, CA, 90017. Additional information is available at ethics.lacity.org.'
  }));


  // Add geolocate control to the map.
map.addControl(
  new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  // When active the map will receive updates to the device's location as it changes.
  trackUserLocation: true,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
  showUserHeading: true
  })
  );

  console.log(map)
 

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
  
map.on('move', () => {
this.setState({
lng: map.getCenter().lng.toFixed(4),
lat: map.getCenter().lat.toFixed(4),
zoom: map.getZoom().toFixed(2)
});
});
  
map.on('load', () => {
 
  
  map.addLayer({
    // buffer
    id: 'locationsBuffer',
    type: 'fill',
    source: {
      type: 'geojson',
      data:  fivehundredsBuffer
    },
    paint: {
      "fill-color": "#ff0000",
      "fill-opacity": ["interpolate",
      ["exponential", 1],
         ['zoom'],
         10, 0.7,
         15, 0.6,
       18, 0.4
   ]
    }
  });
  map.addLayer({
    // buffer
    id: 'locationsThousandsBuffer',
    type: 'fill',
    source: {
      type: 'geojson',
      data:  thousandsBuffer
    },
    paint: {
      "fill-color": "#CA8A04",
      "fill-opacity": ["interpolate",
      ["exponential", 1],
         ['zoom'],
         10, 0.7,
         15, 0.6,
       18, 0.4
   ]
    }
  });
  map.addLayer({
    //illegal zone solid
    id: 'locations',
    type: 'fill',
    source: {
      type: 'geojson',
      data: fivehundreds
    },
    paint: {
      "fill-color": "#ffaaaa",
      "fill-opacity": ["interpolate",
     ["exponential", 1],
        ['zoom'],
        10, 0.9,
        12, 0.6,
        13, 0.6,
        15, 0.5,
        17, 0.4,
      18, 0.3
  ]
    }
  });

  map.addLayer({
    //illegal zone solid
    id: 'locationsThousands',
    type: 'fill',
    source: {
      type: 'geojson',
      data: thousands
    },
    paint: {
      "fill-color": "#FEF08A",
      "fill-opacity": ["interpolate",
     ["exponential", 1],
        ['zoom'],
        10, 0.9,
        12, 0.6,
        13, 0.6,
        15, 0.5,
        17, 0.4,
      18, 0.3
  ]
    }
  });
});
}
  
  
render() {
const { lng, lat, zoom } = this.state;
return (
<div>
 {/*<div className="sidebar">
Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
</div>*/}
    
    <div
      className=' outsideTitle'
    >
      <div className='titleBox'>41.18 Enforcement Locations</div>
      <div
      className='font-sans mt-3 space-y-2 p-2 bg-truegray-900 bg-opacity-90 md:bg-opacity-60 rounded-xl text-xs'> <div className='md:max-w-xs'>Banned: sit, lie, sleep, or store, use, maintain, or place personal property within:</div>
      <div
      className='md:max-w-xs'
      ><span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-2 py-1 mr-2'>1000ft</span>Facility providing shelter, safe sleeping, safe parking, or serving as a homeless services navigation center</div>
       <div
      className='md:max-w-xs'
      ><span className='font-mono h-1 w-1 bg-red-600 rounded-full px-2 py-1 mr-2'>500ft</span>Other locations (ex: school, road)</div></div>
     
    </div>
  
    
<div ref={this.mapContainer} className="map-container" />
</div>
);
}
}