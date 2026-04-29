import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminListHeader from "../../../components/Admin/AdminListHeader/AdminListHeader";
import AdminListFilter from "../../../components/Admin/AdminListFilter/AdminListFilter";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { MdMovie } from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import directorService from "../../../services/directorService";
import { toast } from "sonner";
import "./AdminDirector.css";

function AdminDirector() {
  const navigate = useNavigate();

  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await directorService.getAllDirectors();

      if (response && response.success) {
        setDirectors(response.data);
      } else {
        console.warn("Dữ liệu không đúng định dạng:", response);
        setDirectors([]);
        setError("Dữ liệu đạo diễn không đúng định dạng");
      }
    } catch (err) {
      console.error("Error fetching directors:", err);
      setError("Không thể tải danh sách đạo diễn. Vui lòng thử lại sau.");
      setDirectors([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [];

  const handleFilterChange = () => {};

  const columns = [
    { key: "name", title: "Tên đạo diễn" },
    {
      key: "createdAt",
      title: "Ngày tạo",
      render: (director) => 
        director.createdAt ? new Date(director.createdAt).toLocaleDateString("vi-VN") : "—",
    },
    {
      key: "updatedAt",
      title: "Lần cập nhật",
      render: (director) => 
        director.updatedAt ? new Date(director.updatedAt).toLocaleDateString("vi-VN") : "—",
    },
    { key: "actions", title: "Hành động" },
  ];

  const filteredDirectors = directors.filter((director) => {
    const searchMatch =
      !searchValue ||
      director.name?.toLowerCase().includes(searchValue.toLowerCase());

    return searchMatch;
  });
  
  // Pagination logic
  const totalItems = filteredDirectors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDirectors.slice(startIndex, endIndex);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDirector = (id) => {
    navigate(`/admin/directors/${id}`);
  };

  const handleEditDirector = (id) => {
    navigate(`/admin/directors/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    const director = directors.find(dir => dir._id === id);
    setDirectorToDelete(director);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDirectorToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!directorToDelete) return;
    
    try {
      const response = await directorService.deleteDirector(directorToDelete._id);
      if (response && response.success) {
        setDirectors(directors.filter((director) => director._id !== directorToDelete._id));
        toast.success("Xóa đạo diễn thành công!");
      } else {
        toast.error("Xóa đạo diễn thất bại!");
      }
    } catch (error) {
      toast.error(
        "Xóa đạo diễn thất bại: " + (error.message || "Đã xảy ra lỗi")
      );
    } finally {
      handleCloseDeleteModal();
    }
  };

  const emptyStateProps = {
    icon: <MdMovie size={48} />,
    title: "Không có đạo diễn nào",
    message: "Thêm đạo diễn đầu tiên vào hệ thống của bạn",
    actionButton: (
      <Button onClick={() => navigate("/admin/directors/add")}>
        Thêm đạo diễn mới
      </Button>
    ),
  };

  return (
    <AdminLayout>
      <AdminListHeader
        title="Quản lý đạo diễn"
        subtitle="Quản lý danh sách đạo diễn trong hệ thống của bạn"
        actionButton={() => navigate("/admin/directors/add")}
        titleButton="Thêm đạo diễn mới"
      />

      <AdminListFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Tìm kiếm đạo diễn..."
      />

      <AdminDataTable
        data={getCurrentPageData()}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchDirectors}
        emptyStateProps={emptyStateProps}
        onView={handleViewDirector}
        onEdit={handleEditDirector}
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
        message={
          directorToDelete
            ? `Bạn có chắc chắn muốn xóa đạo diễn "${directorToDelete.name}"? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa đạo diễn này?"
        }
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminDirector; 