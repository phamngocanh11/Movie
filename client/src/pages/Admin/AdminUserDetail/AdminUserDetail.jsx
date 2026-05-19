import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import userService from "../../../services/userService";
import movieService from "../../../services/movieService";
import commentService from "../../../services/commentService";
import { toast } from "sonner";
import {
  MdShield,
  MdDelete,
  MdEmail,
  MdAccessTime,
  MdLocalMovies,
  MdFavorite,
  MdMovieFilter,
  MdStar,
  MdCalendarToday,
  MdPersonAdd,
} from "react-icons/md";
import Button from "../../../components/UI/Button/Button";
import AdminAddHeader from "../../../components/Admin/AdminAddHeader/AdminAddHeader";
import "./AdminUserDetail.css";

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratingCount, setRatingCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);

      let userData = null;
      if (response && response.data) {
        userData = response.data;
      } else if (response) {
        userData = response;
      } else {
        setError("Không thể tải thông tin người dùng");
        setLoading(false);
        return;
      }

      setUser(userData);

      await Promise.all([
        fetchUserComments(userData),
        fetchUserFavorites(userData),
        fetchUserWatchedMovies(userData),
      ]);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserComments = async (userData) => {
    if (!userData?._id) return;

    try {
      const commentsResponse = await commentService.getCommentsByUserId(
        userData._id,
      );
      const commentsData = Array.isArray(commentsResponse)
        ? commentsResponse
        : [];

      setComments(commentsData);

      if (commentsData.length > 0) {
        const commentWithRating = commentsData.filter(
          (comment) => comment.rate > 0,
        );
        setRatingCount(commentWithRating.length);

        if (commentWithRating.length > 0) {
          const totalRating = commentWithRating.reduce(
            (sum, comment) => sum + comment.rate,
            0,
          );
          setAvgRating(totalRating / commentWithRating.length);
        }
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
      setRatingCount(0);
      setAvgRating(0);
    }
  };

  const fetchUserFavorites = async (userData) => {
    if (!userData?._id) return;

    try {
      const favoritesResponse = await userService.getUserFavorites(
        userData._id,
      );

      if (favoritesResponse?.success && Array.isArray(favoritesResponse.data)) {
        await fetchAndProcessMovies(favoritesResponse.data, "favorites");
      } else if (userData.favourite && Array.isArray(userData.favourite)) {
        await fetchFavoriteMovies(userData.favourite);
      } else {
        setFavoriteMovies([]);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      if (userData.favourite && Array.isArray(userData.favourite)) {
        await fetchFavoriteMovies(userData.favourite);
      } else {
        setFavoriteMovies([]);
      }
    }
  };

  const fetchUserWatchedMovies = async (userData) => {
    if (userData?.movieWatched && userData.movieWatched.length > 0) {
      try {
        await fetchWatchedMovies(userData.movieWatched);
      } catch (err) {
        console.error("Error fetching watched movies:", err);
        setWatchedMovies([]);
      }
    } else {
      setWatchedMovies([]);
    }
  };

  const fetchAndProcessMovies = async (movies, type) => {
    if (!movies || !movies.length) return;

    const processedMovies = await Promise.all(
      movies.map(async (movie) => {
        try {
          if (typeof movie === "object" && movie._id) {
            return {
              id: movie._id,
              title: movie.name,
              poster: movie.poster_url,
              year: movie.year,
              rating: movie.rating || 0,
              ratingCount: movie.ratingCount || 0,
              favoritedAt: movie.favoritedAt || new Date(),
            };
          } else {
            const movieId =
              typeof movie === "object" ? movie._id || movie.id : movie;
            const movieResponse = await movieService.getMovieById(movieId);

            if (movieResponse?.data) {
              return {
                id: movieResponse.data._id,
                title: movieResponse.data.name,
                poster: movieResponse.data.poster_url,
                year: movieResponse.data.year,
                rating: movieResponse.data.rating || 0,
                ratingCount: movieResponse.data.ratingCount || 0,
                favoritedAt: new Date(),
                watchedAt: new Date(),
              };
            }
          }
          return null;
        } catch (err) {
          console.error(`Error processing movie:`, err);
          return null;
        }
      }),
    );

    const filteredMovies = processedMovies.filter((movie) => movie !== null);

    if (type === "favorites") {
      setFavoriteMovies(filteredMovies);
    } else {
      setWatchedMovies(filteredMovies);
    }
  };

  const fetchFavoriteMovies = async (movieIds) => {
    if (!movieIds || !movieIds.length) return;
    await fetchAndProcessMovies(movieIds, "favorites");
  };

  const fetchWatchedMovies = async (movieIds) => {
    if (!movieIds || !movieIds.length) return;
    await fetchAndProcessMovies(movieIds, "watched");
  };

  const handleManageAccount = () => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await userService.deleteUser(id);
        toast.success("Xóa người dùng thành công!");
        navigate("/admin/users");
      } catch (error) {
        toast.error(
          "Xóa người dùng thất bại: " + (error.message || "Đã xảy ra lỗi"),
        );
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderHeaderActions = () => (
    <>
      <button
        className="user-detail-action-btn manage-btn"
        onClick={handleManageAccount}
      >
        <MdShield />
        Quản lý tài khoản
      </button>
      <button
        className="user-detail-action-btn delete-btn"
        onClick={handleDelete}
      >
        <MdDelete />
        Xóa
      </button>
    </>
  );

  const renderMovieItem = (movie, type) => (
    <div
      key={movie.id}
      className="user-detail-movie"
      onClick={() => navigate(`/admin/movies/${movie.id}`)}
    >
      <div className="user-detail-movie-poster">
        <img
          src={movie.poster || "https://via.placeholder.com/60x90"}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/60x90?text=Movie";
          }}
        />
      </div>

      <div className="user-detail-movie-info">
        <h4 className="user-detail-movie-title">{movie.title}</h4>
        <div className="user-detail-movie-meta">
          <span>{movie.year || "N/A"}</span>
          <span>•</span>
          <div className="user-detail-movie-rating">
            <MdStar className="movie-rating-star" />
            <span className="movie-rating-value">
              {movie.rating
                ? typeof movie.rating === "number"
                  ? movie.rating.toFixed(1)
                  : parseFloat(movie.rating).toFixed(1)
                : "0"}
              <span className="movie-rating-max">/5</span>
            </span>
          </div>
          {movie.ratingCount > 0 && (
            <span className="movie-rating-count">({movie.ratingCount})</span>
          )}
        </div>
        <span className="user-detail-movie-meta">
          {type === "watched"
            ? `Đã xem: ${formatDate(movie.watchedAt)}`
            : `Thêm vào yêu thích: ${formatDate(movie.favoritedAt)}`}
        </span>
      </div>
    </div>
  );

  const renderEmptyState = (type) => (
    <div className="user-detail-empty">
      {type === "watched" ? (
        <MdMovieFilter className="user-detail-empty-icon" />
      ) : (
        <MdFavorite className="user-detail-empty-icon" />
      )}
      <div className="user-detail-empty-text">
        {type === "watched"
          ? "Người dùng chưa xem phim nào"
          : "Người dùng chưa có phim yêu thích nào"}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-detail-loading">
          <div className="admin-detail-loading-spinner"></div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="admin-detail-error">
          <div className="admin-detail-error-icon">!</div>
          <h3>Không thể tải thông tin người dùng</h3>
          <p>{error || "Đã xảy ra lỗi"}</p>
          <Button onClick={() => navigate("/admin/users")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminAddHeader
        title="Chi tiết người dùng"
        subtitle={`Thông tin người dùng ${user.name} (${user.username})`}
        actions={renderHeaderActions()}
      />

      <div className="user-detail-container">
        <div className="user-profile-card">
          <div className="user-profile-header">
            <div className="user-avatar-large">
              <img
                src={user.avatar || "https://via.placeholder.com/120x120"}
                alt={user.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/120x120?text=User";
                }}
              />
            </div>

            <div className="user-profile-info">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-username">@{user.username}</p>

              <div className="user-email">
                <MdEmail />
                <span>{user.email}</span>
              </div>

              <span
                className={`user-role-badge ${
                  user.role === "admin" ? "role-admin" : "role-user"
                }`}
              >
                {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
              </span>
            </div>
          </div>

          <div className="user-profile-body">
            <div className="user-stats">
              <div className="user-stat-card">
                <div className="user-stat-value">
                  {watchedMovies.length || 0}
                </div>
                <div className="user-stat-label">Phim đã xem</div>
              </div>

              <div className="user-stat-card">
                <div className="user-stat-value">
                  {favoriteMovies.length || 0}
                </div>
                <div className="user-stat-label">Phim yêu thích</div>
              </div>

              <div className="user-stat-card">
                <div className="user-stat-value">{ratingCount || 0}</div>
                <div className="user-stat-label">Đánh giá</div>
              </div>

              <div className="user-stat-card">
                <div className="user-stat-value">{comments.length || 0}</div>
                <div className="user-stat-label">Bình luận</div>
              </div>
            </div>

            <div className="user-detail-dates">
              <div className="user-detail-date">
                <MdPersonAdd className="user-detail-date-icon" />
                <span>Ngày tạo: {formatDate(user.createdAt)}</span>
              </div>

              <div className="user-detail-date">
                <MdAccessTime className="user-detail-date-icon" />
                <span>Cập nhật: {formatDate(user.updatedAt)}</span>
              </div>

              <div className="user-detail-date">
                <MdCalendarToday className="user-detail-date-icon" />
                <span>
                  Hoạt động gần đây:{" "}
                  {formatDate(user.lastActivity || user.updatedAt)}
                </span>
              </div>
            </div>

            <div className="user-detail-section">
              <h3 className="user-detail-heading">
                <MdLocalMovies />
                Phim đã xem
              </h3>

              {watchedMovies.length > 0 ? (
                <div className="user-detail-list">
                  {watchedMovies.map((movie) =>
                    renderMovieItem(movie, "watched"),
                  )}
                </div>
              ) : (
                renderEmptyState("watched")
              )}
            </div>

            <div className="user-detail-section">
              <h3 className="user-detail-heading">
                <MdFavorite />
                Phim yêu thích
              </h3>

              {favoriteMovies.length > 0 ? (
                <div className="user-detail-list">
                  {favoriteMovies.map((movie) =>
                    renderMovieItem(movie, "favorite"),
                  )}
                </div>
              ) : (
                renderEmptyState("favorite")
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUserDetail;
