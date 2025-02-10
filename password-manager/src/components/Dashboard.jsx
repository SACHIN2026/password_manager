// components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Container, Typography, List, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";

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
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Dashboard
      </Typography>
      {passwords.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No passwords stored yet
        </Typography>
      ) : (
        <List>
          {passwords.map((pwd) => (
            <motion.div
              key={pwd.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{pwd.siteName}</Typography>
                  <Typography
                    variant="body2"
                    color={
                      pwd.password === "DECRYPTION_ERROR" ? "error" : "text.secondary"
                    }
                  >
                    {pwd.password}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Dashboard;
