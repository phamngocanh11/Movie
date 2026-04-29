import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CategoryPage.css";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import MovieCard from "../../components/MovieCard/MovieCard";
import movieService from "../../services/movieService";
import { toast } from "sonner";

function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchCategoryAndMovies = async () => {
      try {
        if (slug === "top") {
          setCategory({
            _id: "top",
            name: "Phim Được Đánh Giá Cao",
            description: "Danh sách những bộ phim có đánh giá cao nhất",
          });

          const moviesResponse = await movieService.getMoviesSortedByRating();
          if (moviesResponse?.data) {
            setMovies(moviesResponse.data);
          } else {
            setMovies([]);
          }
        } else if (slug === "new") {
          setCategory({
            _id: "new",
            name: "Phim Mới Nhất",
            description: "Danh sách những bộ phim mới phát hành",
          });

          const moviesResponse = await movieService.getMoviesSortedByYear();
          if (moviesResponse?.data) {
            setMovies(moviesResponse.data);
          } else {
            setMovies([]);
          }
        } else if (slug === "trending") {
          setCategory({
            _id: "rate",
            name: "Phim Được Xem Nhiều Nhất",
            description: "Danh sách những bộ phim có lượt xem cao nhất",
          });

          const moviesResponse = await movieService.getMoviesSortedByViews();
          if (moviesResponse?.data) {
            setMovies(moviesResponse.data);
          } else {
            setMovies([]);
          }
        } else {
          setCategory({
            _id: slug,
            name: slug.charAt(0).toUpperCase() + slug.slice(1),
            description: `Danh sách phim thuộc thể loại ${slug}`,
          });

          const moviesResponse = await movieService.getMoviesByCategory(slug);

          if (moviesResponse?.data) {
            setMovies(moviesResponse.data);
          } else {
            setMovies([]);
          }
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        toast.error("Không thể tải dữ liệu thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndMovies();
  }, [slug]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="category-page-loading">
          <div className="loader"></div>
          <p>Đang tải thể loại...</p>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="category-page-error">
          <h2>Rất tiếc! {error}</h2>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">
              Thử lại
            </button>
            <button onClick={() => navigate("/")} className="home-button">
              Về trang chủ
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="category-page">
        <div className="category-header">
          <h1>{category?.name || "Thể loại không xác định"}</h1>
          <p>{category?.description || "Không có mô tả"}</p>
        </div>

        {movies.length > 0 ? (
          <div className="category-movies">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="no-movies">
            <p>Không có phim nào trong thể loại này</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default CategoryPage;
