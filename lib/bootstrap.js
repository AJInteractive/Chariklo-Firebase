import 'normalize.css';
import '#google Fira Mono,Fira Sans !font';
import './main.css!';
// import 'github:liabru/dat-gui-light-theme@master/dat-gui-light-theme.css!';

// import _ from 'lodash-node';

import dat from 'dat-gui';


export function bootstrap() {
  
  var gui = new dat.GUI();

  var controls = {
    message: 'lorem ipsum'
  };

  gui.add(controls, 'message');

}