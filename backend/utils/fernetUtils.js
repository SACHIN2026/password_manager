// utils/fernetUtils.js
const crypto = require("crypto");
require("dotenv").config();

// AES-256-CBC requires a 32-byte key and a 16-byte IV
// Make sure that process.env.FERNET_SECRET is a Base64-encoded 32-byte key.
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.FERNET_SECRET, "base64");

const encryptPassword = (password) => {
  // Generate a random 16-byte IV
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, "utf8", "base64");
  encrypted += cipher.final("base64");
  // Prepend IV to the ciphertext (separated by a colon)
  const ivBase64 = iv.toString("base64");
  return `${ivBase64}:${encrypted}`;
};

const decryptPassword = (encryptedData) => {
  // Split the stored string into IV and ciphertext
  const parts = encryptedData.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted data format");
  }
  const iv = Buffer.from(parts[0], "base64");
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptPassword, decryptPassword };
