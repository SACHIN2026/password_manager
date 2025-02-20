// src/pages/AuditLogs.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import { Container, Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  const fetchAuditLogs = async () => {
    try {
      const response = await API.get("/audit");
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Audit Logs
        </Typography>
        {logs.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            No audit logs available.
          </Typography>
        ) : (
          <List>
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem>
                    <ListItemText
                      primary={`${log.action.toUpperCase()} - ${log.details}`}
                      secondary={new Date(log.timestamp).toLocaleString()}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Container>
    </>
  );
};

export default AuditLogs;
