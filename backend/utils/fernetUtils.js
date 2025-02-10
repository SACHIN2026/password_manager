const Fernet = require("fernet");
require("dotenv").config();

// Create a secret using the value from the environment.
const secretKey = new Fernet.Secret(process.env.FERNET_SECRET);

const encryptPassword = (password) => {
  // Use a UNIX timestamp in seconds
  const token = new Fernet.Token({
    secret: secretKey,
    time: Math.floor(Date.now() / 1000),
    iv: "AQIDBAUGBwgJCgsMDQ4PEA==", // Constant IV (16 bytes in Base64)
  });
  return token.encode(password);
};

const decryptPassword = (encryptedPassword) => {
  // Do not pass a TTL so that no TTL check is performed during decryption.
  const token = new Fernet.Token({
    secret: secretKey,
    token: encryptedPassword,
  });
  return token.decode();
};

module.exports = { encryptPassword, decryptPassword };
