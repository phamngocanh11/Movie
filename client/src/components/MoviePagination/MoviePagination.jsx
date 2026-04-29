import React from "react";
import "./MoviePagination.css";

const MoviePagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        className={currentPage === 1 ? "active" : ""}
      >
        1
      </button>
    );

    // If more than 5 pages and not near start, add ellipsis
    if (totalPages > 5 && currentPage > 3) {
      pages.push(<span key="ellipsis1">...</span>);
    }

    // Show pages around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue;
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // If more than 5 pages and not near end, add ellipsis
    if (totalPages > 5 && currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis2">...</span>);
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pages.push(
        <button
          key="last"
          onClick={() => onPageChange(totalPages)}
          className={currentPage === totalPages ? "active" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="movie-pagination">
      <button
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo;
      </button>

      {renderPagination()}

      <button
        className="pagination-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &raquo;
      </button>
    </div>
  );
};

export default MoviePagination;
