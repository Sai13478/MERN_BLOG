// src/components/Layout.js
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useDarkMode } from "../context/DarkModeContext"; // Use useDarkMode hook
import { FaMoon, FaSun } from "react-icons/fa"; // Icons for dark/light modes

const Layout = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode state and toggle function

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div className="layout">
      <Header />

      {/* Dark Mode Toggle Button */}
      <button onClick={toggleDarkMode} className="theme-toggle-btn">
        {isDarkMode ? <FaSun /> : <FaMoon />} {/* Switch icon */}
      </button>

      {/* Page Content */}
      <Outlet />

      <Footer />
    </div>
  );
};

export default Layout;
