const cool = require('cool-ascii-faces');  //From instruction of Heroku.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000


var bodyParser = require('body-parser');//use body-parsing middleware to populate req.body.
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
    res.render('newcomer');
  })
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('listening on port ' + PORT);
  });