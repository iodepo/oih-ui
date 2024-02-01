import React from "react";
import App from "./config/App";
import ReactDOM from "react-dom/client";
import { AppTranslationProvider } from "context/AppTranslationProvider";
import { AppThemeProvider } from "context/AppThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <CssBaseline />
      <AppTranslationProvider>
        <App />
      </AppTranslationProvider>
    </AppThemeProvider>
  </React.StrictMode>
);
