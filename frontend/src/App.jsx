// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import PasswordForm from "./components/PasswordForm";
import Passwords from "./pages/Passwords";
import Profile from "./pages/Profile"; // Added Profile page
import TwoFactor from "./pages/TwoFactor";
import AuditLogs from "./pages/AuditLogs";
import Export from "./pages/Export";
import Import from "./pages/Import";
import { getToken } from "./utils/auth";
import { lightTheme, darkTheme } from "./theme";

const App = () => {
  const isAuthenticated = !!getToken();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <IconButton onClick={toggleTheme} sx={{ position: "fixed", top: 16, right: 16 }}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/add-password" element={isAuthenticated ? <PasswordForm /> : <Navigate to="/login" />} />
            <Route path="/passwords" element={isAuthenticated ? <Passwords /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/two-factor" element={isAuthenticated ? <TwoFactor /> : <Navigate to="/login" />} />
            <Route path="/audit" element={isAuthenticated ? <AuditLogs /> : <Navigate to="/login" />} />
            <Route path="/export" element={isAuthenticated ? <Export /> : <Navigate to="/login" />} />
            <Route path="/import" element={isAuthenticated ? <Import /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
