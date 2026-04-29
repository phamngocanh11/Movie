import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaArrowRight } from "react-icons/fa";
import "./FavoriteMovies.css";
import MovieCard from "../../MovieCard/MovieCard";
import Button from "../../UI/Button/Button";

const FavoriteMovies = ({ favorites = [], cssNamespace = "fm" }) => {
  const classWithPrefix = (className) => `${cssNamespace}-${className}`;

  return (
    <div className={classWithPrefix("container")}>
      <div className={classWithPrefix("section")}>
        <h3 className={classWithPrefix("section-title")}>
          <FaHeart className={classWithPrefix("section-icon")} />
          Phim yêu thích
        </h3>

        {favorites.length > 0 ? (
          <div className={classWithPrefix("movies-grid")}>
            {favorites.map((movie, index) => (
              <div
                key={movie._id}
                className={classWithPrefix("movie-item")}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={classWithPrefix("movie-card-wrapper")}>
                  <MovieCard movie={movie} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={classWithPrefix("empty-content")}>
            <div className={classWithPrefix("empty-icon")}>
              <FaHeart />
            </div>
            <p className={classWithPrefix("empty-text")}>
              Bạn chưa thêm phim yêu thích nào
            </p>
            <Link to="/" className={classWithPrefix("discover-link")}>
              <Button variant="primary" hasIcon={true}>
                <span>Khám phá phim ngay</span>
                <FaArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteMovies;
