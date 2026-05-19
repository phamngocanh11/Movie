import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import "../Register/Register.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import userService from "../../../services/userService";
import { toast } from "sonner";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      toast.error("Vui lòng nhập đầy đủ username và email");
      return;
    }

    try {
      setSubmitting(true);
      const response = await userService.forgotPassword(formData);
      toast.success(response?.message || "Link đặt lại mật khẩu đã được gửi về email");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Không thể xử lý yêu cầu quên mật khẩu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="register-container">
        <h2 className="register-title">Quên mật khẩu</h2>
        <form className="register-form" onSubmit={handleSubmit}>
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
            type="email"
            id="email"
            name="email"
            label="Email"
            placeholder="Nhập email đã đăng ký"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </Button>

          <div className="login-link">
            Đã nhớ mật khẩu? <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
