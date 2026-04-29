import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import userService from "../../../services/userService";
import movieService from "../../../services/movieService";
import { toast } from "sonner";
import {
  MdSave,
  MdCancel,
  MdArrowBack,
  MdVerified,
  MdEmail,
  MdAccessTime,
} from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import "./AdminEditUser.css";

function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userResponse = await userService.getUserById(id);

        if (!userResponse) {
          throw new Error("Không thể tải thông tin người dùng");
        }

        setUser(userResponse);

        const moviesResponse = await movieService.getAllMovies();

        setMovies(moviesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
        toast.error("Không thể tải dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const movieOptions = movies.map((movie) => ({
    value: movie._id,
    label: movie.title || "Phim không có tên",
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

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);

      // Only submit system attributes (role, status, membership, membershipExpiry)
      const updateData = {
        role: formData.role,
        status: formData.status,
        membership: formData.membership,
        membershipExpiry: formData.membershipExpiry || null,
      };

      // Cập nhật người dùng
      const response = await userService.updateUser(id, updateData);

      if (response && response.data) {
        toast.success("Cập nhật tài khoản người dùng thành công!");
        navigate(`/admin/users/${id}`);
      } else {
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error.message || "Có lỗi xảy ra khi cập nhật tài khoản người dùng",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/users/${id}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const renderActions = () => (
    <>
      <Button
        variant="secondary"
        onClick={handleCancel}
        className="cancel-button"
        disabled={submitting}
      >
        <MdCancel /> Hủy
      </Button>
    </>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-detail-loading">
          <div className="admin-detail-loading-spinner"></div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="admin-detail-error">
          <div className="admin-detail-error-icon">!</div>
          <h3>Không thể tải thông tin người dùng</h3>
          <p>{error || "Đã xảy ra lỗi"}</p>
          <div className="error-actions">
            <Button variant="primary" onClick={handleRetry}>
              Thử lại
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/users")}
            >
              <MdArrowBack /> Quay lại danh sách
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Status options
  const statusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "banned", label: "Đã khóa" },
    { value: "suspended", label: "Tạm dừng" },
  ];

  // Membership/VIP options
  const membershipOptions = [
    { value: "free", label: "Miễn phí" },
    { value: "vip", label: "VIP" },
    { value: "premium", label: "Premium" },
  ];

  // Prepare form fields with current user data
  // Separated into Personal Info (read-only) and System Attributes (editable)
  const personalInfoFields = [
    {
      name: "name",
      label: "Họ và tên",
      type: "text",
      placeholder: "Nhập họ và tên",
      required: true,
      value: user.name || "",
      col: 6,
      disabled: true,
      description: "Thông tin cá nhân không thể chỉnh sửa từ đây",
    },
    {
      name: "username",
      label: "Tên đăng nhập",
      type: "text",
      placeholder: "Nhập tên đăng nhập",
      required: true,
      value: user.username || "",
      col: 6,
      disabled: true,
      description: "Thông tin cá nhân không thể chỉnh sửa từ đây",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "example@domain.com",
      required: true,
      validation: validateEmail,
      value: user.email || "",
      col: 6,
      disabled: true,
      description: "Thông tin cá nhân không thể chỉnh sửa từ đây",
    },
    {
      name: "avatar",
      label: "Ảnh đại diện",
      type: "file",
      accept: "image/*",
      description: "Thông tin cá nhân không thể chỉnh sửa từ đây",
      col: 6,
      disabled: true,
      preview: user.avatar,
    },
  ];

  const systemAttributeFields = [
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      required: true,
      options: roleOptions,
      value: user.role || "user",
      col: 6,
    },
    {
      name: "status",
      label: "Trạng thái tài khoản",
      type: "select",
      required: true,
      options: statusOptions,
      value: user.status || "active",
      col: 6,
    },
    {
      name: "membership",
      label: "Cấp độ thành viên",
      type: "select",
      required: false,
      options: membershipOptions,
      value: user.membership || "free",
      col: 6,
      description: "Cấp độ thành viên của người dùng",
    },
    {
      name: "membershipExpiry",
      label: "Ngày hết hạn VIP",
      type: "date",
      required: false,
      value: user.membershipExpiry
        ? new Date(user.membershipExpiry).toISOString().split("T")[0]
        : "",
      col: 6,
      description: "Để trống nếu là thành viên vĩnh viễn",
    },
  ];

  const userFields = [...personalInfoFields, ...systemAttributeFields];

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <AdminLayout>
      <AdminAddHeader
        title="Quản lý tài khoản người dùng"
        subtitle={`Quản lý tài khoản của ${user.name} (${user.username})`}
        actions={renderActions()}
      />

      <div className="edit-user-container">
        <div className="edit-user-panels">
          <div className="edit-user-sidebar">
            <div className="edit-user-profile-card">
              <div className="edit-user-avatar">
                <img
                  src={
                    user.avatar ||
                    "https://via.placeholder.com/180x180?text=User"
                  }
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/180x180?text=User";
                  }}
                />
              </div>
              <h3 className="edit-user-name">{user.name}</h3>
              <p className="edit-user-username">@{user.username}</p>

              <div className="edit-user-badge">
                <span
                  className={`user-role-badge ${
                    user.role === "admin" ? "role-admin" : "role-user"
                  }`}
                >
                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </span>
              </div>

              <ul className="edit-user-info-list">
                <li>
                  <MdEmail className="info-icon" />
                  <span>{user.email}</span>
                </li>
                <li>
                  <MdVerified className="info-icon" />
                  <span>ID: {user._id}</span>
                </li>
                <li>
                  <MdAccessTime className="info-icon" />
                  <span>Tham gia: {formatDate(user.createdAt)}</span>
                </li>
              </ul>

              <div className="edit-user-stats">
                <div className="stat-item">
                  <div className="stat-value">
                    {user.movieWatched?.length || 0}
                  </div>
                  <div className="stat-label">Đã xem</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {user.favourite?.length || 0}
                  </div>
                  <div className="stat-label">Yêu thích</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{user.commentCount || 0}</div>
                  <div className="stat-label">Bình luận</div>
                </div>
              </div>
            </div>
          </div>

          <div className="edit-user-form-panel">
            <div className="edit-user-form-card">
              <h2 className="form-title">Thông tin cá nhân</h2>
              <AdminAddForm
                id="edit-user-personal-form"
                fields={personalInfoFields}
                onSubmit={() => {}}
                showSubmitButton={false}
                resetAfterSubmit={false}
                className="edit-user-form"
              />

              <h2 className="form-title form-title-secondary">
                Quản lý tài khoản
              </h2>
              <AdminAddForm
                id="edit-user-form"
                fields={systemAttributeFields}
                onSubmit={handleSubmit}
                showSubmitButton={true}
                submitButtonText={submitting ? "Đang lưu..." : "Lưu thay đổi"}
                submitButtonDisabled={submitting}
                resetAfterSubmit={false}
                className="edit-user-form"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminEditUser;
