import React from "react";
import { Link } from "react-router-dom";
import "./Unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">403 - Không có quyền truy cập</h1>
        <p className="unauthorized-message">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn nghĩ đây là lỗi.
        </p>
        <div className="unauthorized-actions">
          <Link to="/" className="unauthorized-button">
            Quay về trang chủ
          </Link>
          <Link to="/login" className="unauthorized-button">
            Đăng nhập với tài khoản khác
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
