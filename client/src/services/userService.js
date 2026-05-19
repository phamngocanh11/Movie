import api from "../config/api";

const normalizeErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Lỗi khi gọi API!"
  );
};

const register = async (userData) => {
  try {
    const response = await api.post("/api/users/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const login = async (userData) => {
  try {
    const response = await api.post("/api/users/login", userData);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const googleLogin = async (credential) => {
  try {
    const response = await api.post("/api/users/google-login", { credential });
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const getAllUser = async () => {
  try {
    const response = await api.get("/api/users");
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    const payload = response.data || {};
    return payload.data || null;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const changePassword = async (userId, newPassword) => {
  try {
    const response = await api.post(`/api/users/update/password/${userId}`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const updateUser = async (userId, userData) => {
  try {
    if (userData.avatar instanceof File) {
      const formData = new FormData();

      formData.append("avatar", userData.avatar);

      Object.keys(userData).forEach((key) => {
        if (key !== "avatar") {
          formData.append(key, userData[key]);
        }
      });

      const response = await api.put(`/api/users/update/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    }

    const response = await api.put(`/api/users/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const createUser = async (userData) => {
  try {
    if (userData.avatar instanceof File) {
      const formData = new FormData();

      formData.append("avatar", userData.avatar);

      Object.keys(userData).forEach((key) => {
        if (key !== "avatar") {
          formData.append(key, userData[key]);
        }
      });

      const response = await api.post(`/api/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }

    const response = await api.post(`/api/users/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const getUserByInfo = async (username) => {
  try {
    const response = await api.get(`/api/users/info/${username}`);
    const payload = response.data || {};
    return payload.data || null;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const watchMovie = async (userId, movieId) => {
  try {
    const response = await api.post("/api/users/watch", {
      userId,
      movieId,
    });
    return response.data;
  } catch (error) {
    console.error("Error watching movie:", error);
    return null;
  }
};

const addFavorite = async (userId, movieId) => {
  try {
    const response = await api.post(`/api/users/add-favorite`, {
      userId,
      movieId,
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const removeFavorite = async (userId, movieId) => {
  try {
    const response = await api.post(`/api/users/remove-favorite`, {
      userId,
      movieId,
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const isFavorite = async (userId, movieId) => {
  try {
    const response = await api.get(`/api/users/favorite/${userId}/${movieId}`);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const forgotPassword = async (data) => {
  try {
    const response = await api.post("/api/users/forgotpassword", data);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const resetPassword = async (data) => {
  try {
    const response = await api.post("/api/users/reset-password", data);
    return response.data;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error));
  }
};

const addWatchHistory = async (userId, movieId, watchInfo = {}) => {
  try {
    const response = await api.post(`/api/movie-watched`, {
      userId,
      movieId,
      currentTime: watchInfo.currentTime || 0,
      duration: watchInfo.duration || 0,
      percentWatched: watchInfo.percentWatched || 0,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to watch history:", error);
    return null;
  }
};

const getUserFavorites = async (userId) => {
  try {
    const response = await api.get(`/api/users/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu thích:", error);
    return { success: false, data: [] };
  }
};

const getContinueWatching = async (userId, limit = 10) => {
  try {
    const response = await api.get(
      `/api/movie-watched/user/${userId}/continue-watching?limit=${limit}`,
    );

    const payload = response.data || {};
    return payload.data || [];
  } catch (error) {
    console.error("Error getting continue watching:", error);
    return [];
  }
};

const getWatchHistory = async (userId, movieId) => {
  try {
    const response = await api.get(
      `/api/movie-watched/user/${userId}/movie/${movieId}`,
    );
    const payload = response.data || {};

    return {
      ...payload,
      found: payload.found ?? false,
      data: payload.data || null,
    };
  } catch (error) {
    console.log("No watch history found or error:", error);
    return { found: false, data: null };
  }
};

const resetWatchHistory = async (userId, movieId) => {
  try {
    const response = await api.put(
      `/api/movie-watched/reset/${userId}/${movieId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting watch history:", error);
    throw new Error(normalizeErrorMessage(error));
  }
};

const userService = {
  register,
  login,
  googleLogin,
  getAllUser,
  deleteUser,
  getUserById,
  changePassword,
  updateUser,
  getUserByInfo,
  watchMovie,
  addFavorite,
  removeFavorite,
  isFavorite,
  forgotPassword,
  resetPassword,
  createUser,
  addWatchHistory,
  getUserFavorites,
  getContinueWatching,
  getWatchHistory,
  resetWatchHistory,
};

export default userService;
