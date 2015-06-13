import $ from 'jquery';
import React from 'react';

var ContentEditable = React.createClass({
  
  html: '',
  
  render: function(){
    
    var html = '<p>';
    var words = [];
    
    var tokens = this.props.text.split(' ');
    var unit = (this.props.end - this.props.start)/tokens.length;
            
    for (var i = 0; i < tokens.length; i++) {
    
      words.push({
        name: tokens[i],
        time: Math.floor(this.props.start + i*unit)
      });
      
      var classes = '';
      if (words[i].time < 0 || isNaN(words[i].time)) classes += ' unedited';
      if (words[i].time > -1 && words[i].time < this.props.time) classes += ' past';
      html += '<span title="' + words[i].time + '" class="' + classes + '">' + tokens[i] + ' </span>';
    }
    
    html += '</p>';    
    this.html = html;
    
    return (
      <div id="contenteditable"
        onInput={this.emitChange} 
        onBlur={this.emitChange}
        contentEditable
        dangerouslySetInnerHTML={{__html: html}}></div>
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
  
  // componentDidUpdate: function() {
  //   if ( this.html !== this.getDOMNode().innerHTML ) {
  //     this.getDOMNode().innerHTML = this.html;
  //   }
  // },

  emitChange: function(event) {
    var html = React.findDOMNode(this).innerHTML;//this.getDOMNode().innerHTML;
    var text = $(html).text().trim();
    if (this.props.onChange && html !== this.lastHtml && this.props.text !== text) {
      event.target = { 
        value: html,
        text: text
      };
      this.props.onChange(event);
    }
    this.lastHtml = html;
  }
});

export default ContentEditable;
