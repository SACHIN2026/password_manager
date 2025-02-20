// routes/authRoutes.js
const express = require("express");
const { registerUser, loginUser, getProfile, updateProfile, generate2FASecret, verify2FAToken } = require("../controllers/authController");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.get("/generate-2fa", generate2FASecret);
router.post("/verify-2fa", verify2FAToken);

module.exports = router;
