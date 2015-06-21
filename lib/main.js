import {bootstrap} from './bootstrap';
bootstrap();


import React from 'react';
import Router from 'tiny-react-router';

import Root from './root.jsx!';
import About from './about.jsx!';
import Ingest from './ingest.jsx!';
import Transcript from './transcript.jsx!';
import Player from './player.jsx!';


let routes = {
  '/': Root,
  '/about': About,
  '/ingest/:id': Ingest,
  '/transcript/:id/:lang': Transcript,
  '/transcript/:id/:lang/:suffix': Transcript,
  '/play/:id/:lang': Player,
  '/play/:id/:lang/:suffix': Player
};

React.render((
  React.createElement(Router, {routes})
), 
  document.getElementById('root')
);

