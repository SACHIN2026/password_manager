// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserFromToken, removeToken } from "../utils/auth";

const Navbar = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Password Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {user ? (
            <>
              <Avatar
                src={user.profilePic || ""}
                sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : ""}
              </Avatar>
              <Typography variant="body1" sx={{ mx: 1 }}>
                {user.username || "Profile"}
              </Typography>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/add-password">
                Add Password
              </Button>
              <Button color="inherit" component={Link} to="/passwords">
                Passwords
              </Button>
              <Button color="inherit" component={Link} to="/two-factor">
                2FA
              </Button>
              <Button color="inherit" component={Link} to="/audit">
                Audit Logs
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
