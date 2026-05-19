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
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${fullWidth ? "btn-full" : ""} ${
        hasIcon ? "btn-with-icon" : ""
      } ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
