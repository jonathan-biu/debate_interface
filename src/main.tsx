import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import { HashRouter } from "react-router-dom";
import "./output.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
