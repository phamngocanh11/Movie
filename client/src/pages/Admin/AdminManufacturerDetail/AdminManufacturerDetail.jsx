import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdMovie, MdBusinessCenter } from "react-icons/md";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import Button from "../../../components/UI/Button/Button";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import manufacturerService from "../../../services/manufacturerService";
import movieService from "../../../services/movieService";
import { toast } from "sonner";
import "./AdminManufacturerDetail.css";

function AdminManufacturerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [manufacturer, setManufacturer] = useState(null);
  const [moviesOfManufacturer, setMoviesOfManufacturer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("ID nhà sản xuất không hợp lệ");
      setLoading(false);
      return;
    }
    
    fetchManufacturerDetails();
  }, [id]);

  const fetchManufacturerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await manufacturerService.getManufacturerById(id);
      let manufacturerData = null;
      
      if (response && response.data && response.data.data) {
        manufacturerData = response.data.data;
        setManufacturer(manufacturerData);
      } else if (response && response.data) {
        manufacturerData = response.data;
        setManufacturer(manufacturerData);
      } else {
        setError("Không thể tải thông tin nhà sản xuất");
        toast.error("Không thể tải thông tin nhà sản xuất");
        return;
      }
      
      const moviesResponse = await movieService.getMoviesByManufacturer(id);
      
      if (moviesResponse && moviesResponse.success) {
        setMoviesOfManufacturer(moviesResponse.data || []);
      } else {
        setMoviesOfManufacturer([]);
      }
    } catch (err) {
      console.error("Error fetching manufacturer details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải thông tin nhà sản xuất");
      toast.error(`Lỗi: ${err.message || "Không thể tải thông tin nhà sản xuất"}`);
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
    fetchManufacturerDetails();
  };

  const handleEditManufacturer = () => {
    navigate(`/admin/manufacturers/edit/${id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-manufacturer-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin nhà sản xuất...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !manufacturer) {
    return (
      <AdminLayout>
        <div className="admin-manufacturer-detail-error">
          <h2>Không thể tải thông tin nhà sản xuất</h2>
          <p>{error || "Nhà sản xuất không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-manufacturer-detail-actions">
            <Button onClick={handleRetry} variant="primary">
              Thử lại
            </Button>
            <Button onClick={() => navigate("/admin/manufacturers")} variant="secondary">
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
        title={`Nhà sản xuất: ${manufacturer.name}`}
        subtitle={`ID: ${manufacturer._id || id}`}
        actionButton={handleEditManufacturer}
        titleButton="Chỉnh sửa"
      />

      <div className="manufacturer-detail-container">
        <div className="manufacturer-overview">
          <div className="manufacturer-logo-wrapper">
            {manufacturer.logo ? (
              <img 
                src={manufacturer.logo} 
                alt={manufacturer.name} 
                className="manufacturer-logo-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100x100?text=Logo";
                }}
              />
            ) : (
              <MdBusinessCenter className="manufacturer-icon" />
            )}
          </div>
          <div className="manufacturer-info">
            <div className="manufacturer-stat">
              <span className="stat-value">{moviesOfManufacturer.length}</span>
              <span className="stat-label">Bộ phim</span>
            </div>
            <div className="manufacturer-meta">
              {manufacturer.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Ngày tạo:</span>
                  <span className="meta-value">
                    {new Date(manufacturer.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {manufacturer.updatedAt && (
                <div className="meta-item">
                  <span className="meta-label">Cập nhật lần cuối:</span>
                  <span className="meta-value">
                    {new Date(manufacturer.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="manufacturer-movies-section">
          <div className="section-header">
            <h2 className="section-title">Phim của nhà sản xuất này</h2>
          </div>
          
          <AdminDataTable
            data={moviesOfManufacturer}
            columns={movieColumns}
            loading={false}
            error={null}
            emptyStateProps={{
              icon: <MdMovie size={48} />,
              title: "Không có phim nào",
              message: "Nhà sản xuất này chưa có phim nào trong hệ thống",
            }}
            onView={handleViewMovie}
            onEdit={handleEditMovie}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminManufacturerDetail; 