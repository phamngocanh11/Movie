import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import SearchModal from "../../SearchModal/SearchModal";
import movieService from "../../../services/movieService";
import { toast } from "sonner";

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const openSearchModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSearchModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  const handleSearch = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      if (!searchQuery.trim()) return;

      setIsLoading(true);

      try {
        const response = await movieService.searchMovies(
          searchQuery,
          activeCategory
        );

        if (response?.data) {
          setSearchResults(response.data);

          if (!recentSearches.includes(searchQuery)) {
            const updatedRecent = [searchQuery, ...recentSearches].slice(0, 5);
            setRecentSearches(updatedRecent);
            localStorage.setItem(
              "recentSearches",
              JSON.stringify(updatedRecent)
            );
          }

          onSearch(searchQuery);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching movies:", error);
        toast.error("Không thể tìm kiếm phim");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, activeCategory, recentSearches, onSearch]
  );

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent searches", e);
      }
    }
  }, []);

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    handleSearch();
  };

  useEffect(() => {
    if (searchQuery && searchResults.length > 0) {
      handleSearch();
    }
  }, [activeCategory, handleSearch, searchQuery, searchResults.length]);

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
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        handleSearch={handleSearch}
        searchResults={searchResults}
        recentSearches={recentSearches}
        isLoading={isLoading}
        handleRecentSearch={handleRecentSearch}
      />
    </>
  );
}

export default SearchBar;
