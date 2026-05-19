import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdPerson, MdMovie } from "react-icons/md";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import Button from "../../../components/UI/Button/Button";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import directorService from "../../../services/directorService";
import movieService from "../../../services/movieService";
import { toast } from "sonner";
import "./AdminDirectorDetail.css";

function AdminDirectorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [director, setDirector] = useState(null);
  const [moviesOfDirector, setMoviesOfDirector] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID đạo diễn không hợp lệ");
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
      
      if (response && response.success) {
        setDirector(response.data);
        
        const moviesResponse = await movieService.getMoviesByDirector(id);
        
        if (moviesResponse && moviesResponse.success) {
          setMoviesOfDirector(moviesResponse.data || []);
        } else {
          setMoviesOfDirector([]);
        }
      } else {
        setError("Không thể tải thông tin đạo diễn");
        toast.error("Không thể tải thông tin đạo diễn");
      }
    } catch (err) {
      console.error("Error fetching director details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải thông tin đạo diễn");
      toast.error(`Lỗi: ${err.message || "Không thể tải thông tin đạo diễn"}`);
    } finally {
      setLoading(false);
    }
  };

  const movieColumns = [
    { 
      key: "poster", 
      title: "Poster",
      render: (movie) => (
        <div className="movie-poster-cell">
          <img 
            src={movie.poster_url || "/placeholder-poster.jpg"} 
            alt={movie.name} 
            className="movie-poster-thumbnail" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/40x60?text=Poster";
            }}
          />
        </div>
      )
    },
    { key: "name", title: "Tên phim" },
    { 
      key: "year", 
      title: "Năm sản xuất",
      hideOnMobile: "sm"
    },
    {
      key: "actions",
      title: "Hành động",
    },
  ];

  const handleViewMovie = (movieId) => {
    navigate(`/admin/movies/${movieId}`);
  };

  const handleEditMovie = (movieId) => {
    navigate(`/admin/movies/edit/${movieId}`);
  };

  const handleRetry = () => {
    fetchDirectorDetails();
  };

  const handleEditDirector = () => {
    navigate(`/admin/directors/edit/${id}`);
  };

  const handleDeleteDirector = async () => {
    try {
      const response = await directorService.deleteDirector(id);
      if (response && response.success) {
        toast.success("Xóa đạo diễn thành công!");
        navigate("/admin/directors");
      } else {
        toast.error("Xóa đạo diễn thất bại!");
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message || "Không thể xóa đạo diễn"}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-director-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin đạo diễn...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !director) {
    return (
      <AdminLayout>
        <div className="admin-director-detail-error">
          <h2>Không thể tải thông tin đạo diễn</h2>
          <p>{error || "Đạo diễn không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-director-detail-actions">
            <Button onClick={handleRetry} variant="primary">
              Thử lại
            </Button>
            <Button onClick={() => navigate("/admin/directors")} variant="secondary">
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminAddHeader
        title={`Đạo diễn: ${director.name}`}
        subtitle={`ID: ${director._id || id}`}
        actionButton={handleEditDirector}
        titleButton="Chỉnh sửa"
      />

      <div className="actor-detail-container">
        <div className="director-overview">
          <div className="director-avatar-wrapper">
            <MdPerson className="director-icon" />
          </div>
          <div className="director-info">
            <div className="actor-stat">
              <span className="stat-value">{moviesOfDirector.length}</span>
              <span className="stat-label">Bộ phim</span>
            </div>
            <div className="actor-meta">
              {director.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Ngày tạo:</span>
                  <span className="meta-value">
                    {new Date(director.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {director.updatedAt && (
                <div className="meta-item">
                  <span className="meta-label">Cập nhật lần cuối:</span>
                  <span className="meta-value">
                    {new Date(director.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="actor-movies-section">
          <div className="section-header">
            <h2 className="section-title">Phim của đạo diễn này</h2>
          </div>
          
          <AdminDataTable
            data={moviesOfDirector}
            columns={movieColumns}
            loading={false}
            error={null}
            emptyStateProps={{
              icon: <MdMovie size={48} />,
              title: "Không có phim nào",
              message: "Đạo diễn này chưa có phim nào trong hệ thống",
            }}
            onView={handleViewMovie}
            onEdit={handleEditMovie}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteDirector}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa đạo diễn "${director?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminDirectorDetail; 