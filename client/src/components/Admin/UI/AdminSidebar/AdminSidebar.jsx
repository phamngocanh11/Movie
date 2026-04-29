import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdLogout,
  MdMovie,
  MdCategory,
  MdComment,
  MdTheaters,
  MdPerson,
} from "react-icons/md";
import "./AdminSidebar.css";
import { logout } from "../../../../utils/auth";

function AdminSidebar({ sidebarCollapsed, toggleSidebar, currentPath }) {
  const logoutAction = () => {
    logout();
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      icon: <MdDashboard className="adm-nav-icon-svg" />,
      label: "Tổng quan",
    },
    {
      path: "/admin/users",
      icon: <MdPeople className="adm-nav-icon-svg" />,
      label: "Người dùng",
    },
    {
      path: "/admin/movies",
      icon: <MdMovie className="adm-nav-icon-svg" />,
      label: "Quản lý phim",
    },
    {
      path: "/admin/categories",
      icon: <MdCategory className="adm-nav-icon-svg" />,
      label: "Thể loại",
    },
    {
      path: "/admin/manufacturers",
      icon: <MdComment className="adm-nav-icon-svg" />,
      label: "Nhà sản xuất",
    },
    {
      path: "/admin/directors",
      icon: <MdTheaters className="adm-nav-icon-svg" />,
      label: "Đạo diễn",
    },
    {
      path: "/admin/actors",
      icon: <MdPerson className="adm-nav-icon-svg" />,
      label: "Diễn viên",
    },
  ];

  const isActive = (path) => {
    if (currentPath === path) return true;

    if (path !== "/admin/dashboard" && currentPath.startsWith(path + "/"))
      return true;

    return false;
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth <= 992) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`adm-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="adm-sidebar-glass"></div>

      <div className="adm-sidebar-header">
        <div className="adm-logo">
          <span className="adm-logo-icon">M</span>
          <span className="adm-logo-text">MovieAdmin</span>
        </div>
        <button className="adm-sidebar-close" onClick={toggleSidebar}>
          &times;
        </button>
      </div>

      <div className="adm-sidebar-content">
        <nav className="adm-sidebar-nav">
          <ul className="adm-nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="adm-nav-item">
                <NavLink
                  to={item.path}
                  className={`adm-nav-link ${
                    isActive(item.path) ? "adm-active" : ""
                  }`}
                  onClick={handleMenuItemClick}
                  data-title={item.label}
                >
                  <span className="adm-nav-icon">{item.icon}</span>
                  <span className="adm-nav-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="adm-sidebar-footer">
        <button className="adm-logout-btn" onClick={logoutAction}>
          <MdLogout className="adm-logout-icon" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
