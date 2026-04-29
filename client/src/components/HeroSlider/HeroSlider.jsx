import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { FaPlay, FaPlus, FaHeart } from "react-icons/fa";
import "./HeroSlider.css";
import { useFavorite } from "../../contexts/FavoriteContext";
import { isAuthenticated } from "../../utils/auth";
import { toast } from "sonner";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Button from "../UI/Button/Button";

const HeroSlider = ({ movies }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { checkIsFavorite, toggleFavorite: toggleFavoriteContext } = useFavorite();
  const [favoriteStatus, setFavoriteStatus] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated() && movies.length > 0) {
      const initialStatus = {};
      movies.forEach(movie => {
        initialStatus[movie._id] = checkIsFavorite(movie._id);
      });
      setFavoriteStatus(initialStatus);
    }
  }, [movies, checkIsFavorite]);

  const toggleFavorite = async (movieId) => {
    if (!isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thêm phim vào danh sách yêu thích");
      return;
    }
    
    if (!movieId) return;
    
    const success = await toggleFavoriteContext(movieId);
    if (success) {
      setFavoriteStatus(prev => ({
        ...prev,
        [movieId]: !prev[movieId]
      }));
    }
  };

  const truncateDescription = (text, length) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          bulletClass: "pagination-bullet",
          bulletActiveClass: "pagination-bullet-active",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
        loop={true}
        className="hero-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.slug}>
            <div className="hero-slide">
              <div
                className="hero-backdrop"
                style={{ backgroundImage: `url(${movie.poster_url})` }}
              ></div>
              <div className="hero-content">
                <div className="hero-info">
                  {movie.isTrending && (
                    <div className="trending-badge">Hot</div>
                  )}
                  <h1 className="movie-title">{movie.name}</h1>
                  <div className="movie-meta">
                    <span className="movie-year">{movie.year}</span>
                    <span className="movie-duration">{movie.time}</span>
                  </div>
                  <p className="movie-description">
                    {truncateDescription(movie.content, 200)}
                  </p>
                  <div className="hero-buttons">
                    <Link to={`/movie/${movie.slug}`} className="watch-link">
                      <Button variant="primary" hasIcon>
                        <FaPlay />
                        <span>Xem ngay</span>
                      </Button>
                    </Link>
                    {favoriteStatus[movie._id] ? (
                      <Button 
                        variant="primary"
                        hasIcon 
                        className="add-button favorite-active"
                        onClick={() => toggleFavorite(movie._id)}
                        style={{
                          background: 'linear-gradient(135deg, #e50914, #b20710)',
                          borderColor: '#e50914'
                        }}
                      >
                        <span className="favorite-icon">
                          <FaHeart />
                        </span>
                        <span className="add-text">
                          Đã thêm vào yêu thích
                        </span>
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary"
                        hasIcon 
                        className="add-button"
                        onClick={() => toggleFavorite(movie._id)}
                      >
                        <span className="favorite-icon">
                          <FaPlus />
                        </span>
                        <span className="add-text">
                          Thêm vào danh sách yêu thích
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-pagination"></div>
    </section>
  );
};

export default HeroSlider;
