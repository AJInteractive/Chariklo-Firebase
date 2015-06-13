import 'normalize.css';
import '#google Fira Mono,Fira Sans,Amiri !font';
import './main.css!';
// import 'github:liabru/dat-gui-light-theme@master/dat-gui-light-theme.css!';

// import _ from 'lodash-node';

import dat from 'dat-gui';


export function bootstrap() {
  
  var gui = new dat.GUI();

  var controls = {
    message: 'lorem ipsum'
  };
  
  // var FrameRates = {
  //   film: 24,
  //   NTSC : 29.97,
  //   NTSC_Film: 23.98,
  //   NTSC_HD : 59.94,
  //   PAL: 25,
  //   PAL_HD: 50,
  //   web: 30,
  //   high: 60
  // };

  gui.add(controls, 'message');

}