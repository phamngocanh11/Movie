import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import actorService from "../../../services/actorService";
import { toast } from "sonner";
import "./AdminAddActor.css";

function AdminAddActor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formFields = [
    {
      name: "name",
      label: "Tên diễn viên",
      type: "text",
      placeholder: "Nhập tên diễn viên",
      required: true,
    },
  ];

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setLoading(true);
      
      const actorData = {
        name: formData.name,
      };
      
      const response = await actorService.createActor(actorData);
      
      if (response && response.success) {
        toast.success("Thêm diễn viên thành công!");
        navigate("/admin/actors");
      } else {
        toast.error("Thêm diễn viên thất bại!");
      }
    } catch (error) {
      console.error("Error creating actor:", error);
      toast.error(`Lỗi: ${error.message || "Không thể thêm diễn viên"}`);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/actors");
  };

  return (
    <AdminLayout>
      <AdminAddHeader 
        title="Thêm diễn viên mới"
        subtitle="Thêm một diễn viên mới vào hệ thống"
      />
      
      <AdminAddForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitButtonText="Thêm diễn viên"
        cancelButtonText="Hủy"
        cancelButton={true}
      />
    </AdminLayout>
  );
}

export default AdminAddActor; 