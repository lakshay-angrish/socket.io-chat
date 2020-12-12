const User = require("./models/user");
const Room = require("./models/room");
const ChatMessage = require("./models/chatMessage");
const fs = require("fs");

exports.signUp = async (req, res) => {
  try {
    let user = await User.findOne({
      username: req.body.username,
    }).exec();
    if (user) throw new Error("Username taken");
    let userData = {
      username: req.body.username,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      password: req.body.password,
    };
    if (!req.file) {
      userData.photo = "default.jpeg";
    } else {
      userData.photo = req.file.path.split("\\")[2];
    }
    user = new User(userData);

    await user.save();
    console.log("Signup Successful");
    res.status(200).send("Signup Successful");
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

exports.logIn = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }).exec();

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) throw new Error("Invalid Credentials");
    res.status(200).send({
      username: user.username,
      birthdate: user.birthdate,
      photo: user.photo,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }).exec();

    if (!user) throw new Error("Invalid Credentials");

    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) throw new Error("Invalid Credentials");

    user.password = req.body.newPassword;
    await user.save();

    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.query.username,
    }).exec();
    if (!user) {
      throw new Error("User not found");
    }
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.query.photo !== "default.jpeg") {
      fs.unlink("src/uploads/" + req.query.photo, (error) => {
        if (error) throw error;
        console.log("Old Photo Deleted");
      });
    }
    await User.deleteOne({
      username: req.query.username,
    }).exec();
    console.log("User Removed");
    res.status(200).send("User Removed");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.changePhoto = async (req, res) => {
  try {
    if (!req.file) {
      photo = req.body.currentPhoto;
    } else {
      if (req.body.currentPhoto != "default.jpeg") {
        fs.unlink("src/uploads/" + req.body.currentPhoto, (error) => {
          if (error) throw error;
          console.log("Old Photo Deleted");
        });
      }
    }
    const user = await User.updateOne(
      {
        username: req.body.username,
      },
      {
        photo: req.file.path.split("\\")[2],
      }
    ).exec();
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().exec();
    console.log(rooms);
    res.status(200).send(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = new Room({
      roomName: req.body.roomName,
      usersInRoom: req.body.usersInRoom,
    });

    await room.save();
    console.log("Room Created");
    res.status(200).send("Room Created");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.getUsersInRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomName: req.query.roomName,
    }).exec();
    if (!room) {
      throw new Error("Room not found");
    }
    console.log(room);
    res.status(200).send(room);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.postChat = async (req, res) => {
  try {
    const chat = new ChatMessage({
      sender: req.body.username,
      roomName: req.body.roomName,
      messageText: req.body.message,
      timeDate: req.body.timeDate,
    });

    await chat.save();
    console.log("Chat Saved!");
    res.status(200).send("Chat Saved!");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chat = await ChatMessage.find({
      roomName: req.query.roomName,
    }).exec();

    if (!chat) {
      throw new Error("Chat not found");
    }
    console.log(chat);
    res.status(200).send(chat);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({
      roomName: req.query.roomName,
    }).exec();

    console.log("Chat History Cleared");
    res.status(200).send("Chat History Cleared");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
