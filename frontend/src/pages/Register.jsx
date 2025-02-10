// pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button, Typography } from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        username,
        masterPassword,
      });
      setMessage(response.data.message);
      setUsername("");
      setMasterPassword("");
      navigate("/login");
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h4" align="center">
          Register
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Master Password"
          type="password"
          variant="outlined"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
        {message && (
          <Typography variant="body2" color="error" align="center">
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Register;
