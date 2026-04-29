import React, { useState, useEffect } from "react";
import "./UserLayout.css";
import Header from "../../components/UI/User/Header/Header";
import Sidebar from "../../components/UI/User/Sidebar/Sidebar";
import Footer from "../../components/UI/User/Footer/Footer";

function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="user-layout">
      <Header toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />

        {isMobile && sidebarOpen && (
          <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
        )}

        <main
          className={`content ${
            isMobile && sidebarOpen ? "content-pushed" : ""
          }`}
        >
          <div className="content-wrapper">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default UserLayout;
