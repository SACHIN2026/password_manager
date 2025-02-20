// src/pages/TwoFactor.jsx
import React, { useState } from "react";
import API from "../utils/api";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TwoFactor = () => {
    const [token, setToken] = useState("");
    const [secret, setSecret] = useState(""); // We'll store the secret received from the backend
    const navigate = useNavigate();

    const handleGenerateSecret = async () => {
        try {
            // Use the shared API instance so the URL is taken from env variables
            const response = await API.get("/auth/generate-2fa");
            setSecret(response.data.secret);
            alert("Scan the QR code or copy the secret: " + response.data.secret);
        } catch (error) {
            console.error("Failed to generate 2FA secret:", error);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            // Use the shared API instance for verification
            const response = await API.post("/auth/verify-2fa", { token, secret });
            if (response.data.verified) {
                navigate("/dashboard");
            } else {
                alert("Invalid 2FA token");
            }
        } catch (error) {
            console.error("2FA verification failed:", error);
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box component="form" onSubmit={handleVerify} sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h4" align="center">
                        Two-Factor Authentication
                    </Typography>
                    <Button variant="outlined" onClick={handleGenerateSecret}>
                        Generate 2FA Secret
                    </Button>
                    <TextField
                        label="Enter 2FA Token"
                        variant="outlined"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Verify
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default TwoFactor;
