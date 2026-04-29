import React, { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import "./AdminHeader.css";
import { decryptedUserData, isAuthenticated } from "../../../../utils/auth";
import ThemeToggle from "../../../ThemeToggle/ThemeToggle";

const formatRole = (role) => {
  if (role === "admin") {
    return "Quản trị viên";
  } else {
    return "Người dùng";
  }
};

function AdminHeader({ toggleSidebar }) {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    role: "",
  });

  useEffect(() => {
    const loadUserData = () => {
      if (isAuthenticated()) {
        const userData = decryptedUserData();

        if (userData) {
          setUser({
            name: userData.name || "User",
            avatar: userData?.avatar || "",
            role: formatRole(userData.role),
          });
        }
      }
    };

    loadUserData();
  }, []);

  return (
    <header className="adm-header">
      <div className="adm-header-glass"></div>

      <div className="adm-header-left">
        <button
          className="adm-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <MdMenu className="adm-menu-icon" />
        </button>

        <div className="adm-search-container"></div>
      </div>

      <div className="adm-header-right">
        <ThemeToggle />
        
        <div className="adm-user-profile">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="adm-user-avatar"
            />
          )}
          <div className="adm-user-info">
            <span className="adm-user-name">{user.name}</span>
            <span className="adm-user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
