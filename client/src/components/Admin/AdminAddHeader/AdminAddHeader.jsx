import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import "./AdminAddHeader.css";

function AdminAddHeader({ title, subtitle }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="admin-add-header">
      <div className="admin-add-header-top">
        <button className="back-button" onClick={handleGoBack}>
          <FaChevronLeft />
        </button>
        <div className="admin-add-header-content">
          <h2 className="header-title">{title}</h2>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminAddHeader;
