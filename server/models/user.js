const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    gender: String,
    birthdate: Date,
    password: String,
    photo: String,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
