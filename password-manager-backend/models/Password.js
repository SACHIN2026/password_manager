// models/password.js
const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  siteName: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Password", passwordSchema);
