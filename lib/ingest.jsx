import React from 'react';
import Firebase from 'firebase';

const Ingest = React.createClass({

  getInitialState: function() {
    this.firebaseRef = new Firebase('https://chariklo.firebaseio.com/');
    return {value: ''};
  },

  render: function() {
    return (
      <article className="ingest">
        <header>
          <h1>Ingest {this.props.id}</h1>
        </header>
        <section>
          <br />
          <textarea ref="text" value={this.state.value} onChange={this._onChange}></textarea>
          <br />
          <button onClick={this._onClickTXT}>process</button>
          <hr />
          <button onClick={this._onClickVideo}>import video data</button>
        </section>
      </article>
    );
  },

  _onChange: function (event) {
    this.setState({value: event.target.value});
  },

  _onClickTXT: function (event) {
    const rows = this.state.value.split(/\n/);
    const itemsRef = this.firebaseRef.child(this.props.id);

    let para = false;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] === '') {
        para = true;
        continue;
      }

      const itemRef = itemsRef.push({
        start: -1,
        end: -1,
        para,
        order: i * 1337,
        text: rows[i],
      });

      console.log(itemRef.key());

      para = false;
    }
  },

  _tc2ms: function (tc) {
    const [hh, mm, ss, zz] = tc.split(':');
    return parseInt(zz, 10) + parseInt(ss, 10) * 1000 + parseInt(mm, 10) * 60000 + parseInt(hh, 10) * 3600000;
  },

  _mmss2ms: function (tc) {
    const [mm, ss] = tc.split(':');
    return parseInt(ss, 10) * 1000 + parseInt(mm, 10) * 60000;
  },

  _onClickSBV: function (event) {
    console.log(1);

    // const rows = this.state.value.split(/\n(?=\d\d:)/);
    const rows = this.state.value.split(/\n(?=\d\d:)/);
    const itemsRef = this.firebaseRef.child(this.props.id);

    // console.log(rows);

    const records = [];

    let para = false;
    let start = -1;
    let end = -1;
    let counter = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] === '') {
        para = true;
        continue;
      }

      const lines = rows[i].split(/\n/);
      const [startTC, endTC] = lines.shift().split(',');
      // const startTC = lines.shift();
      const text = lines.join(' ').trim();

      const zero = 1400000 + 32500;//1468229 - this._tc2ms('00:00:44:20'); //16000;
      start = this._tc2ms(startTC) + zero;
      end = this._tc2ms(endTC) + zero;

      // start = this._mmss2ms(startTC) + zero;
      // end = start;
      // if (i < rows.length - 1) {
      //   end = this._mmss2ms(rows[i + 1].split(/\n/).shift()) + zero;
      // }

      const data = {
        start,
        end,
        para,
        order: counter,
        text,
      };

      console.log(data);
      // counter = counter + 1337;
      // const itemRef = itemsRef.push(data);
      // console.log(itemRef.key());

      const tokens = text.split(' ');
      const unit = (end - start) / tokens.length;

      let k = 0;
      let p = 0;
      for (let j = 0; j < lines.length; j++) {
        p = k + lines[j].split(' ').length;
        const line = {
          start: parseInt(start + k * unit, 10),
          end: parseInt(start + p * unit, 10),
          para: lines[j].charAt(0).toUpperCase() === lines[j].charAt(0),
          order: counter,
          text: lines[j].trim(),
        };

        console.log(line);

        // const itemRef = itemsRef.push(line);
        // console.log(itemRef.key());

        records.push(line)

        k = p;
        counter = counter + 1337;
      }

      para = false;
    }

    // fold
    const folded = [records[0]];
    for (let r = 1; r < records.length; r++) {
      const rec = records[r];
      const prec = folded[folded.length - 1];

      if (rec.para) {
        folded.push(rec);
        continue;
      }

      prec.end = rec.end;
      prec.text += ' ' + rec.text;
    }

    console.log(folded);

    for (let f = 0; f < folded.length; f++) {
      const itemRef = itemsRef.push(folded[f]);
      console.log(itemRef.key());
    }
  },

  _onClickSBVTurkish: function (event) {
    console.log(1);

    // const rows = this.state.value.split(/\n(?=\d\d:)/);
    const rows = this.state.value.split(/\n(?=\d\d:)/);
    const itemsRef = this.firebaseRef.child(this.props.id);

    // console.log(rows);

    const records = [];

    let para = false;
    let start = -1;
    let end = -1;
    let counter = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] === '') {
        para = true;
        continue;
      }

      const lines = rows[i].split(/\n/);
      // const [startTC, endTC] = lines.shift().split(',');
      const startTC = lines.shift();
      const text = lines.join(' ').trim();

      const zero =0;//1468229 - this._tc2ms('00:00:44:20'); //16000;
      // start = this._tc2ms(startTC) + zero;
      // end = this._tc2ms(endTC) + zero;

      start = this._mmss2ms(startTC) + zero;
      end = start;
      if (i < rows.length - 1) {
        end = this._mmss2ms(rows[i + 1].split(/\n/).shift()) + zero;
      }

      const data = {
        start,
        end,
        para,
        order: counter,
        text,
      };

      console.log(data);
      // counter = counter + 1337;
      // const itemRef = itemsRef.push(data);
      // console.log(itemRef.key());

      const tokens = text.split(' ');
      const unit = (end - start) / tokens.length;

      let k = 0;
      let p = 0;
      for (let j = 0; j < lines.length; j++) {
        p = k + lines[j].split(' ').length;
        const line = {
          start: parseInt(start + k * unit, 10),
          end: parseInt(start + p * unit, 10),
          para: lines[j].charAt(0).toUpperCase() === lines[j].charAt(0),
          order: counter,
          text: lines[j].trim(),
        };

        console.log(line);

        // const itemRef = itemsRef.push(line);
        // console.log(itemRef.key());

        records.push(line)

        k = p;
        counter = counter + 1337;
      }

      para = false;
    }

    // fold
    const folded = [records[0]];
    for (let r = 1; r < records.length; r++) {
      const rec = records[r];
      const prec = folded[folded.length - 1];

      if (rec.para) {
        folded.push(rec);
        continue;
      }

      prec.end = rec.end;
      prec.text += ' ' + rec.text;
    }

    console.log(folded);

    for (let f = 0; f < folded.length; f++) {
      const itemRef = itemsRef.push(folded[f]);
      console.log(itemRef.key());
    }
  },

  _onClickVideo: function (event) {
    return alert('disabled');
    const videos = videosArabic;
    const videosRef = this.firebaseRef.child('videos-arabic');


    for (let i = 1; i < videos.length; i++) {

      const videoRef = videosRef.push({
        "id": '' + videos[i][0],
        "title": '' + videos[i][1],
        "youtube": '' + videos[i][2],
        "mobile": '' + videos[i][3],
        "vimeo sd": '' + videos[i][4],
        "vimeo hd": '' + videos[i][5]
      });

      console.log(videoRef.key());
    }
  }

});

export default Ingest;


/*eslint-disable */

// var videosBosnian = [
//   [
//       "id",
//       "title",
//       "youtube",
//       "mobile",
//       "vimeo sd",
//       "vimeo hd",
//       ""
//   ],

  // [125,"Born in 48","Rođene '48-e","","https://player.vimeo.com/external/143461251.mobile.mp4?s=92a621d2956fc5556f45a62520327725&profile_id=116","https://player.vimeo.com/external/143461251.sd.mp4?s=8d9751c7899cd5d5391750c8daf6c24a&profile_id=112","https://player.vimeo.com/external/143461251.hd.mp4?s=3fca831541bbfccec36176a619f7931c&profile_id=113"],

  // [25,"Born in 48","Rođene '48-e","","https://player.vimeo.com/external/143459104.mobile.mp4?s=aaa325050a0d4bb086c90705135be40d&profile_id=116","https://player.vimeo.com/external/143459104.sd.mp4?s=c914616351697cbd111910d866d25219&profile_id=112","https://player.vimeo.com/external/143459104.hd.mp4?s=874e4ec0ac3965e8d25209793e521f0b&profile_id=113"],

  // [27,"Palestine Divided","Podijeljena Palestina","","https://player.vimeo.com/external/143459104.mobile.mp4?s=aaa325050a0d4bb086c90705135be40d&profile_id=116","https://player.vimeo.com/external/143459104.sd.mp4?s=c914616351697cbd111910d866d25219&profile_id=112",""],

  // [15,"The price of Oslo 2","Cijena Osla: drugi dio","","http://player.vimeo.com/external/110128580.mobile.mp4?s=0e84a5982ae709daae97a674ce5f9963","http://player.vimeo.com/external/110128580.sd.mp4?s=3afbf306fcbfea47d6f704cdcc7e0252","http://player.vimeo.com/external/110128580.hd.mp4?s=0b2f0a61204844bd72b012c6b653bbe7"],
  // [20,"Al Nakba 4","Al Nakba: Palestinska katastrofa, Epizoda 4","","http://player.vimeo.com/external/110121999.mobile.mp4?s=6e0952b3840090ccffd4319dc05f5d56","http://player.vimeo.com/external/110121999.sd.mp4?s=40b3b4273361a1450ebe70e0dbcecc74","http://player.vimeo.com/external/110121999.hd.mp4?s=6d22706046eda0e76c00e4390ab47993"]

    // [
    //     23,
    //     'Stories from the Intifada 1',
    //     'Pri\u010de Intifade 1',
    //     '',
    //     'https://player.vimeo.com/external/142124820.mobile.mp4?s=ee711f61e66f7498254fdd0f51eb753c&profile_id=116',
    //     'https://player.vimeo.com/external/142124820.sd.mp4?s=06d778fc351790d95c61f5229fa23858&profile_id=112',
    //     ''
    // ],
    // [
    //     24,
    //     'Stories from the Intifada 2',
    //     'Pri\u010de Intifade 2',
    //     '',
    //     'https://player.vimeo.com/external/142124819.mobile.mp4?s=03a07412230abbd7162a9ffb6e4493e6&profile_id=116',
    //     'https://player.vimeo.com/external/142124819.sd.mp4?s=452112ba0471f46f385d8e9c98b92a97&profile_id=112',
    //     ''
    // ],
    // [
    //     22,
    //     'Return to Morocco',
    //     'Povratak u Maroko',
    //     '',
    //     'https://player.vimeo.com/external/142124821.mobile.mp4?s=64f9d26a081d5c58cb2617e36863d981&profile_id=116',
    //     'https://player.vimeo.com/external/142124821.sd.mp4?s=97c09efc15494bb933caae00280525e7&profile_id=112',
    //     ''
    // ],
    // [
    //     21,
    //     'The Deportees',
    //     'Deportovani',
    //     '',
    //     'https://player.vimeo.com/external/142124823.mobile.mp4?s=06406311f463e22ef8ef7ae9afe25d57&profile_id=116',
    //     'https://player.vimeo.com/external/142124823.sd.mp4?s=22e255f93d353efae62552eac07ae679&profile_id=112',
    //     ''
    // ],
    // [
    //     26,
    //     'Jerusalem Hitting Home',
    //     'Jeruzalem: ru\u0161enje domova',
    //     '',
    //     'https://player.vimeo.com/external/142124822.mobile.mp4?s=28c8dfebd5cdaf962c7d75c9898ad11b&profile_id=116',
    //     'https://player.vimeo.com/external/142124822.sd.mp4?s=81b9a8e6728de0b82ff0cbd51ce53e54&profile_id=112',
    //     ''
    // ]
// ];


// var videosTurkish = [
//     [
//         "id",
//         "title",
//         "youtube",
//         "mobile",
//         "vimeo sd",
//         "vimeo hd",
//         ""
//     ],
//     [
//         21,
//         'Deportees',
//         '',
//         '',
//         'https://player.vimeo.com/external/142108848.mobile.mp4?s=fc518d0cc85e5f3abd549fa0d557f507&profile_id=116',
//         'https://player.vimeo.com/external/142108848.sd.mp4?s=cdec2011c88fff0949e658e1e2f926a7&profile_id=112',
//         'https://player.vimeo.com/external/142108848.hd.mp4?s=a94041da0de4b0aca91146820a9af7b4&profile_id=113'
//     ],
//     [
//         22,
//         'Return to Morocco',
//         '',
//         '',
//         'https://player.vimeo.com/external/142108849.mobile.mp4?s=09ed7afbdc522f5ff845a215c717f490&profile_id=116',
//         'https://player.vimeo.com/external/142108849.sd.mp4?s=0e05c9160371b50c0328dd0eb8a20e95&profile_id=112',
//         'https://player.vimeo.com/external/142108849.hd.mp4?s=2f4646f17b8f69364669d69de4f918e8&profile_id=113'
//     ],
//     [
//         23,
//         'Stories from the Intifada p1',
//         '',
//         '',
//         'https://player.vimeo.com/external/142108847.mobile.mp4?s=4b8bdf25a9db0ee92ec4d409f07c4a59&profile_id=116',
//         'https://player.vimeo.com/external/142108847.sd.mp4?s=0100608d3d338ae29df2860a3fcd917e&profile_id=112',
//         'https://player.vimeo.com/external/142108847.hd.mp4?s=9c0adb96b1b456ac127e54478315c35a&profile_id=113'
//     ],
//     [
//         24,
//         'Stories from the Intifada p2',
//         '',
//         '',
//         'https://player.vimeo.com/external/142108846.mobile.mp4?s=6fc024c14104b051f1ecbe35ef9cd8ec&profile_id=116',
//         'https://player.vimeo.com/external/142108846.sd.mp4?s=a2b0cfe1b297745cfd14a29f5a511814&profile_id=112',
//         'https://player.vimeo.com/external/142108846.hd.mp4?s=9305ffe4ca8cacafb55b2fefaa080fd6&profile_id=113'
//     ],
//     [
//         25,
//         'Born in 1948',
//         '',
//         '',
//         'https://player.vimeo.com/external/142480739.mobile.mp4?s=30d4afd2163600c5f110242c6e381247&profile_id=116',
//         'https://player.vimeo.com/external/142480739.sd.mp4?s=279744fada390b84a889bf555ac03117&profile_id=112',
//         'https://player.vimeo.com/external/142480739.hd.mp4?s=c9b5b6d280c854002d71bdf1c7191aed&profile_id=113'
//     ],
//     [
//         26,
//         'Jerusalem Hitting Home',
//         '',
//         '',
//         'https://player.vimeo.com/external/142397473.mobile.mp4?s=1b0c70d604c385cafeadd30924f2626a&profile_id=116',
//         'https://player.vimeo.com/external/142397473.sd.mp4?s=eb1978b3b964dab165e235d9a62cb599&profile_id=112',
//         'https://player.vimeo.com/external/142397473.hd.mp4?s=8e6a81872e38db9c5eb4c59efa7f1430&profile_id=113'
//     ],
//     [
//         27,
//         'Divided Homeland',
//         '',
//         '',
//         'https://player.vimeo.com/external/142480740.mobile.mp4?s=d597c9d8b78d1287cc8e8fc0acb5044e&profile_id=116',
//         'https://player.vimeo.com/external/142480740.sd.mp4?s=3109d866b70575543943f482458a85ae&profile_id=112',
//         'https://player.vimeo.com/external/142480740.hd.mp4?s=af75712cf0bcfaff5dab48bfd066127f&profile_id=113'
//     ]
// ];


var videosEnglish = [
    [
        "id",
        "title",
        "youtube",
        "mobile",
        "vimeo sd",
        "vimeo hd",
        ""
    ],
    // [28,"Human Shields","","https://player.vimeo.com/external/159054725.sd.mp4?s=b1e2833e64320058079edd92a1b21ff4659ce32c&profile_id=164","https://player.vimeo.com/external/159054725.sd.mp4?s=b1e2833e64320058079edd92a1b21ff4659ce32c&profile_id=165","https://player.vimeo.com/external/159054725.hd.mp4?s=584622d084620407c3f7b0a6c3455af021fe1d62&profile_id=113"],
    // [29,"Dividing Al Aqsa","","https://player.vimeo.com/external/159054743.sd.mp4?s=4f1de8cee9200a56a0830a76c5257f669e3cc5e4&profile_id=164","https://player.vimeo.com/external/159054743.sd.mp4?s=4f1de8cee9200a56a0830a76c5257f669e3cc5e4&profile_id=165","https://player.vimeo.com/external/159054743.hd.mp4?s=9e9384a3781ab76447a5c9f5a80f686d987d51c1&profile_id=113"],
    // [30,"Defying my disability","","https://player.vimeo.com/external/159054753.sd.mp4?s=4d71979540ad2dc9bd641277f07e2361c79cb5ac&profile_id=164","https://player.vimeo.com/external/159054753.sd.mp4?s=4d71979540ad2dc9bd641277f07e2361c79cb5ac&profile_id=165","https://player.vimeo.com/external/159054753.hd.mp4?s=e325a465c9e1e3d55b1b4e0e446d89f848bd4aac&profile_id=113"]
//     [
//         0,
//         "Going against the grain",
//         "http://www.youtube.com/watch?v=4hRzdAgc8FM",
//         "http://player.vimeo.com/external/109585527.mobile.mp4?s=7cc3e82e7500925575fa4a80aa38a380",
//         "http://player.vimeo.com/external/109585527.sd.mp4?s=e99f33109ff46499874083681f22910a",
//         "http://player.vimeo.com/external/109585527.hd.mp4?s=7bd504c45f373de7f627177e3c3f1bcb",
//         ""
//     ],
//     [
//         1,
//         "Against the wall",
//         "http://www.youtube.com/watch?v=HomYG95MO3k",
//         "http://player.vimeo.com/external/109585525.mobile.mp4?s=0e9cf2efcd029f38f4ac24adf0e04527",
//         "http://player.vimeo.com/external/109585525.sd.mp4?s=b84469ac8b71df005ce2da6ec1568e7f",
//         "http://player.vimeo.com/external/109585525.hd.mp4?s=dbcb3c3e779426f92f5ef51f64acbba5",
//         ""
//     ],
//     [
//         2,
//         "Area C",
//         "http://www.youtube.com/watch?v=TwJHG2KSsG0",
//         "http://player.vimeo.com/external/110884059.mobile.mp4?s=51f59906a97efc8cc800238f3890071f",
//         "http://player.vimeo.com/external/110884059.sd.mp4?s=44dec8da908f8fe861803178db968db4",
//         "http://player.vimeo.com/external/110884059.hd.mp4?s=3eb6e351f73ca929189cbf1e2d74c8c4",
//         ""
//     ],
//     [
//         3,
//         "Beyond the walls",
//         "http://www.youtube.com/watch?v=oy4PWG6LCAs",
//         "http://player.vimeo.com/external/109585524.mobile.mp4?s=2a7d529e9ad8e7e965c621a28aa771de",
//         "http://player.vimeo.com/external/109585524.sd.mp4?s=a7565459a936ac7d3e616fd2d9dc4df1",
//         "http://player.vimeo.com/external/109585524.hd.mp4?s=988c547e4e5d25236d5862976af9e836",
//         ""
//     ],
//     [
//         4,
//         "Forbidden Pilgrimage",
//         "http://www.youtube.com/watch?v=2JqmcqkIrFE",
//         "http://player.vimeo.com/external/110467198.mobile.mp4?s=2368448e7a6a6aa807d1af5e75dad4f7",
//         "http://player.vimeo.com/external/110467198.sd.mp4?s=4c5bb5c5d6991eb23992e0175c7909d6",
//         "http://player.vimeo.com/external/110467198.hd.mp4?s=2f954a2e824e152bc3bf29a616511b92",
//         ""
//     ],
//     [
//         5,
//         "Gaza left in the dark",
//         "http://www.youtube.com/watch?v=t657lfeIg4s",
//         "http://player.vimeo.com/external/109585526.mobile.mp4?s=5e8942182f3854fad2f86ceee7071d30",
//         "http://player.vimeo.com/external/109585526.sd.mp4?s=60efbf26a631aad508d922a50d6d2952",
//         "http://player.vimeo.com/external/109585526.hd.mp4?s=1fe0282cf14b8ae2bd82f59f21ad43cb",
//         ""
//     ],
//     [
//         6,
//         "Gaza lives on",
//         "http://www.youtube.com/watch?v=Jp2UcV2Ldaw",
//         "http://player.vimeo.com/external/110467201.mobile.mp4?s=43e858a614b39f36250d364d08982262",
//         "http://player.vimeo.com/external/110467201.sd.mp4?s=61be96df1d407d817b06cee2f63f6e49",
//         "http://player.vimeo.com/external/110467201.hd.mp4?s=53965bd7c092c753d3ab3506273bb5c4",
//         ""
//     ],
//     [
//         7,
//         "Gaza we are coming",
//         "http://youtu.be/a9rGEPGpDis",
//         "http://player.vimeo.com/external/110467206.mobile.mp4?s=363243d6fd8e3a2b4831bcee5bfaa329",
//         "http://player.vimeo.com/external/110467206.sd.mp4?s=404e9e6b9c502c8b40161c6e9507fd00",
//         "http://player.vimeo.com/external/110467206.hd.mp4?s=d529d60db0e6b9374f75301837c6580e",
//         ""
//     ],
//     [
//         8,
//         "Inside Shin Bet",
//         "http://www.youtube.com/watch?v=3dBBBnxKgeQ",
//         "http://player.vimeo.com/external/110888355.mobile.mp4?s=e109a6ee7b9518be2fca986bf6ffc3be",
//         "http://player.vimeo.com/external/110888355.sd.mp4?s=50eedb2acda47d10fe34f1912e812072",
//         "http://player.vimeo.com/external/110888355.hd.mp4?s=9360b21d5cb36f15bed0353a02b0d044",
//         ""
//     ],
//     [
//         9,
//         "Last shepherds of the valley",
//         "http://www.youtube.com/watch?v=GHcFqNICoJM",
//         "http://player.vimeo.com/external/110889321.mobile.mp4?s=373da2d55f91e06bfc1d0d6abff59953",
//         "http://player.vimeo.com/external/110889321.sd.mp4?s=11e3a3315488fd0d73f692e193d6f67a",
//         "http://player.vimeo.com/external/110889321.hd.mp4?s=05d019878de216dffe78c98e332bcd52",
//         ""
//     ],
//     [
//         10,
//         "Lost cities of Palestine",
//         "http://www.youtube.com/watch?v=sT22bwJ55Sw",
//         "http://player.vimeo.com/external/111081054.mobile.mp4?s=ff90091fdfd0036e06e93286aeddb8b9",
//         "http://player.vimeo.com/external/111081054.sd.mp4?s=f01c9c1be937d4ba8cf9e3703bcf07e7",
//         "http://player.vimeo.com/external/111081054.hd.mp4?s=6aa8d5d30823a9e7bd04cdc1bec455d6",
//         ""
//     ],
//     [
//         11,
//         "Palestina Amore",
//         "http://www.youtube.com/watch?v=sXDngNEqdnA",
//         "http://player.vimeo.com/external/111081055.mobile.mp4?s=7a43ccbcbcea35dd9c8aca3f0efb96dd",
//         "http://player.vimeo.com/external/111081055.sd.mp4?s=58b07c38865d4a98cb8b311bb5dc9c2b",
//         "http://player.vimeo.com/external/111081055.hd.mp4?s=518ee40011cbdbff539bb8e5cfca7165",
//         ""
//     ],
//     [
//         12,
//         "The pain inside",
//         "http://www.youtube.com/watch?v=iOoW9-gUCDw",
//         "http://player.vimeo.com/external/110697549.mobile.mp4?s=73f098f7e661660e9fa87d1d594a4a50",
//         "http://player.vimeo.com/external/110697549.sd.mp4?s=760f42f10760ad4273b7a60b226f2491",
//         "http://player.vimeo.com/external/110697549.hd.mp4?s=cee08621e19cb94e50df5997d25620b0",
//         ""
//     ],
//     [
//         13,
//         "Stronger than words",
//         "http://www.youtube.com/watch?v=NRP-j1eM2Ck",
//         "http://player.vimeo.com/external/111081091.mobile.mp4?s=e293bcbc2be7d5e84342371b8c1e2598",
//         "http://player.vimeo.com/external/111081091.sd.mp4?s=ead9a0a6f369b24bab6bdeb94a4a23f6",
//         "http://player.vimeo.com/external/111081091.hd.mp4?s=fcf751b56cab4dc49e24efb01e8a0ae1",
//         ""
//     ],
//     [
//         14,
//         "The price of Oslo 1",
//         "http://www.youtube.com/watch?v=ism-ctaSbw0",
//         "http://player.vimeo.com/external/110904621.mobile.mp4?s=312e542c7d64534d54f7f9b5e6ab1078",
//         "http://player.vimeo.com/external/110904621.sd.mp4?s=e429e308721b41a22ed5cc8acdd32647",
//         "http://player.vimeo.com/external/110904621.hd.mp4?s=b5055337d78a967c8e98372a11b57b0a",
//         ""
//     ],
//     [
//         15,
//         "The price of Oslo 2",
//         "http://www.youtube.com/watch?v=TgFWEVQTeHM",
//         "http://player.vimeo.com/external/111081057.mobile.mp4?s=2aa4a2bed0e855ee249e8c620e324c26",
//         "http://player.vimeo.com/external/111081057.sd.mp4?s=c65048e4656dfde791f8f78ac87cb6ed",
//         "http://player.vimeo.com/external/111081057.hd.mp4?s=98db1b1544a502afcfb92172c7380574",
//         ""
//     ],
//     [
//         16,
//         "Hunger Strike",
//         "http://www.youtube.com/watch?v=u49jwfcLwuE",
//         "http://player.vimeo.com/external/110467238.mobile.mp4?s=0690d58aa180bd66e9043975361639de",
//         "http://player.vimeo.com/external/110467238.sd.mp4?s=e8a332cbffc1cfa2dcfafe71abe40dc3",
//         "http://player.vimeo.com/external/110467238.hd.mp4?s=1d8125fcb86fbc884d8e7ab2d71aa9d5",
//         ""
//     ],
//     [
//         17,
//         "Al Nakba 1",
//         "http://www.youtube.com/watch?v=H7FML0wzJ6A",
//         "http://player.vimeo.com/external/111081058.mobile.mp4?s=2c9283df2d2132791282fd473d95d413",
//         "http://player.vimeo.com/external/111081058.sd.mp4?s=d20ded9a08ad462f6ff44790b40d7693",
//         "http://player.vimeo.com/external/111081058.hd.mp4?s=cad76b3823904863171ec927e50bd7a0",
//         ""
//     ],
//     [
//         18,
//         "Al Nakba 2",
//         "http://www.youtube.com/watch?v=yI2D5Fsd9lg",
//         "http://player.vimeo.com/external/111081059.mobile.mp4?s=9a8cd0a739805a9b847e2a330e3af851",
//         "http://player.vimeo.com/external/111081059.sd.mp4?s=6c853d32b8dd2e7167a0f79d4c06033d",
//         "http://player.vimeo.com/external/111081059.hd.mp4?s=f08274591b8f2d75919792837dcbb99a",
//         ""
//     ],
//     [
//         19,
//         "Al Nakba 3",
//         "http://www.youtube.com/watch?v=5SKECszemmA",
//         "http://player.vimeo.com/external/111081089.mobile.mp4?s=2da6e706be1f8852def6bda4d77eb1cf",
//         "http://player.vimeo.com/external/111081089.sd.mp4?s=95254f6be7ac51226c4dc37ed5e602c9",
//         "http://player.vimeo.com/external/111081089.hd.mp4?s=7fc73b36d5f23c2b46272f0c2466fdeb",
//         ""
//     ],
//     [
//         20,
//         "Al Nakba 4",
//         "http://www.youtube.com/watch?v=0m__A7MlDrk",
//         "http://player.vimeo.com/external/111081090.mobile.mp4?s=f4fde8d2304350fed1fc70771f292032",
//         "http://player.vimeo.com/external/111081090.sd.mp4?s=e4e8d05d5093187411eda737120d1c54",
//         "http://player.vimeo.com/external/111081090.hd.mp4?s=a243a21bb0ceb9c63e1504fa6ae16376",
//         ""
//     ],
//     [
//         21,
//         "Deportees",
//         "http://player.vimeo.com/external/129669280.mobile.mp4?s=ecd8a4bf45009a26f1a1e5facab0ff74&profile_id=116",
//         "http://player.vimeo.com/external/129669280.sd.mp4?s=67cccdeeab0622a8c2a583187bd936ab&profile_id=112",
//         "http://player.vimeo.com/external/129669280.hd.mp4?s=e2b2185feabd68d101b37f5830c84404&profile_id=113",
//         ""
//     ],
//     [
//         22,
//         "Return to Morocco",
//         "http://player.vimeo.com/external/129669283.mobile.mp4?s=5fe075e71719b42cfc36f67b118a9e19&profile_id=116",
//         "http://player.vimeo.com/external/129669283.sd.mp4?s=709197ba49b0f4d924c6a95d9fd80852&profile_id=112",
//         "http://player.vimeo.com/external/129669283.hd.mp4?s=041ac74ba08aec62e8943cdaa6273b49&profile_id=113",
//         ""
//     ],
//     [
//         23,
//         "Stories from the Intifada p1",
//         "http://player.vimeo.com/external/129860384.mobile.mp4?s=ff86e42222ab9d3fb4b175ac0ed73183&profile_id=116",
//         "http://player.vimeo.com/external/129860384.sd.mp4?s=1b2fe6ae662d2634853b7703063b4c2b&profile_id=112",
//         "http://player.vimeo.com/external/129860384.hd.mp4?s=3a97e4faac5d89cb2bc4ea48788d1d59&profile_id=113",
//         ""
//     ],
//     [
//         24,
//         "Stories from the Intifada p2",
//         "http://player.vimeo.com/external/130102374.mobile.mp4?s=dfe5057f497bb8f3dbf0d64a67bf45d1&profile_id=116",
//         "http://player.vimeo.com/external/130102374.sd.mp4?s=de7125f7bd4f1a0dd59a589a9524a590&profile_id=112",
//         "http://player.vimeo.com/external/130102374.hd.mp4?s=fcb7680f87cf1777b129085890163b91&profile_id=113",
//         ""
//     ],
//     [
//         25,
//         "Born in 1948",
//         "http://player.vimeo.com/external/129669287.mobile.mp4?s=5f5e9dc074d733f471bf1759b2fd7d6d&profile_id=116",
//         "http://player.vimeo.com/external/129669287.sd.mp4?s=12a321b15d408c3da395675f5fbfdb02&profile_id=112",
//         "http://player.vimeo.com/external/129669287.hd.mp4?s=5f563bdcba33a0fbb053853d13f8dd30&profile_id=113",
//         ""
//     ],
//     [
//         26,
//         "Jerusalem Hitting Home",
//         "http://player.vimeo.com/external/129669812.mobile.mp4?s=e5c6fc49081ed17eb363d41c94c4b6a5&profile_id=116",
//         "http://player.vimeo.com/external/129669812.sd.mp4?s=1d7fb4d35960cfd0771bdeda82ac723e&profile_id=112",
//         "http://player.vimeo.com/external/129669812.hd.mp4?s=0ebaa742f4d74ea6b84f6d641dae5dda&profile_id=113",
//         ""
//     ],
//     [
//         27,
//         "Divided Homeland",
//         ""
//     ]
];

var videosArabic = [
    [
        "id",
        "title",
        "youtube",
        "mobile",
        "vimeo sd",
        "vimeo hd",
        ""
    ],
    [
        28,
        "AJA-Gaza Human Shields",
        "https://player.vimeo.com/external/162938001.sd.mp4?s=6e03aa9850cf0089d23458014d728176e4e3411a&profile_id=165", // yt
        "https://player.vimeo.com/external/162938001.sd.mp4?s=6e03aa9850cf0089d23458014d728176e4e3411a&profile_id=165", // m
        "https://player.vimeo.com/external/162938001.sd.mp4?s=6e03aa9850cf0089d23458014d728176e4e3411a&profile_id=165", // sd
        "https://player.vimeo.com/external/162938001.sd.mp4?s=6e03aa9850cf0089d23458014d728176e4e3411a&profile_id=165", // hd
        ""
    ],
    [
        29,
        "AJA-Jerusalem-Dividing",
        "https://player.vimeo.com/external/159251303.sd.mp4?s=7bd1ef63e609ac4d01ebb78cefd5fd646413a5d3&profile_id=165", // yt
        "https://player.vimeo.com/external/159251303.sd.mp4?s=7bd1ef63e609ac4d01ebb78cefd5fd646413a5d3&profile_id=165", // m
        "https://player.vimeo.com/external/159251303.sd.mp4?s=7bd1ef63e609ac4d01ebb78cefd5fd646413a5d3&profile_id=165", // sd
        "https://player.vimeo.com/external/159251303.sd.mp4?s=7bd1ef63e609ac4d01ebb78cefd5fd646413a5d3&profile_id=165", // hd
        ""
    ],
    [
        30,
        "AJA-Defying My Disability",
        "https://player.vimeo.com/external/162943091.sd.mp4?s=a9f1fdc6b5ca9ff75aad3015e674f5eba35f8375&profile_id=165", // yt
        "https://player.vimeo.com/external/162943091.sd.mp4?s=a9f1fdc6b5ca9ff75aad3015e674f5eba35f8375&profile_id=165", // m
        "https://player.vimeo.com/external/162943091.sd.mp4?s=a9f1fdc6b5ca9ff75aad3015e674f5eba35f8375&profile_id=165", // sd
        "https://player.vimeo.com/external/162943091.sd.mp4?s=a9f1fdc6b5ca9ff75aad3015e674f5eba35f8375&profile_id=165", // hd
        ""
    ],
//     [
//         0,
//         "Going against the grain",
//         "http://www.youtube.com/watch?v=Sl-l0-uFgJ0",
//         "http://player.vimeo.com/external/109676100.mobile.mp4?s=492c39a5d904a9f1f188b0a5bf3e6b08",
//         "http://player.vimeo.com/external/109676100.sd.mp4?s=029535cf6fa8612288eea88121f3f83e",
//         "http://player.vimeo.com/external/109676100.hd.mp4?s=5f80e6a80c367b54273be5918a0eca3a",
//         ""
//     ],
//     [
//         1,
//         "Against the wall",
//         "http://www.youtube.com/watch?v=jATIsS9_swo",
//         "http://player.vimeo.com/external/109676098.mobile.mp4?s=a8ae7830fd73d9b89c849b10795773b1",
//         "http://player.vimeo.com/external/109676098.hd.mp4?s=964705a807ec00da4b169ad1804a7222",
//         ""
//     ],
//     [
//         2,
//         "Area C",
//         "http://www.youtube.com/watch?v=LaBwaCDPm4w",
//         "http://player.vimeo.com/external/110884058.mobile.mp4?s=85abff8effebb6906bf2105cee2590c0",
//         "http://player.vimeo.com/external/110884058.sd.mp4?s=fc54f6f60379056f9a403ae8ea9b55d1",
//         "http://player.vimeo.com/external/110884058.hd.mp4?s=bd53b55a2058f5165c9f903cfe5f45dc",
//         ""
//     ],
//     [
//         3,
//         "Beyond the walls",
//         "http://www.youtube.com/watch?v=WaLBB2kPkDw",
//         "http://player.vimeo.com/external/109676101.mobile.mp4?s=d236c110092448b2d74b8f21aa10ab75",
//         "http://player.vimeo.com/external/109676101.sd.mp4?s=888993aec8141fa73bda9d427fdef4b2",
//         "http://player.vimeo.com/external/109676101.hd.mp4?s=697c8c466ff15b6e5c06c4ff153c9dcc",
//         ""
//     ],
//     [
//         4,
//         "Forbidden Pilgrimage",
//         "http://www.youtube.com/watch?v=ZulMDK5qhBo",
//         "http://player.vimeo.com/external/110699967.mobile.mp4?s=fa132ac220e0390d3172e4a847666dc7",
//         "http://player.vimeo.com/external/110699967.sd.mp4?s=214d159d86cb99108bf282888ad9ec62",
//         "http://player.vimeo.com/external/110699967.hd.mp4?s=a10fe4f950e8a0261518bfdf77af6f11",
//         ""
//     ],
//     [
//         5,
//         "Gaza left in the dark",
//         "http://www.youtube.com/watch?v=jrVGbkkBiHM",
//         "http://player.vimeo.com/external/109676099.mobile.mp4?s=11f9aa793c9fa1315ecb2bdf2ddd8f48",
//         "http://player.vimeo.com/external/109676099.sd.mp4?s=f0a06547303478e5279dede658b41122",
//         "http://player.vimeo.com/external/109676099.hd.mp4?s=a09896b6f559a678ac5dda92ae1e582c",
//         ""
//     ],
//     [
//         6,
//         "Gaza lives on",
//         "http://www.youtube.com/watch?v=bcHnaujEvU0",
//         "http://player.vimeo.com/external/110699968.mobile.mp4?s=1b6e79fefc235db74268b30374de5108",
//         "http://player.vimeo.com/external/110699968.sd.mp4?s=231462e6c3ffc1b76bb6de304581bfd9",
//         "http://player.vimeo.com/external/110699968.hd.mp4?s=ee9b223b2b368421ea0ca2019091b5f6",
//         ""
//     ],
//     [
//         7,
//         "Gaza we are coming",
//         "http://www.youtube.com/watch?v=pAjBpvZaSOI",
//         "http://player.vimeo.com/external/110699970.mobile.mp4?s=0b37dfea3ac28c6b945eb27b69c50dd3",
//         "http://player.vimeo.com/external/110699970.sd.mp4?s=f73e51fedb4d4f326d2d3d2d700a3a91",
//         "http://player.vimeo.com/external/110699970.hd.mp4?s=4fd5c49f8cfc94e949189fdec2f5536a",
//         ""
//     ],
//     [
//         8,
//         "Inside Shin Bet",
//         "http://www.youtube.com/watch?v=u-TVbo9duz0",
//         "http://player.vimeo.com/external/110888354.mobile.mp4?s=1484bc5d663a38c704a1150ad3481f97",
//         "http://player.vimeo.com/external/110888354.sd.mp4?s=9636f7ac373bb0bd2aabc38d66637c37",
//         "http://player.vimeo.com/external/110888354.hd.mp4?s=9f7743e694295bbd297ca81615d323bd",
//         ""
//     ],
//     [
//         9,
//         "Last shepherds of the valley",
//         "http://www.youtube.com/watch?v=bgmoxds_p94",
//         "http://player.vimeo.com/external/110889320.mobile.mp4?s=d5b8d0b2c217434904d720e30ba40583",
//         "http://player.vimeo.com/external/110889320.sd.mp4?s=2d036ecac58e54623a8f92bc4e004ed2",
//         "http://player.vimeo.com/external/110889320.hd.mp4?s=d9dc0b2118485945ffc7383691ecb47d",
//         ""
//     ],
//     [
//         10,
//         "Lost cities of Palestine",
//         "http://www.youtube.com/watch?v=8n6E6GKEz00",
//         "http://player.vimeo.com/external/111081706.mobile.mp4?s=326f72b5e0d728dd1e6b14a3039dc4ab",
//         "http://player.vimeo.com/external/111081706.sd.mp4?s=be4dff92f408eff4f7672384ebae9abd",
//         "http://player.vimeo.com/external/111081706.hd.mp4?s=fe0ecbf8b45c0602ed5cdf942a486b2f",
//         ""
//     ],
//     [
//         11,
//         "Palestine Amore",
//         "http://www.youtube.com/watch?v=dpPpT-KddoI",
//         "http://player.vimeo.com/external/111081707.mobile.mp4?s=887fe973f974587ff606187622e72263",
//         "http://player.vimeo.com/external/111081707.sd.mp4?s=4864c5f5aeefe21d89b9eb85ffd6b44a",
//         "http://player.vimeo.com/external/111081707.hd.mp4?s=49930c5c08c2899aa8e5dfc9e0a76c31",
//         ""
//     ],
//     [
//         12,
//         "The pain inside",
//         "http://www.youtube.com/watch?v=KJSbg00EJNY",
//         "http://player.vimeo.com/external/110699971.mobile.mp4?s=7108692f89d1d08dd252be1165a23dea",
//         "http://player.vimeo.com/external/110699971.sd.mp4?s=d0812a07fe855ca23db7db2d7b08f68b",
//         "http://player.vimeo.com/external/110699971.hd.mp4?s=3d9fdcf5b5ae9688f20ca6e215454057",
//         ""
//     ],
//     [
//         13,
//         "Stronger than words",
//         "http://www.youtube.com/watch?v=KJSbg00EJNY",
//         "http://player.vimeo.com/external/111081708.mobile.mp4?s=4a154f32203e8094783d0a02efb2d683",
//         "http://player.vimeo.com/external/111081708.sd.mp4?s=9f5a802e7cda924e5a937034feafd1dc",
//         "http://player.vimeo.com/external/111081708.hd.mp4?s=6bf5cd6eb2d18779296d2fd85ae1bc85",
//         ""
//     ],
//     [
//         14,
//         "The price of Oslo 1",
//         "http://www.youtube.com/watch?v=fstR_9s2sKI",
//         "http://player.vimeo.com/external/110904619.mobile.mp4?s=eb8b36729062e3341ca879c40d734312",
//         "http://player.vimeo.com/external/110904619.sd.mp4?s=64ce6472dae88e2fba51137a600a8838",
//         "http://player.vimeo.com/external/110904619.hd.mp4?s=8fe1322568109750101de61e6bc6f1a7",
//         ""
//     ],
//     [
//         15,
//         "The price of Oslo 2",
//         "http://www.youtube.com/watch?v=B2emYLb13yg",
//         "http://player.vimeo.com/external/110904620.mobile.mp4?s=d898e9e0507a91436049b3a4291af84e",
//         "http://player.vimeo.com/external/110904620.sd.mp4?s=556723fffead865378872d4c676b116f",
//         "http://player.vimeo.com/external/110904620.hd.mp4?s=7cc272bcaceb87cf1f6b6c2c360d5390",
//         ""
//     ],
//     [
//         16,
//         "Hunger Strike",
//         "http://www.youtube.com/watch?v=K293aqf4LKk",
//         "http://player.vimeo.com/external/110699973.mobile.mp4?s=d21883931cf4794c05d008a454254c29",
//         "http://player.vimeo.com/external/110699973.sd.mp4?s=b66c0a0e7f808434131468bbff60a77e",
//         "http://player.vimeo.com/external/110699973.hd.mp4?s=92f4e3d1a1b97ab07613df4c51e49ed3",
//         ""
//     ],
//     [
//         17,
//         "Al Nakba 1",
//         "http://www.youtube.com/watch?v=rFYmRX7A_Fc",
//         "http://player.vimeo.com/external/111081702.mobile.mp4?s=abfb0e5e03306403415e9acd3d2418ce",
//         "http://player.vimeo.com/external/111081702.sd.mp4?s=186077c154c7ff6fe50c8df131ab106d",
//         "http://player.vimeo.com/external/111081702.hd.mp4?s=1cf17720bcb1274cd8a4e2cb85f1af8c",
//         ""
//     ],
//     [
//         18,
//         "Al Nakba 2",
//         "http://www.youtube.com/watch?v=WuBKtzi2Cos",
//         "http://player.vimeo.com/external/111081701.mobile.mp4?s=8c765af7431e158f6ddba499943121d5",
//         "http://player.vimeo.com/external/111081701.sd.mp4?s=138fc50b8572993c6a42754c72690c9f",
//         "http://player.vimeo.com/external/111081701.hd.mp4?s=a12b63ca215bc1b2f03a39db7f1f8dc5",
//         ""
//     ],
//     [
//         19,
//         "Al Nakba 3",
//         "http://www.youtube.com/watch?v=z4w43Ynv1qM",
//         "http://player.vimeo.com/external/111081703.mobile.mp4?s=599f101ec177a4e078da44dbdc8cbfe5",
//         "http://player.vimeo.com/external/111081703.sd.mp4?s=a81a2929cbfb1d9d52145911225c7fd1",
//         "http://player.vimeo.com/external/111081703.hd.mp4?s=921d9fc2812bad401c8662ffa95ab3e8",
//         ""
//     ],
//     [
//         20,
//         "Al Nakba 4",
//         "http://www.youtube.com/watch?v=9sMQFrPnYfg",
//         "http://player.vimeo.com/external/111081704.mobile.mp4?s=d2be573c85d6169343bc18eff02e85b4",
//         "http://player.vimeo.com/external/111081704.sd.mp4?s=0ac5c3ffb44169d6f8e198914ab7b519",
//         "http://player.vimeo.com/external/111081704.hd.mp4?s=594fc0668efe5f5ff086191584719c07",
//         ""
//     ],
//     [
//         21,
//         "Deportees",
//         "http://player.vimeo.com/external/129860381.mobile.mp4?s=fac9f1b5c9c642c0a964e5cf36535f2e&profile_id=116",
//         "http://player.vimeo.com/external/129860381.sd.mp4?s=5e2271dcc3e84086da93dc78cf45d82b&profile_id=112",
//         "http://player.vimeo.com/external/129860381.hd.mp4?s=f98be818d46addbd78a9d99d747ef1cf&profile_id=113",
//         ""
//     ],
//     [
//         22,
//         "Return to Morocco",
//         "http://player.vimeo.com/external/129860383.mobile.mp4?s=a7712f6daa580cfcc4800b964d7a32fd&profile_id=116",
//         "http://player.vimeo.com/external/129860383.sd.mp4?s=76cb7745f8a2d9ab7344bced26bb56b2&profile_id=112",
//         "http://player.vimeo.com/external/129860383.hd.mp4?s=909a718a397dbaf861ea6fa6d9a85b06&profile_id=113",
//         ""
//     ],
//     [
//         23,
//         "Stories from the Intifada p1",
//         "http://player.vimeo.com/external/129860384.mobile.mp4?s=ff86e42222ab9d3fb4b175ac0ed73183&profile_id=116",
//         "http://player.vimeo.com/external/129860384.sd.mp4?s=1b2fe6ae662d2634853b7703063b4c2b&profile_id=112",
//         "http://player.vimeo.com/external/129860384.hd.mp4?s=3a97e4faac5d89cb2bc4ea48788d1d59&profile_id=113",
//         ""
//     ],
//     [
//         24,
//         "Stories from the Intifada p2",
//         "http://player.vimeo.com/external/129860385.mobile.mp4?s=871e9e5969386d6aaa9c89b4fae1e0aa&profile_id=116",
//         "http://player.vimeo.com/external/129860385.sd.mp4?s=18dadf8561579a68e5bcb0c42eafcd0a&profile_id=112",
//         "http://player.vimeo.com/external/129860385.hd.mp4?s=d00d653a9c2089b8fa2bd623ad98d239&profile_id=113",
//         ""
//     ],
//     [
//         25,
//         "Born in 1948",
//         "http://player.vimeo.com/external/129774128.mobile.mp4?s=b0dc890f5b7e85080717f5ff8ea87851&profile_id=116",
//         "http://player.vimeo.com/external/129774128.sd.mp4?s=331bbf7dd850bac6386a2fed0034797c&profile_id=112",
//         "http://player.vimeo.com/external/129774128.hd.mp4?s=19e017129160af5226b125ca1a2e07fb&profile_id=113",
//         ""
//     ],
//     [
//         26,
//         "Jerusalem Hitting Home",
//         "http://player.vimeo.com/external/129860388.mobile.mp4?s=1d96fa13edd6f034e1b4dad0550dfb6e&profile_id=116",
//         "http://player.vimeo.com/external/129860388.sd.mp4?s=c10e516b4f51d586b17cffa7e1b7e9f6&profile_id=112",
//         "http://player.vimeo.com/external/129860388.hd.mp4?s=ea72fff02c021854b657354d58ec09ad&profile_id=113",
//         ""
//     ],
//     [
//         27,
//         "Divided Homeland",
//         "http://player.vimeo.com/external/129860404.mobile.mp4?s=83a81d774e6b3e9a37573c996b48501e&profile_id=116",
//         "http://player.vimeo.com/external/129860404.sd.mp4?s=3e55c9262310935374cfe311b9202aa1&profile_id=112",
//         "http://player.vimeo.com/external/129860404.hd.mp4?s=c707eb5b68edf206f444270d6f8e73b2&profile_id=113",
//         ""
//     ]
];
