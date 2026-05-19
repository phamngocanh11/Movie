import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import "./Register.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import userService from "../../../services/userService";
import { toast } from "sonner";
import GoogleLoginButton from "../../../components/Auth/GoogleLoginButton/GoogleLoginButton";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên hiển thị";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await userService.register(formData);
        if (response) {
          toast(
            "Đăng ký thành công! Chuyển tới trang đăng nhập.",
            response.message
          );

          navigate("/login");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="register-container">
        <div className="auth-header-text">
          <h2 className="register-title">Tạo tài khoản mới</h2>
          <p className="register-subtitle">Tham gia cùng chúng tôi ngay hôm nay</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              type="text"
              id="name"
              name="name"
              label="Tên hiển thị"
              placeholder="Nhập tên"
              value={formData.name}
              onChange={handleChange}
              required
              error={errors.name}
            />

            <Input
              type="text"
              id="username"
              name="username"
              label="Tên đăng nhập"
              placeholder="Nhập username"
              value={formData.username}
              onChange={handleChange}
              required
              error={errors.username}
            />
          </div>

          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <div className="form-row">
            <Input
              type="password"
              id="password"
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
            />

            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận"
              placeholder="Nhập lại"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={errors.confirmPassword}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Đăng ký
          </Button>

          <GoogleLoginButton actionText="signup_with" />

          <div className="login-link">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Register;
