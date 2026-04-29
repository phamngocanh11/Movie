import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import categoryService from "../../../services/categoryService";
import "./AdminEditCategory.css";

function AdminEditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await categoryService.getCategoryById(id);
      
      if (response && response.data) {
        setCategory(response.data);
      } else {
        setError("Không thể tải thông tin thể loại");
        toast.error("Không thể tải thông tin thể loại");
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải thông tin thể loại");
      toast.error(`Lỗi: ${err.message || "Không thể tải thông tin thể loại"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryFields = [
    {
      name: "name",
      label: "Tên thể loại",
      type: "text",
      required: true,
      placeholder: "Nhập tên thể loại",
      col: 12,
    }
  ];

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await categoryService.updateCategory(id, formData);
      
      if (response && response.data) {
        toast.success("Cập nhật thể loại thành công!");
        navigate(`/admin/categories/${id}`);
      } else {
        toast.error("Không nhận được phản hồi từ máy chủ");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thể loại:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thể loại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="admin-edit-category-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin thể loại...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !category) {
    return (
      <AdminLayout>
        <div className="admin-edit-category-error">
          <h2>Không thể tải thông tin thể loại</h2>
          <p>{error || "Thể loại không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-edit-category-actions">
            <button 
              className="btn-primary" 
              onClick={fetchCategoryDetails}
            >
              Thử lại
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/admin/categories")}
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
        title={`Chỉnh sửa thể loại: ${category.name}`}
        subtitle={`ID: ${category._id || id}`}
      />
      <div className="admin-edit-category-container">
        <AdminAddForm
          fields={categoryFields}
          onSubmit={handleSubmit}
          submitButtonText="Cập nhật thể loại"
          isSubmitting={isSubmitting}
          initialValues={{
            name: category.name
          }}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminEditCategory; 