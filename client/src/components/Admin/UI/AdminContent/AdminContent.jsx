import React from "react";
import "./AdminContent.css";

function AdminContent({ children }) {
  return (
    <main className="adm-content">
      <div className="adm-content-wrapper">{children}</div>
    </main>
  );
}

export default AdminContent;
