import React from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieGrid.css";

function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <p>Không có phim nào phù hợp với bộ lọc của bạn.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <div
          key={movie.id || movie.slug}
          className="movie-grid-item"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <MovieCard movie={movie} className="grid-card" />
        </div>
      ))}
    </div>
  );
}

export default MovieGrid;
