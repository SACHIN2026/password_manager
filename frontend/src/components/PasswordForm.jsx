// components/PasswordForm.jsx
import React, { useState } from "react";
import API from "../utils/api";
import { Box, TextField, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

const PasswordForm = ({ onPasswordAdded }) => {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/passwords", { siteName: site, password });
      setSite("");
      setPassword("");
      if (typeof onPasswordAdded === "function") {
        onPasswordAdded();
      }
    } catch (error) {
      console.error("Failed to add password:", error);
      setError("Failed to add password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      component={motion.form}
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" align="center">
        Add New Password
      </Typography>
      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}
      <TextField
        label="Site Name"
        variant="outlined"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        required
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Adding..." : "Add Password"}
      </Button>
    </Box>
  );
};

export default PasswordForm;
