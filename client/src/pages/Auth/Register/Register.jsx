import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import "./Register.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import userService from "../../../services/userService";
import { toast } from "sonner";

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
        <h2 className="register-title">Đăng ký</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            name="name"
            label="Tên hiển thị"
            placeholder="Nhập tên hiển thị"
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
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            error={errors.username}
          />

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
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" fullWidth>
            Đăng ký
          </Button>

          <div className="login-link">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Register;
