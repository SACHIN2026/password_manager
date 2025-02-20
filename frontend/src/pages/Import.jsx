// src/pages/Import.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import { Container, Box, Button, Typography } from "@mui/material";
import API from "../utils/api";

const Import = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const importedPasswords = results.data;
        for (const pwd of importedPasswords) {
          try {
            await API.post("/passwords", {
              siteName: pwd["Site Name"],
              password: pwd["Password"],
            });
          } catch (err) {
            console.error("Failed to import a password:", err);
          }
        }
        alert("Import complete");
      },
    });
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Import Passwords
      </Typography>
      <Box sx={{ my: 2 }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </Box>
      <Button variant="contained" color="primary" onClick={handleImport}>
        Import CSV
      </Button>
    </Container>
  );
};

export default Import;
