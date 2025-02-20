// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  masterPasswordHash: { type: String, required: true },
  profilePic: { type: String, default: "" }, // New field for profile picture
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.masterPasswordHash);
};

module.exports = mongoose.model("User", userSchema);
