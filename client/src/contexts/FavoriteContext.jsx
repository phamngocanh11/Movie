import React, { createContext, useState, useContext, useEffect } from "react";
import { getUserSingleInfo, isAuthenticated } from "../utils/auth";
import userService from "../services/userService";
import { toast } from "sonner";

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const loadFavorites = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setIsReloading(true);
      const userId = getUserSingleInfo("_id");
      const response = await userService.getUserFavorites(userId);

      if (response && response.success && Array.isArray(response)) {
        const favoriteIds = response.data.map((movie) =>
          typeof movie === "object" ? movie._id : movie
        );
        setFavorites(favoriteIds);
      } else if (response && Array.isArray(response)) {
        // Handle old response format for backward compatibility
        const favoriteIds = response.map((movie) =>
          typeof movie === "object" ? movie._id : movie
        );
        setFavorites(favoriteIds);
      } else {
        // Reset favorites if no valid data
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      toast.error("Không thể tải danh sách yêu thích");
      setFavorites([]);
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const checkIsFavorite = (movieId) => {
    return favorites.includes(movieId);
  };

  const toggleFavorite = async (movieId) => {
    if (!isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }

    try {
      const userId = getUserSingleInfo("_id");
      const isFav = checkIsFavorite(movieId);

      if (isFav) {
        await userService.removeFavorite(userId, movieId);
        setFavorites((prev) => prev.filter((id) => id !== movieId));
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await userService.addFavorite(userId, movieId);
        setFavorites((prev) => [...prev, movieId]);
        toast.success("Đã thêm vào danh sách yêu thích");
      }

      return true;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Không thể cập nhật trạng thái yêu thích");
      return false;
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        loading,
        favorites,
        checkIsFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
