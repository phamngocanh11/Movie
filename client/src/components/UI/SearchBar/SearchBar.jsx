import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import SearchModal from "../../SearchModal/SearchModal";
import movieService from "../../../services/movieService";
import { toast } from "sonner";

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRequestIdRef = useRef(0);
  const debounceTimerRef = useRef(null);

  const persistRecentSearch = useCallback((query) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) return;

    setRecentSearches((prev) => {
      const updated = [
        normalizedQuery,
        ...prev.filter(
          (item) => item.toLowerCase() !== normalizedQuery.toLowerCase(),
        ),
      ].slice(0, 6);

      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
    }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  const runSearch = useCallback(
    async (query, { persist = false } = {}) => {
      const normalizedQuery = query.trim();
      const requestId = ++searchRequestIdRef.current;

      if (normalizedQuery.length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        setActiveIndex(0);
        return [];
      }

      setIsLoading(true);

      try {
        const response = await movieService.searchMovies(normalizedQuery);
        const movies = Array.isArray(response?.data) ? response.data : [];

        if (requestId !== searchRequestIdRef.current) {
          return movies;
        }

        setSearchResults(movies);
        setActiveIndex(0);

        if (persist) {
          persistRecentSearch(normalizedQuery);
          onSearch?.(normalizedQuery);
        }

        return movies;
      } catch (error) {
        if (requestId === searchRequestIdRef.current) {
          toast.error("Không thể tìm kiếm phim");
          setSearchResults([]);
        }

        return [];
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [onSearch, persistRecentSearch],
  );

  const openSearchModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSearchModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    setActiveIndex(0);
  };

  const handleSearch = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      await runSearch(searchQuery, { persist: true });
    },
    [runSearch, searchQuery],
  );

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    runSearch(query);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    window.clearTimeout(debounceTimerRef.current);

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      setActiveIndex(0);
      return undefined;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      runSearch(searchQuery);
    }, 280);

    return () => window.clearTimeout(debounceTimerRef.current);
  }, [isModalOpen, runSearch, searchQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery, searchResults.length, recentSearches.length, isModalOpen]);

  return (
    <>
      <div className="search-form">
        <div className="search-container" onClick={openSearchModal}>
          <input
            type="text"
            placeholder="Tìm kiếm phim, diễn viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              openSearchModal();
            }}
            readOnly
          />
          <button
            className="search-btn"
            onClick={(e) => {
              e.stopPropagation();
              openSearchModal();
            }}
          >
            <FaSearch />
          </button>
        </div>

        <button
          className="mobile-search-btn"
          onClick={openSearchModal}
          aria-label="Tìm kiếm"
        >
          <FaSearch />
        </button>
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeSearchModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        searchResults={searchResults}
        recentSearches={recentSearches}
        isLoading={isLoading}
        handleRecentSearch={handleRecentSearch}
        clearRecentSearches={clearRecentSearches}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  );
}

export default SearchBar;
