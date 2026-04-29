import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import categoryService from "../../../services/categoryService";
import "./AdminAddCategory.css";

function AdminAddCategory() {
  const navigate = useNavigate();

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
    try {
      await categoryService.createCategory(formData);
      toast.success("Thêm thể loại thành công!");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm thể loại!");
    }
  };

  return (
    <AdminLayout>
      <AdminAddHeader title={"Thêm thể loại mới"} />
      <div className="admin-add-category-container">
        <AdminAddForm
          fields={categoryFields}
          onSubmit={handleSubmit}
          submitButtonText="Thêm thể loại"
        />
      </div>
    </AdminLayout>
  );
}

export default AdminAddCategory; 