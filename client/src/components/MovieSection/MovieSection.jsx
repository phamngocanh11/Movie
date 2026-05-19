import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieSection.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";

const MovieSection = ({ title, linkTo, movies, variant = "default" }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const uniqueMovies = useMemo(() => {
    const seen = new Set();

    return (movies || []).filter((movie, index) => {
      const identity = movie?._id || movie?.id || movie?.slug || movie?.name;
      const key = identity ? String(identity) : `movie-${index}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [movies]);

  return (
    <section className="movie-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="see-all">
            <span>Xem tất cả</span> <FaChevronRight />
          </Link>
        )}
      </div>

      <div className="movie-slider-container">
        <Swiper
          modules={[Navigation, A11y]}
          slidesPerView="auto"
          spaceBetween={20}
          navigation={{
            nextEl: `.swiper-button-next-${title.replace(/\s+/g, "-")}`,
            prevEl: `.swiper-button-prev-${title.replace(/\s+/g, "-")}`,
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="movie-swiper"
          breakpoints={{
            320: {
              slidesPerView: 2.2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 3.2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 4.2,
              spaceBetween: 15,
            },
            992: {
              slidesPerView: 5.2,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 6.2,
              spaceBetween: 30,
            },
            1400: {
              slidesPerView: 7,
              spaceBetween: 40,
            },
          }}
        >
          {uniqueMovies.map((movie, index) => (
            <SwiperSlide
              key={`${movie?._id || movie?.id || movie?.slug || title}-${index}`}
            >
              <MovieCard movie={movie} variant={variant} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          className={`swiper-button-prev swiper-button-prev-${title.replace(
            /\s+/g,
            "-"
          )} ${isBeginning ? "swiper-button-disabled" : ""}`}
          aria-label="Previous slides"
        ></div>
        <div
          className={`swiper-button-next swiper-button-next-${title.replace(
            /\s+/g,
            "-"
          )} ${isEnd ? "swiper-button-disabled" : ""}`}
          aria-label="Next slides"
        ></div>
      </div>
    </section>
  );
};

export default MovieSection;
