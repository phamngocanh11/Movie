import React from "react";
import "./AdminListHeader.css";
import Button from "../../UI/Button/Button";

function AdminListHeader({ title, titleButton, actionButton, subtitle }) {
  return (
    <div className="admin-list-header">
      <div className="admin-list-header__content">
        <h1 className="admin-list-header__title">{title}</h1>
        {subtitle && <p className="admin-list-header__subtitle">{subtitle}</p>}
      </div>
      {actionButton && <Button children={titleButton} onClick={actionButton} />}
    </div>
  );
}

export default AdminListHeader;
