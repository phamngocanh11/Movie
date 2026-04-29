import React, { useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./SearchModal.css";

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
}) {
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
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

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal" ref={modalRef}>
        <div className="search-modal-header">
          <div className="search-modal-form">
            <FaSearch className="search-modal-icon" />
            <form onSubmit={handleSearch} className="search-input-form">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm phim..."
                className="search-modal-input"
                autoComplete="off"
              />
            </form>
          </div>
          <button className="search-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="search-modal-content">
          {isLoading ? (
            <div className="search-loading">
              <div className="search-loader"></div>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results">
              <h3 className="search-section-title">Kết quả tìm kiếm</h3>
              <div className="search-results-grid">
                {searchResults.map((item) => (
                  <Link
                    to={`/movie/${item.slug}`}
                    key={item.id}
                    className="search-result-item"
                    target="_blank"
                  >
                    <div className="search-result-image">
                      <img src={item.poster_url} alt={item.title} />
                    </div>
                    <div
                      className="search-result-info"
                      style={{ textAlign: "center" }}
                    >
                      <h4>{item.name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="search-no-results">
              <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="search-recent">
              <h3 className="search-section-title">Tìm kiếm gần đây</h3>
              <ul className="recent-searches-list">
                {recentSearches.map((query, index) => (
                  <li key={index}>
                    <button onClick={() => handleRecentSearch(query)}>
                      <FaSearch /> {query}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="search-placeholder">
              <p>Tìm kiếm phim yêu thích...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
