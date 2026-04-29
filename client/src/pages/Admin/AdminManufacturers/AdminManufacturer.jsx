import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminListHeader from "../../../components/Admin/AdminListHeader/AdminListHeader";
import AdminListFilter from "../../../components/Admin/AdminListFilter/AdminListFilter";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import { useNavigate } from "react-router-dom";
import { MdBusinessCenter } from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import manufacturerService from "../../../services/manufacturerService";
import { toast } from "sonner";
import "./AdminManufacturer.css";

function AdminManufacturer() {
  const navigate = useNavigate();

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await manufacturerService.getAllManufacturers();
      
      if (response && response.data && response.data.data) {
        setManufacturers(response.data.data);
      } else if (response && Array.isArray(response.data)) {
        setManufacturers(response.data);
      } else {
        console.warn("Dữ liệu không đúng định dạng:", response);
        setManufacturers([]);
        setError("Dữ liệu nhà sản xuất không đúng định dạng");
      }
    } catch (err) {
      console.error("Error fetching manufacturers:", err);
      setError("Không thể tải danh sách nhà sản xuất. Vui lòng thử lại sau.");
      setManufacturers([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "logo",
      title: "Logo",
      render: (manufacturer) => (
        <div className="manufacturer-logo">
          {manufacturer.logo ? (
            <img
              src={manufacturer.logo}
              alt={manufacturer.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40x40?text=Logo";
              }}
            />
          ) : (
            <MdBusinessCenter size={20} />
          )}
        </div>
      ),
    },
    { key: "name", title: "Tên nhà sản xuất" },
    { 
      key: "createdAt", 
      title: "Ngày tạo",
      hideOnMobile: "sm",
      render: (manufacturer) => {
        const date = new Date(manufacturer.createdAt);
        return date.toLocaleDateString('vi-VN');
      } 
    },
    { 
      key: "updatedAt", 
      title: "Cập nhật lần cuối",
      hideOnMobile: "md",
      render: (manufacturer) => {
        const date = new Date(manufacturer.updatedAt);
        return date.toLocaleDateString('vi-VN');
      } 
    },
    { key: "actions", title: "Hành động" },
  ];

  const filteredManufacturers = manufacturers.filter((manufacturer) => {
    return !searchValue || 
      manufacturer.name?.toLowerCase().includes(searchValue.toLowerCase());
  });
  
  // Pagination logic
  const totalItems = filteredManufacturers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredManufacturers.slice(startIndex, endIndex);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewManufacturer = (id) => {
    navigate(`/admin/manufacturers/${id}`);
  };

  const handleEditManufacturer = (id) => {
    navigate(`/admin/manufacturers/edit/${id}`);
  };

  const showDeleteConfirmation = (id) => {
    const manufacturer = manufacturers.find(manu => (manu._id || manu.id) === id);
    if (manufacturer) {
      setManufacturerToDelete(manufacturer);
      setDeleteModalOpen(true);
    } else {
      toast.error("Không tìm thấy nhà sản xuất!");
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setManufacturerToDelete(null);
  };

  const confirmDeleteManufacturer = async () => {
    if (!manufacturerToDelete) return;
    
    try {
      const id = manufacturerToDelete._id || manufacturerToDelete.id;
      await manufacturerService.deleteManufacturer(id);
      
      setManufacturers(manufacturers.filter((manufacturer) => (manufacturer._id || manufacturer.id) !== id));
      toast.success("Xóa nhà sản xuất thành công!");
    } catch (error) {
      toast.error(
        "Xóa nhà sản xuất thất bại: " + (error.message || "Đã xảy ra lỗi")
      );
    }
  };

  const emptyStateProps = {
    icon: <MdBusinessCenter size={48} />,
    title: "Không có nhà sản xuất nào",
    message: "Thêm nhà sản xuất đầu tiên vào hệ thống của bạn",
    actionButton: (
      <Button onClick={() => navigate("/admin/manufacturers/add")}>
        Thêm nhà sản xuất mới
      </Button>
    ),
  };

  return (
    <AdminLayout>
      <AdminListHeader
        title="Quản lý nhà sản xuất"
        subtitle="Quản lý danh sách nhà sản xuất phim trong hệ thống của bạn"
        actionButton={() => navigate("/admin/manufacturers/add")}
        titleButton="Thêm nhà sản xuất mới"
      />

      <AdminListFilter
        filters={[]}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Tìm kiếm nhà sản xuất..."
      />

      <AdminDataTable
        data={getCurrentPageData()}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchManufacturers}
        emptyStateProps={emptyStateProps}
        onView={handleViewManufacturer}
        onEdit={handleEditManufacturer}
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
        onConfirm={confirmDeleteManufacturer}
        title="Xóa nhà sản xuất"
        message={
          manufacturerToDelete
            ? `Bạn có chắc chắn muốn xóa nhà sản xuất "${manufacturerToDelete.name}"? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa nhà sản xuất này?"
        }
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminManufacturer; 