import {bootstrap} from './bootstrap';
bootstrap();


import React from 'react';
import Router from 'tiny-react-router';

import Root from './root.jsx!';
import About from './about.jsx!';
import Ingest from './ingest.jsx!';
import Transcript from './transcript.jsx!';


let routes = {
  '/': Root,
  '/about': About,
  '/ingest/:id': Ingest,
  '/transcript/:id/:lang': Transcript
};

React.render((
  <Router routes={routes} />
), document.getElementById('root'));

