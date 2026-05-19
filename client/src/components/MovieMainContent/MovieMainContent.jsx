import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaGlobe,
  FaUserTie,
  FaUsers,
  FaTag,
  FaInfoCircle,
  FaEye,
  FaFilm,
} from "react-icons/fa";
import categoryService from "../../services/categoryService";
import actorService from "../../services/actorService";
import directorService from "../../services/directorService";
import "./MovieMainContent.css";

const isRawId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value.trim());

const cleanText = (value) => {
  if (!value || isRawId(value)) return "";
  return String(value);
};

const formatViews = (views = 0) => {
  const value = Number(views) || 0;

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`;
  }

  return value.toString();
};

const MovieMainContent = ({ movie }) => {
  const [categoryNames, setCategoryNames] = useState({});
  const [formattedActors, setFormattedActors] = useState("");
  const [formattedDirectors, setFormattedDirectors] = useState("");
  
  useEffect(() => {
    const fetchCategoryNames = async () => {
      if (!movie.categories || movie.categories.length === 0) return;
      
      const needToFetch = movie.categories.some(cat => 
        typeof cat === 'string' || !cat.name
      );
      
      if (needToFetch) {
        try {
          const response = await categoryService.getAllCategories();
          const categoryData = Array.isArray(response.data) 
            ? response.data 
            : response;
            
          const categoryMap = {};
          categoryData.forEach(cat => {
            categoryMap[cat._id] = cat.name;
          });
          
          setCategoryNames(categoryMap);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin thể loại:", error);
        }
      }
    };
    
    fetchCategoryNames();
  }, [movie.categories]);
  
  useEffect(() => {
    const fetchActorNames = async () => {
      if (typeof movie.actors === 'string') {
        setFormattedActors(cleanText(movie.actors));
        return;
      }
      
      if (Array.isArray(movie.actors) && movie.actors.length > 0) {
        if (typeof movie.actors[0] === 'object' && movie.actors[0].name) {
          setFormattedActors(movie.actors.map(actor => actor.name).join(', '));
          return;
        }
        
        try {
          const response = await actorService.getAllActors();
          const actorData = Array.isArray(response.data) 
            ? response.data 
            : response;
            
          const actorMap = {};
          actorData.forEach(actor => {
            actorMap[actor._id] = actor.name;
          });
          
          const actorsList = movie.actors
            .map(actorId => actorMap[actorId] || cleanText(actorId))
            .filter(Boolean);
          setFormattedActors(actorsList.join(', '));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin diễn viên:", error);
        }
      }
    };
    
    fetchActorNames();
  }, [movie.actors]);
  
  useEffect(() => {
    const fetchDirectorNames = async () => {
      if (typeof movie.director === 'string') {
        setFormattedDirectors(cleanText(movie.director));
        return;
      }
      
      if (Array.isArray(movie.director) && movie.director.length > 0) {
        if (typeof movie.director[0] === 'object' && movie.director[0].name) {
          setFormattedDirectors(movie.director.map(dir => dir.name).join(', '));
          return;
        }
        
        try {
          const response = await directorService.getAllDirectors();
          const directorData = Array.isArray(response.data) 
            ? response.data 
            : response;
            
          const directorMap = {};
          directorData.forEach(director => {
            directorMap[director._id] = director.name;
          });
          
          const directorsList = movie.director
            .map(directorId => directorMap[directorId] || cleanText(directorId))
            .filter(Boolean);
          setFormattedDirectors(directorsList.join(', '));
        } catch (error) {
          console.error("Lỗi khi lấy thông tin đạo diễn:", error);
        }
      }
      else if (movie.director && typeof movie.director === 'string') {
        try {
          const response = await directorService.getAllDirectors();
          const directorData = Array.isArray(response.data) 
            ? response.data 
            : response;
            
          const directorMap = {};
          directorData.forEach(director => {
            directorMap[director._id] = director.name;
          });
          
          setFormattedDirectors(
            directorMap[movie.director] || cleanText(movie.director)
          );
        } catch (error) {
          console.error("Lỗi khi lấy thông tin đạo diễn:", error);
        }
      }
    };
    
    fetchDirectorNames();
  }, [movie.director]);
  
  const getCategoryName = (category) => {
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    
    return categoryNames[category] || cleanText(category);
  };

  const visibleCategories = (movie.categories || [])
    .map(getCategoryName)
    .filter(Boolean);

  return (
    <div className="mc-container">
      <div className="mc-wrapper">
        <div className="mc-poster-section">
          <div className="mc-poster-frame">
            <img
              src={movie.poster_url}
              alt={movie.name}
              className="mc-poster"
            />
            {movie.quality && (
              <span className="mc-quality">{movie.quality}</span>
            )}
          </div>

          {movie.rating && (
            <div className="mc-rating-badge">
              <FaStar className="mc-star-icon" />
              <span>{movie.rating}</span>
            </div>
          )}
        </div>

        <div className="mc-info-section">
          <div className="mc-section-header">
            <h2 className="mc-section-header-title">
              <FaFilm className="mc-header-icon" />
              Thông tin phim
            </h2>
          </div>

          <div className="mc-key-stats">
            {movie.time && (
              <div className="mc-stat-item">
                <FaClock />
                <span>{movie.time}</span>
              </div>
            )}

            {movie.views && (
              <div className="mc-stat-item">
                <FaEye />
                <span>{formatViews(movie.views)} lượt xem</span>
              </div>
            )}

            {(movie.year || movie.release_date) && (
              <div className="mc-stat-item">
                <FaCalendarAlt />
                <span>{movie.release_date || movie.year}</span>
              </div>
            )}

            {movie.country && (
              <div className="mc-stat-item">
                <FaGlobe />
                <span>{movie.country}</span>
              </div>
            )}
          </div>

          <div className="mc-section">
            <h3 className="mc-section-title">
              <FaInfoCircle className="mc-title-icon" />
              Nội dung
            </h3>
            <p className="mc-overview-text">
              {movie.content || "Chưa có mô tả chi tiết cho phim này."}
            </p>
          </div>

          <div className="mc-info-grid">
            {formattedDirectors && (
              <div className="mc-info-item">
                <span className="mc-info-label">
                  <FaUserTie className="mc-label-icon" />
                  Đạo diễn
                </span>
                <span className="mc-info-value">{formattedDirectors}</span>
              </div>
            )}

            {formattedActors && (
              <div className="mc-info-item">
                <span className="mc-info-label">
                  <FaUsers className="mc-label-icon" />
                  Diễn viên
                </span>
                <span className="mc-info-value">{formattedActors}</span>
              </div>
            )}
          </div>

          {visibleCategories.length > 0 && (
            <div className="mc-section mc-categories-section">
              <h3 className="mc-section-title">
                <FaTag className="mc-title-icon" />
                Thể loại
              </h3>
              <div className="mc-categories">
                {visibleCategories.map((category, index) => (
                  <span key={index} className="mc-category-tag">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieMainContent;
