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

  var buffered:any;

 // console.log(eachFeatureIndex)
 // console.log(locations.features[eachFeatureIndex].properties.category)
  if (locations.features[eachFeatureIndex].properties.category.match(/Design/gi) || locations.features[eachFeatureIndex].properties.category.match(/Navigation/gi)) {
    buffered = turf.buffer(polygon, 1000, { units: 'feet' });
  //  console.log('1000ft', locations.features[eachFeatureIndex].properties.address)
  } else {
  buffered = turf.buffer(polygon, 500, { units: 'feet' });
  }

  buffered.properties = eachFeature.properties;
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

function showMapboxStuff() {
  /*
  var mapboxlogo = document.querySelector('.mapboxgl-ctrl-bottom-left')
  console.log('mapboxlogo')
  if (mapboxlogo) {
    mapboxlogo.classList.remove('hidden')
  }*/

  var mapboxtopright = document.querySelector(".mapboxgl-ctrl-top-right")
  console.log('topright',mapboxtopright)
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
  popupfunc: any;
  map: any;
constructor(props:any) {
super(props);
this.state = {
lng: -118.41,
  lat: 34,
  initialWindowWidth: window.innerWidth,
  isPopupActive: false,
  zoom: formulaForZoom(),
  featureSelected: {},
  infoBoxShown: true
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
 
  var mapboxlogo = document.querySelector('.mapboxgl-ctrl-bottom-left')
  if (mapboxlogo) {
    mapboxlogo.classList.add('hidden')
  }

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
  
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
      className=' outsideTitle max-h-screen flex-col flex z-50'
    >
      <div className='titleBox max-h-screen mt-2 ml-2 md:mt-3 md:ml-3 break-words'>41.18 By-Resolution Areas</div>
 
      <div className='flex flex-col md:flex-row w-auto md:auto md:flex-nowrap '>
      {this.state.infoBoxShown && (
          <div
          className='flex-none font-sans mt-5 md:mt-3 space-y-2 p-2 banned-box-text ml-2 md:ml-3 bg-truegray-900 bg-opacity-90 md:bg-opacity-70 rounded-xl text-xs' style={{
          
        }}> <div className='md:max-w-xs'>Banned: sit, lie, sleep, or store, use, maintain, or place personal property within:</div>
        <div
        className='md:max-w-xs'
        ><span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-2 py-1 mr-2'>1000ft</span>Facility providing shelter, safe sleeping, safe parking, or serving as a homeless services navigation center</div>
         <div
        className='md:max-w-xs' 
          ><span className='font-mono h-1 w-1 bg-red-600 rounded-full px-2 py-1 mr-2'>500ft</span>Other locations (school, park, tunnel, underpass, bridge, active railway, etc.)</div>
         <div className='md:max-w-xs'>Only covers by-resolution locations, not other locations. See ordinance for more.</div>
            <div className='flex-row'>
            <a  target="_blank" rel='external' className='underline text-mejito' href='https://clkrep.lacity.org/onlinedocs/2020/20-1376-S1_ord_187127_09-03-21.pdf'>41.18 Ordinance</a>
            <a  target="_blank" rel='author' className='underline text-mejito ml-4' href='https://mejiaforcontroller.com'>Mejia For Controller</a>
          </div>
        </div>
    )}
        <div className={`hidden md:block flex-none ${this.state.infoBoxShown ? 'absolute' : ''} w-6 h-6 bg-opacity-95 bg-mejito text-black rounded-full md:ml-3 md:my-3`}
          
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
     
      
      <div className={`w-screen md:w-auto mejiascrollbar scrollbar-thumb-gray-400 scrollbar-rounded scrollbar scrollbar-thin scrollbar-trackgray-900 max-h-screen transform overflow-y-auto transition-all z-50 sidebar-4118-list md:ml-3 absolute md:static ${(this.state.initialWindowWidth >= 768)  ? "" : "-translate-x-full"} md:block md:flex-initial md:mt-1 md:flex-col md:max-w-xs text-xs font-sans bg-truegray-900 md:bg-opacity-90 px-2 py-1 md:rounded-xl md:mb-10`}>
     
        <div className='pl-1 pt-2 text-base flex flex-row flex-nowrap'>
          <svg xmlns="http://www.w3.org/2000/svg"
            onClick={(event) => {
              this.toggleList();
              checkStateOfSidebarAndUpdateOtherComponents();
            }}
            className="h-6 w-6 flex-shrink md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg><p className='flex-grow  scrollbar scrollbar-thumb-gray-400 scrollbar-rounded scrollbar scrollbar-thin scrollbar-trackgray-900 '>List - By-Resolution Areas</p>
        
        </div>
        {
      featuresTotal.features.map((eachFeature:any,eachFeatureIndex:any) => (
        <div className=' bg-truegray-800 my-2 px-2 py-1 rounded-sm ' key={eachFeatureIndex} onClick={(event) => {
          this.toggleList();
          checkStateOfSidebarAndUpdateOtherComponents();
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
  
   
    <div ref={this.mapContainer} style={{
      
    }} className="map-container" />

    {this.state.isPopupActive && (
    <div className={`
    text-xs absolute bottom-4 left-4 md:right-4 md:left-auto w-70 md:w-auto  text-white z-10 popupbox z-auto  rounded-sm bg-opacity-75`}>
         
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
        <div className='bg-truegray-900  border-2 px-2 py-2  md:font-base'>
        <p className='font-bold'>{this.state.featureSelected.properties.address}</p>
    {(this.state.featureSelected.properties.buffer === '1000' && (
            <span className='font-mono h-1 w-1 bg-yellow-500 text-black rounded-full px-1 py-1 mr-1 font-xs md:font-base'>1000ft</span>
          ))}
            {(this.state.featureSelected.properties.buffer === '500' && (
            <span className='font-mono h-1 w-1 bg-red-600 text-black rounded-full px-1 py-1 mr-1 font-xs  md:font-base'>500ft</span>
          ))}
    {this.state.featureSelected.properties.category}
        </div>
       
    </div>
    )}
    
    <div className='absolute z-10 md:hidden rounded-full bottom-4 right-4 bg-mejito w-16 h-16 '
      onClick={(event: any) => {
        this.toggleList();
        checkStateOfSidebarAndUpdateOtherComponents();
      }}>
      <svg width="24" height="24" fill="none" className="text-black absolute m-auto top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform scale-80">
      <path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"></path>  
      </svg>
    </div>
</div>
);
}
}