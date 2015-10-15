import $ from 'jquery';
import React from 'react';
import _ from 'lodash-node';

const ContentEditable = React.createClass({

  shouldComponentUpdate: function(nextProps){
    const html = React.findDOMNode(this).innerHTML;//this.getDOMNode().innerHTML;
    const text = $(html).text().trim();

    return (nextProps.text !== text
      || nextProps.start !== this.props.start
      || nextProps.end !== this.props.end
      || (nextProps.time !== this.props.time
        && (this.props.time > this.props.start && this.props.time < this.props.end)
        && (nextProps.time > this.props.start && nextProps.time < this.props.end)
      )
    );
  },

  html: '',

  render: function() {
    let html = '';//'<p>';
    const words = [];

    const tokens = this.props.text.split(' ');
    const unit = (this.props.end - this.props.start)/tokens.length;

    let lastTime = 0;
    let time = 0;
    for (let i = 0; i < tokens.length; i++) {

      time = Math.floor(this.props.start + i*unit);

      if (time < lastTime) time = lastTime; // no past
      if (time === lastTime) time = time + 1; // always in the future

      words.push({
        name: tokens[i],
        time: time,
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
      <p dangerouslySetInnerHTML={{__html: html}}></p>
    );
  },

});

export default ContentEditable;
