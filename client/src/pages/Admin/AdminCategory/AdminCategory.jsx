import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminListHeader from "../../../components/Admin/AdminListHeader/AdminListHeader";
import AdminListFilter from "../../../components/Admin/AdminListFilter/AdminListFilter";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import { useNavigate } from "react-router-dom";
import { MdCategory } from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import categoryService from "../../../services/categoryService";
import { toast } from "sonner";
import "./AdminCategory.css";

function AdminCategory() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();

      if (Array.isArray(response)) {
        setCategories(response);
      } else if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.warn("Dữ liệu không đúng định dạng:", response);
        setCategories([]);
        setError("Dữ liệu thể loại không đúng định dạng");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Không thể tải danh sách thể loại. Vui lòng thử lại sau.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "_id", title: "ID" },
    { key: "name", title: "Tên thể loại" },
    {
      key: "createdAt",
      title: "Ngày tạo",
      hideOnMobile: "md",
      render: (category) => new Date(category.createdAt).toLocaleDateString("vi-VN"),
    },
    { key: "actions", title: "Hành động" },
  ];

  const filteredCategories = categories.filter((category) => {
    return !searchValue || 
      category.name?.toLowerCase().includes(searchValue.toLowerCase());
  });
  
  // Pagination logic
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewCategory = (id) => {
    navigate(`/admin/categories/${id}`);
  };

  const handleEditCategory = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const showDeleteConfirmation = (id) => {
    const category = categories.find(cat => (cat._id || cat.id) === id);
    if (category) {
      setCategoryToDelete(category);
      setDeleteModalOpen(true);
    } else {
      toast.error("Không tìm thấy thể loại!");
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      const id = categoryToDelete._id || categoryToDelete.id;
      const response = await categoryService.deleteCategory(id);
      
      if (response && response.data) {
        setCategories(categories.filter((category) => (category._id || category.id) !== id));
        toast.success("Xóa thể loại thành công!");
      } else {
        toast.error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      toast.error(
        "Xóa thể loại thất bại: " + (error.message || "Đã xảy ra lỗi")
      );
    }
  };

  const emptyStateProps = {
    icon: <MdCategory size={48} />,
    title: "Không có thể loại nào",
    message: "Thêm thể loại đầu tiên vào hệ thống của bạn",
    actionButton: (
      <Button onClick={() => navigate("/admin/categories/add")}>
        Thêm thể loại mới
      </Button>
    ),
  };

  return (
    <AdminLayout>
      <AdminListHeader
        title="Quản lý thể loại"
        subtitle="Quản lý danh sách thể loại phim trong hệ thống của bạn"
        actionButton={() => navigate("/admin/categories/add")}
        titleButton="Thêm thể loại mới"
      />

      <AdminListFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Tìm kiếm thể loại..."
      />

      <AdminDataTable
        data={getCurrentPageData()}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchCategories}
        emptyStateProps={emptyStateProps}
        onView={handleViewCategory}
        onEdit={handleEditCategory}
        onDelete={showDeleteConfirmation}
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
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteCategory}
        title="Xóa thể loại"
        message={
          categoryToDelete
            ? `Bạn có chắc chắn muốn xóa thể loại "${categoryToDelete.name}"? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa thể loại này?"
        }
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminCategory;