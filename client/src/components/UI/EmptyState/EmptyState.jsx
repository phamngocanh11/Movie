import React from "react";
import { Link } from "react-router-dom";
import "./EmptyState.css";

const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {Icon && <Icon />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="empty-state-action">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
