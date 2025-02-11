// components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Container, Typography, List } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const Dashboard = () => {
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
        <Typography variant="h3" align="center" gutterBottom>
          Dashboard
        </Typography>
        {passwords.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            No passwords stored yet
          </Typography>
        ) : (
          <List>
            <AnimatePresence>
              {passwords.map((pwd) => (
                <motion.div
                  key={pwd.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6">{pwd.siteName}</Typography>
                  <Typography
                    variant="body2"
                    color={
                      pwd.password === "DECRYPTION_ERROR"
                        ? "error"
                        : "text.secondary"
                    }
                  >
                    {pwd.password}
                  </Typography>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
