import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import userService from "../../../services/userService";
import movieService from "../../../services/movieService";
import { toast } from "sonner";

function AdminAddUser() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getAllMovies();
        if (Array.isArray(response)) {
          setMovies(response);
        } else if (response && Array.isArray(response.data)) {
          setMovies(response.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Không thể tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const movieOptions = movies.map((movie) => ({
    value: movie._id || movie.id,
    label: movie.title || 'Phim không có tên',
  }));

  const roleOptions = [
    { value: "user", label: "Người dùng" },
    { value: "admin", label: "Quản trị viên" },
  ];

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) || "Email không hợp lệ";
  };

  const validatePassword = (password) => {
    return password.length >= 6 || "Mật khẩu phải có ít nhất 6 ký tự";
  };

  const userFields = [
    {
      name: "name",
      label: "Họ và tên",
      type: "text",
      placeholder: "Nhập họ và tên",
      required: true,
      col: 6,
    },
    {
      name: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "Nhập tên đăng nhập",
      required: true,
      col: 6,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "example@domain.com",
      required: true,
      validation: validateEmail,
      col: 6,
    },
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu",
      required: true,
      validation: validatePassword,
      col: 6,
    },
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      required: true,
      options: roleOptions,
      defaultValue: "user",
      col: 6,
    },
    {
      name: "avatar",
      label: "Ảnh đại diện",
      type: "file",
      accept: "image/*",
      description: "Chọn ảnh đại diện cho người dùng (định dạng: JPG, PNG)",
      col: 6,
    },
    {
      name: "movieWatched",
      label: "Phim đã xem",
      type: "multi-select",
      options: movieOptions,
      col: 12,
    },
    {
      name: "favourite",
      label: "Phim yêu thích",
      type: "multi-select",
      options: movieOptions,
      col: 12,
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      const response = await userService.createUser(formData);

      if (response && response.data) {
        toast.success("Tạo người dùng mới thành công!");
        navigate("/admin/users");
      } else {
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error.message || "Có lỗi xảy ra khi tạo người dùng"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  return (
    <AdminLayout>
      <AdminAddHeader
        title="Thêm người dùng mới"
        subtitle="Điền thông tin để tạo tài khoản người dùng mới"
      />

      <div className="admin-add-container">
        <AdminAddForm
          fields={userFields}
          onSubmit={handleSubmit}
          submitButtonText={submitting ? "Đang tạo..." : "Tạo người dùng"}
          submitButtonDisabled={submitting}
          cancelButton={true}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminAddUser;
