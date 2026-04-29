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
import { getUserSingleInfo } from "../../../utils/auth";
import "./AdminUser.css";

function AdminUser() {
  const navigate = useNavigate();
  const currentUserId = getUserSingleInfo("_id"); // ID của admin đang đăng nhập

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [banModalOpen, setBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  
  // Pagination state
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
    {
      id: "status",
      label: "Trạng thái",
      type: "select",
      value: statusFilter,
      options: [
        { value: "active", label: "Hoạt động" },
        { value: "banned", label: "Đã khóa" },
      ],
    },
  ];

  const handleFilterChange = (filterId, value) => {
    if (filterId === "role") {
      setRoleFilter(value);
    } else if (filterId === "status") {
      setStatusFilter(value);
    }
  };

  const columns = [
    {
      key: "avatar",
      title: "Ảnh",
      render: (user) => (
        <div className="user-avatar">
          <img
            src={user.avatar || "https://via.placeholder.com/40x40"}
            alt={user.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/40x40?text=User";
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
      key: "status",
      title: "Trạng thái",
      render: (user) => (
        <span
          className={`status-badge ${
            user.status === "banned" ? "status-banned" : "status-active"
          }`}
        >
          {user.status === "banned" ? "Đã khóa" : "Hoạt động"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      hideOnMobile: "md",
      render: (user) => new Date(user.createdAt).toLocaleDateString("vi-VN"),
    },
    { 
      key: "actions", 
      title: "Hành động",
      customActions: (user) => {
        const userId = user._id || user.id;
        const isCurrentUser = userId === currentUserId;
        const isAdmin = user.role === "admin";
        
        return {
          canView: true,
          canEdit: true,
          canDelete: false, // Không cho xóa user
          canBan: !isCurrentUser && !isAdmin, // Chỉ ban user thường, không ban chính mình và admin khác
          isBanned: user.status === "banned",
        };
      },
    },
  ];

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      !searchValue ||
      user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchValue.toLowerCase());

    const roleMatch = !roleFilter || user.role === roleFilter;
    const statusMatch = !statusFilter || user.status === statusFilter;

    return searchMatch && roleMatch && statusMatch;
  });
  
  // Pagination logic
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

  const handleBanClick = (id) => {
    const user = users.find(u => (u._id || u.id) === id);
    setUserToBan(user);
    setBanModalOpen(true);
  };

  const handleCloseBanModal = () => {
    setBanModalOpen(false);
    setUserToBan(null);
  };

  const handleConfirmBan = async () => {
    if (!userToBan) return;
    
    const userId = userToBan._id || userToBan.id;
    const newStatus = userToBan.status === "banned" ? "active" : "banned";
    
    try {
      // Cập nhật status của user
      await userService.updateUser(userId, { status: newStatus });
      
      // Cập nhật state
      setUsers(users.map(user => 
        (user._id || user.id) === userId 
          ? { ...user, status: newStatus }
          : user
      ));
      
      toast.success(
        newStatus === "banned" 
          ? "Đã khóa tài khoản người dùng" 
          : "Đã mở khóa tài khoản người dùng"
      );
    } catch (error) {
      toast.error(
        "Thao tác thất bại: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      handleCloseBanModal();
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
        onBan={handleBanClick}
        currentUserId={currentUserId}
        pagination={{
          currentPage,
          totalPages,
          startItem: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
          endItem: Math.min(currentPage * itemsPerPage, totalItems),
          totalItems
        }}
        onPageChange={handlePageChange}
      />

      <ConfirmModal
        isOpen={banModalOpen}
        onClose={handleCloseBanModal}
        onConfirm={handleConfirmBan}
        title={userToBan?.status === "banned" ? "Xác nhận mở khóa tài khoản" : "Xác nhận khóa tài khoản"}
        message={
          userToBan?.status === "banned"
            ? `Bạn có chắc chắn muốn mở khóa tài khoản "${userToBan?.name}"? Người dùng này sẽ có thể đăng nhập và sử dụng hệ thống trở lại.`
            : `Bạn có chắc chắn muốn khóa tài khoản "${userToBan?.name}"? Người dùng này sẽ không thể đăng nhập vào hệ thống. Tất cả dữ liệu của họ (bình luận, lịch sử xem, danh sách yêu thích) vẫn được giữ nguyên.`
        }
        confirmText={userToBan?.status === "banned" ? "Mở khóa" : "Khóa tài khoản"}
        cancelText="Hủy"
        type={userToBan?.status === "banned" ? "success" : "warning"}
      />
    </AdminLayout>
  );
}

export default AdminUser;
