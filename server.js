const path = require('path');
const fs = require('fs');
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
const app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
const multer = require('multer');


const DIR = 'src/uploads';
var photo;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
     photo = Date.now() + file.originalname;
     cb(null, photo);
  }
 });
let upload = multer({storage: storage});

const dbURL = 'mongodb://localhost/chat-io';

mongoose.connect(dbURL, { useNewUrlParser: true });

mongoose.connection.on('connected', function(){
  console.log("Mongoose default connection is open to " + dbURL);
});

mongoose.connection.on('error', function(err){
  console.log("Mongoose default connection has occurred "+err+" error");
});

mongoose.connection.on('disconnected', function(){
  console.log("Mongoose default connection is disconnected");
});

process.on('SIGINT', function(){
  mongoose.connection.close(function(){
      console.log("Mongoose default connection is disconnected due to application termination");
      process.exit(0)
  });
});

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  gender: String,
  birthdate: Date,
  password: String,
  photo: String
},
{
  versionKey: false
});

var User = mongoose.model('users', userSchema, 'users');

var roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    unique: true
  },
  usersInRoom: [String]
},
{
  versionKey: false
});

var Room = mongoose.model('rooms', roomSchema, 'rooms');

var chatMessageSchema = new mongoose.Schema({
  sender: String,
  timeDate: String,
  messageText: String,
  roomName: String
},
{
  versionKey: false
});

var chatMessage = mongoose.model('chatHistory', chatMessageSchema, 'chatHistory');

app.use(bodyparser.urlencoded( { extended: true } ));
app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
 });

app.post('/signup', upload.single('photo'), function(req, res) {
  if (!req.file) {
    photo = 'default.jpg';
  }
  var newUser = new User({
    username: req.body.username,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    password: req.body.password,
    photo: photo
  });

  newUser.save(function(error) {
    if (error) {
      console.log(error);
      res.send('Error while signing up. Try again.');
    } else {
      res.send('Signup Successful!');
    }
  });
});

app.post('/login', function(req, res) {
  console.log(req.body);

  User.find({
    username: req.body.username,
    password: req.body.password
  }, function(error, data) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.get('/getAllRooms', (req, res) => {
  Room.find((error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  })
});

app.get('/getUser', (req, res) => {
  User.find({
    username: req.query.username
  }, (error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.post('/createRoom', (req, res) => {
  console.log(req.body);

  var newRoom = new Room({
    roomName: req.body.roomName,
    usersInRoom: req.body.usersInRoom
  });

  newRoom.save(function(error) {
    if (error) {
      console.log(error);
      res.send('Error while creating room. Try again.');
    } else {
      res.send('Room Created!');
    }
  })
});

app.get('/getUsersInRoom', (req, res) => {
  Room.find({
    roomName: req.query.roomName
  }, (error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.post('/postChat', (req, res) => {
  console.log(req.body);

  var newChat = new chatMessage({
    sender: req.body.username,
    roomName: req.body.roomName,
    messageText: req.body.message,
    timeDate: req.body.timeDate
  });

  newChat.save(function(error) {
    if (error) {
      console.log(error);
      res.send('Error while saving chat. Try again.');
    } else {
      res.send('Chat Saved!');
    }
  })
});

app.get('/getChatHistory', (req, res) => {
  chatMessage.find({
    roomName: req.query.roomName
  }, (error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.delete('/clearChatHistory', (req, res) => {
  chatMessage.deleteMany({
    roomName: req.query.roomName
  }, (error) => {
    if (error) {
      res.send(error);
    } else {
      res.send('Chat History Cleared');
    }
  });
});

app.delete('/deleteUser', function(req, res) {
  User.deleteOne({
    username: req.query.username
  },
  function(error) {
    if (error) {
      console.log(error);
      res.send('Server Error: Could Not Delete!')
    } else {
      res.send('User Removed');
    }
  });
});

app.put('/changePassword', (req, res) => {
  User.updateOne({
    username: req.body.username,
    password: req.body.currentPassword
  }, {
    password: req.body.newPassword
  }, (error, data) => {
    if (error) {
      console.log(error);
      res.send('Server Error');
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

io.on('connection', (socket) => {
  console.log('new connection made');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('join', (data) => {
    socket.join(data.roomName);
    console.log(data.username + ' joined Room: ' + data.roomName);
    socket.nickname = data.username;

    var usersInRoom = [];
    io.of('/').in(data.roomName).clients((error, clients) => {
      if (error) throw error;

      clients.forEach(element => {
        usersInRoom.push(io.of('/').in(data.roomName).connected[element].nickname);
      });

      Room.updateOne({
        roomName: data.roomName
      }, {
        $set: {
          usersInRoom: usersInRoom
        }
      }, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
        }
      });
    });

    socket.broadcast.to(data.roomName).emit('new user joined', {
      username: data.username,
      message: 'has joined the room',
      timeDate: data.timeDate
    });
  });

  socket.on('leave', (data) => {
    console.log(data.username + ' has left the Room: ' + data.roomName);

    var usersInRoom = [];
    io.of('/').in(data.roomName).clients((error, clients) => {
      if (error) throw error;
      clients.forEach(element => {
        usersInRoom.push(io.of('/').in(data.roomName).connected[element].nickname);
      });

      const index = usersInRoom.indexOf(data.username);
      usersInRoom.splice(index, 1);

      Room.updateOne({
        roomName: data.roomName
      }, {
        $set: {
          usersInRoom: usersInRoom
        }
      }, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
        }
      });
    });

    socket.broadcast.to(data.roomName).emit('left the room', {
      username: data.username,
      message: 'has left the room',
      timeDate: data.timeDate
    });

    socket.leave(data.roomName);
  });

  socket.on('message', (data) => {
    io.in(data.roomName).emit('new message', {
      username: data.username,
      message: data.message,
      timeDate: data.timeDate
    });
  });

});


http.listen(3000, function() {
  console.log('server running on http://localhost:3000');
});
