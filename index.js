const express = require('express');
const app = express();
var bodyParser = require('body-parser');//use body-parsing middleware to populate req.body.
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));
app.set('view engine', 'pug');

var MongoClient = require('mongodb').MongoClient;   //官方推荐的连接方式。
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';   //We know that by default MongoDB uses port 27017 and we have it installed in our local environment

//used by the page of Physician List
app.get('/', (req, res) => {
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
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

//Used for searching physicians in the page of Physician List
app.post('/searchPhysician', (req, res) => {
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
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
    const collection = db.collection("basicInfo"); 
    collection.find(a).toArray((err, result) => {
      if (err) console.log(error);
      else res.json(result);
    });
  })
})

//fetch the data for 'Physician List' and '/Clinic Information'
app.get('/database', (req, res) => {
  let a = req.query;
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
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

//Used by 'book appointment' in the page of 'APPOINTMENT'
app.post('/database', (req, res, next) => {
  let a = req.body;
  console.log(a);
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
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

//used for cancelAppointment
app.post('/cancelAppointment', (req, res, next) => {
  let a = req.body;
  console.log(a,'CANCEL APPOINTMENT');
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
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

app.get('/appointment', (req, res, next) => {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('physicians');
    const collection = db.collection('clinicInfo');
    collection.find({}).toArray((error, doc) => {
      res.render('appointment', { documents: doc });
    })
  })
});

app.get('/clinicInfo', (req, res) => {
  res.render('clinicInfo');
});

app.get('/complaints', (req, res) => {
  res.render('complaints');
});

app.get('/comments', (req, res) => {
  res.render('comments');
});

app.get('/newcomer', (req, res) => {
  res.render('newcomer');
});

app.post('/mail', (req, res) => {  //send mail to patients to confirm immediately after submit the form
  let a = req.body;
  console.log(a.email);
  var nodemailer = require('nodemailer');
  var config = require("./public/js1/secrets");  //put the password in another file, and ignore it from github.
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Saskphysician@gmail.com',
      pass: config.emailPassword
    }
  });

  var confirmMail = {
    from: 'Saskphysician@gmail.com',
    to: a.email,
    subject: 'Book appointment successfully!',
    html: `<div style='background:url(./public/img/appointmentpage.jpg)'><h5>From Saskphysician<br>Please do not reply.</h5>
  <h4>Hi,${a.fullname},<br><br> You just booked an appointment with your physician, here is the detail:</h4>
  <h4><li>Clinic:${a.clinic}</li><li>Physician:${a.physician}</li><li>Date:${a.date}</li><li>Time:${a.time}</li></h4>
  <h4 style="color:red">Please take the HEALTHCARD and this EMAIL when you visit the clinic.</h4>
  <h4 style="color:blue">Good health!</h4></div>`,
    attachments: [{ filename: 'appointmentpage', path: './public/img/appointmentpage.jpg' }]
  };

  transporter.sendMail(confirmMail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Confirming Email sent: ' + info.response);
    }
  })
})

//Below is for the reminding email for user who has an appointment tomorrow.
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = 18;
rule.minute = 08;
schedule.scheduleJob(rule, function () {
   MongoClient.connect(url, function (err, client) {
    const db = client.db('physicians');
    const collection = db.collection('appointment');
    collection.find({"date":new Date().toJSON().substr(0,10)}).toArray((error, doc) => { //select the record including appointment in tomorrow.
    //  console.log(doc[0],11111);
    doc.forEach(function(value){
      var nodemailer = require('nodemailer');
      var config = require("./public/js1/secrets");  //put the password in another file, and ignore it from github.
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'Saskphysician@gmail.com',
          pass: config.emailPassword
        }
      });
      var remindMail = {
        from: 'anonymous@saskphysician',
        to: value.email,
        subject: 'Reminder for your tomorrow appointment!',
        html: `<h5>From Saskphysician Please do not reply.</h5>
      <h3 style="font-family: microsoft yahei">Hi ${value.fullname},<br><br> Just remind you about the appointment with your physician. Following is the detail:</h3>
      <h3><li>Clinic:${value.clinic}</li><li>Physician:Dr. ${value.physician}</li><li>Appointment Date:${value.date}</li><li>Appointment Time:${value.time}</li></h3>
      <h3 style="color:red">Please take your HEALTHCARD and this EMAIL when you visit the clinic.</h3>
      <br><h3>Good health!</h3>`  
     };

      transporter.sendMail(remindMail, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Reminding Email sent: ' + info.response);
        }
      })
     })
    })
  })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening on port '+PORT);
});