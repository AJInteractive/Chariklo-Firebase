import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
// import ContentEditable from 'react-contenteditable/index.js!jsx';
import ContentEditable from './contenteditable.jsx!';

import $ from 'jquery';
import interact from 'interact.js';
import {VideoFrame} from 'X3TechnologyGroup/VideoFrame';

ReactFireMixin._toArray = function(obj) {
  var out = [];
  if (obj) {
    if (this._isArray(obj)) {
      out = obj;
    } else if (typeof(obj) === "object") {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var val = obj[key];
          val.key = key;
          out.push(val);
        }
      }
    }
  }
  return out;
};

var Transcript = React.createClass({
  mixins: [ReactFireMixin],
  
  getInitialState: function() {
    return {
      lines: [],
      time: 0,
      smpte: ''
    };
  },
  
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return (nextProps.id !== this.props.id || nextProps.lang !== this.props.lang);
  // },
  
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.id !== this.props.id || nextProps.lang !== this.props.lang) {
      this.unbind('lines');
      this.bindAsArray(new Firebase('https://chariklo.firebaseio.com/transcript-' + nextProps.id + '-' + nextProps.lang), 'lines');
    }
  },
  
  componentWillMount: function() {
    this.bindAsArray(new Firebase('https://chariklo.firebaseio.com/transcript-' + this.props.id + '-' + this.props.lang), 'lines');
  },
  
  componentWillUnmount: function() {
    this.unbind('lines');
    if (this.media) {
      this.media.removeEventListener( "timeupdate", this.mediaTimeupdate);
    }
  },
    
  handleTextChangeFor: function(key) {
    var self = this;
    return function(event) {      
      var lineRef = self.firebaseRefs.lines.child(key);
      lineRef.update({
        text: event.target.text
      });
    };
  },
  
  createLine: function(line, index) {
    // return (
    //   <div key={line.key} className={line.para?'paragraph':'line'}>
    //     <ContentEditable html={'<p>' + line.text + '</p>'} onChange={this.handleChangeFor(line.key)} />
    //   </div>
    // );
    return (
      <div key={line.key} className={line.para?'paragraph':'line'}>
        <ContentEditable text={line.text.trim()} start={line.start} end={line.end} onChange={this.handleTextChangeFor(line.key)} time={this.state.time} />
      </div>
    );
  },
      
  render: function() {
    return (
      <article className={this.props.lang + ' transcript'}>
        <div className="box stripes pace-hide" ref="box">
          <span>{this.state.smpte}</span>
          <video ref="media" controls src="http://player.vimeo.com/external/129669280.hd.mp4?s=e2b2185feabd68d101b37f5830c84404&profile_id=113"></video>
        </div>
        <header>
          <h1>Transcript {this.props.id}-{this.props.lang}</h1>
        </header>
        <section>
          {this.state.lines.map(this.createLine)}
        </section>
      </article>
    );
  },
  
  componentDidMount: function() {
    
    var self = this;
    this.media = this.refs.media.getDOMNode();    
    this.mediaTimeupdate = function (event) {
      var time = Math.round(1000*this.currentTime);
      var smpte = '';
      if (self.videoFrame) smpte = self.videoFrame.toSMPTE();
      self.setState({time, smpte});
    };
    this.media.addEventListener('timeupdate', this.mediaTimeupdate);
    
    this.videoFrame = window.VideoFrame({
      frameRate: 30
    });
    this.videoFrame.stopListen();
    
    /////////    
    function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }

      // this is used later in the resizing demo
      window.dragMoveListener = dragMoveListener;

    interact('.box')
      .draggable({
        onmove: window.dragMoveListener
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        // target.textContent = event.rect.width + '×' + event.rect.height;
      });
    /////////
  }
  
});



export default Transcript;