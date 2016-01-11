import ReactDOM from 'react-dom';
import Root from './Root';
import { createHistory } from 'history';

// Import required so that React is available even
// though it is not used in this file
import React from 'react';

// CSS
require('./purecss/pure-min.css');
require('./purecss/grids-responsive-min.css');
require('./index.css');

require('font-awesome-webpack');

window.THREE = require('three');

ReactDOM.render(
  <Root history={ createHistory() } />,
  document.getElementById('container')
);
