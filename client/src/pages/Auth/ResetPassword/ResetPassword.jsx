import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import userService from "../../../services/userService";
import { toast } from "sonner";
import "../Register/Register.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const token = searchParams.get("token") || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Link đặt lại mật khẩu không hợp lệ");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu mới");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setSubmitting(true);
      const response = await userService.resetPassword({
        token,
        newPassword: formData.newPassword,
      });
      toast.success(response?.message || "Mật khẩu đã được đặt lại");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Không thể đặt lại mật khẩu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="register-container">
        <h2 className="register-title">Đặt lại mật khẩu</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </Button>

          <div className="login-link">
            Đã nhớ mật khẩu? <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
