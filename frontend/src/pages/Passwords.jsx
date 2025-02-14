// pages/Passwords.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import PasswordList from "../components/PasswordList";
import Navbar from "../components/Navbar";
import { Container, Typography } from "@mui/material";

const Passwords = () => {
  const [passwords, setPasswords] = useState([]);

  const fetchPasswords = async () => {
    try {
      const response = await API.get("/passwords");
      setPasswords(response.data);
    } catch (error) {
      console.error("Failed to fetch passwords:", error);
      setPasswords([]);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Saved Passwords
        </Typography>
        <PasswordList passwords={passwords} onPasswordUpdated={fetchPasswords} />
      </Container>
    </>
  );
};

export default Passwords;
