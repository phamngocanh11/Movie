import api from "../config/api";

const register = async (userData) => {
  try {
    const response = await api.post("/api/users/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const login = async (userData) => {
  try {
    const response = await api.post("/api/users/login", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getAllUser = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const changePassword = async (userId, newPassword) => {
  try {
    const response = await api.post(`/api/users/update/password/${userId}`, {
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const updateUser = async (userId, userData) => {
  try {
    if (userData.avatar instanceof File) {
      const formData = new FormData();
      
      formData.append('avatar', userData.avatar);
      
      Object.keys(userData).forEach(key => {
        if (key !== 'avatar') {
          formData.append(key, userData[key]);
        }
      });
      
      const response = await api.put(`/api/users/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await api.put(`/api/users/update/${userId}`, userData);
      return response.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const createUser = async (userData) => {
  try {
    if (userData.avatar instanceof File) {
      const formData = new FormData();
      
      formData.append('avatar', userData.avatar);
      
      Object.keys(userData).forEach(key => {
        if (key !== 'avatar') {
          formData.append(key, userData[key]);
        }
      });
      
      const response = await api.post(`/api/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await api.post(`/api/users/register`, userData);
      return response.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getUserByInfo = async (username) => {
  try {
    const response = await api.get(`/api/users/info/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
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
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
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
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const isFavorite = async (userId, movieId) => {
  try {
    const response = await api.get(`/api/users/favorite/${userId}/${movieId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const forgotPassword = async (data) => {
  try {
    const response = await api.post("/api/users/forgotpassword", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const addWatchHistory = async (userId, movieId, watchInfo = {}) => {
  try {
    const response = await api.post(`/api/movie-watched`, {
      userId,
      movieId,
      currentTime: watchInfo.currentTime || 0,
      duration: watchInfo.duration || 0,
      percentWatched: watchInfo.percentWatched || 0
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

const getWatchHistory = async (userId, movieId) => {
  try {
    const response = await api.get(`/api/movie-watched/user/${userId}/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.log("No watch history found or error:", error);
    return { found: false };
  }
};

const resetWatchHistory = async (userId, movieId) => {
  try {
    const response = await api.put(`/api/movie-watched/reset/${userId}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error resetting watch history:", error);
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const userService = {
  register,
  login,
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
  createUser,
  addWatchHistory,
  getUserFavorites,
  getWatchHistory,
  resetWatchHistory
};

export default userService;
