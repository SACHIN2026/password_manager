// src/pages/Export.jsx
import React from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import API from "../utils/api";

const Export = () => {
  const handleExport = async () => {
    try {
      const response = await API.get("/passwords");
      const data = response.data;
      let csvContent = "data:text/csv;charset=utf-8,Site Name,Password\n";
      data.forEach((row) => {
        csvContent += `${row.siteName},${row.password}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "passwords.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Export Passwords
      </Typography>
      <Button variant="contained" color="primary" onClick={handleExport}>
        Export as CSV
      </Button>
    </Container>
  );
};

export default Export;
