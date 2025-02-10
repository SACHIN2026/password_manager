// routes/passwordroutes.js
const express = require("express");
const { addPassword, getPasswords, updatePassword, deletePassword } = require("../controllers/passwordController");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, addPassword);
router.get("/", authenticate, getPasswords);
router.put("/:id", authenticate, updatePassword);
router.delete("/:id", authenticate, deletePassword);

module.exports = router;
