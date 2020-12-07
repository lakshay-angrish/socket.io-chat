const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    sender: String,
    timeDate: String,
    messageText: String,
    roomName: String,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("chatHistory", chatMessageSchema);
