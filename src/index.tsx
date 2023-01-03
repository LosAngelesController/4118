import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';

import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
  gtmId: 'G-MRSNR9Z25J'
}

TagManager.initialize(tagManagerArgs)


ReactDOM.render(
<React.StrictMode>
<App />
</React.StrictMode>,
document.getElementById('root')
);
