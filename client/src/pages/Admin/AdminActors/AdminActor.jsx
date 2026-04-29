import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminListHeader from "../../../components/Admin/AdminListHeader/AdminListHeader";
import AdminListFilter from "../../../components/Admin/AdminListFilter/AdminListFilter";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import actorService from "../../../services/actorService";
import { toast } from "sonner";
import "./AdminActor.css";

function AdminActor() {
  const navigate = useNavigate();

  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actorToDelete, setActorToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      setLoading(true);
      const response = await actorService.getAllActors();

      if (Array.isArray(response)) {
        setActors(response);
      } else if (response && Array.isArray(response.data)) {
        setActors(response.data);
      } else {
        console.warn("Dữ liệu không đúng định dạng:", response);
        setActors([]);
        setError("Dữ liệu diễn viên không đúng định dạng");
      }
    } catch (err) {
      console.error("Error fetching actors:", err);
      setError("Không thể tải danh sách diễn viên. Vui lòng thử lại sau.");
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterId, value) => {
  };

  const columns = [
    { key: "name", title: "Tên diễn viên" },
    {
      key: "createdAt",
      title: "Ngày tạo",
      render: (actor) => 
        actor.createdAt ? new Date(actor.createdAt).toLocaleDateString("vi-VN") : "—",
    },
    {
      key: "updatedAt",
      title: "Lần cập nhật",
      render: (actor) => 
        actor.updatedAt ? new Date(actor.updatedAt).toLocaleDateString("vi-VN") : "—",
    },
    { key: "actions", title: "Hành động" },
  ];

  const filteredActors = actors.filter((actor) => {
    const searchMatch =
      !searchValue ||
      actor.name?.toLowerCase().includes(searchValue.toLowerCase());

    return searchMatch;
  });
  
  // Pagination logic
  const totalItems = filteredActors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredActors.slice(startIndex, endIndex);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewActor = (id) => {
    navigate(`/admin/actors/${id}`);
  };

  const handleEditActor = (id) => {
    navigate(`/admin/actors/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setActorToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setActorToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!actorToDelete) return;
    
    try {
      await actorService.deleteActor(actorToDelete);
      setActors(actors.filter((actor) => (actor._id || actor.id) !== actorToDelete));
      toast.success("Xóa diễn viên thành công!");
    } catch (error) {
      toast.error(
        "Xóa diễn viên thất bại: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      handleCloseDeleteModal();
    }
  };

  const emptyStateProps = {
    icon: <MdPerson size={48} />,
    title: "Không có diễn viên nào",
    message: "Thêm diễn viên đầu tiên vào hệ thống của bạn",
    actionButton: (
      <Button onClick={() => navigate("/admin/actors/add")}>
        Thêm diễn viên mới
      </Button>
    ),
  };

  return (
    <AdminLayout>
      <AdminListHeader
        title="Quản lý diễn viên"
        subtitle="Quản lý danh sách diễn viên trong hệ thống của bạn"
        actionButton={() => navigate("/admin/actors/add")}
        titleButton="Thêm diễn viên mới"
      />

      <AdminListFilter
        filters={[]}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Tìm kiếm diễn viên..."
      />

      <AdminDataTable
        data={getCurrentPageData()}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchActors}
        emptyStateProps={emptyStateProps}
        onView={handleViewActor}
        onEdit={handleEditActor}
        onDelete={handleDeleteClick}
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
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa diễn viên này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminActor; 