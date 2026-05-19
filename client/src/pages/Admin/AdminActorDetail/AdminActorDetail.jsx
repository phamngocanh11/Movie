import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdPerson, MdMovie } from "react-icons/md";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import Button from "../../../components/UI/Button/Button";
import AdminDataTable from "../../../components/Admin/AdminDataTable/AdminDataTable";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import actorService from "../../../services/actorService";
import movieService from "../../../services/movieService";
import { toast } from "sonner";
import "./AdminActorDetail.css";

function AdminActorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [moviesOfActor, setMoviesOfActor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      if (response && response.data) {
        setActor(response.data);
        
        const moviesResponse = await movieService.getMoviesByActor(id);
        
        if (moviesResponse && moviesResponse.success) {
          setMoviesOfActor(moviesResponse.data || []);
        } else {
          setMoviesOfActor([]);
        }
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
    fetchActorDetails();
  };

  const handleEditActor = () => {
    navigate(`/admin/actors/edit/${id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-actor-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin diễn viên...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !actor) {
    return (
      <AdminLayout>
        <div className="admin-actor-detail-error">
          <h2>Không thể tải thông tin diễn viên</h2>
          <p>{error || "Diễn viên không tồn tại hoặc đã bị xóa"}</p>
          <div className="admin-actor-detail-actions">
            <Button onClick={handleRetry} variant="primary">
              Thử lại
            </Button>
            <Button onClick={() => navigate("/admin/actors")} variant="secondary">
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
        title={`Diễn viên: ${actor.name}`}
        subtitle={`ID: ${actor._id || id}`}
        actionButton={handleEditActor}
        titleButton="Chỉnh sửa"
      />

      <div className="actor-detail-container">
        <div className="actor-overview">
          <div className="actor-avatar-wrapper">
              <MdPerson className="actor-icon" />
          </div>
          <div className="actor-info">
            <div className="actor-stat">
              <span className="stat-value">{moviesOfActor.length}</span>
              <span className="stat-label">Bộ phim</span>
            </div>
            <div className="actor-meta">
              {actor.createdAt && (
                <div className="meta-item">
                  <span className="meta-label">Ngày tạo:</span>
                  <span className="meta-value">
                    {new Date(actor.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {actor.updatedAt && (
                <div className="meta-item">
                  <span className="meta-label">Cập nhật lần cuối:</span>
                  <span className="meta-value">
                    {new Date(actor.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="actor-movies-section">
          <div className="section-header">
            <h2 className="section-title">Phim của diễn viên này</h2>
          </div>
          
          <AdminDataTable
            data={moviesOfActor}
            columns={movieColumns}
            loading={false}
            error={null}
            emptyStateProps={{
              icon: <MdMovie size={48} />,
              title: "Không có phim nào",
              message: "Diễn viên này chưa có phim nào trong hệ thống",
            }}
            onView={handleViewMovie}
            onEdit={handleEditMovie}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminActorDetail; 