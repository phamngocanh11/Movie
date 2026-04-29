import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaStar } from "react-icons/fa";
import "./MovieCard.css";
import categoryService from "../../services/categoryService";

const MovieCard = ({ movie, variant = "default" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [categoryNames, setCategoryNames] = useState([]);

  useEffect(() => {
    const getCategoryNames = async () => {
      if (!movie.categories || movie.categories.length === 0) return;

      if (typeof movie.categories[0] === 'object' && movie.categories[0].name) {
        setCategoryNames(movie.categories.map(cat => cat.name));
        return;
      }

      try {
        const allCategories = await categoryService.getAllCategories();
        const categoryData = Array.isArray(allCategories.data) 
          ? allCategories.data 
          : allCategories;

        const categoryMap = {};
        categoryData.forEach(cat => {
          categoryMap[cat._id] = cat.name;
        });

        const names = movie.categories.map(catId => 
          categoryMap[catId] || "Không xác định"
        );
        setCategoryNames(names);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thể loại:", error);
        setCategoryNames(["Chưa rõ"]);
      }
    };

    getCategoryNames();
  }, [movie.categories]);

  return (
    <div className={`movie-card glass-card movie-card-${variant}`}>
      <div className="movie-poster">
        <img
          src={movie.poster_url}
          alt={movie.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={imageLoaded ? "loaded" : ""}
        />
        <div className="movie-overlay">
          <Link to={`/movie/${movie.slug}`} className="play-icon">
            <FaPlay />
            <span className="sr-only">Play {movie.name}</span>
          </Link>
        </div>

        {movie.views > 0 && (
          <div className="movie-rating">
            <FaStar /> {(movie.views / 1000).toFixed(1)}K lượt xem
          </div>
        )}

        {movie.year === 2024 && <div className="new-badge">Mới</div>}

        {movie.time && <div className="episodes-badge">{movie.time}</div>}
      </div>

      <div className="movie-card-info">
        <h3 className="card-title" title={movie.name}>
          {movie.name}
        </h3>
        <div className="card-meta">
          <span>{movie.year}</span> •{" "}
          <span>
            {categoryNames.length > 0
              ? categoryNames.join(", ")
              : "Chưa rõ"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
