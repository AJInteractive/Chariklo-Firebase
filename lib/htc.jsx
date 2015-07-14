import $ from 'jquery';
import React from 'react';
import _ from 'lodash-node';

var ContentEditable = React.createClass({

  html: '',

  render: function() {

    var html = '';//'<p>';
    var words = [];

    var tokens = this.props.text.split(' ');
    var unit = (this.props.end - this.props.start)/tokens.length;

    var lastTime = 0;
    for (var i = 0; i < tokens.length; i++) {

      var time = Math.floor(this.props.start + i*unit);

      if (time < lastTime) time = lastTime; //no past
      if (time === lastTime) time = time + 1; //always in the future

      words.push({
        name: tokens[i],
        time: time
      });


      // var classes = '';
      // if (words[i].time < 0 || isNaN(words[i].time)) classes += ' unedited';
      // if (words[i].time > -1 && words[i].time < this.props.time) classes += ' past';
      html += '<a data-m="' + words[i].time + '">' + _.escape(tokens[i]) + ' </a>';
    }

    // html += '</p>';
    this.html = html;

    lastTime = time;

    return (
      <p
        dangerouslySetInnerHTML={{__html: html}}></p>
      );
  },

  shouldComponentUpdate: function(nextProps){
    var html = React.findDOMNode(this).innerHTML;//this.getDOMNode().innerHTML;
    var text = $(html).text().trim();

    return (nextProps.text !== text
      || nextProps.start !== this.props.start
      || nextProps.end !== this.props.end
      || (nextProps.time !== this.props.time
        && (this.props.time > this.props.start && this.props.time < this.props.end)
        && (nextProps.time > this.props.start && nextProps.time < this.props.end)
      )
    );
  },

});

export default ContentEditable;
