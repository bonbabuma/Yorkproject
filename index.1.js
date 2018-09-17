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



app.get('/complaints', (req, res) => {
  res.render('complaints');
});

app.get('/comments', (req, res) => {
  res.render('comments');
});

app.get('/newcomer', (req, res) => {
  res.render('newcomer');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening on port '+PORT);
});