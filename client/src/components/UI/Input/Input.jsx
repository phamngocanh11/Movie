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
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
