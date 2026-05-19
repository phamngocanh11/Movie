import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import AdminAddForm from "../../../components/Admin/AdminAddForm/AdminAddForm";
import actorService from "../../../services/actorService";
import { toast } from "sonner";
import "./AdminEditActor.css";

function AdminEditActor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID diễn viên không hợp lệ");
      setLoading(false);
      return;
    }
    
    fetchActorDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchActorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await actorService.getActorById(id);
      
      if (response && response.data && response.data.data) {
        setActor(response.data.data);
      } else if (response && response.data) {
        setActor(response.data);
      } else {
        setError("Không thể tải thông tin diễn viên");
        toast.error("Không thể tải thông tin diễn viên");
      }
    } catch (err) {
      console.error("Error fetching actor details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải thông tin diễn viên");
      toast.error(`Lỗi: ${err.message || "Không thể tải thông tin diễn viên"}`);
    } finally {
      setLoading(false);
    }
  };

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
      
      const response = await actorService.updateActor(id, formData);
      
      if (response && response.data ) {
        toast.success("Cập nhật diễn viên thành công!");
        navigate(`/admin/actors`);
      } else {
        toast.error("Cập nhật diễn viên thất bại!");
      }
    } catch (error) {
      console.error("Error updating actor:", error);
      toast.error(`Lỗi: ${error.message || "Không thể cập nhật diễn viên"}`);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/actors/${id}`);
  };

  const handleRetry = () => {
    fetchActorDetails();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-edit-actor-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin diễn viên...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !actor) {
    return (
      <AdminLayout>
        <div className="admin-edit-actor-error">
          <h2>Không thể tải thông tin diễn viên</h2>
          <p>{error || "Diễn viên không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-edit-actor-actions">
            <button onClick={handleRetry} className="retry-button">
              Thử lại
            </button>
            <button onClick={() => navigate("/admin/actors")} className="cancel-button">
              Quay lại danh sách
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const initialValues = {
    name: actor.name || '',
  };

  return (
    <AdminLayout>
      <AdminAddHeader 
        title={`Chỉnh sửa diễn viên: ${actor.name}`}
        subtitle={`ID: ${actor._id || id}`}
      />
      
      <AdminAddForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitButtonText="Cập nhật"
        cancelButtonText="Hủy"
      />
    </AdminLayout>
  );
}

export default AdminEditActor; 