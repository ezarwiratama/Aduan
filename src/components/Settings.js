import React, { useState } from "react";
import Sidenav from "./Sidenav";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("in");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSaveSettings = () => {
    setSnackbarMessage("Settings saved successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ my: 2, marginTop: "6vh" }}>
          <div>Theme</div>
            <FormControl fullWidth margin="normal">
              <Select
                id="theme-select"
                value={theme}
                onChange={handleThemeChange}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ my: 2 }}>
          <div>Language</div>
            <FormControl fullWidth margin="normal">
              <Select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
              >
                <MenuItem value="in">Indonesia</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default Settings;