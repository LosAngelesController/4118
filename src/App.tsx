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

//console.log(locations)

var locationsBuffered = locations.features.map((eachFeature:any,eachFeatureIndex:any) => {
  var polygon = turf.polygon(eachFeature.geometry.coordinates);
  //console.log(polygon)

  var buffered;

 // console.log(eachFeatureIndex)
 // console.log(locations.features[eachFeatureIndex].properties.category)
  if (locations.features[eachFeatureIndex].properties.category.match(/Design/gi) || locations.features[eachFeatureIndex].properties.category.match(/Navigation/gi)) {
    buffered = turf.buffer(polygon, 1000, { units: 'feet' });
  //  console.log('1000ft', locations.features[eachFeatureIndex].properties.address)
  } else {
  buffered = turf.buffer(polygon, 500, { units: 'feet' });
  }
  return buffered;
})

//console.log(locationsBuffered)



var geoJsonBoundary:any = {
  features: locationsBuffered,
  type: "FeatureCollection"
}

function isStringOneThousandFt(stringInput:string) {
  return (stringInput.match(/Design/gi) || stringInput.match(/Navigation/gi))
}

function centroids(geojsonobj: any) {
  var featuresTotal: any =  {
    features: [],
    type: "FeatureCollection"
  }

  geojsonobj.features.forEach((eachFeature: any, eachFeatureIndex: any) => {
    var polygon = turf.polygon(eachFeature.geometry.coordinates);

    var centroid = turf.centroid(polygon);
    eachFeature.properties['centroid'] = centroid
    console.log(centroid)

    featuresTotal.features.push(eachFeature)
  });

  return featuresTotal;
}

var locationsCentroids = centroids(locations)
console.log('locationsCentroids', locationsCentroids)

function splitIntoYellowAndRed(geojsonobj: any) {
  //console.log('splitInto', geojsonobj)
  var thousands:any = {
    features: [],
      type: "FeatureCollection"
  }

  var fivehundreds:any = {
    features: [],
    type: "FeatureCollection"
  }

  var featuresTotal: any =  {
    features: [],
    type: "FeatureCollection"
  }

  geojsonobj.features.forEach((eachFeature: any, eachFeatureIndex: any) => {

    if (isStringOneThousandFt(locations.features[eachFeatureIndex].properties.category)) {
   
      eachFeature.properties['buffer'] = '1000'
      
      console.log()
      thousands['features'].push(eachFeature)
    } else {
      eachFeature.properties['buffer'] = '500'
      fivehundreds['features'].push(eachFeature)
    }

    featuresTotal['features'].push(eachFeature)
  })
  
  return {thousands, fivehundreds, featuresTotal}
}

const { thousands, fivehundreds, featuresTotal } = splitIntoYellowAndRed(locations)
const {thousands : thousandsBuffer, fivehundreds : fivehundredsBuffer, featuresTotal: featuresTotalBuffer} = splitIntoYellowAndRed(geoJsonBoundary)



const formulaForZoom = () => {
  if (window.innerWidth > 700) {
    return 10
  } else { 
    return 9.1
  }
}

const characters ='abcdefghijklmnopqrstuvwxyz0123456789';

const generateString = (length:any) =>  {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export default class App extends React.PureComponent {
  mapContainer: any;
  state: any;
  map: any;
constructor(props:any) {
super(props);
this.state = {
lng: -118.41,
  lat: 34,
  initialWindowWidth: window.innerWidth,
  zoom: formulaForZoom()
};
this.mapContainer = React.createRef();
}
  
  handleResize = () => {
    const sidebar = document.querySelector(".sidebar-4118-list");
    if (sidebar) {
      if ((window.innerWidth < 768)) {
        //screen smol
        if (!(sidebar.classList.contains("-translate-x-full"))) {
         // sidebar.classList.toggle("-translate-x-full");
        } 
      } else {
        if (sidebar.classList.contains("-translate-x-full")) {
          sidebar.classList.toggle("-translate-x-full");
        }
        //
      }
    }
  }

  toggleList = () => {
    console.log('togglelistfunc')
    const sidebar = document.querySelector(".sidebar-4118-list");
    if (sidebar) {
      console.log('toggle it')
      if (window.innerWidth < 768) {
        sidebar.classList.toggle("-translate-x-full");
        }
        } 
    
  }
  
  flyToPoint = (longcoord: any, latcoord: any, map: any, eachFeature: any, indexOfFeature: any, bufferFeat:any) => {
   
    var idMade = generateString(6)
    var idMadeBuffer = `${idMade}buff`


    console.log('data 1',eachFeature)
    console.log('use this data',bufferFeat)
    // bufferFeat
    map.addLayer({
      'id': `${idMadeBuffer}`,
      'type': "line",
      source: {
        type: 'geojson',
        data:{
          features:  [bufferFeat],
          type: "FeatureCollection"
        }
      },
      paint: {
        "line-color": "#41ffca",
        "line-width": 8,
        "line-opacity": 0.7,
        "line-width-transition": {
          "duration": 1000,
          "delay": 0
        }
      }
    });

    const setLine = (setNumb:any) => {
      map.setPaintProperty(
        `${idMadeBuffer}`,
        'line-width',
        setNumb
      );
    }

    setTimeout(() => {
      setLine(0)
    }, 1000 * 2)

    setTimeout(() => {
     map.removeLayer(`${idMadeBuffer}`)
    }, 1000 * 6)

  map.flyTo({
    center: [
    longcoord,
    latcoord
    ],
    zoom: 14,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
    
   

  return true;
}
  
   componentDidMount() {
    window.addEventListener('resize', this.handleResize);
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
  this.map = map

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
      className=' outsideTitle max-h-screen flex-col h-screen flex'
    >
      <div className='titleBox max-h-screen mt-2 ml-2 md:mt-3 md:ml-3'>41.18 Enforcement Locations</div>
 
      <div
        className='font-sans mt-3 space-y-2 p-2  ml-2 md:ml-3 bg-truegray-900 bg-opacity-90 md:bg-opacity-70 rounded-xl text-xs' style={{
        maxWidth: '85%'
      }}> <div className='md:max-w-xs'>Banned: sit, lie, sleep, or store, use, maintain, or place personal property within:</div>
      <div
      className='md:max-w-xs'
      ><span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-2 py-1 mr-2'>1000ft</span>Facility providing shelter, safe sleeping, safe parking, or serving as a homeless services navigation center</div>
       <div
      className='md:max-w-xs'
      ><span className='font-mono h-1 w-1 bg-red-600 rounded-full px-2 py-1 mr-2'>500ft</span>Other locations (school, park, tunnel, underpass, etc.)</div></div>
     
      <div className={`transition-all sidebar-4118-list z-50 md:ml-3 absolute md:static transform ${(this.state.initialWindowWidth >= 768)  ? "" : "-translate-x-full"} md:block md:flex-initial md:mt-1 md:flex-col md:max-w-xs overflow-y-auto text-xs font-sans bg-truegray-900 md:bg-opacity-90 px-2 py-1 md:rounded-xl md:mb-10`}>
     
        <div className='pl-1 pt-2 text-base flex flex-row flex-nowrap'>
          <svg xmlns="http://www.w3.org/2000/svg"
            onClick={(event) => {
              this.toggleList();
            }}
            className="h-6 w-6 flex-shrink md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg><p className='flex-grow'>List - 41.18 Enforcement Locations</p>
        
        </div>
        {
      featuresTotal.features.map((eachFeature:any,eachFeatureIndex:any) => (
        <div className='bg-truegray-800 my-2 px-2 py-1 rounded-sm ' key={eachFeatureIndex} onClick={(event) => {
          this.toggleList();
          this.flyToPoint(eachFeature.properties.centroid.geometry.coordinates[0], eachFeature.properties.centroid.geometry.coordinates[1], this.map, eachFeature, eachFeatureIndex,
            featuresTotalBuffer.features[eachFeatureIndex])
          }}>
          <p className='font-bold'>{eachFeature.properties.address}</p>
          <p>{(eachFeature.properties.buffer === '1000' && (
            <span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-1 py-1 mr-1 font-xs'>1000ft</span>
          ))}
            {(eachFeature.properties.buffer === '500' && (
            <span className='font-mono h-1 w-1 bg-red-600 text-black rounded-full px-1 py-1 mr-1 font-xs'>500ft</span>
          ))}
            {eachFeature.properties.category}<br>
            </br>
            {/*eachFeature.properties.centroid.geometry.coordinates[0]} {eachFeature.properties.centroid.geometry.coordinates[1]*/}
            <p className='pt-1'>View on Map</p>
          </p>
       </div>
      ))
    }
      </div>
    </div>
  
    
    <div ref={this.mapContainer} className="map-container" />
    <div className='absolute z-10 md:hidden rounded-full bottom-4 right-4 bg-mejito w-16 h-16 '
      onClick={(event: any) => {
        this.toggleList();
      }}>
      <svg width="24" height="24" fill="none" className="text-black absolute m-auto top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform scale-80">
      <path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"></path>  
      </svg>
    </div>
</div>
);
}
}