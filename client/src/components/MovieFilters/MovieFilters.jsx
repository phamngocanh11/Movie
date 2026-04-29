import React from "react";
import "./MovieFilters.css";
import Button from "../UI/Button/Button";

const MovieFilters = ({ filters, filterOptions, onFilterChange, onReset }) => {
  return (
    <div className="movie-filters">
      <h3>Bộ lọc</h3>
      <div className="filter-container">
        <div className="filter-group">
          <label>Thể loại</label>
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange("genre", e.target.value)}
          >
            <option value="">Tất cả</option>
            {filterOptions.genres.map((genre) => (
              <option key={genre.id || genre} value={genre.name || genre}>
                {genre.name || genre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Năm</label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
          >
            <option value="">Tất cả</option>
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Chất lượng</label>
          <select
            value={filters.quality}
            onChange={(e) => onFilterChange("quality", e.target.value)}
          >
            <option value="">Tất cả</option>
            {filterOptions.quality.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Nhà sản xuất</label>
          <select
            value={filters.studio}
            onChange={(e) => onFilterChange("studio", e.target.value)}
          >
            <option value="">Tất cả</option>
            {filterOptions.studios.map((studio) => (
              <option key={studio.id || studio} value={studio.name || studio}>
                {studio.name || studio}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={onReset} children={"Đặt lại"} />
      </div>
    </div>
  );
};

export default MovieFilters;
