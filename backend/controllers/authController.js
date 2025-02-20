// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");

// Register a new user
const registerUser = async (req, res) => {
  const { username, masterPassword } = req.body;
  if (!username || !masterPassword) {
    return res.status(400).json({ message: "Please provide all fields." });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const masterPasswordHash = await bcrypt.hash(masterPassword, salt);
    const user = await User.create({ username, masterPasswordHash });
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { username, masterPassword } = req.body;
  if (!username || !masterPassword) {
    return res.status(400).json({ message: "Please provide all fields." });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isMatch = await user.matchPassword(masterPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    // Optionally: if 2FA is enabled, you might delay token issuance until verified.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get the profile of the authenticated user
const getProfile = async (req, res) => {
  try {
    // req.user is set by the authentication middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update the profile (username and profile picture) of the authenticated user
const updateProfile = async (req, res) => {
  const { username, profilePic } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, profilePic },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Generate a 2FA secret for the user (for example, to display a QR code)
const generate2FASecret = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  // In a real-world scenario, you would store secret.base32 with the user’s record
  res.status(200).json({ secret: secret.base32, otpauth_url: secret.otpauth_url });
};

// Verify a submitted 2FA token
const verify2FAToken = (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
  res.status(200).json({ verified });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  generate2FASecret,
  verify2FAToken,
};
