const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      unique: true,
    },
    usersInRoom: [String],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("rooms", roomSchema, "rooms");
