import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdMovie, MdLocalMovies } from "react-icons/md";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import Button from "../../../components/UI/Button/Button";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import categoryService from "../../../services/categoryService";
import movieService from "../../../services/movieService";
import { toast } from "sonner";
import "./AdminCategoryDetail.css";

function AdminCategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [moviesInCategory, setMoviesInCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("ID thể loại không hợp lệ");
      setLoading(false);
      return;
    }
    
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryResponse = await categoryService.getCategoryById(id);
      
      if (categoryResponse && categoryResponse.data) {
        setCategory(categoryResponse.data);
        
        const moviesResponse = await movieService.getMoviesByCategory(id);
        
        if (moviesResponse && moviesResponse.data) {
          setMoviesInCategory(moviesResponse.data || []);
        } else {
          setMoviesInCategory([]);
        }
      } else {
        setError("Không thể tải thông tin thể loại");
        toast.error("Không thể tải thông tin thể loại");
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải thông tin thể loại");
      toast.error(`Lỗi: ${err.message || "Không thể tải thông tin thể loại"}`);
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
          />
        </div>
      )
    },
    { key: "name", title: "Tên phim" },
    { key: "year", title: "Năm sản xuất", hideOnMobile: "sm" },
    { key: "actions", title: "Hành động" },
  ];

  const handleViewMovie = (movieId) => navigate(`/admin/movies/${movieId}`);
  const handleEditMovie = (movieId) => navigate(`/admin/movies/edit/${movieId}`);
  const handleRetry = () => fetchCategoryDetails();

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-category-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin thể loại...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !category) {
    return (
      <AdminLayout>
        <div className="admin-category-detail-error">
          <h2>Không thể tải thông tin thể loại</h2>
          <p>{error || "Thể loại không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-category-detail-actions">
            <Button onClick={handleRetry} variant="primary">Thử lại</Button>
            <Button onClick={() => navigate("/admin/categories")} variant="secondary">
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
        title={`Thể loại: ${category.name}`}
        subtitle={`ID: ${category._id || id}`}
      />

      <div className="category-detail-container">
        <div className="category-overview">
          <div className="category-icon-wrapper">
            <MdLocalMovies className="category-icon" />
          </div>
          <div className="category-info">
            <div className="category-stat">
              <span className="stat-value">{moviesInCategory.length}</span>
              <span className="stat-label">Bộ phim</span>
            </div>
            <div className="category-meta">
              {category.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Ngày tạo:</span>
                  <span className="meta-value">
                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="category-movies-section">
          <div className="section-header">
            <h2 className="section-title">Phim thuộc thể loại này</h2>
          </div>
          
          <AdminDataTable
            data={moviesInCategory}
            columns={movieColumns}
            loading={false}
            error={null}
            emptyStateProps={{
              icon: <MdMovie size={48} />,
              title: "Không có phim nào",
              message: "Thể loại này chưa có phim nào được gán",
            }}
            onView={handleViewMovie}
            onEdit={handleEditMovie}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCategoryDetail; 