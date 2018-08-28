const express = require('express');
const app = express();
var bodyParser = require('body-parser');//use body-parsing middleware to populate req.body.
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));
app.set('view engine', 'pug');

var MongoClient = require('mongodb').MongoClient;   //官方推荐的连接方式。
const url = 'mongodb://localhost:27017';   //We know that by default MongoDB uses port 27017 and we have it installed in our local environment

app.get('/', (req, res) => {
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
    const collection = db.collection('basicInfo');

    //   console.log(collection.find({"name":"Naidu"}.toArray()));

    /*
        collection.find({"name":"Naidu"}).toArray((error, documents) => {
          res.render('index', { documents: documents });
          client.close();//As we opened a connection to the MongoDB we need to close it if we're not using it
        });
    */
    /*
        collection.findOne({"name":"Naidu"}, function(error,doc){
      //		cursor.each(function(error,doc){
             res.render('index', {profileTitle1: `Dr. ${doc.name}`, src1: doc.image, docImage: doc.image});
             client.close();
          })
    //		})*/

    collection.find({}).toArray((error, doc) => {
      // console.log(doc.length);
      if (error) console.log( error );
      else res.render('index', { documents: doc });
      //callback(doc);  //回应callback is not defined.
      client.close();//As we opened a connection to the MongoDB we need to close it if we're not using it
    });
  })
})

//fetch the data for '/' and '/clinic information'
app.get('/database', (req, res) => {
  let a = req.query;
  //console.log(a.searchKey==undefined);
  // const properties = Object.keys(a);
  // console.log(properties[0]);
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
    const collection = db.collection('clinicInfo');
    const collectionBasicInfo = db.collection("basicInfo");
   
      if (a.searchKey ===""&& a.search===undefined) {
        collection.find({}).toArray(function (error, doc) {
          //  console.log(doc[0].address);
          res.json(doc);
          client.close();
        })
      } else if(a.searchKey!==""&&a.search===undefined) {
        collection.find({ "$or": [{ "clinic": a.searchKey }, { "community": a.searchKey }] }).toArray(function (error, doc) {
          //  console.log(doc[0].address);
          res.json(doc);
        })      
    }else{
      collectionBasicInfo.findOne({"name":a.search}, function(error,doc){
       res.json(doc);
      })
    }
  })
})

//insert new appointment
app.post('/database',(req,res,next)=>{
  let a = req.body;
  console.log(a);
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
    const collectionAppointment = db.collection('appointment');   
    const collectionClinic=db.collection('clinicInfo');
    if(a.fullname===undefined){  //find the physicianList according to clinic selected
    collectionClinic.findOne(a,(err,result)=>{
     //console.log(result.physicianList);
      res.json(result.physicianList);
    });
    }else{
		collectionAppointment.insertOne(a,(err, result) => {
      res.json(result.ops[0]);    
    });
   }
  })
})

app.post('/temp',(req,res)=>{
  const a={"name": "luyao","gender":"Male","age":'secret'};
  res.json(a);
})

app.get('/appointment', (req, res,next) => {
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
    const collection = db.collection('clinicInfo');
    collection.find({}).toArray((error, doc) => {
     res.render('appointment',{documents:doc});     
    })
  }) 
});

app.get('/clinicInfo', (req, res) => {
  res.render('clinicInfo');
});

app.post('/mail',(req,res)=>{
let a = req.body;
console.log(a.email);
var nodemailer = require('nodemailer');
var config = require("./secrets");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mengerpapa@gmail.com',
    pass: config.emailPassword
  }
});

var mailOptions = {
  from: 'anonymous@saskphysician',
  to: a.email,
  subject: 'Sending Email using Node.js',
  html: `<h3>From Saskphysician</h3>
  <h3>Hi,${a.fullname}:<br><br> You just make an appointment with your physician, here is the detail:</h3>
  <h3><li>Clinic:${a.clinic}</li><li>Physician:${a.physician}</li><li>Date:${a.date}</li><li>Time:${a.time}</li></h3>
  <h3>Please present your healthcard and this email when you visit the clinic.</h3>
  <h3>Please do not reply this email.</h3>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
   }
 })
})

app.listen(3001);

/**In this example we configured a root route
Using the response render method we can send a response to the user
The render method accepts two parameters
The first parameter is the template name
The second parameter is a JavaScript object where each property will become a template variable
So, calling http://localhost:3000 will render the index.pug template passing Hey text as title value and Hello there! as message
Express will render the template and create the content to send to the user
The final template result will be:

可以使用HTML2Jade - HTML to Jade Online Realtime Converter，将html转化为pug。
*/