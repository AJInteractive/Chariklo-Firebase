import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
// import ContentEditable from 'react-contenteditable/index.js!jsx';
import ContentEditable from './contenteditable.jsx!';

import $ from 'jquery';
import _ from 'lodash-node';
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
      video: null,
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
      this.bindAsArray(
        this.firebaseRef.child('transcript-' 
        + nextProps.id 
        + '-' + nextProps.lang
        + (nextProps.suffix?'-' + nextProps.suffix : '')
      ).orderByChild('sort'), 'lines');
    }
  },
  
  componentWillMount: function() {
    this.firebaseRef = new Firebase('https://chariklo.firebaseio.com/');
    this.bindAsArray(
      this.firebaseRef.child('transcript-' 
      + this.props.id 
      + '-' + this.props.lang
      + (this.props.suffix?'-' + this.props.suffix : '')
    ).orderByChild('sort'), 'lines');
    
    var self = this;
    var videosRef = this.firebaseRef.child('videos-' + this.props.lang);
    videosRef.orderByChild('id').startAt(this.props.id).endAt(this.props.id).once('value', function(snapshot) {
      var value = snapshot.val();
      for (var key in value) {
        var data = value[key];
        if (data.id == self.props.id) {
          var video = data['vimeo sd'];
          if (video == '') video = data['vimeo hd'];
          self.setState({video});
        } 
      }
    });
  },
  
  componentWillUnmount: function() {
    // this.unbind('lines');
    if (this.media) {
      this.media.removeEventListener('timeupdate', this.mediaTimeupdate);
    }
  },
    
  handleTextChangeFor: function(key, index, order) {
    var self = this;
    return function(event) {
      var paras = $(event.target.value).filter('p');
      
      if (paras.length > 1) {
        // assume 2 paras only
        var lineRef = self.firebaseRefs.lines.child(key);
        
        var nextLine = {order: order + 1337};
        if (index < self.lines.length - 1) nextLine = self.lines[index + 1];
        
        var end = Math.floor((self.lines[index].end + self.lines[index].start)/2);
        
        lineRef.update({
          end,
          text: $(paras[0]).text().trim()
        });
        
        self.firebaseRefs.lines.push({
          para: true,
          start: end,
          end: self.lines[index].end,
          text: $(paras[1]).text().trim(),
          order: (order + nextLine.order)/2
        });
        //
      } else {           
        var lineRef = self.firebaseRefs.lines.child(key);
        if (event.target.text == '') {
          lineRef.remove();
        } else {
          lineRef.update({
            text: event.target.text
          });
        }
      }
    };
  },
  
  setStartFor: function(key, index, start) {
    var self = this;
    return function(event) {      
      if (event.metaKey || event.shiftKey) {
        var lineRef = self.firebaseRefs.lines.child(key);
        lineRef.update({
          start: self.state.time
        });
      } else if (start != -1) {
        self.media.currentTime = start/1000;
        self.media.pause();
      }
    };
  },
  
  setEndFor: function(key, index, end) {
    var self = this;  
    return function(event) {     
      if (event.metaKey || event.shiftKey) { 
        var lineRef = self.firebaseRefs.lines.child(key);
        lineRef.update({
          end: self.state.time
        });
        // set next start if -1
        if (index < self.lines.length - 1 && self.lines[index + 1].start == -1) {
          var nextLineRef = self.firebaseRefs.lines.child(self.lines[index + 1].key);
          nextLineRef.update({
            start: self.state.time
          });
        }
      } else if (end != -1) {
        self.media.currentTime = end/1000;
        self.media.pause();
      }
    };
  },
  
  createLine: function(line, index) {
    var classes = 'top';
    if (line.end < this.state.time && line.end > 0) classes += ' past';
    
    if (this.props.lang == 'arabic') {
      return (
        <tr key={line.key + classes} className={line.para?'paragraph':'line'}>
          <td className="bottom">
            <button onClick={this.setEndFor(line.key, index, line.end)}>{line.end}</button>
          </td>
          <td className={classes}>
            <ContentEditable text={line.text.trim()} start={line.start} end={line.end} onChange={this.handleTextChangeFor(line.key, index, line.order)} time={this.state.time} />
          </td>
          <td className="baseline">
            <button onClick={this.setStartFor(line.key, index, line.start)}>{line.start}</button>
            <span>{line.start}</span>
          </td>
          <td className="baseline"><input type="checkbox" value={index + '|' + line.key} /></td>
        </tr>
      );
    } else {
      return (
        <tr key={line.key + classes} className={line.para?'paragraph':'line'}>
          <td className="baseline"><input type="checkbox" value={index + '|' + line.key} /></td>
          <td className="baseline">
            <button onClick={this.setStartFor(line.key, index, line.start)}>{line.start}</button>
            <span>{line.start}</span>
          </td>
          <td className={classes}>
            <ContentEditable text={line.text.trim()} start={line.start} end={line.end} onChange={this.handleTextChangeFor(line.key, index, line.order)} time={this.state.time} />
          </td>
          <td className="bottom">
            <button onClick={this.setEndFor(line.key, index, line.end)}>{line.end}</button>
          </td>
        </tr>
      );
    }
  },
  
  render: function() {
    this.lines = _.sortBy(this.state.lines, 'order');
    
    return (
      <article className={this.props.lang + ' transcript'}>
        <div className="box stripes pace-hide" ref="box">
          <span>{this.state.smpte}</span>
          <video ref="media" controls src={this.state.video}></video>
        </div>
        <header>
          <h1>Transcript {this.props.id}-{this.props.lang} {this.props.suffix}</h1>
        </header>
        <table>
          <tbody>
            {this.lines.map(this.createLine)}
          </tbody>
        </table>
      </article>
    );
  },
  
  componentDidMount: function() {
    
    var self = this;
    this.media = React.findDOMNode(this.refs.media);    
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
    
    this.controls = {
      speed: self.media.playbackRate,
      clear: function() {
        var $boxes = $('.transcript input[type="checkbox"]');
        $boxes.each(function(i, e){
          e.checked = false;
        });
      },
      merge: function() {
        var $boxes = $('.transcript input[type="checkbox"]');
        
        var checked = [];
        for (var i = 0; i < $boxes.length; i++) {
          if ($boxes.get(i).checked) checked.push($boxes.get(i));
        }
        
        if (checked.length > 2) return alert('cannot merge more than two at once');
        if (checked.length < 2) return alert('for merge you need two');
        
        var [a, p] = checked[0].value.split('|');
        var [b, q] = checked[1].value.split('|');
        
        if (parseInt(a) + 1 != parseInt(b)) return alert('cannot merge non-adjacent lines');
        
        var pRef = self.firebaseRefs.lines.child(p);
        var qRef = self.firebaseRefs.lines.child(q);
        
        var aLine = self.lines[a];
        var bLine = self.lines[b];
        
        pRef.update({
          end: bLine.end,
          text: aLine.text + ' ' + bLine.text 
        });
        
        qRef.remove();
        
        $boxes.each(function(i, e){
          e.checked = false;
        });
      }
    };

    this.speed = gui.add(this.controls, 'speed').min(1).max(4).step(1);
    this.speed.onChange(function(value) {
      self.media.playbackRate = value;
    });
    gui.add(this.controls, 'clear');
    gui.add(this.controls, 'merge');
    
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