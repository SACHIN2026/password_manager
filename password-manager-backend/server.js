// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/auth", authRoutes);
app.use("/passwords", passwordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
