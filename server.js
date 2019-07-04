const path = require('path');
const fs = require('fs');
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
const app = require('express')();

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  gender: String,
  birthdate: Date,
  password: String
},
{
  versionKey: false
});

var User = mongoose.model('users', userSchema, 'users');

app.use(bodyparser.urlencoded( { extended: true } ));
app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
 });

app.post('/signup', function(req, res) {
  mongoose.connect('mongodb://localhost/chat-io');

  var newUser = new User({
    username: req.body.username,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    password: req.body.password
  });

  newUser.save(function(err, data) {
    if (error) {
      console.log(error);
      res.send('Error while signing up. Try again.');
    } else {
      res.send('Signup Successful!');
    }
    mongoose.connection.close();
  });
});

app.post('/login', function(req, res) {
  mongoose.connect('mongodb://localhost/chat-io');
  console.log(req.body);

  User.find({
    username: req.body.username,
    password: req.body.password
  }, function(err, data) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
    mongoose.connection.close();
  });
});

app.listen(3000, function() {
  console.log('server running on http://localhost:3000');
});
