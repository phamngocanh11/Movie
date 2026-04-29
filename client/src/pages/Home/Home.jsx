import React, { useState, useEffect } from "react";
import "./Home.css";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import MovieSection from "../../components/MovieSection/MovieSection";
import movieService from "../../services/movieService";
import { toast } from "sonner";

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [topFavoriteMovies, setTopFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    const fetchAllMovies = async () => {
      try {
        const response = await movieService.getAllMovies();

        if (response?.data) {
          const allMovies = response.data;

          const trending = [...allMovies]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
          setTrendingMovies(trending);

          const newReleasesData = [...allMovies]
            .sort(
              (a, b) =>
                new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0)
            )
            .slice(0, 5);
          setNewReleases(newReleasesData);

          const rated = [...allMovies]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5);
          setTopRated(rated);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        toast.error("Không thể tải danh sách phim");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTopFavorites = async () => {
      try {
        const response = await movieService.getTopFavoriteMovies();
        if (
          response &&
          response.success === true &&
          Array.isArray(response.data)
        ) {
          setTopFavoriteMovies(response.data);
        } else {
          console.log(
            "Invalid response format from top favorites API:",
            response
          );
          setTopFavoriteMovies([]);
        }
      } catch (error) {
        console.error("Error in fetchTopFavorites:", error);
        setTopFavoriteMovies([]);
      }
    };

    fetchAllMovies();
    fetchTopFavorites();
  }, []);

  return (
    <UserLayout>
      <div className="home-container">
        <section className="hero-container">
          {isLoading ? (
            <div className="hero-loading-skeleton"></div>
          ) : (
            <HeroSlider movies={trendingMovies} />
          )}
        </section>

        <div className="movie-categories">
          {isLoading ? (
            <div className="section-loading">
              <div className="section-loader"></div>
              <p>Đang tải phim...</p>
            </div>
          ) : (
            <>
              <MovieSection
                title="Đang Thịnh Hành"
                linkTo="/trending"
                movies={trendingMovies}
              />

              <MovieSection
                title="Mới Ra Mắt"
                linkTo="/new-releases"
                movies={newReleases}
              />

              <MovieSection
                title="Đánh Giá Cao"
                linkTo="/top-rated"
                movies={topRated}
              />

              {topFavoriteMovies.length > 0 && (
                <MovieSection
                  title="Phim được yêu thích nhất"
                  movies={topFavoriteMovies}
                />
              )}
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default Home;
