const express = require('express');
const app = express();
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
      console.log(doc.length);
      res.render('index', {documents: doc});
      //callback(doc);  //回应callback is not defined.
      client.close();//As we opened a connection to the MongoDB we need to close it if we're not using it
    });
  })
})

app.get('/database',(req,res)=>{
  let a=req.query;
//  console.log(a);
  MongoClient.connect(url, function (err, client) {//MongoClient has a connect method that allows us to connect to MongoDB using Node.js
    const db = client.db('physicians');//The client object has a db method that accepts a string with the database name
    const collection = db.collection('basicInfo');
    collection.findOne({"name":a.name},function(error,doc){
//    console.log(doc);
    res.json(doc);
    })        
  })
})


app.get('/appointment', (req, res) => {
  res.render('appointment');
});

app.get('/clinicInfo', (req, res) => {
  res.render('clinicInfo');
});

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