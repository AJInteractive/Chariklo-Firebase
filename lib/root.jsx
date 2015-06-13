import React from 'react';
import ReactFireMixin from 'reactfire';
import Firebase from 'firebase';

var Root = React.createClass({
  mixins: [ReactFireMixin],
  
  componentWillMount: function() {
    this.bindAsArray(new Firebase("https://chariklo.firebaseio.com/items/"), "items");
  },
  
  render: function() {
    console.log(this.state);
    return (
      <h1>
        Hello, world!
      </h1>
    );
  }
});

export default Root;