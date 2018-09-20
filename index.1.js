const cool = require('cool-ascii-faces');  //From instruction of Heroku.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

var bodyParser = require('body-parser');//use body-parsing middleware to populate req.body.

var MongoClient = require('mongodb').MongoClient;   //官方推荐的连接方式。
const ObjectID = require('mongodb').ObjectID;
//const url = 'mongodb://localhost:27017';
let uri = 'mongodb://york1:comit2018@ds163402.mlab.com:63402/yorkproject';


let seedData = [
  {
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

MongoClient.connect(uri, function(err, client) {

  if(err) throw err;

  /*
   * Get the database from the client. Nothing is required to create a
   * new database, it is created automatically when we insert.
   */

  let db = client.db('yorkproject')
  /*
   * First we'll add a few songs. Nothing is required to create the
   * songs collection; it is created automatically when we insert.
   */

  let songs = db.collection('songs');

   // Note that the insert method can take either an array or a dict.

  songs.insert(seedData, function(err, result) {

    if(err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    songs.update(
      { song: 'One Sweet Day' },
      { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
      function (err, result) {

        if(err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {

          if(err) throw err;

          docs.forEach(function (doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });

          // Since this is an example, we'll clean up after ourselves.
  /*           songs.drop(function (err) {
            if(err) throw err;

            // Only close the connection when your app is terminating.
            client.close(function (err) {
              if(err) throw err;
            });
          });*/
        });
      }
    );
  });
});


app.use(bodyParser.json())// for parsing application/json
  .use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  .use(express.static('public'))
  .set('view engine', 'pug')
  .get('/complaints', (req, res) => {
    res.render('complaints');
  })
  .get('/comments', (req, res) => {
    res.render('comments');
  })  
  .get('/newcomer', (req, res) => {
    MongoClient.connect(uri, function(err, client) {
      if(err) throw err;
      let db = client.db('yorkproject')
      let songs = db.collection('songs');
    songs.findOne({"decade":'1970s'}, function (error, doc) {
    res.render('newcomer',{documents:doc});
    })
   })
  })
  .get('/', (req, res) => {
    MongoClient.connect(uri, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
      const db = client.db('yorkproject');//The client object has a db method that accepts a string with the database name
      const collection = db.collection('basicInfo');
      collection.find({}).toArray((error, doc) => {
        // console.log(doc.length);
        if (error){
          throw error;
        }
        else{
          res.render('index', { documents: doc })
        };
        //callback(doc);  //回应callback is not defined.
        client.close();//As we opened a connection to the MongoDB we need to close it if we're not using it
      });
    })
  })
  .get('/appointment', (req, res, next) => {
    MongoClient.connect(uri, function (err, client) {
      const db = client.db('yorkproject');
      const collection = db.collection('clinicInfo');
      collection.find({}).toArray((error, doc) => {
        res.render('appointment', { documents: doc });
      })
    })
  })
  .get('/clinicInfo', (req, res) => {
    res.render('clinicInfo');
  })
  .get('/database', (req, res) => {
    let a = req.query;
    MongoClient.connect(uri, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
      const db = client.db('yorkproject');//The client object has a db method that accepts a string with the database name
      const collection = db.collection('clinicInfo');
      const collectionBasicInfo = db.collection("basicInfo");
  
      if (a.searchKey === "" && a.search === undefined) {
        collection.find({}).toArray(function (error, doc) {
          //  console.log(doc[0].address);
          res.json(doc);
          client.close();
        })
      } else if (a.searchKey !== "" && a.search === undefined) {
        collection.find({ "$or": [{ "clinic": a.searchKey }, { "community": a.searchKey }] }).toArray(function (error, doc) {
          //  console.log(doc[0].address);
          res.json(doc);
        })
      } else {
        collectionBasicInfo.findOne({ "name": a.search }, function (error, doc) {
          res.json(doc);
        })
      }
    })
  })
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times',(req,res)=>{
    let result='';
    const times=process.env.TIMES || 5
    for(i=0;i<times;i++){
      result+=i+' '
    }
    res.send(result)
  })
  .post('/searchPhysician', (req, res) => {
    let a = req.body;
    console.log(a,111);
    if(a.name===""){
      delete a.name;
    };
    if(a.languages===""){
      delete a.languages;
    }
    if(a.specialty===""){
      delete a.specialty;
    }
    console.log(a,222);  
    MongoClient.connect(uri, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
      const db = client.db('yorkproject');//The client object has a db method that accepts a string with the database name
      const collection = db.collection("basicInfo"); 
      collection.find(a).toArray((err, result) => {
        if (err) console.log(error);
        else res.json(result);
      });
    })
  })
  .post('/database', (req, res, next) => {
    let a = req.body;
    console.log(a);
    MongoClient.connect(uri, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
      const db = client.db('yorkproject');//The client object has a db method that accepts a string with the database name
      const collectionAppointment = db.collection('appointment');
      const collectionClinic = db.collection('clinicInfo');
      if (a.fullname === undefined) {  //fill the droplist in 'Book appointment' with physicianList according to selected clinic
        collectionClinic.findOne(a, (err, result) => {
          //console.log(result.physicianList);
          res.json(result.physicianList);
        });
      } else {
        collectionAppointment.insertOne(a, (err, result) => {
          res.json(result.ops[0]);
        });
      }
    })
  })
  .post('/cancelAppointment', (req, res, next) => {
    let a = req.body;
    console.log(a,'CANCEL APPOINTMENT');
    MongoClient.connect(uri, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
      const db = client.db('yorkproject');//The client object has a db method that accepts a string with the database name
      const collectionAppointment = db.collection('appointment');
      if (a.fullname !== '' && a._id === undefined) {
        collectionAppointment.find(a).toArray(function (error, doc) {
          res.json(doc);
        })
      } else{
        let successRecords=[];
        let errOcurr=0;
        a._id.forEach(function (value) {
          collectionAppointment.deleteOne({ "_id": ObjectID(value) }, function (err, result) {
            if(err!==null){errOcurr+=1};
          });        
          if(errOcurr!==1){
          successRecords.push(value);}
        })
        res.json({"successRecords":successRecords,"errOcurr":errOcurr})
      }
    })
  })
  .listen(PORT, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('listening on port ' + PORT);
  })