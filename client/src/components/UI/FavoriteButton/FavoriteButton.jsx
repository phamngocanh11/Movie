import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './FavoriteButton.css';

const FavoriteButton = ({ isFavorite, onClick, size = 'medium', showText = false }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button 
      className={`favorite-btn ${isFavorite ? 'is-favorite' : ''} ${size} ${isAnimating ? 'animating' : ''}`}
      onClick={handleClick}
      aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
    >
      {isFavorite 
        ? <FaHeart className="heart-icon filled" /> 
        : <FaRegHeart className="heart-icon" />
      }
      {showText && <span>{isFavorite ? "Đã yêu thích" : "Yêu thích"}</span>}
    </button>
  );
};

export default FavoriteButton; 