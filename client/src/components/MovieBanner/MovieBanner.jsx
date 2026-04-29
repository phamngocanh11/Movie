import React from "react";
import { FaPlay, FaHeart, FaRegHeart, FaClock, FaCalendar, FaEye, FaStar } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import Button from "../UI/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import "./MovieBanner.css";
import StarRating from "../StarRating/StarRating";

const MovieBanner = ({ movie, isFavorite, toggleFavorite, onRatingSubmit }) => {
  const navigate = useNavigate();
  
  // Format categories
  const getCategories = () => {
    if (!movie.categories || movie.categories.length === 0) return "Chưa phân loại";
    return movie.categories.map(cat => 
      typeof cat === 'object' ? cat.name : cat
    ).join(", ");
  };
  
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
          {movie.categories && movie.categories.length > 0 && (
            <div className="meta-item">
              <MdCategory className="meta-icon" />
              <span>{getCategories()}</span>
            </div>
          )}
          {movie.views > 0 && (
            <div className="meta-item">
              <FaEye className="meta-icon" />
              <span>{(movie.views / 1000).toFixed(1)}K lượt xem</span>
            </div>
          )}
          {movie.rating > 0 && (
            <div className="meta-item rating-item">
              <FaStar className="meta-icon star-icon" />
              <span className="rating-value">{movie.rating.toFixed(1)}</span>
              <span className="rating-count">({movie.ratingCount || 0} đánh giá)</span>
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
