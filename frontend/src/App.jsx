// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import PasswordForm from "./components/PasswordForm";
import PasswordList from "./components/PasswordList";
import { getToken } from "./utils/auth";
import { Container } from "@mui/material";
import Passwords from "./pages/Passwords";

const App = () => {
  const isAuthenticated = !!getToken();

  return (
    <Router>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/add-password" element={isAuthenticated ? <PasswordForm /> : <Navigate to="/login" />} />
          <Route path="/passwords" element={isAuthenticated ? <Passwords/> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
