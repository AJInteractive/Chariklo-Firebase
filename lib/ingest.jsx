import $ from 'jquery';
import Firebase from 'firebase';

export function ingestSetup() {
  
  $('#ingest button').click(function(){
    var text = $('#ingest textarea').val().split(/\n/);
    console.log(text);
    
    var ref = new Firebase("https://chariklo.firebaseio.com/");
    var itemsRef = ref.child("items");
    
    for (var i = 0; i < text.length; i++) {
      if (text[i] == '') continue;
      var itemRef = itemsRef.push({
          foo: "bar",
          index: i,
          text: text[i]
      });
      console.log(itemRef.key());
    }
  });
  
}