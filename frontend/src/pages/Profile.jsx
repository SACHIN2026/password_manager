// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Container, Box, TextField, Button, Typography, Avatar, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(""); // Base64 string or URL
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/auth/profile");
        const data = response.data;
        setUsername(data.username);
        setProfilePic(data.profilePic);
        setPreview(data.profilePic);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Also set profilePic as the base64 string
      const reader2 = new FileReader();
      reader2.onloadend = () => {
        setProfilePic(reader2.result);
      };
      reader2.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, profilePic };
      const response = await API.put("/auth/profile", payload);
      setMessage("Profile updated successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile.");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Profile
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 500,
            margin: "auto",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Avatar
              src={preview || ""}
              sx={{ width: 100, height: 100 }}
            >
              {(!preview && username) ? username.charAt(0).toUpperCase() : ""}
            </Avatar>
            <Button variant="outlined" component="label">
              Upload Profile Picture
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Update Profile
          </Button>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Profile;
