import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout/UserLayout";
import MovieBanner from "../../components/MovieBanner/MovieBanner";
import MovieMainContent from "../../components/MovieMainContent/MovieMainContent";
import MovieSection from "../../components/MovieSection/MovieSection";
import MovieCommentSection from "../../components/MovieSectionComment/MovieCommentSection";
import StarRating from "../../components/StarRating/StarRating";
import movieService from "../../services/movieService";
import userService from "../../services/userService";
import commentService from "../../services/commentService";
import { getUserSingleInfo, isAuthenticated } from "../../utils/auth";
import { toast } from "sonner";
import "./MovieDetail.css";
import { useFavorite } from '../../contexts/FavoriteContext';

const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const { checkIsFavorite, toggleFavorite: toggleFavoriteContext } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    const fetchMovieData = async () => {
      try {
        const movieResponse = await movieService.getMovieBySlug(slug);
        if (!movieResponse?.data) {
          setLoading(false);
          return;
        }
        
        const movieData = movieResponse.data;
        setMovie(movieData);
        
        if (movieData?.categories?.length > 0) {
          try {
            let categoryId;
            
            if (typeof movieData.categories[0] === 'object' && movieData.categories[0]?._id) {
              categoryId = movieData.categories[0]._id;
            } else {
              categoryId = movieData.categories[0];
            }

            try {
              const relatedResponse = await movieService.getMoviesByCategory(categoryId);
              if (relatedResponse?.data) {
                const relatedData = relatedResponse.data
                  .filter(m => m._id !== movieData._id)
                  .slice(0, 8);
                
                if (relatedData.length > 0) {
                  setRelatedMovies(relatedData);
                } else {
                  console.log("Không tìm thấy phim liên quan");
                  setRelatedMovies([]);
                }
              } else {
                console.log("Không có dữ liệu phim liên quan từ API");
                setRelatedMovies([]);
              }
            } catch (error) {
              console.error("Error fetching related movies:", error);
              setRelatedMovies([]);
            }
          } catch (error) {
            console.error("Error processing categories:", error);
          }
        }
        
        try {
          const commentsData = await commentService.getCommentsByMovieId(movieData._id);
          if (commentsData) {
            const formattedComments = Array.isArray(commentsData) ? commentsData.map(comment => {
              const userObj = typeof comment.user === 'object' ? comment.user : {};
              
              return {
                id: comment._id,
                user: userObj.username || "Người dùng",
                avatar: userObj.avatar || "https://res.cloudinary.com/dprthmqgl/image/upload/v1708944715/avatars/fe4uocps0ibylndvppk9.webp",
                text: comment.content,
                rating: comment.rate,
                date: comment.createdAt || new Date()
              };
            }) : [];
            
            setComments(formattedComments);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
        
        if (isAuthenticated() && movieData?._id) {
          setIsFavorite(checkIsFavorite(movieData._id));
        }
        
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Không thể tải thông tin phim");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieData();
  }, [slug, checkIsFavorite]);

  const toggleFavorite = async () => {
    if (!isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thêm phim vào danh sách yêu thích");
      return;
    }
    
    if (!movie?._id) return;
    
    const success = await toggleFavoriteContext(movie._id);
    if (success) {
      setIsFavorite(!isFavorite);
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    
    if (!isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }
    
    try {
      const userId = getUserSingleInfo("_id");
      const commentData = {
        user: userId,
        movie: movie._id,
        content: comment,
        rate: rating
      };
      
      try {
        const newComment = await commentService.createComment(commentData);
        if (newComment) {
          const userInfo = {
            _id: getUserSingleInfo("_id"),
            username: getUserSingleInfo("username"),
            avatar: getUserSingleInfo("avatar")
          };
          
          const formattedComment = {
            id: newComment._id,
            user: userInfo.username,
            avatar: userInfo.avatar,
            text: newComment.content,
            rating: newComment.rate,
            date: newComment.createdAt || new Date()
          };
          
          setComments(prevComments => [formattedComment, ...prevComments]);
          setComment("");
          setRating(0);
          toast.success("Bình luận đã được đăng");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
        toast.error("Không thể đăng bình luận");
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      toast.error("Không thể xác định thông tin người dùng");
    }
  };

  const handleRatingSubmit = async (ratingValue) => {
    if (!isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }
    
    try {
      const userId = getUserSingleInfo("_id");
      
      const response = await movieService.rateMovie(movie._id, ratingValue, userId);
      if (response.success) {
        setMovie({
          ...movie,
          rating: response.data.rating,
          ratingCount: response.data.ratingCount
        });
        toast.success("Đánh giá của bạn đã được ghi nhận!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Có lỗi xảy ra khi đánh giá phim");
      } else {
        toast.error("Có lỗi xảy ra khi đánh giá phim");
      }
      console.error("Error submitting rating:", error);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="movie-detail-container">
          <div className="loading-skeleton">
            <div className="skeleton-banner"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-meta"></div>
              <div className="skeleton-desc"></div>
              <div className="skeleton-buttons"></div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!movie) {
    return (
      <UserLayout>
        <div className="movie-detail-container">
          <div className="movie-not-found">
            <h2>Không tìm thấy phim</h2>
            <p>
              Rất tiếc, chúng tôi không thể tìm thấy phim bạn đang tìm kiếm.
            </p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="movie-detail-container">
        <MovieBanner
          movie={movie}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onRatingSubmit={handleRatingSubmit}
        />

        <div className="movie-content">
          <MovieMainContent movie={movie} />

          <MovieCommentSection
            rating={rating}
            comment={comment}
            comments={comments}
            handleRatingChange={handleRatingChange}
            handleCommentChange={handleCommentChange}
            submitComment={submitComment}
          />

          {relatedMovies.length > 0 && (
            <div className="related-movies">
              <MovieSection title="Phim Tương Tự" movies={relatedMovies} />
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default MovieDetail;
