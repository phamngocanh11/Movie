import React, { useEffect, useMemo, useRef } from "react";
import { FaSearch, FaTimes, FaClock, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SearchModal.css";

const escapeRegExp = (value = "") =>
  value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

const highlightMatch = (text, query) => {
  if (!query) return text;

  const safeQuery = query.trim();
  if (!safeQuery) return text;

  const regex = new RegExp(`(${escapeRegExp(safeQuery)})`, "ig");
  const parts = String(text).split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === safeQuery.toLowerCase() ? (
      <mark key={`${part}-${index}`}>{part}</mark>
    ) : (
      part
    ),
  );
};

function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  recentSearches,
  isLoading,
  handleRecentSearch,
  clearRecentSearches,
  activeIndex,
  setActiveIndex,
}) {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const normalizedQuery = searchQuery.trim();
  const hasResults = searchResults.length > 0;
  const showRecent = !normalizedQuery && recentSearches.length > 0;
  const selectableItems = useMemo(
    () => (hasResults ? searchResults : showRecent ? recentSearches : []),
    [hasResults, recentSearches, searchResults, showRecent],
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedQuery, hasResults, recentSearches.length, setActiveIndex]);

  if (!isOpen) return null;

  const handleResultClick = (slug) => {
    onClose();
    navigate(`/movie/${slug}`);
  };

  const moveActiveIndex = (delta) => {
    if (!selectableItems.length) return;

    setActiveIndex((prev) => {
      const next = (prev + delta + selectableItems.length) % selectableItems.length;
      return next;
    });
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveIndex(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveIndex(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (hasResults && selectableItems[activeIndex]) {
        handleResultClick(selectableItems[activeIndex].slug);
        return;
      }

      if (showRecent && selectableItems[activeIndex]) {
        handleRecentSearch(selectableItems[activeIndex]);
        return;
      }

      handleSearch(event);
    }
  };

  const sectionTitle = hasResults
    ? `Kết quả cho "${normalizedQuery}"`
    : showRecent
      ? "Tìm kiếm gần đây"
      : normalizedQuery.length >= 2
        ? `Không có kết quả cho "${normalizedQuery}"`
        : "Tìm kiếm gần đây";

  return (
    <div className="search-modal-overlay">
      <div
        className="search-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm phim"
      >
        <div className="search-modal-header">
          <div className="search-modal-form">
            <FaSearch className="search-modal-icon" />
            <form onSubmit={handleSearch} className="search-input-form">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Tìm kiếm phim, diễn viên..."
                className="search-modal-input"
                autoComplete="off"
                aria-label="Tìm kiếm phim"
              />
            </form>
          </div>
          <button
            className="search-modal-close"
            onClick={onClose}
            aria-label="Đóng tìm kiếm"
          >
            <FaTimes />
          </button>
        </div>

        <div className="search-modal-content">
          {isLoading ? (
            <div className="search-loading">
              <div className="search-loader"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : hasResults ? (
            <div className="search-results">
              <div className="search-section-header">
                <h3 className="search-section-title">{sectionTitle}</h3>
                <span className="search-results-count">
                  {searchResults.length} kết quả
                </span>
              </div>
              <div className="search-results-grid">
                {searchResults.map((item, index) => (
                  <button
                    type="button"
                    key={item._id || item.slug || item.name || index}
                    className={`search-result-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleResultClick(item.slug)}
                    onMouseEnter={() => setActiveIndex(index)}
                    tabIndex={activeIndex === index ? 0 : -1}
                  >
                    <div className="search-result-image">
                      <img
                        src={item.poster_url}
                        alt={item.name || "Movie poster"}
                        loading="lazy"
                      />
                    </div>
                    <div className="search-result-info">
                      <h4>{highlightMatch(item.name, normalizedQuery)}</h4>
                      <p>
                        {[item.year, item.quality].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : normalizedQuery.length >= 2 ? (
            <div className="search-no-results">
              <FaSearch className="search-placeholder-icon" />
              <h3 className="search-section-title">{sectionTitle}</h3>
              <p>Thử đổi từ khóa hoặc dùng tên phim ngắn hơn.</p>
            </div>
          ) : showRecent ? (
            <div className="search-recent">
              <div className="search-section-header">
                <h3 className="search-section-title">{sectionTitle}</h3>
                <button
                  type="button"
                  className="search-clear-recent"
                  onClick={clearRecentSearches}
                >
                  Xóa lịch sử
                </button>
              </div>
              <div className="recent-searches-list">
                {recentSearches.map((query, index) => (
                  <button
                    type="button"
                    key={`${query}-${index}`}
                    className={`recent-search-pill ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleRecentSearch(query)}
                    onMouseEnter={() => setActiveIndex(index)}
                    tabIndex={activeIndex === index ? 0 : -1}
                  >
                    {index === 0 ? <FaClock /> : <FaHistory />}
                    <span>{query}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="search-placeholder">
              <FaSearch className="search-placeholder-icon" />
              <h3 className="search-section-title">Bắt đầu tìm kiếm</h3>
              <p>Nhập ít nhất 2 ký tự để xem gợi ý phim phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
