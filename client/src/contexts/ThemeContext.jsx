import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const ThemeContext = createContext();

// Custom hook để sử dụng ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Lấy theme từ localStorage, mặc định là "light"
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Apply theme khi component mount và khi theme thay đổi
  useEffect(() => {
    // Set attribute cho html element
    document.documentElement.setAttribute("data-theme", theme);
    // Lưu vào localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Set theme trực tiếp
  const setThemeMode = (mode) => {
    if (mode === "light" || mode === "dark") {
      setTheme(mode);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
