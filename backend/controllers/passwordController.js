// controllers/passwordController.js
const Password = require("../models/Password");
const AuditLog = require("../models/AuditLog"); // Import the audit log model
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

    // Create an audit log entry for creation
    await AuditLog.create({
      user: req.user.id,
      passwordId: newPassword._id,
      action: "created",
      details: `Created password for site ${siteName}`,
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

    // Create an audit log entry for update
    await AuditLog.create({
      user: req.user.id,
      passwordId: updatedPassword._id,
      action: "updated",
      details: `Updated password for site ${updatedPassword.siteName}`,
    });

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

    // Create an audit log entry for deletion
    await AuditLog.create({
      user: req.user.id,
      passwordId: deletedPassword._id,
      action: "deleted",
      details: `Deleted password for site ${deletedPassword.siteName}`,
    });

    res.status(200).json({ message: "Password deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addPassword, getPasswords, updatePassword, deletePassword };
