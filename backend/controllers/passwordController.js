// controllers/passwordController.js
const Password = require("../models/Password");
const { encryptPassword, decryptPassword } = require("../utils/fernetUtils");

// Add a new password
const addPassword = async (req, res) => {
  const { siteName, password } = req.body;

  if (!siteName || !password) {
    return res.status(400).json({ message: "Please provide all fields." });
  }

  try {
    // Encrypt the password
    const encryptedPassword = encryptPassword(password);

    const newPassword = await Password.create({
      user: req.user.id,
      siteName,
      encryptedPassword,
    });

    res.status(201).json(newPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all passwords for the logged-in user
const getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user.id });

    // Decrypt each password before sending.
    // If decryption fails for a password, catch the error and use a fallback string.
    const decryptedPasswords = passwords.map((pw) => {
      let decrypted = "";
      try {
        decrypted = decryptPassword(pw.encryptedPassword);
      } catch (err) {
        console.error("Decryption error for password id " + pw._id, err);
        decrypted = "Decryption error";
      }
      return {
        id: pw._id,
        siteName: pw.siteName,
        password: decrypted,
      };
    });

    res.status(200).json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a password
const updatePassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (!password) {
    return res.status(400).json({ message: "Please provide a new password." });
  }

  try {
    const encryptedPassword = encryptPassword(password);
    const updatedPassword = await Password.findByIdAndUpdate(
      id,
      { encryptedPassword },
      { new: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ message: "Password not found." });
    }

    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a password
const deletePassword = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPassword = await Password.findByIdAndDelete(id);

    if (!deletedPassword) {
      return res.status(404).json({ message: "Password not found." });
    }

    res.status(200).json({ message: "Password deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addPassword, getPasswords, updatePassword, deletePassword };
