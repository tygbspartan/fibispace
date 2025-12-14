import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <ScrollToTopButton />
      <Main />
    </Router>
  </React.StrictMode>
);
