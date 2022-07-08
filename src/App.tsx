import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './App.css'
import { Switch,MantineProvider  } from '@mantine/core';

       
import {DisclaimerPopup} from './Disclaimer'
import * as turf from '@turf/turf'

    // added the following 6 lines.
    import mapboxgl from 'mapbox-gl';
import { assertDeclareExportAllDeclaration } from '@babel/types';

import { datadogRum } from '@datadog/browser-rum';
try {
  datadogRum.init({
    applicationId: '0f167d08-abab-4f76-bdc7-71efacca54d8',
    clientToken: 'pub15407666c25ebb17ff50cdde4892057f',
    site: 'datadoghq.com',
    service:'4118',
    // Specify a version number to identify the deployed version of your application in Datadog 
    version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'allow'
  });
    
  datadogRum.startSessionReplayRecording();
} catch (datadogerr) {
  console.error(datadogerr)
}


    // The following is required to stop "npm build" from transpiling mapbox code.
    // notice the exclamation point in the import.
    // @ts-ignore
    // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
//import locations from './features.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoiY29tcmFkZWt5bGVyIiwiYSI6ImNrdjBkOXNyeDdscnoycHE2cDk4aWJraTIifQ.77Gid9mgpEdLpFszO5n4oQ';
 
var locationsImport = require('./features.json')

var locationsRemoveSections = locationsImport.features.filter((location:any) => {
  if (location.properties.section) {
    // 9 will be passed nov 3
    if ([16,15,18].includes(location.properties.section)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
})

var locations: any =  {
  features:  locationsRemoveSections,
  type: "FeatureCollection"
}

const citybound = require('./citybounds.json')

//console.log(locations)

function isStringOneThousandFt(stringInput: string) {
 // console.log('stringinput', stringInput)
  return (stringInput.match(/Design/gi) || stringInput.match(/Navigation/gi))
}

var locationsBuffered = locations.features.map((eachFeature:any,eachFeatureIndex:any) => {
  var polygon = turf.polygon(eachFeature.geometry.coordinates);
  //console.log(polygon)

  var buffered:any;

 // console.log(eachFeatureIndex)
 // console.log(locations.features[eachFeatureIndex].properties.category)
  if (isStringOneThousandFt(eachFeature.properties.category)) {
    buffered = turf.buffer(polygon, 1000, { units: 'feet' });
  //  console.log('1000ft', locations.features[eachFeatureIndex].properties.address)
  } else {
  buffered = turf.buffer(polygon, 500, { units: 'feet' });
  }

  buffered.properties = eachFeature.properties;
  return buffered;
})

//console.log(locationsBuffered)

const currentSetGlobal = 9

var geoJsonBoundary:any = {
  features: locationsBuffered,
  type: "FeatureCollection"
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
   // console.log(centroid)

    featuresTotal.features.push(eachFeature)
  });

  return featuresTotal;
}

var locationsCentroids = centroids(locations)
//console.log('locationsCentroids', locationsCentroids)

function showMapboxStuff() {
  /*
  var mapboxlogo = document.querySelector('.mapboxgl-ctrl-bottom-left')
  console.log('mapboxlogo')
  if (mapboxlogo) {
    mapboxlogo.classList.remove('hidden')
  }*/

  var mapboxtopright = document.querySelector(".mapboxgl-ctrl-top-right")
 // console.log('topright',mapboxtopright)
  if (mapboxtopright) {
    mapboxtopright.classList.remove('hidden')
  }

  var mapboxBottomRight = document.querySelector('.mapboxgl-ctrl-bottom-right')
  if (mapboxBottomRight) {
    mapboxBottomRight.classList.remove('hidden')
  }
}

function hideMapboxStuff() {
  var mapboxlogo = document.querySelector('.mapboxgl-ctrl-bottom-left')
  if (mapboxlogo) {
    mapboxlogo.classList.add('hidden')
  }

  var mapboxtopright = document.querySelector(".mapboxgl-ctrl-top-right")
  if (mapboxtopright) {
    mapboxtopright.classList.add('hidden')
  }

  var mapboxBottomRight = document.querySelector('.mapboxgl-ctrl-bottom-right')
  if (mapboxBottomRight) {
    mapboxBottomRight.classList.add('hidden')
  }

}

function sidebardom() {
  const sidebar = document.querySelector(".sidebar-4118-list");
  /*if (sidebar) {
    //if its hidden
    if (sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.remove('visible')
      sidebar.classList.add('invisible')
    } else {
      sidebar.classList.add('visible')
      sidebar.classList.remove('invisible')
    }
  }*/
}

function checkStateOfSidebarAndUpdateOtherComponents() {
  const sidebar = document.querySelector(".sidebar-4118-list");
  if (sidebar) {
    if ((window.innerWidth < 768)) {
      //screen smol

      //if the screen is small and the drawer is tucked
      if (!(sidebar.classList.contains("-translate-x-full"))) {
        hideMapboxStuff()
        
      } else {
        showMapboxStuff()
      }
    } else {
     showMapboxStuff()
      //
    }
  }
}

function checkHideOrShowTopRightGeocoder() {
  var toprightbox = document.querySelector(".mapboxgl-ctrl-top-right")
 if (toprightbox) {
  var toprightgeocoderbox:any = toprightbox.querySelector(".mapboxgl-ctrl-geocoder");
  if (toprightgeocoderbox) {
    if (window.innerWidth >= 768) {
      toprightgeocoderbox.style.display = 'block'
    } else {
      toprightgeocoderbox.style.display = 'none'
    }
  }
 }
}

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

    if (isStringOneThousandFt(eachFeature.properties.category)) {
   
      eachFeature.properties['buffer'] = '1000'
      
     // console.log()
      thousands['features'].push(eachFeature)
    } else {
      eachFeature.properties['buffer'] = '500'
      fivehundreds['features'].push(eachFeature)
    }

    featuresTotal['features'].push(eachFeature)
  })
  
  return {thousands, fivehundreds, featuresTotal}
}

var boundsUpcoming = geoJsonBoundary.features.filter((eachFeature: any) => parseInt(eachFeature.properties.set,10) > currentSetGlobal)

var boundsUpcomingGeojson: any =  {
  features: boundsUpcoming,
  type: "FeatureCollection"
}

const { thousands, fivehundreds, featuresTotal } = splitIntoYellowAndRed(locations)
const {thousands : thousandsBuffer, fivehundreds : fivehundredsBuffer, featuresTotal: featuresTotalBuffer} = splitIntoYellowAndRed(geoJsonBoundary)
const {thousands : thousandsBufferUpcoming, fivehundreds : fivehundredsBufferUpcoming, featuresTotal: featuresTotalBufferUpcoming} = splitIntoYellowAndRed(boundsUpcomingGeojson)

//console.log('thousandsBufferUpcoming', thousandsBufferUpcoming)


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

const urlParams = new URLSearchParams(window.location.search);
const latParam = urlParams.get('lat');
const lngParam = urlParams.get('lng');
const zoomParam = urlParams.get('zoom');
const debugParam = urlParams.get('debug');


const searchParam = urlParams.get('search');

const pinSetParam = urlParams.get('pinset');

var pinSetGeojson: any;

if (pinSetParam) {
  //console.log('locationscentroids', locationsCentroids)
  const pinSetArray =locationsCentroids.features.filter((eachItem:any) => parseInt(eachItem.properties.set,10) === parseInt(pinSetParam,10)).map((eachItem:any) => eachItem.properties.centroid)
  .map((eachItem:any) => {
    eachItem.properties['marker-size'] = "small";
    eachItem.properties['marker-symbol'] = "1";
    eachItem.properties['marker-color'] = "small";
    return eachItem;
  })

  pinSetGeojson = {
    features: pinSetArray,
    type: "FeatureCollection"
  }

 // console.log('pinsetgeojsonresult',  pinSetGeojson )
}

const cityBoundParam = urlParams.get('citybound')


export default class App extends React.PureComponent {
  mapContainer: any;
  state: any;
  popupfunc: any;
  map: any;
constructor(props:any) {
super(props);
this.state = {
  disclaimerOpen: false,
  isButtonExit: false,
lng: lngParam || -118.41,
  lat:  latParam || 34,
  initialWindowWidth: window.innerWidth,
  isPopupActive: false,
  zoom: zoomParam || formulaForZoom(),
  search: searchParam,
  featureSelected: {},
  infoBoxShown: true,
  currentSet: currentSetGlobal,
  debugState: !!(debugParam),
  pinset: pinSetParam,
  pendinglegend: true,
  showpending: false
};
this.mapContainer = React.createRef();
}

refilterpending = () => {
  const arrayoflayerstofilter = ['locationsThousandsBuffer','locationsBuffer','locationsThousands','locations']
  var filtertoapply:any = null;
  
  if (this.state.showpending === false) {
    filtertoapply = ['<=', 'set', currentSetGlobal]
  } else {
    filtertoapply = null;
  }
  arrayoflayerstofilter.forEach((eachlayer) => {
    this.map.setFilter(eachlayer, filtertoapply);
  })

}

closeModal =() =>  {
  this.setState({
    disclaimerOpen: false
  })
}

openModal = () => {
  this.setState({
    disclaimerOpen: true
  })
}

  
  handleResize = () => {
    checkHideOrShowTopRightGeocoder()

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
    sidebardom()
  }

  toggleInfoBox = () => {
    this.setState((state: any, props: any) => {
      if (state.infoBoxShown) {
        return {infoBoxShown: false}
      } else {
        return {infoBoxShown: true}
      }
    })
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
        sidebardom()
        this.updatebuttonstate()
  }

  updatebuttonstate = () => {
    const sidebar:any = document.querySelector(".sidebar-4118-list");

    if (sidebar != null) {
      var classList = sidebar.classList

      if (classList.contains("-translate-x-full")) {
        this.setState({
          isButtonExit: false
        })
      } else {
        this.setState({
          isButtonExit: true
        })
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

    var customobj:any = {
      container: this.mapContainer.current,
      //style: 'mapbox://styles/comradekyler/ckv0iinpk1tlj15o2y6v1cur9',
      style: 'mapbox://styles/comradekyler/ckv1ai7fb27w614s0d4tfbsac',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
      projection: { name: 'globe', center: [0, 0], parallels: [30, 30] }
    }

  const map = new mapboxgl.Map(customobj)
  //.addControl(new mapboxgl.AttributionControl({
   // customAttribution: 'Paid for by Mejia for City Controller 2022, FPPC ID#: 1435234 1001 Wilshire Blvd. Suite 102, Los Angeles, CA, 90017. Additional information is available at ethics.lacity.org.'
  //}));
  this.map = map

  console.log(map)
 
  var mapboxlogo = document.querySelector('.mapboxgl-ctrl-bottom-left')
  if (mapboxlogo) {
    mapboxlogo.classList.add('hidden')
  }


     
map.on('move', () => {
this.setState({
lng: map.getCenter().lng.toFixed(4),
lat: map.getCenter().lat.toFixed(4),
zoom: map.getZoom().toFixed(2)
});
});
     
     this.popupfunc = (e:any) => {
       // Copy coordinates array.
     //  console.log(e)
       const coordinates = e.lngLat

       var resultOfCalculation;
       
       var pt = turf.point([coordinates.lng,coordinates.lat]);
//const description = e.features[0].properties.description;
       
       var featureMatchingClick:any;
       
       //foreach thing in featuresTotalBuffer
       featuresTotalBuffer.features.forEach((eachFeature: any) => {
        // console.log(eachFeature)
         var poly = turf.polygon([eachFeature.geometry.coordinates[0]]);
         
         resultOfCalculation = turf.booleanPointInPolygon(pt, poly)
         if (resultOfCalculation === true) {
           featureMatchingClick = eachFeature;
           return eachFeature;
         }
       })

       console.log('success found feature clicked', featureMatchingClick)
       
       if (featureMatchingClick) {
         this.setState((state: any, props: any) => {
           return {
             isPopupActive: true,
             featureSelected: featureMatchingClick
           }
         })
       }
       //do the turf inside function
       // if true, display the popup state
 
// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
       this.setState({
         isPopupActive: true
       })
     }
  
map.on('load', () => {


  map.addSource('single-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    id: 'point',
    source: 'single-point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#41ffca'
    }
  });

  const geocoder:any = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: map,
    proximity: {
      longitude: -118.41,
      latitude: 34
    },
    marker: true
    });

    var colormarker = new mapboxgl.Marker({
      color: '#41ffca'
    });

    const geocoderopt:any = 
      {
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: {
          color: '#41ffca'
        }
        }
    

    const geocoder2 = new MapboxGeocoder(geocoderopt);
    const geocoder3 = new MapboxGeocoder(geocoderopt);


   
       
  geocoder.on('result', (event:any) => {
    var singlePointSet:any = map.getSource('single-point')
    singlePointSet.setData(event.result.geometry);
    console.log('event.result.geometry',event.result.geometry)
    console.log('geocoderesult', event)
  });

  geocoder.on('select', function(object:any){
    var coord = object.feature.geometry.coordinates;
    var singlePointSet:any = map.getSource('single-point')
    singlePointSet.setData(object.feature.geometry);
});

  var geocoderId = document.getElementById('geocoder')



  if (geocoderId) {
    console.log(
    'geocoder div found'
    )

    if (!document.querySelector(".geocoder input")) {
      geocoderId.appendChild(geocoder3.onAdd(map));

      var inputMobile = document.querySelector(".geocoder input");

      try {
        var loadboi =  document.querySelector('.mapboxgl-ctrl-geocoder--icon-loading')
        if (loadboi) {
          var brightspin:any = loadboi.firstChild;
       if (brightspin) {
        brightspin.setAttribute('style', 'fill: #e2e8f0');
       }
       var darkspin:any = loadboi.lastChild;
       if (darkspin) {
        darkspin.setAttribute('style', 'fill: #94a3b8');
       }
        }
       
      } catch (err) {
        console.error(err)
      }
    
      if (inputMobile) {
        inputMobile.addEventListener("focus", () => {
          //make the box below go away
          this.setState((state: any, props: any) => {
          return {
            infoBoxShown: false
          }
          })
          });
      }
    }
  

  } else {
    console.log('no geocoder div')
    console.log(geocoderId)
  }


  map.addControl(
    geocoder2
    );

    checkHideOrShowTopRightGeocoder()
  
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
     
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
       

  if (true) {
    map.addLayer({
      id: 'citybound',
      type: 'line',
      source: {
        type: 'geojson',
        data:  citybound
      },
      paint: {
        "line-color": '#51ffea',
        'line-opacity': 0.9,
        'line-width': 2
      }
    })

  
    map.addLayer({
      id: 'cityboundfill',
      type: 'fill',
      source: {
        type: 'geojson',
        data:  citybound
      },
      paint: {
        'fill-color': '#aaaaaa',
        'fill-opacity': 0.01
      }
    })
  }

  
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

  map.on('click', 'locationsBuffer', event => this.popupfunc(event))
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

  map.on('click', 'locationsThousandsBuffer', event => this.popupfunc(event))
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

  map.on('click', 'locations', event => this.popupfunc(event))

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



  map.on('click', 'locationsThousands', event => this.popupfunc(event))

this.refilterpending()

  //dashed upcoming lines
/*

  map.addLayer({
    //illegal zone solid
    id: 'locationsThousandsUpcomingDashed',
    type: 'line',
    source: {
      type: 'geojson',
      data: thousandsBufferUpcoming
    },
    paint: {
      "line-color": "#FEF08A",
      "line-width":  ["interpolate",
      ["exponential", 1],
        ['zoom'],
         6, 2,
        10, 4,
         15, 5
   ],
      'line-dasharray': [5, 5, 5, 5],
      'line-offset': 3,
      'line-opacity': 0.5
    }
  });*/
 
/*

  map.addLayer({
    //illegal zone solid
    id: 'locationsFiveHundredsUpcomingDashed',
    type: 'line',
    source: {
      type: 'geojson',
      data: fivehundredsBufferUpcoming
    },
    paint: {
      "line-color": "#ffaaaa",
      "line-width": ["interpolate",
      ["exponential", 1],
        ['zoom'],
         6, 2,
        10, 5,
         15, 9
   ],
      'line-dasharray': [5, 5, 5, 5],
      'line-offset': 3,
      'line-opacity': ["interpolate",
      ["exponential", 1],
        ['zoom'],
        10, 0,
         13, 0.9
   ],
    }
  });*/

  if (this.state.pinset) {
    console.log('pinSetGeojson', pinSetGeojson)

  
      
      map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': {
          type: 'geojson',
          data: pinSetGeojson,
      
        'tolerance': 0,  },
        'layout': {
       'icon-image': 'custom-marker',
        // get the title name from the source's "title" property
        'text-allow-overlap': true,
        "icon-allow-overlap": true
        },
        });
   

  
  }
});
    
     
     
}
  


render() {
 
  
const { lng, lat, zoom } = this.state;
return (
  <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
<div>
 {/*<div className="sidebar">
Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
</div>*/}
    
  
         
    <div
      className=' outsideTitle max-h-screen flex-col flex z-50'
    >
      <div className='titleBox max-h-screen mt-2 ml-2 md:mt-3 md:ml-3 break-words'>41.18 By-Resolution Areas</div>

      <div
    className={`geocoder md:hidden`} id='geocoder'></div>

      {
        this.state.debugState && (
          <div className="sidebar-debug mx-4 mt-2 mb-1 bg-gray-900 text-white">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
     )
      }
      <div className='flex flex-col md:flex-row w-auto md:auto md:flex-nowrap '>
      {this.state.infoBoxShown && (
          <div
          className='flex-none font-sans mt-3 md:mt-3 p-2 banned-box-text ml-2 md:ml-3 bg-truegray-900 bg-opacity-90 md:bg-opacity-70 rounded-xl text-xs' style={{
          
        }}> <div className='md:max-w-xs  mt-1'>Banned: sit, lie, sleep, or store, use, maintain, or place personal property within:</div>
        <div
        className='md:max-w-xs mt-1 pt-1 sm:pt-3'
        ><span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-2 py-1 mr-2'>1000ft</span><span className='font-xs'> </span>Facility providing shelter, safe sleeping, safe parking, or serving as a homeless services navigation center</div>
         <div
        className='md:max-w-xs  mt-1 pt-1 sm:pt-3' 
            ><span className='font-mono h-1 w-1 bg-red-600 rounded-full px-2 py-1 mr-2'>500ft</span>Other locations (school, park, tunnel, underpass, bridge, active railway, etc.)</div>
          {
            this.state.pendinglegend === true && (
              <div
              className='md:max-w-xs flex flex-row space-x-1  mt-1' 
           >
           <Switch
           checked={this.state.showpending}
           onChange={(newstate:any) => {
            console.log(newstate);
            this.setState({showpending: !this.state.showpending}, () => {
            this.refilterpending()
           }); }}
    />
           <span className='pl-1'>View Pending Sites</span>
           </div> 
            )
          }
         <div className='md:max-w-xs mt-0'>Covers schools, daycares, and by-resolution locations voted on by City Council. See ordinance for more info.</div>
            <div className='flex-row  mt-1'>
            <a  target="_blank" rel='external' className='underline text-mejito' href='https://clkrep.lacity.org/onlinedocs/2020/20-1376-S1_ord_187127_09-03-21.pdf'>41.18 Ordinance</a>
            <a  target="_blank" rel='author' className='underline text-mejito ml-4' href='https://mejiaforcontroller.com'>Mejia For Controller</a>
          </div>
        </div>
    )}
        <div className={`hidden md:block flex-none ${this.state.infoBoxShown ? 'absolute' : ''} w-6 h-6 bg-opacity-95 bg-mejito text-black rounded-full md:ml-2 md:my-2`}
          
          style={
            {
              right: -2
            }
          }
          
          onClick={(event) => { this.toggleInfoBox() }}>
          {this.state.infoBoxShown && (
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform-all`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
          )}
          {
            (this.state.infoBoxShown === false) && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
</svg>
            )
          }
        </div>
        
        <div className={`block md:hidden ${this.state.infoBoxShown ? 'absolute' : ''} flex-none w-6 h-6 bg-mejito text-black bg-opacity-95 rounded-full ml-2 my-2`}
          onClick={(event) => { this.toggleInfoBox() }}>
          {this.state.infoBoxShown && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          )}
          {
            (this.state.infoBoxShown === false) && (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
</svg>
            )
          }
         </div>
      </div>


     
      
      <div className={`w-screen md:w-auto  scrollbar-thumb-gray-400 scrollbar-rounded scrollbar scrollbar-thin scrollbar-trackgray-900 max-h-screen transform overflow-y-auto transition-all z-50 sidebar-4118-list md:ml-3 absolute md:static ${(this.state.initialWindowWidth >= 768)  ? "" : "-translate-x-full"} md:block md:flex-initial md:mt-1 md:flex-col md:max-w-xs text-xs font-sans bg-truegray-900 md:bg-opacity-90 px-2 py-1 md:rounded-xl mejiascrollbar`}>
     
        <div className='pl-1 pt-2 text-base flex flex-row flex-nowrap'>
          <svg xmlns="http://www.w3.org/2000/svg"
            onClick={(event) => {
              this.toggleList();
              checkStateOfSidebarAndUpdateOtherComponents();
            }}
            className="h-6 w-6 flex-shrink md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg><p className='flex-grow  scrollbar scrollbar-thumb-gray-400 scrollbar-rounded scrollbar scrollbar-thin scrollbar-trackgray-900 font-bold'>List of By-Resolution Areas</p>
        
        </div>
        {
      featuresTotal.features.map((eachFeature:any,eachFeatureIndex:any) => (
        <div className=' bg-truegray-800 my-2 px-2 py-1 rounded-sm ' key={eachFeatureIndex} onClick={(event) => {
          this.toggleList();
          checkStateOfSidebarAndUpdateOtherComponents();
          this.setState((state: any, props: any) => {
            return {
              isPopupActive: true,
              featureSelected: eachFeature
            }
          })
          this.flyToPoint(eachFeature.properties.centroid.geometry.coordinates[0], eachFeature.properties.centroid.geometry.coordinates[1], this.map, eachFeature, eachFeatureIndex,
            featuresTotalBuffer.features[eachFeatureIndex])
          }}>
            {
              eachFeature.properties.place_name && (
                <p className='font-bold py-2'>{eachFeature.properties.place_name}</p>
              )
            }
            
          <p className='font-bold py-2'>{eachFeature.properties.address}</p>
       
          <p>{(eachFeature.properties.buffer === '1000' && (
            <span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-1 py-1 mr-1 font-xs'>1000ft</span>
          ))}
            {(eachFeature.properties.buffer === '500' && (
            <span className='font-mono h-1 w-1 bg-red-600 text-black rounded-full px-1 py-1 mr-1 font-xs'>500ft</span>
            ))}
            {eachFeature.properties.category}<br>
            </br>
            <p className='py-2'>{parseInt(eachFeature.properties.set, 10) > this.state.currentSet && (
              "Pending "
            )}
              {parseInt(eachFeature.properties.set, 10) <= this.state.currentSet && (
              "Enacted "
            )}
              {eachFeature.properties.date}</p>
            {/*eachFeature.properties.centroid.geometry.coordinates[0]} {eachFeature.properties.centroid.geometry.coordinates[1]*/}
            <p className='pt-1 underline py-1'>View on Map</p>
          </p>
       </div>
      ))
    }
      </div>

      
    </div>
  
   
    <div ref={this.mapContainer} style={{
      
    }} className="map-container" />

         
<DisclaimerPopup
        open={this.state.disclaimerOpen}
        openModal={this.openModal}
        closeModal={this.closeModal}
        />

<div className={`absolute md:mx-auto z-9 bottom-2 left-1 md:left-1/2 md:transform md:-translate-x-1/2`}>
<a href='https://mejiaforcontroller.com/' target="_blank">
    
  
                  <img src='/mejia-watermark-smol.png' className='h-9 md:h-10'></img>
                  
    </a>
  
                </div>

    {this.state.isPopupActive && (
    <div className={`
    text-xs absolute bottom-3 left-3 md:right-4 md:left-auto md:bottom-9 w-auto text-white z-10 popupbox z-auto  rounded-sm bg-opacity-75`}>
         
         <div className='' onClick={(event) => {
          this.setState((state: any, props: any) => {
            return {
              isPopupActive:false
            }
          })
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>
        </div>
        <div className='bg-truegray-900 border-2 px-2 py-2 md:font-base max-w-xxs md:w-max-sm md:w-auto'>
     {this.state.featureSelected.properties.place_name && (
       <p className='font-bold'>{this.state.featureSelected.properties.place_name}</p>
     )}
        <p className='font-bold'>{this.state.featureSelected.properties.address}</p>
          {(this.state.featureSelected.properties.buffer === '1000' && (
            <span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-1 py-1 mr-1 font-xs md:font-base'>1000ft</span>
          ))}
            {(this.state.featureSelected.properties.buffer === '500' && (
            <span className='font-mono h-1 w-1 bg-red-600 text-black rounded-full px-1 py-1 mr-1 font-xs  md:font-base'>500ft</span>
          ))}
          {this.state.featureSelected.properties.category}
          {this.state.featureSelected.properties.autoadd && (
                <span className='font-mono h-1 w-1 bg-blue-400 text-black rounded-full px-1 py-1 mr-1 font-xs  md:font-base'>Auto Added</span>
          )}
          <p>{parseInt(this.state.featureSelected.properties.set, 10) > this.state.currentSet && (
              "Pending "
            )}
              {parseInt(this.state.featureSelected.properties.set, 10) <= this.state.currentSet && (
              "Enacted "
            )}
              {this.state.featureSelected.properties.date}</p>
        </div>
       
                
    

    </div>

    )}

  
    
    <div className='absolute z-10 md:hidden rounded-full bottom-3 right-3 bg-mejito w-16 h-16 '
      onClick={(event: any) => {
        this.toggleList();
        checkStateOfSidebarAndUpdateOtherComponents();
      }}>
     
      {
  this.state.isButtonExit === false && (
    <svg width="24" height="24" fill="none" className="text-black absolute m-auto top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform scale-80">
    <path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"></path>  
    </svg>
  )
}
      {
  this.state.isButtonExit === true && (
<svg width="24" height="24"  xmlns="http://www.w3.org/2000/svg" className="text-black absolute m-auto top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform scale-80"
       fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>
  )
}


      
    </div>
</div>

</MantineProvider>
);

}

}
