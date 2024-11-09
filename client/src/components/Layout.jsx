// src/components/Layout.js
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useDarkMode } from "../context/DarkModeContext"; // Use useDarkMode hook
import { FaMoon, FaSun } from "react-icons/fa"; // Icons for dark/light modes

const Layout = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode state and toggle function

  useEffect(() => {
    // Toggle dark mode class on body element
    document.body.classList.toggle("dark-mode", isDarkMode);

    // Cleanup function to ensure no stale classes remain
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDarkMode]);

  return (
    <div className={`layout ${isDarkMode ? "dark-mode" : ""}`}>
      <Header />

      {/* Dark Mode Toggle Button with aria-label */}
      <button
        onClick={toggleDarkMode}
        className="theme-toggle-btn"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Page Content */}
      <Outlet />

      <Footer />
    </div>
  );
};

export default Layout;
