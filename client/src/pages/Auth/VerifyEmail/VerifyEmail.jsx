import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import "../Register/Register.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import api from "../../../config/api";
import { toast } from "sonner";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [tokenStatus, setTokenStatus] = useState("idle");
  const [submitting, setSubmitting] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      try {
        setTokenStatus("pending");
        const response = await api.post("/api/users/verify-email", { token });
        setTokenStatus("success");
        toast.success(response?.data?.message || "Xác thực email thành công");
      } catch (error) {
        setTokenStatus("error");
        toast.error(
          error?.response?.data?.message ||
            "Xác thực thất bại, vui lòng gửi lại email",
        );
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/api/users/resend-verification", {
        email,
      });
      toast.success(response?.data?.message || "Đã gửi lại email xác thực");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Không thể gửi lại email xác thực",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="register-container">
        <h2 className="register-title">Xác thực email</h2>

        {token ? (
          <div className="login-link" style={{ marginBottom: 16 }}>
            {tokenStatus === "pending" && "Đang xác thực email..."}
            {tokenStatus === "success" && "Email đã được xác thực thành công!"}
            {tokenStatus === "error" &&
              "Token xác thực không hợp lệ hoặc đã hết hạn."}
          </div>
        ) : (
          <div className="login-link" style={{ marginBottom: 16 }}>
            Nhập email để gửi lại liên kết xác thực.
          </div>
        )}

        {(tokenStatus === "error" || !token) && (
          <form className="register-form" onSubmit={handleResend}>
            <Input
              type="email"
              id="email"
              name="email"
              label="Email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi lại email xác thực"}
            </Button>
          </form>
        )}

        <div className="login-link" style={{ marginTop: 16 }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
