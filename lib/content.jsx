import $ from 'jquery';
import React from 'react';
import _ from 'lodash-node';

const ContentEditable = React.createClass({

  shouldComponentUpdate: function(nextProps){
    const html = React.findDOMNode(this).innerHTML;// this.getDOMNode().innerHTML;
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
    let html = this.props.para ? '<p>' : '<div>';
    const words = [];

    const tokens = this.props.text.split(' ');
    const unit = (this.props.end - this.props.start) / tokens.length;

    for (let i = 0; i < tokens.length; i++) {
      words.push({
        name: tokens[i],
        time: Math.floor(this.props.start + i * unit),
      });

      let classes = '';
      if (words[i].time < 0 || isNaN(words[i].time)) classes += ' unedited';
      if (words[i].time > -1 && words[i].time < this.props.time) classes += ' past';
      html += '<span title="' + words[i].time + '" class="' + classes + '">' + _.escape(tokens[i]) + ' </span>';
    }

    html += this.props.para ? '</p>' : '</div>';
    this.html = html;

    return (
      <div id="contenteditable"
        dangerouslySetInnerHTML={{__html: html}}></div>
      );
  },
});

export default ContentEditable;
