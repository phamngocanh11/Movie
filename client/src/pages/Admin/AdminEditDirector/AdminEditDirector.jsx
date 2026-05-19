import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './AdminEditDirector.css';
import Button from '../../../components/UI/Button/Button';
import directorService from '../../../services/directorService';
import AdminAddForm from '../../../components/Admin/AdminAddForm/AdminAddForm';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout';
import AdminAddHeader from '../../../components/Admin/AdminAddHeader/AdminAddHeader';

const AdminEditDirector = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID đạo diễn không hợp lệ');
      setLoading(false);
      return;
    }

    fetchDirectorDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDirectorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await directorService.getDirectorById(id);
      if (response && response.data) {
        setDirector(response.data);
        setError(null);
      } else {
        setError('Không thể tải thông tin đạo diễn');
        toast.error('Không thể tải thông tin đạo diễn');
      }
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin đạo diễn');
      toast.error(err.message || 'Không thể tải thông tin đạo diễn');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Tên đạo diễn',
      type: 'text',
      placeholder: 'Nhập tên đạo diễn',
      required: true,
    }
  ];

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setLoading(true);
      
      const response = await directorService.updateDirector(id, formData);
      if (response && response.success) {
        toast.success('Cập nhật đạo diễn thành công');
        navigate('/admin/directors');
      } else {
        toast.error('Cập nhật đạo diễn thất bại');
      }
    } catch (err) {
      console.error("Error updating director:", err);
      toast.error(`Lỗi: ${err.message || 'Không thể cập nhật đạo diễn'}`);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/directors');
  };

  const handleRetry = () => {
    fetchDirectorDetails();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-edit-director-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin đạo diễn...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !director) {
    return (
      <AdminLayout>
        <div className="admin-edit-director-error">
          <h2>Không thể tải thông tin đạo diễn</h2>
          <p>{error || "Đạo diễn không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-edit-director-actions">
            <Button onClick={handleRetry} variant="primary">
              Thử lại
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/directors')}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const initialValues = {
    name: director.name || '',
  };

  return (
    <AdminLayout>
      <AdminAddHeader 
        title={`Chỉnh sửa đạo diễn: ${director.name}`}
        subtitle={`ID: ${director._id || id}`}
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
};

export default AdminEditDirector; 