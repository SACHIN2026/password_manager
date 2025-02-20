// src/components/PasswordForm.jsx
import React, { useState } from "react";
import API from "../utils/api";
import { Box, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import zxcvbn from "zxcvbn";
import Navbar from "./Navbar";

const generatePassword = (length = 12) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const PasswordForm = ({ onPasswordAdded }) => {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const result = zxcvbn(pwd);
    setStrength(result.score); // 0-4
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/passwords", { siteName: site, password });
      setSite("");
      setPassword("");
      setStrength(0);
      if (typeof onPasswordAdded === "function") {
        onPasswordAdded();
      }
      setSuccessOpen(true);
    } catch (error) {
      console.error("Failed to add password:", error);
      setError("Failed to add password. Please try again.");
    }
    setLoading(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccessOpen(false);
  };

  return (
    <>
      <Navbar />
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
          mt: 4,
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
          />
          <Button variant="outlined" color="secondary" onClick={() => setPassword(generatePassword(12))}>
            Generate
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography variant="caption">Strength: {strength}/4</Typography>
          <Box
            sx={{
              height: 8,
              backgroundColor: "#e0e0e0",
              borderRadius: 1,
              overflow: "hidden",
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                width: `${(strength / 4) * 100}%`,
                height: "100%",
                backgroundColor:
                  strength < 2 ? "error.main" : strength < 3 ? "warning.main" : "success.main",
              }}
            />
          </Box>
        </Box>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Adding...
            </>
          ) : (
            "Add Password"
          )}
        </Button>
        <Snackbar
          open={successOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
            Password added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default PasswordForm;
