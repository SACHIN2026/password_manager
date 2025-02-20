// src/components/PasswordList.jsx
import React, { useState } from "react";
import API from "../utils/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  IconButton
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordList = ({ passwords = [], onPasswordUpdated }) => {
  const [editingId, setEditingId] = useState(null);
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [showPassword, setShowPassword] = useState({});

  const handleToggleVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/passwords/${id}`, { password: updatedPassword });
      setEditingId(null);
      onPasswordUpdated();
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/passwords/${id}`);
      onPasswordUpdated();
    } catch (error) {
      console.error("Failed to delete password:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Saved Passwords
      </Typography>
      {passwords.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No saved passwords.
        </Typography>
      ) : (
        <List>
          <AnimatePresence>
            {passwords.map((pwd) => (
              <motion.div
                key={pwd.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ListItem>
                  <Card sx={{ width: "100%" }}>
                    <CardContent>
                      <Typography variant="h6">{pwd.siteName}</Typography>
                      {editingId === pwd.id ? (
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
                          <TextField
                            label="New Password"
                            type="password"
                            variant="outlined"
                            value={updatedPassword}
                            onChange={(e) => setUpdatedPassword(e.target.value)}
                          />
                          <Button variant="contained" color="success" onClick={() => handleUpdate(pwd.id)}>
                            Save
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                          <Typography
                            variant="body2"
                            color={pwd.password === "DECRYPTION_ERROR" ? "error" : "text.secondary"}
                            sx={{ flexGrow: 1 }}
                          >
                            {showPassword[pwd.id] ? pwd.password : "••••••••••••"}
                          </Typography>
                          {pwd.password !== "DECRYPTION_ERROR" && (
                            <IconButton onClick={() => handleToggleVisibility(pwd.id)}>
                              {showPassword[pwd.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          )}
                        </Box>
                      )}
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        {editingId !== pwd.id && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setEditingId(pwd.id);
                              setUpdatedPassword(pwd.password || "");
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        <Button variant="outlined" color="error" onClick={() => handleDelete(pwd.id)}>
                          Delete
                        </Button>
                        {editingId === pwd.id && (
                          <Button variant="text" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      )}
    </Box>
  );
};

export default PasswordList;
