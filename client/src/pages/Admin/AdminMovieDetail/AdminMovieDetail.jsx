import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import movieService from "../../../services/movieService";
import categoryService from "../../../services/categoryService";
import commentService from "../../../services/commentService";
import Button from "../../../components/UI/Button/Button";
import { toast } from "sonner";
import "./AdminMovieDetail.css";

import {
  MdDelete,
  MdStar,
  MdAccessTime,
  MdCalendarToday,
  MdMovie,
  MdVideoLibrary,
  MdCategory,
  MdVisibility,
  MdComment,
  MdPeople
} from "react-icons/md";

function AdminMovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchMovieData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      
      const movieResponse = await movieService.getMovieById(id);
      if (!movieResponse || !movieResponse.data) {
        setError("Không thể tải thông tin phim");
        setLoading(false);
        return;
      }
      
      const movieData = movieResponse.data;
      setMovie(movieData);
      
      try {
        const commentsData = await commentService.getCommentsByMovieId(id);
        if (commentsData && Array.isArray(commentsData)) {
          setComments(commentsData);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
      
      if (movieData.categories && movieData.categories.length > 0) {
        try {
          const categoryResponse = await categoryService.getAllCategories();
          if (categoryResponse && Array.isArray(categoryResponse.data)) {
            setCategories(categoryResponse.data);
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      }
      
    } catch (err) {
      console.error("Error fetching movie:", err);
      setError("Không thể tải thông tin phim. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này không?")) {
      try {
        await movieService.deleteMovie(id);
        toast.success("Xóa phim thành công!");
        navigate("/admin/movies");
      } catch (error) {
        toast.error(
          "Xóa phim thất bại: " + (error.message || "Đã xảy ra lỗi")
        );
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const renderHeaderActions = () => (
    <>
      <button className="admin-movie-detail-action-btn delete-btn" onClick={handleDelete}>
        <MdDelete />
        Xóa
      </button>
    </>
  );

  const getCategoryName = (categoryId) => {
    if (!categories || !Array.isArray(categories)) return "—";
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : "—";
  };

  const renderCategories = () => {
    if (!movie || !movie.categories || !movie.categories.length) {
      return <div className="admin-movie-detail-categories">—</div>;
    }
    
    return (
      <div className="admin-movie-detail-categories">
        {movie.categories.map(catId => (
          <span key={catId} className="admin-movie-detail-category-tag">
            {getCategoryName(catId)}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-detail-loading">
          <div className="admin-detail-loading-spinner"></div>
          <p>Đang tải thông tin phim...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !movie) {
    return (
      <AdminLayout>
        <div className="admin-detail-error">
          <div className="admin-detail-error-icon">!</div>
          <h3>Không thể tải thông tin phim</h3>
          <p>{error || "Đã xảy ra lỗi"}</p>
          <Button onClick={() => navigate("/admin/movies")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminAddHeader
        title="Chi tiết phim"
        subtitle={`Thông tin phim ${movie.name}`}
        actions={renderHeaderActions()}
      />

      <div className="admin-movie-detail-container">
        <div className="admin-movie-profile-card">
          <div className="admin-movie-profile-header">
            <div className="admin-movie-poster-large">
              <img
                src={movie.poster_url || "https://via.placeholder.com/240x360"}
                alt={movie.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/240x360?text=No+Poster";
                }}
              />
            </div>
            
            <div className="admin-movie-profile-info">
              <h2 className="admin-movie-name">{movie.name}</h2>
              <p className="admin-movie-slug">Slug: {movie.slug}</p>
              
              <div className="admin-movie-meta-info">
                <div className="admin-movie-meta-item">
                  <MdCalendarToday />
                  <span>{movie.year || "—"}</span>
                </div>
                
                <div className="admin-movie-meta-item">
                  <MdAccessTime />
                  <span>{movie.time || "—"} phút</span>
                </div>
                
                <div className="admin-movie-meta-item">
                  <MdVideoLibrary />
                  <span>{movie.type === "movie" ? "Phim lẻ" : "Phim bộ"}</span>
                </div>
                
                <div className="admin-movie-meta-item">
                  <MdMovie />
                  <span>{movie.quality || "—"}</span>
                </div>
              </div>
              
              <div className={`admin-movie-status-badge admin-movie-status-${movie.status}`}>
                {movie.status === "released" && "Đã phát hành"}
                {movie.status === "upcoming" && "Sắp ra mắt"}
                {movie.status === "cancelled" && "Đã hủy"}
                {!movie.status && "Không xác định"}
              </div>

              <div className="admin-movie-short-content">
                <h4 className="admin-movie-short-content-title">Nội dung</h4>
                <p>{movie.content || "Chưa có mô tả nội dung"}</p>
              </div>
            </div>
          </div>
          
          <div className="admin-movie-profile-body">
            <div className="admin-movie-stats">
              <div className="admin-movie-stat-card">
                <div className="admin-movie-stat-value">
                  <MdVisibility className="admin-movie-stat-icon" />
                  {movie.views ? new Intl.NumberFormat().format(movie.views) : "0"}
                </div>
                <div className="admin-movie-stat-label">Lượt xem</div>
              </div>
              
              <div className="admin-movie-stat-card">
                <div className="admin-movie-stat-value">
                  <MdStar className="admin-movie-stat-icon" />
                  {movie.rating ? movie.rating.toFixed(1) : "0"}/5
                </div>
                <div className="admin-movie-stat-label">Đánh giá</div>
              </div>
              
              <div className="admin-movie-stat-card">
                <div className="admin-movie-stat-value">
                  <MdPeople className="admin-movie-stat-icon" />
                  {movie.ratingCount || 0}
                </div>
                <div className="admin-movie-stat-label">Lượt đánh giá</div>
              </div>
              
              <div className="admin-movie-stat-card">
                <div className="admin-movie-stat-value">
                  <MdComment className="admin-movie-stat-icon" />
                  {comments.length || 0}
                </div>
                <div className="admin-movie-stat-label">Bình luận</div>
              </div>
            </div>
            
            <div className="admin-movie-detail-dates">
              <div className="admin-movie-detail-date">
                <MdCalendarToday className="admin-movie-detail-date-icon" />
                <span>Ngày tạo: {formatDate(movie.createdAt)}</span>
              </div>
              
              <div className="admin-movie-detail-date">
                <MdCalendarToday className="admin-movie-detail-date-icon" />
                <span>Cập nhật: {formatDate(movie.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="admin-movie-detail-section">
          <h3 className="admin-movie-detail-heading">
            <MdCategory /> Thể loại
          </h3>
          {renderCategories()}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminMovieDetail; 