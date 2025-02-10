// controllers/authcontroller.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  console.log(req.body);
  const { username, masterPassword } = req.body;

  if (!username || !masterPassword) {
    return res.status(400).json({ message: "Please provide all fields." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the master password
    const salt = await bcrypt.genSalt(10);
    const masterPasswordHash = await bcrypt.hash(masterPassword, salt);

    // Create new user
    const user = await User.create({
      username,
      masterPasswordHash,
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, masterPassword } = req.body;

  if (!username || !masterPassword) {
    return res.status(400).json({ message: "Please provide all fields." });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if the master password is correct
    const isMatch = await user.matchPassword(masterPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
