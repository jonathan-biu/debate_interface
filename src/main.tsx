import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import { HashRouter } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </SettingsProvider>
  </React.StrictMode>
);
