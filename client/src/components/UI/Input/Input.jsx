import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Input.css";

const Input = ({
  type = "text",
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="required"></span>}
        </label>
      )}
      <div className="input-container">
        <input
          type={isPasswordInput && showPassword ? "text" : type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`glass-input ${error ? "error" : ""}`}
          disabled={disabled}
        />
        {isPasswordInput && (
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
