import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./AdminLayout.css";
import AdminSidebar from "../../components/Admin/UI/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/Admin/UI/AdminHeader/AdminHeader";
import AdminContent from "../../components/Admin/UI/AdminContent/AdminContent";

function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={`adm-layout ${
        sidebarCollapsed ? "adm-sidebar-collapsed" : ""
      }`}
    >
      <AdminSidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        currentPath={location.pathname}
      />

      <div className="adm-main">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <AdminContent>{children}</AdminContent>
      </div>

      <div
        className={`adm-sidebar-overlay ${
          !sidebarCollapsed ? "adm-active" : ""
        }`}
        onClick={toggleSidebar}
      ></div>
    </div>
  );
}

export default AdminLayout;
