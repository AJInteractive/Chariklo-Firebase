import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';
import ContentEditable from 'react-contenteditable/index.js!jsx';

var Root = React.createClass({
  mixins: [ReactFireMixin],
  
  componentWillMount: function() {
    this.bindAsArray(new Firebase("https://chariklo.firebaseio.com/items/"), "items");
  },
  
  getInitialState: function(){
    return {html: "<p><b>Hello <i>World</i></b></p>"};
  },
  
  handleChange: function(evt){
    this.setState({html: evt.target.value});
  },
  
  // render: function() {
  //   console.log(this.state);
  //   return (
  //     <h1>
  //       Hello, world!
  //     </h1>
  //   );
  // }
  
  render: function(){
    console.log(this.state, this.firebaseRefs["items"]);
    return <ContentEditable html={this.state.html} onChange={this.handleChange} />
  }
});

export default Root;