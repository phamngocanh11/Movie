import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminListHeader from "../../../components/Admin/AdminListHeader/AdminListHeader";
import AdminListFilter from "../../../components/Admin/AdminListFilter/AdminListFilter";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import userService from "../../../services/userService";
import { toast } from "sonner";
import "./AdminUser.css";

function AdminUser() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUser();

      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.warn("Dữ liệu không đúng định dạng:", response);
        setUsers([]);
        setError("Dữ liệu người dùng không đúng định dạng");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    {
      id: "role",
      label: "Vai trò",
      type: "select",
      value: roleFilter,
      options: [
        { value: "admin", label: "Quản trị viên" },
        { value: "user", label: "Người dùng" },
      ],
    },
  ];

  const handleFilterChange = (filterId, value) => {
    if (filterId === "role") {
      setRoleFilter(value);
    }
  };

  const columns = [
    {
      key: "avatar",
      title: "Ảnh",
      render: (user) => (
        <div className="user-avatar">
          <img
            src={user.avatar || ""}
            alt={user.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "null";
            }}
          />
        </div>
      ),
    },
    { key: "name", title: "Họ tên" },
    { key: "username", title: "Tên đăng nhập" },
    { key: "email", title: "Email", hideOnMobile: "sm" },
    {
      key: "role",
      title: "Vai trò",
      render: (user) => (
        <span
          className={`role-badge ${
            user.role === "admin" ? "role-admin" : "role-user"
          }`}
        >
          {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      hideOnMobile: "md",
      render: (user) => new Date(user.createdAt).toLocaleDateString("vi-VN"),
    },
    { key: "actions", title: "Hành động" },
  ];

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      !searchValue ||
      user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchValue.toLowerCase());

    const roleMatch = !roleFilter || user.role === roleFilter;

    return searchMatch && roleMatch;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleEditUser = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete);
      setUsers(users.filter((user) => (user._id || user.id) !== userToDelete));
      toast.success("Xóa người dùng thành công!");
    } catch (error) {
      toast.error(
        "Xóa người dùng thất bại: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      handleCloseDeleteModal();
    }
  };

  const emptyStateProps = {
    icon: <MdPerson size={48} />,
    title: "Không có người dùng nào",
    message: "Thêm người dùng đầu tiên vào hệ thống của bạn",
    actionButton: (
      <Button onClick={() => navigate("/admin/users/add")}>
        Thêm người dùng mới
      </Button>
    ),
  };

  return (
    <AdminLayout>
      <AdminListHeader
        title="Quản lý người dùng"
        subtitle="Quản lý người dùng trong hệ thống của bạn"
        actionButton={() => navigate("/admin/users/add")}
        titleButton="Thêm người dùng mới"
      />

      <AdminListFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Tìm kiếm người dùng..."
      />

      <AdminDataTable
        data={getCurrentPageData()}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchUsers}
        emptyStateProps={emptyStateProps}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteClick}
        pagination={{
          currentPage,
          totalPages,
          startItem:
            totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
          endItem: Math.min(currentPage * itemsPerPage, totalItems),
          totalItems,
        }}
        onPageChange={handlePageChange}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Tất cả dữ liệu liên quan đến người dùng này (bình luận, lịch sử xem, danh sách yêu thích) sẽ bị xóa. Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminUser;
