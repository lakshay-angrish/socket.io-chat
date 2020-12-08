const Room = require("./server/models/room");
const router = require("./server/router");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);

const dbURL = "mongodb://localhost/chat-io";

mongoose.connect(
  dbURL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("mongodb connected")
);

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error")
);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

app.use(express.static(__dirname + "/dist/io-chat"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.use(router);

io.on("connection", (socket) => {
  console.log("new connection made");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join", (data) => {
    socket.join(data.roomName);
    console.log(data.username + " joined Room: " + data.roomName);
    socket.nickname = data.username;

    var usersInRoom = [];
    io.of("/")
      .in(data.roomName)
      .clients((error, clients) => {
        if (error) throw error;

        clients.forEach((element) => {
          // usersInRoom.push(io.of('/').in(data.roomName).connected[element].nickname);
          usersInRoom.push(io.sockets.connected[element].nickname);
          //console.log(io.sockets.connected[element].nickname);
        });

        Room.updateOne(
          {
            roomName: data.roomName,
          },
          {
            $set: {
              usersInRoom: usersInRoom,
            },
          },
          (error, data) => {
            if (error) {
              console.log(error);
            } else {
              console.log(data);
            }
          }
        );
      });

    socket.broadcast.to(data.roomName).emit("new user joined", {
      username: data.username,
      message: "has joined the room",
      timeDate: data.timeDate,
    });
  });

  socket.on("leave", (data) => {
    console.log(data.username + " has left the Room: " + data.roomName);

    var usersInRoom = [];
    io.of("/")
      .in(data.roomName)
      .clients((error, clients) => {
        if (error) throw error;
        clients.forEach((element) => {
          usersInRoom.push(
            io.of("/").in(data.roomName).connected[element].nickname
          );
        });

        const index = usersInRoom.indexOf(data.username);
        usersInRoom.splice(index, 1);

        Room.updateOne(
          {
            roomName: data.roomName,
          },
          {
            $set: {
              usersInRoom: usersInRoom,
            },
          },
          (error, data) => {
            if (error) {
              console.log(error);
            } else {
              console.log(data);
            }
          }
        );
      });

    socket.broadcast.to(data.roomName).emit("left the room", {
      username: data.username,
      message: "has left the room",
      timeDate: data.timeDate,
    });

    socket.leave(data.roomName);
  });

  socket.on("message", (data) => {
    io.in(data.roomName).emit("new message", {
      username: data.username,
      message: data.message,
      timeDate: data.timeDate,
    });
  });
});

http.listen(3000, function () {
  console.log("server running on http://localhost:3000");
});
