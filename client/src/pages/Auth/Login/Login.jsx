import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import "./Login.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import userService from "../../../services/userService";
import { toast } from "sonner";
import { encryptedUserData, getRoleAfterLogin } from "../../../utils/auth";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validErrors = {};

    if (formData.username === "") {
      validErrors.username = "Tên đăng nhập không được để trống";
    }
    if (formData.password === "") {
      validErrors.password = "Mật khẩu không được để trống";
    }

    if (Object.keys(validErrors).length === 0) {
      try {
        const response = await userService.login(formData);
        toast.success("Đăng nhập thành công", response.message);

        encryptedUserData(response, formData);
        const role = getRoleAfterLogin(response);
        navigate(role);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <AuthLayout>
      <div className="login-container">
        <h2 className="login-title">Đăng nhập</h2>
        <form
          className="login-form"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyPress}
        >
          <Input
            type="text"
            id="username"
            name="username"
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            id="password"
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="form-options">
            <div></div>
            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Đăng nhập
          </Button>

          <div className="register-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
