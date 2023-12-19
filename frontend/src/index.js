import React from "react";
import App from "./config/App";
import ReactDOM from "react-dom/client";
import { AppTranslationProvider } from "ContextManagers/AppTranslationProvider";
import { AppThemeProvider } from "ContextManagers/AppThemeProvider";
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
