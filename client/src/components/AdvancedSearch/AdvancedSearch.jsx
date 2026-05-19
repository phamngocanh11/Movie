import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import movieService from "../../services/movieService";
import "./AdvancedSearch.css";

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    actor: "",
    director: "",
    year: "",
    category: "",
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setHasSearched(true);
      const response = await movieService.searchMovies(searchParams);
      setResults(response?.data || []);
    } catch (error) {
      toast.error(error.message || "Không thể tìm kiếm phim");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      actor: "",
      director: "",
      year: "",
      category: "",
    });
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="advanced-search">
      <h2 className="advanced-search__title">Tìm Kiếm Nâng Cao</h2>
      
      <form className="advanced-search__form" onSubmit={handleSearch}>
        <div className="advanced-search__field">
          <label htmlFor="keyword">Từ khóa</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="Nhập tên phim..."
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="actor">Diễn viên</label>
          <input
            type="text"
            id="actor"
            name="actor"
            value={searchParams.actor}
            onChange={handleChange}
            placeholder="Nhập tên diễn viên..."
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="director">Đạo diễn</label>
          <input
            type="text"
            id="director"
            name="director"
            value={searchParams.director}
            onChange={handleChange}
            placeholder="Nhập tên đạo diễn..."
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="year">Năm sản xuất</label>
          <input
            type="number"
            id="year"
            name="year"
            value={searchParams.year}
            onChange={handleChange}
            placeholder="VD: 2024"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="category">Thể loại</label>
          <select
            id="category"
            name="category"
            value={searchParams.category}
            onChange={handleChange}
          >
            <option value="">-- Chọn thể loại --</option>
            <option value="action">Hành động</option>
            <option value="comedy">Hài</option>
            <option value="drama">Chính kịch</option>
            <option value="horror">Kinh dị</option>
            <option value="romance">Lãng mạn</option>
            <option value="sci-fi">Khoa học viễn tưởng</option>
          </select>
        </div>

        <div className="advanced-search__actions">
          <button type="submit" className="btn btn-primary">
            Tìm kiếm
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Đặt lại
          </button>
        </div>
      </form>

      <div className="advanced-search__results">
        {isLoading ? (
          <p>Đang tìm kiếm...</p>
        ) : hasSearched && results.length === 0 ? (
          <p>Không tìm thấy phim phù hợp.</p>
        ) : (
          results.map((movie) => (
            <button
              type="button"
              key={movie._id}
              className="advanced-search__result"
              onClick={() => navigate(`/movie/${movie.slug}`)}
            >
              {movie.poster_url && (
                <img src={movie.poster_url} alt={movie.name} loading="lazy" />
              )}
              <span>{movie.name}</span>
              <small>{[movie.year, movie.quality].filter(Boolean).join(" • ")}</small>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
