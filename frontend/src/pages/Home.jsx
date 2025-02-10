// pages/Home.jsx
import React, { useEffect, useState } from "react";
import jwtDecode from "../utils/jwtDecodeWrapper"; // our wrapper for jwt-decode
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Home Page
      </Typography>
      {user ? (
        <Box>
          <Typography variant="h5">Hello, {user.username}!</Typography>
          <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </Box>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Container>
  );
};

export default Home;
