import React from "react";
import "./Button.css";

const Button = ({
  type = "button",
  onClick,
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  hasIcon = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${fullWidth ? "btn-full" : ""} ${
        hasIcon ? "btn-with-icon" : ""
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
