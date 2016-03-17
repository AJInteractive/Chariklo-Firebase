import 'normalize.css';
import '#google Fira Mono,Fira Sans,Amiri !font';
import './main.css!';

import Raven from 'raven-js';


// import dat from 'dat-gui';
// import 'github:liabru/dat-gui-light-theme@master/dat-gui-light-theme.css!';

export function bootstrap() {
  window.Raven = Raven;

  Raven.config('https://28917a888066444eb5b3751b725a859f@app.getsentry.com/46074', {
    // pass along the version of your application
    // release: '1.0.0',
    // we highly recommend restricting exceptions to a domain in order to filter out clutter
    // whitelistUrls: ['example.com/scripts/']
  }).install();

  window.gui = new window.dat.GUI();

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
}
