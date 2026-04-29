import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./MoviesPage.css";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MovieFilters from "../../components/MovieFilters/MovieFilters";
import MoviePagination from "../../components/MoviePagination/MoviePagination";
import movieService from "../../services/movieService";
import categoryService from "../../services/categoryService";
import manufacturerService from "../../services/manufacturerService";
import { toast } from "sonner";

function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 20;

  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    quality: searchParams.get("quality") || "",
    studio: searchParams.get("studio") || "",
  });

  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    years: [],
    quality: ["HD", "Full HD", "4K", "8K"],
    studios: [],
  });

  const [categoriesData, setCategoriesData] = useState([]);
  const [manufacturersData, setManufacturersData] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.data) {
          setCategoriesData(categoriesResponse.data);
          const genres = categoriesResponse.data.map((category) => ({
            id: category._id,
            name: category.name,
          }));

          const manufacturersResponse =
            await manufacturerService.getAllManufacturers();
          if (manufacturersResponse.data) {
            setManufacturersData(manufacturersResponse.data);
            const studios = manufacturersResponse.data.map((manufacturer) => ({
              id: manufacturer._id,
              name: manufacturer.name,
            }));

            const currentYear = new Date().getFullYear();
            const years = [];
            for (let year = currentYear; year >= 2000; year--) {
              years.push(year.toString());
            }
            years.push("Trước 2000");

            setFilterOptions({
              genres,
              years,
              quality: ["HD", "Full HD", "4K", "8K"],
              studios,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
        toast.error("Không thể tải các tùy chọn lọc");
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    const fetchMovies = async () => {
      try {
        const response = await movieService.getAllMovies();
        if (response && response.data) {
          setMovies(response.data);
        } else {
          toast.error("Dữ liệu phim không đúng định dạng");
          setMovies([]);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        toast.error("Không thể tải danh sách phim");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    setSearchParams(params);

    let result = [...movies];

    if (filters.genre) {
      const selectedCategory = categoriesData.find(
        (cat) => cat.name === filters.genre
      );
      if (selectedCategory) {
        result = result.filter((movie) => {
          if (!movie.categories) return false;

          if (Array.isArray(movie.categories) && movie.categories.length > 0) {
            if (typeof movie.categories[0] === "string") {
              return movie.categories.includes(selectedCategory._id);
            } else if (typeof movie.categories[0] === "object") {
              return movie.categories.some(
                (cat) =>
                  cat._id === selectedCategory._id || cat.name === filters.genre
              );
            }
          }
          return false;
        });
      }
    }

    if (filters.year) {
      if (filters.year === "Trước 2000") {
        result = result.filter((movie) => {
          const movieYear =
            movie.year ||
            (movie.releaseDate
              ? new Date(movie.releaseDate).getFullYear()
              : null);
          return movieYear && movieYear < 2000;
        });
      } else {
        const year = parseInt(filters.year);
        result = result.filter((movie) => {
          const movieYear =
            movie.year ||
            (movie.releaseDate
              ? new Date(movie.releaseDate).getFullYear()
              : null);
          return movieYear === year;
        });
      }
    }

    if (filters.quality) {
      result = result.filter((movie) => movie.quality === filters.quality);
    }

    if (filters.studio) {
      const selectedManufacturer = manufacturersData.find(
        (m) => m.name === filters.studio
      );
      if (selectedManufacturer) {
        result = result.filter((movie) => {
          if (movie.manufacturer) {
            if (typeof movie.manufacturer === "string") {
              return movie.manufacturer === selectedManufacturer._id;
            } else if (typeof movie.manufacturer === "object") {
              return (
                movie.manufacturer._id === selectedManufacturer._id ||
                movie.manufacturer.name === filters.studio
              );
            }
          }
          return false;
        });
      }
    }

    setFilteredMovies(result);
    setTotalPages(Math.ceil(result.length / moviesPerPage));
    setCurrentPage(1);
  }, [
    filters,
    movies,
    searchParams,
    setSearchParams,
    categoriesData,
    manufacturersData,
  ]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      genre: "",
      year: "",
      quality: "",
      studio: "",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentMovies = filteredMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  return (
    <UserLayout>
      <div className="movies-page">
        <div className="movies-content">
          <MovieFilters
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />

          <div className="movies-results">
            {isLoading ? (
              <div className="movies-loading">
                <div className="movies-loader"></div>
                <p>Đang tải phim...</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h2>Danh Sách Phim ({filteredMovies.length})</h2>
                  <div className="results-info">
                    Trang {currentPage}/{totalPages}
                  </div>
                </div>

                {filteredMovies.length === 0 ? (
                  <div className="no-results">
                    <p>Không tìm thấy phim phù hợp với bộ lọc của bạn.</p>
                    <button onClick={resetFilters}>Xóa bộ lọc</button>
                  </div>
                ) : (
                  <>
                    <MovieGrid movies={currentMovies} />

                    <MoviePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default MoviesPage;
