import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import directorService from "../../../services/directorService";
import { toast } from "sonner";
import "./AdminAddDirector.css";

function AdminAddDirector() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formFields = [
    {
      name: "name",
      label: "Tên đạo diễn",
      type: "text",
      placeholder: "Nhập tên đạo diễn",
      required: true,
    }
  ];

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      
      const response = await directorService.createDirector(formData);
      
      if (response && response.success) {
        toast.success("Thêm đạo diễn thành công!");
        navigate("/admin/directors");
      } else {
        toast.error("Thêm đạo diễn thất bại!");
      }
    } catch (error) {
      console.error("Error creating director:", error);
      toast.error(`Lỗi: ${error.message || "Không thể thêm đạo diễn"}`);
    } finally {

      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/directors");
  };

  return (
    <AdminLayout>
      <div className="admin-add-director-container">
        <AdminAddHeader
          title="Thêm đạo diễn mới"
          description="Thêm một đạo diễn mới vào hệ thống"
          onCancel={handleCancel}
        />
        <AdminAddForm
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Thêm đạo diễn"
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminAddDirector; 