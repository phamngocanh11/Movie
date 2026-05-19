import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import manufacturerService from "../../../services/manufacturerService";
import "./AdminEditManufacturer.css";

function AdminEditManufacturer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [manufacturer, setManufacturer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchManufacturerDetails();
    } else {
      setError("ID nhà sản xuất không hợp lệ");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchManufacturerDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await manufacturerService.getManufacturerById(id);
      
      if (response && response.data) {
        setManufacturer(response.data);
      } else {
        setError("Không thể tải thông tin nhà sản xuất");
        toast.error("Không thể tải thông tin nhà sản xuất");
      }
    } catch (err) {
      console.error("Error fetching manufacturer details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải thông tin nhà sản xuất");
      toast.error(`Lỗi: ${err.message || "Không thể tải thông tin nhà sản xuất"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const manufacturerFields = [
    {
      name: "name",
      label: "Tên nhà sản xuất",
      type: "text",
      required: true,
      placeholder: "Nhập tên nhà sản xuất",
      col: 12,
    },
    {
      name: "logo",
      label: "Logo",
      type: "text",
      placeholder: "Nhập URL logo",
      col: 12,
    }
  ];

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await manufacturerService.updateManufacturer(id, formData);
      
      if (response && response.data) {
        toast.success("Cập nhật nhà sản xuất thành công!");
        navigate(`/admin/manufacturers`);
      } else {
        toast.error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà sản xuất:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật nhà sản xuất!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="admin-edit-manufacturer-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin nhà sản xuất...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !manufacturer) {
    return (
      <AdminLayout>
        <div className="admin-edit-manufacturer-error">
          <h2>Không thể tải thông tin nhà sản xuất</h2>
          <p>{error || "Nhà sản xuất không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-edit-manufacturer-actions">
            <button 
              className="btn-primary" 
              onClick={fetchManufacturerDetails}
            >
              Thử lại
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/admin/manufacturers")}
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminAddHeader 
        title={`Chỉnh sửa nhà sản xuất: ${manufacturer.name}`}
        subtitle={`ID: ${manufacturer._id || id}`}
      />
      <div className="admin-edit-manufacturer-container">
        <AdminAddForm
          fields={manufacturerFields}
          onSubmit={handleSubmit}
          submitButtonText="Cập nhật nhà sản xuất"
          isSubmitting={isSubmitting}
          initialValues={{
            name: manufacturer.name,
            logo: manufacturer.logo || ""
          }}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminEditManufacturer; 