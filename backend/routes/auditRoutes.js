// routes/auditRoutes.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const AuditLog = require("../models/AuditLog");

// Get all audit logs for the logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const logs = await AuditLog.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
