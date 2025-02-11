// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserFromToken } from "../utils/auth";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = getUserFromToken();
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Password Manager
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Securely store and manage all your passwords in one place.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Our application uses modern encryption techniques and secure
          authentication to ensure your data remains private and protected.
        </Typography>
        {!user && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="primary" component={Link} to="/login">
              Login
            </Button>
            <Button variant="outlined" color="primary" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
        {user && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Logged in as {user.username}</Typography>
            <Button variant="contained" color="primary" component={Link} to="/dashboard" sx={{ mt: 2 }}>
              Go to Dashboard
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Home;
