// models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  passwordId: { type: mongoose.Schema.Types.ObjectId, ref: "Password", required: true },
  action: { type: String, enum: ["created", "updated", "deleted"], required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
