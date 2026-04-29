import React, { useState, useEffect } from "react";
import {
  MdTrendingUp,
  MdPeople,
  MdLocalMovies,
  MdVisibility,
  MdPlayArrow,
  MdAdd,
  MdCategory,
  MdComment,
  MdMovieFilter,
} from "react-icons/md";
import AdminLayout from "../../../layouts/AdminLayout/AdminLayout";
import movieService from "../../../services/movieService";
import userService from "../../../services/userService";
import categoryService from "../../../services/categoryService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalMovies, setTotalMovies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const [weeklyViews, setWeeklyViews] = useState([]);
  const [weekDays] = useState(["T2", "T3", "T4", "T5", "T6", "T7", "CN"]);

  const [topMovies, setTopMovies] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [moviesResponse, usersResponse, categoriesResponse] =
        await Promise.all([
          movieService.getAllMovies(),
          userService.getAllUser(),
          categoryService.getAllCategories(),
        ]);

      if (moviesResponse && Array.isArray(moviesResponse.data)) {
        const movies = moviesResponse.data;
        setTotalMovies(movies.length);

        const views = movies.reduce(
          (sum, movie) => sum + (movie.views || 0),
          0
        );
        setTotalViews(views);

        const sortedMovies = [...movies].sort(
          (a, b) => (b.views || 0) - (a.views || 0)
        );
        const top5Movies = sortedMovies.slice(0, 5).map((movie) => ({
          id: movie._id,
          title: movie.name,
          views: movie.views || 0,
          poster: movie.poster_url,
        }));

        setTopMovies(top5Movies);
        generateWeeklyViewsData(views);
        generateRecentActivity(movies, usersResponse?.data || []);
      }

      if (usersResponse && Array.isArray(usersResponse.data)) {
        setTotalUsers(usersResponse.data.length);
      } else if (usersResponse && Array.isArray(usersResponse)) {
        setTotalUsers(usersResponse.length);
      }

      if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
        setTotalCategories(categoriesResponse.data.length);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyViewsData = (totalViewCount) => {
    const dayPercentages = [0.1, 0.1, 0.12, 0.15, 0.18, 0.2, 0.15];

    const weeklyViewsData = dayPercentages.map((percent) =>
      Math.round(totalViewCount * percent)
    );

    // Adjust last day to account for rounding errors
    const sum = weeklyViewsData.reduce((a, b) => a + b, 0);
    const diff = totalViewCount - sum;

    if (diff !== 0) {
      weeklyViewsData[6] += diff;
    }

    setWeeklyViews(weeklyViewsData);
  };

  const generateRecentActivity = (movies, users) => {
    const activity = [];
    const now = new Date();

    // Get recent movies
    const recentMovies = [...movies]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);

    // Get recent users
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);

    // Add movie activities
    recentMovies.forEach((movie) => {
      const createdDate = new Date(movie.createdAt || now);
      activity.push({
        id: `movie-${movie._id}`,
        type: "movie",
        message: `Phim "${movie.name}" đã được thêm vào thư viện`,
        time: getTimeDifference(createdDate, now),
      });
    });

    // Add user activities
    recentUsers.forEach((user) => {
      const createdDate = new Date(user.createdAt || now);
      activity.push({
        id: `user-${user._id}`,
        type: "user",
        message: `Người dùng "${user.name || user.username}" đã đăng ký`,
        time: getTimeDifference(createdDate, now),
      });
    });

    // Add view activities for top movies
    if (topMovies.length > 0) {
      topMovies.slice(0, 2).forEach((movie, index) => {
        activity.push({
          id: `view-${movie.id}`,
          type: "view",
          message: `${(movie.views / 10).toFixed(0)} lượt xem mới trên "${
            movie.title
          }"`,
          time: index === 0 ? "30 phút trước" : "1 giờ trước",
        });
      });
    }

    // Sort by time (most recent first)
    activity.sort((a, b) => {
      const timeToValue = (timeStr) => {
        if (timeStr.includes("phút")) return parseInt(timeStr);
        if (timeStr.includes("giờ")) return parseInt(timeStr) * 60;
        if (timeStr.includes("ngày")) return parseInt(timeStr) * 60 * 24;
        return 1000;
      };

      return timeToValue(a.time) - timeToValue(b.time);
    });

    setRecentActivity(activity);
  };

  const getTimeDifference = (date1, date2) => {
    const diffMs = Math.abs(date2 - date1);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const maxViewCount = Math.max(...weeklyViews, 1);

  const getActivityIcon = (type) => {
    switch (type) {
      case "user":
        return <MdPeople />;
      case "movie":
        return <MdLocalMovies />;
      case "view":
        return <MdPlayArrow />;
      case "comment":
        return <MdComment />;
      default:
        return <MdVisibility />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="dashboard-error">
          <p>{error}</p>
          <button
            className="adm-btn adm-btn-primary"
            onClick={fetchDashboardData}
          >
            Thử lại
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Tổng quan</h1>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-card-glass"></div>
            <div className="stats-icon stats-purple">
              <MdVisibility />
            </div>
            <div className="stats-info">
              <h3>Lượt xem</h3>
              <p className="stats-value">{totalViews.toLocaleString()}</p>
              <p className="stats-change positive">
                <MdTrendingUp /> Tổng lượt xem phim
              </p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-glass"></div>
            <div className="stats-icon stats-blue">
              <MdLocalMovies />
            </div>
            <div className="stats-info">
              <h3>Số phim</h3>
              <p className="stats-value">{totalMovies}</p>
              <p className="stats-change positive">
                <MdMovieFilter /> Phim trong thư viện
              </p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-glass"></div>
            <div className="stats-icon stats-green">
              <MdPeople />
            </div>
            <div className="stats-info">
              <h3>Người dùng</h3>
              <p className="stats-value">{totalUsers}</p>
              <p className="stats-change positive">
                <MdTrendingUp /> Tài khoản đã đăng ký
              </p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-glass"></div>
            <div className="stats-icon stats-orange">
              <MdCategory />
            </div>
            <div className="stats-info">
              <h3>Thể loại</h3>
              <p className="stats-value">{totalCategories}</p>
              <p className="stats-change neutral">
                <MdCategory /> Số thể loại hiện có
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-section">
            <div className="chart-card">
              <div className="chart-card-glass"></div>
              <div className="chart-header">
                <h2>Lượt xem theo ngày</h2>
                <div className="chart-period">7 ngày qua</div>
              </div>
              <div className="chart-container">
                <div className="bar-chart">
                  {weeklyViews.map((value, index) => (
                    <div className="chart-bar-container" key={index}>
                      <div
                        className="chart-bar"
                        style={{ height: `${(value / maxViewCount) * 100}%` }}
                      ></div>
                      <div className="chart-label">{weekDays[index]}</div>
                      <div className="chart-value">
                        {value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="top-movies-section">
            <div className="top-movies-card">
              <div className="top-movies-card-glass"></div>
              <div className="top-movies-header">
                <h2>Phim nổi bật</h2>
                <div className="top-movies-period">Lượt xem cao nhất</div>
              </div>
              <div className="top-movies-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên phim</th>
                      <th>Lượt xem</th>
                      <th>Xem chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMovies.map((movie, index) => (
                      <tr key={movie.id}>
                        <td className="movie-rank">{index + 1}</td>
                        <td className="movie-title">
                          <div className="movie-title-with-poster">
                            {movie.poster && (
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="movie-tiny-poster"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/30x40?text=?";
                                }}
                              />
                            )}
                            <span>{movie.title}</span>
                          </div>
                        </td>
                        <td className="movie-views">
                          {movie.views.toLocaleString()}
                        </td>
                        <td>
                          <button
                            className="top-movie-detail-btn"
                            onClick={() =>
                              navigate(`/admin/movies/${movie.id}`)
                            }
                          >
                            <MdVisibility /> Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                    {topMovies.length === 0 && (
                      <tr>
                        <td colSpan="4" className="no-data">
                          Chưa có dữ liệu phim
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-bottom-section">
          <div className="quick-actions">
            <div className="quick-action-card">
              <div className="quick-action-glass"></div>
              <h3>Thao tác nhanh</h3>
              <div className="quick-action-buttons">
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/movies/add")}
                >
                  <MdAdd /> Thêm phim mới
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/users/add")}
                >
                  <MdPeople /> Thêm người dùng
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/categories")}
                >
                  <MdCategory /> Quản lý thể loại
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/admin/movies")}
                >
                  <MdLocalMovies /> Xem tất cả phim
                </button>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <div className="recent-activity-card">
              <div className="recent-activity-glass"></div>
              <h3>Hoạt động gần đây</h3>

              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <div className={`activity-icon activity-${activity.type}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-details">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}

                {recentActivity.length === 0 && (
                  <div className="no-activity">
                    <p>Chưa có hoạt động nào gần đây</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
