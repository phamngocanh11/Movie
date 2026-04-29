import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import movieService from "../../services/movieService";
import userService from "../../services/userService";
import { getUserSingleInfo, isAuthenticated } from "../../utils/auth";
import { toast } from "sonner";
import "./MoviePlayer.css";
import { useFavorite } from "../../contexts/FavoriteContext";
import FavoriteButton from "../../components/UI/FavoriteButton/FavoriteButton";
import ResumeModal from "../../components/UI/ResumeModal/ResumeModal";

const MoviePlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playerState, setPlayerState] = useState({
    playing: true,
    played: 0,
    duration: 0,
  });
  const playerRef = useRef(null);
  const watchHistorySavedRef = useRef(false);
  const controlTimerRef = useRef(null);
  const { checkIsFavorite, toggleFavorite: toggleFavoriteContext } =
    useFavorite();
  const [watchHistory, setWatchHistory] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [startAt, setStartAt] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await movieService.getMovieBySlug(slug);
        if (response?.data) {
          setMovie(response.data);
          if (isAuthenticated()) {
            setIsFavorite(checkIsFavorite(response.data._id));
          }
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        toast.error("Không thể tải thông tin phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();

    controlTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      clearTimeout(controlTimerRef.current);
      saveWatchHistory();
    };
  }, [slug, checkIsFavorite]);

  useEffect(() => {
    const checkWatchHistory = async () => {
      if (isAuthenticated() && movie?._id) {
        try {
          const userId = getUserSingleInfo("_id");

          await movieService.incrementMovieViews(movie._id, userId);

          const response = await userService.getWatchHistory(userId, movie._id);

          if (response.found && response.data) {
            const watchedDuration = response.data.watchedDuration || 0;

            if (watchedDuration > 30) {
              setWatchHistory(response.data);
              setShowResumeModal(true);
            } else {
              console.log(
                `Watched duration (${watchedDuration}) not significant enough to show resume modal`
              );
            }
          } else {
            console.log("No watch history found:", response);
          }
        } catch (error) {
          console.error("Error checking watch history:", error);
        }
      }
    };

    if (movie) {
      checkWatchHistory();
    }

    return () => {
      if (movie && isAuthenticated() && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime > 0) {
          const userId = getUserSingleInfo("_id");
          const duration = playerState.duration || 0;

          userService.addWatchHistory(userId, movie._id, {
            currentTime,
            duration,
          });
        }
      }
    };
  }, [movie]);

  const saveWatchHistory = async (force = false) => {
    if (!isAuthenticated() || !movie?._id) return;

    if (!force && watchHistorySavedRef.current === true) {
      const now = Date.now();
      if (now - watchHistorySavedRef.current < 10000) {
        return;
      }
    }

    try {
      const userId = getUserSingleInfo("_id");
      const currentTime = playerRef.current
        ? playerRef.current.getCurrentTime()
        : 0;
      const duration = playerState.duration || 0;

      if (currentTime <= 0 && !force) {
        return;
      }

      const result = await userService.addWatchHistory(userId, movie._id, {
        currentTime,
        duration,
      });

      if (result && result.success) {
        watchHistorySavedRef.current = Date.now();
      } else {
        console.error("Failed to save watch history:", result);
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch sử xem phim:", error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlTimerRef.current) {
      clearTimeout(controlTimerRef.current);
    }

    controlTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  const handleHeaderMouseEnter = () => {
    setShowControls(true);
    if (controlTimerRef.current) {
      clearTimeout(controlTimerRef.current);
    }
  };

  const handleHeaderMouseLeave = () => {
    if (controlTimerRef.current) {
      clearTimeout(controlTimerRef.current);
    }

    controlTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  const handlePlayPause = (playing) => {
    setPlayerState((prev) => ({ ...prev, playing }));

    if (
      !playing &&
      playerRef.current &&
      playerRef.current.getCurrentTime() > 5
    ) {
      saveWatchHistory(true);
    }
  };

  const togglePlay = () => {
    setPlayerState((prev) => ({ ...prev, playing: !prev.playing }));

    if (playerState.playing) {
      saveWatchHistory();
    }
  };

  const handleProgress = (state) => {
    setPlayerState((prev) => ({
      ...prev,
      played: state.played,
    }));
  };

  const handleDuration = (duration) => {
    setPlayerState((prev) => ({ ...prev, duration }));
  };

  const handleNavigateBack = () => {
    if (playerRef.current && playerRef.current.getCurrentTime() > 0) {
      saveWatchHistory(true);
    }
    navigate(-1);
  };

  const handleToggleFavorite = useCallback(async () => {
    if (!movie?._id) return;

    try {
      const success = await toggleFavoriteContext(movie._id);

      if (success) {
        const newState = !isFavorite;
        setIsFavorite(newState);
      }
    } catch (error) {
      console.error("Error in handleToggleFavorite:", error);
      toast.error("Không thể cập nhật trạng thái yêu thích");
    }
  }, [movie, isFavorite, toggleFavoriteContext]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: movie?.name || "Xem phim hay",
          text: `Đang xem phim ${movie?.name || ""}`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Đã sao chép đường dẫn vào clipboard"))
        .catch(() => toast.error("Không thể sao chép đường dẫn"));
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
  };

  const handleTimeUpdate = () => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    if (
      currentTime >= 10 &&
      Math.floor(currentTime) % 30 === 0 &&
      currentTime > 0
    ) {
      saveWatchHistory();
    }
  };

  const handleResume = () => {
    if (watchHistory && watchHistory.watchedDuration && playerRef.current) {
      playerRef.current.seekTo(parseFloat(watchHistory.watchedDuration));
      setStartAt(watchHistory.watchedDuration);
    }

    setShowResumeModal(false);
    setPlayerState((prev) => ({ ...prev, playing: true }));
  };

  const handleRestart = async () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }

    setShowResumeModal(false);
    setPlayerState((prev) => ({ ...prev, playing: true }));

    if (isAuthenticated() && movie?._id && watchHistory) {
      try {
        const userId = getUserSingleInfo("_id");
        await userService.resetWatchHistory(userId, movie._id);
      } catch (error) {
        console.error("Error resetting watch history:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="mp-container__loading">
        <div className="mp-spinner"></div>
      </div>
    );
  }

  if (!movie || !movie.source_url) {
    return (
      <div className="mp-container__error">
        <h2>Không thể phát phim</h2>
        <p>Không tìm thấy nguồn phim hoặc phim không tồn tại.</p>
        <button onClick={() => navigate(-1)} className="mp-back-btn">
          <FaArrowLeft /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="mp-container" onMouseMove={handleMouseMove}>
      <div
        className="mp-top-hover-zone"
        onMouseEnter={handleHeaderMouseEnter}
        onMouseLeave={handleHeaderMouseLeave}
      ></div>

      <div
        className={`mp-header ${showControls ? "mp-visible" : "mp-hidden"}`}
        onMouseEnter={handleHeaderMouseEnter}
        onMouseLeave={handleHeaderMouseLeave}
      >
        <button onClick={handleNavigateBack} className="mp-back-btn">
          <FaArrowLeft /> Quay lại
        </button>
        <h1 className="mp-title">{movie.name}</h1>
        <div className="mp-action-buttons">
          <button onClick={handleShare} className="mp-share-btn">
            <FaShare />
          </button>
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={handleToggleFavorite}
            size="large"
          />
        </div>
      </div>

      <ReactPlayer
        ref={playerRef}
        url={movie.source_url}
        className="mp-react-player"
        width="100%"
        height="100%"
        playing={playerState.playing}
        controls
        playbackRate={playbackRate}
        onPlay={() => handlePlayPause(true)}
        onPause={() => handlePlayPause(false)}
        onProgress={(state) => {
          handleProgress(state);
          handleTimeUpdate();
        }}
        onDuration={handleDuration}
        onEnded={saveWatchHistory}
        progressInterval={1000}
        config={{
          file: {
            attributes: {
              crossOrigin: "anonymous",
            },
            forceVideo: true,
          },
        }}
      />

      <div
        className={`mp-playback-controls ${
          showControls ? "mp-visible" : "mp-hidden"
        }`}
      >
        <div className="mp-playback-speed">
          <span>Tốc độ phát:</span>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => handlePlaybackRateChange(rate)}
              className={playbackRate === rate ? "mp-active" : ""}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {showResumeModal && watchHistory && (
        <ResumeModal
          watchedDuration={watchHistory.watchedDuration}
          percentWatched={Math.round(
            (watchHistory.watchedDuration / (watchHistory.totalDuration || 1)) *
              100
          )}
          onResume={handleResume}
          onRestart={handleRestart}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  );
};

export default MoviePlayer;
