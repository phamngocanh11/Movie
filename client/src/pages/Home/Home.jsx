import React, { useState, useEffect } from "react";
import "./Home.css";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import MovieSection from "../../components/MovieSection/MovieSection";
import movieService from "../../services/movieService";
import userService from "../../services/userService";
import { getUserSingleInfo, isAuthenticated } from "../../utils/auth";
import { toast } from "sonner";

const getMovieIdentity = (movie, index) =>
  movie?._id || movie?.id || movie?.slug || movie?.name || `movie-${index}`;

const uniqueMovies = (movies = []) => {
  const seen = new Set();

  return movies.filter((movie, index) => {
    const key = String(getMovieIdentity(movie, index));

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [topFavoriteMovies, setTopFavoriteMovies] = useState([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    const fetchAllMovies = async () => {
      try {
        const response = await movieService.getAllMovies();

        if (response?.data) {
          const allMovies = uniqueMovies(response.data);

          const trending = [...allMovies]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 10);
          setTrendingMovies(trending);

          const newReleasesData = [...allMovies]
            .sort(
              (a, b) =>
                new Date(b.releaseDate || b.year || 0) -
                new Date(a.releaseDate || a.year || 0),
            )
            .slice(0, 10);
          setNewReleases(newReleasesData);

          const rated = [...allMovies]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 10);
          setTopRated(rated);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        toast.error("Không thể tải danh sách phim");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchContinueWatching = async () => {
      try {
        if (!isAuthenticated()) {
          setContinueWatchingMovies([]);
          return;
        }

        const userId = getUserSingleInfo("_id");
        if (!userId) {
          setContinueWatchingMovies([]);
          return;
        }

        const response = await userService.getContinueWatching(userId, 10);

        const mappedMovies = uniqueMovies(
          (response || []).map((item) => ({
            ...(item.movie || {}),
            _continueWatching: {
              watchedDuration: item.watchedDuration,
              totalDuration: item.totalDuration,
              percentWatched: item.percentWatched,
              updatedAt: item.updatedAt,
            },
          })),
        );

        setContinueWatchingMovies(mappedMovies);
      } catch (error) {
        console.error("Error in fetchContinueWatching:", error);
        setContinueWatchingMovies([]);
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
          setTopFavoriteMovies(uniqueMovies(response.data));
        } else {
          console.log(
            "Invalid response format from top favorites API:",
            response,
          );
          setTopFavoriteMovies([]);
        }
      } catch (error) {
        console.error("Error in fetchTopFavorites:", error);
        setTopFavoriteMovies([]);
      }
    };

    fetchAllMovies();
    fetchContinueWatching();
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
              {continueWatchingMovies.length > 0 && (
                <MovieSection
                  title="Xem tiếp"
                  movies={continueWatchingMovies}
                />
              )}

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
