import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'sonner';
import { isAuthenticated, getUserSingleInfo } from '../../utils/auth';
import movieService from '../../services/movieService';
import './StarRating.css';

const StarRating = ({ movie, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const checkUserRating = async () => {
      if (isAuthenticated() && movie && movie._id) {
        const userId = getUserSingleInfo("_id");
        try {
          const response = await movieService.getUserMovieRating(movie._id, userId);
          
          if (response.success && response.hasRated) {
            setHasRated(true);
            setUserRating(response.data.rating);
            setRating(response.data.rating);
          }
        } catch (error) {
          console.error('Error checking user rating:', error);
        }
      }
    };

    checkUserRating();
  }, [movie]);

  const handleRatingClick = (ratingValue) => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đánh giá phim');
      return;
    }

    if (hasRated) {
      toast.info(`Bạn đã đánh giá phim này ${userRating} sao. Bạn không thể đánh giá lại.`);
      return;
    }

    if (!movie || !movie._id) {
      toast.error('Không thể đánh giá phim này lúc này. Vui lòng thử lại sau.');
      return;
    }

    setRating(ratingValue);
    onRatingSubmit(ratingValue);
    setHasRated(true);
    setUserRating(ratingValue);
    toast.success('Cảm ơn bạn đã đánh giá phim!');
  };

  return (
    <div className="star-rating-container">
      <h3>Đánh giá phim</h3>
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          
          return (
            <label key={index}>
              <input 
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => handleRatingClick(ratingValue)}
              />
              <FaStar 
                className={`star ${ratingValue <= (hover || rating) ? 'active' : ''}`}
                onMouseEnter={() => !hasRated && setHover(ratingValue)}
                onMouseLeave={() => !hasRated && setHover(0)}
                size={30}
              />
            </label>
          );
        })}
      </div>
      <div className="rating-info">
        {movie && movie.ratingCount > 0 && (
          <p>Đánh giá từ {movie.ratingCount} người dùng</p>
        )}
        {hasRated && (
          <p className="user-rating-info">Bạn đã đánh giá phim này {userRating} sao</p>
        )}
      </div>
    </div>
  );
};

export default StarRating; 