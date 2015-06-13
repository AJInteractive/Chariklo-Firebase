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



// import interact from 'interact.js';


//
//
//
//
// function dragMoveListener (event) {
//     var target = event.target,
//         // keep the dragged position in the data-x/data-y attributes
//         x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
//         y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
//
//     // translate the element
//     target.style.webkitTransform =
//     target.style.transform =
//       'translate(' + x + 'px, ' + y + 'px)';
//
//     // update the posiion attributes
//     target.setAttribute('data-x', x);
//     target.setAttribute('data-y', y);
//   }
//
//   // this is used later in the resizing demo
//   window.dragMoveListener = dragMoveListener;
//
// interact('.box')
//   .draggable({
//     onmove: window.dragMoveListener
//   })
//   .resizable({
//     edges: { left: true, right: true, bottom: true, top: true }
//   })
//   .on('resizemove', function (event) {
//     var target = event.target,
//         x = (parseFloat(target.getAttribute('data-x')) || 0),
//         y = (parseFloat(target.getAttribute('data-y')) || 0);
//
//     // update the element's style
//     target.style.width  = event.rect.width + 'px';
//     target.style.height = event.rect.height + 'px';
//
//     // translate when resizing from top or left edges
//     x += event.deltaRect.left;
//     y += event.deltaRect.top;
//
//     target.style.webkitTransform = target.style.transform =
//         'translate(' + x + 'px,' + y + 'px)';
//
//     target.setAttribute('data-x', x);
//     target.setAttribute('data-y', y);
//     // target.textContent = event.rect.width + '×' + event.rect.height;
//   });