import React from "react";
import {
  FaPlay,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaCalendar,
  FaEye,
  FaStar,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import Button from "../UI/Button/Button";
import { useNavigate } from "react-router-dom";
import "./MovieBanner.css";
import StarRating from "../StarRating/StarRating";

const MovieBanner = ({ movie, isFavorite, toggleFavorite, onRatingSubmit }) => {
  const navigate = useNavigate();

  const isRawId = (value) =>
    typeof value === "string" && /^[a-f\d]{24}$/i.test(value.trim());

  const formatViews = (views = 0) => {
    const value = Number(views) || 0;

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`;
    }

    return value.toString();
  };

  const getCategories = () => {
    if (!movie.categories || movie.categories.length === 0) {
      return "";
    }

    return movie.categories
      .map((cat) => {
        if (typeof cat === "object") {
          return cat?.name || cat?.title || "";
        }

        return isRawId(cat) ? "" : cat;
      })
      .filter(Boolean)
      .slice(0, 3)
      .join(" • ");
  };

  const categoriesLabel = getCategories();
  
  return (
    <div className="movie-banner">
      <div
        className="banner-background"
        style={{
          backgroundImage: `url(${movie.backdrop_url || movie.thumb_url})`,
        }}
      ></div>

      <div className="banner-content">
        <h1 className="movie-title">{movie.name}</h1>
        
        {/* Movie Meta Info with Icons */}
        <div className="movie-meta-info">
          {movie.year && (
            <div className="meta-item">
              <FaCalendar className="meta-icon" />
              <span>{movie.year}</span>
            </div>
          )}
          {movie.time && (
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{movie.time}</span>
            </div>
          )}
          {categoriesLabel && (
            <div className="meta-item">
              <MdCategory className="meta-icon" />
              <span>{categoriesLabel}</span>
            </div>
          )}
          {movie.quality && (
            <div className="meta-item">
              <span>{movie.quality}</span>
            </div>
          )}
          {movie.views > 0 && (
            <div className="meta-item">
              <FaEye className="meta-icon" />
              <span>{formatViews(movie.views)} lượt xem</span>
            </div>
          )}
          {movie.rating > 0 && (
            <div className="meta-item rating-item">
              <FaStar className="meta-icon star-icon" />
              <span className="rating-value">{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="button-group">
          <Button
            variant="primary"
            hasIcon={true}
            onClick={() => {
              navigate(`/watch/${movie.slug}`);
            }}
          >
            <FaPlay /> <span>Xem Phim</span>
          </Button>

          <Button
            variant="secondary"
            hasIcon={true}
            onClick={() => {
              window.open(movie.trailer_url, "_blank");
            }}
          >
            <FaPlay /> <span>Xem trailer</span>
          </Button>

          <button
            className={`btn-favorite ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Bỏ thích" : "Yêu thích"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className="movie-actions">
          <StarRating movie={movie} onRatingSubmit={onRatingSubmit} />
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;
