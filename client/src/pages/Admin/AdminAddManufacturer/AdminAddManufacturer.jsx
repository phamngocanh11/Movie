import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import manufacturerService from "../../../services/manufacturerService";
import "./AdminAddManufacturer.css";

function AdminAddManufacturer() {
  const navigate = useNavigate();

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
    try {
      await manufacturerService.createManufacturer(formData);
      toast.success("Thêm nhà sản xuất thành công!");
      navigate("/admin/manufacturers");
    } catch (error) {
      console.error("Lỗi khi thêm nhà sản xuất:", error);
      toast.error(error.message || "Có lỗi xảy ra khi thêm nhà sản xuất!");
    }
  };

  return (
    <AdminLayout>
      <AdminAddHeader title={"Thêm nhà sản xuất mới"} />
      <div className="admin-add-manufacturer-container">
        <AdminAddForm
          fields={manufacturerFields}
          onSubmit={handleSubmit}
          submitButtonText="Thêm nhà sản xuất"
        />
      </div>
    </AdminLayout>
  );
}

export default AdminAddManufacturer; 