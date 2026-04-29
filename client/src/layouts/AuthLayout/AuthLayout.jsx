import React from "react";
import "./AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>{" "}
      </div>
      <div className="auth-content">
        <div className="auth-card">{children}</div>
        <div className="auth-footer">
          <p>© {new Date().getFullYear()} Movie. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
