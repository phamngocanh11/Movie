import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <div className={`theme-toggle-switch ${isDark ? "active" : ""}`}>
        <div className={`theme-toggle-slider ${isDark ? "active" : ""}`}>
          <span className="theme-toggle-icon">
            {isDark ? <FaMoon /> : <FaSun />}
          </span>
        </div>
      </div>
      <span className="theme-toggle-label">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
};

export default ThemeToggle;
