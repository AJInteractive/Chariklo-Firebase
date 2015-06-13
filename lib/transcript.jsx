import $ from 'jquery';
import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import ContentEditable from 'react-contenteditable/index.js!jsx';

ReactFireMixin._toArray = function(obj) {
  var out = [];
  if (obj) {
    if (this._isArray(obj)) {
      out = obj;
    }
    else if (typeof(obj) === "object") {
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
    return {lines: []};
  },
  
  componentWillMount: function() {
    this.bindAsArray(new Firebase('https://chariklo.firebaseio.com/transcript-' + this.props.id + '-' + this.props.lang), 'lines');
  },
  
  componentWillUnmount: function() {
    this.unbind('lines');
  },
    
  handleChangeFor: function(key) {
    var self = this;
    return function(event) {      
      var lineRef = self.firebaseRefs.lines.child(key);
      lineRef.update({
        text: $(event.target.value).text()
      });
    };
  },
  
  createLine: function(line, index) {
    return (
      <div key={line.key} className={line.para?'paragraph':'line'}>
        <ContentEditable html={'<p>' + line.text + '</p>'} onChange={this.handleChangeFor(line.key)} />
      </div>
    );
  },
      
  render: function() {
    console.log(this.state);
    return (
      <article className="transcript">
        <header>
          <h1>Transcript {this.props.id}-{this.props.lang}</h1>
        </header>
        <section>
          {this.state.lines.map(this.createLine)}
        </section>
      </article>
    );
  }
  
});



export default Transcript;