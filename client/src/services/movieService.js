import api from "../config/api";

const handleApiError = (error) => {
  console.error(error);
  throw new Error(error.response?.data?.error || "Something went wrong");
};

const getAllMovies = async () => {
  try {
    const response = await api.get("/api/movies");
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const getMovieById = async (id) => {
  try {
    const response = await api.get(`/api/movies/${id}`);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const getMovieBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/movies/slug/${slug}`);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const createMovie = async (movieData) => {
  try {
    const response = await api.post("/api/movies/add", movieData);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const updateMovie = async (id, movieData) => {
  try {
    const response = await api.put(`/api/movies/update/${id}`, movieData);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteMovie = async (id) => {
  try {
    const response = await api.delete(`/api/movies/delete/${id}`);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const getMoviesByCategory = async (category) => {
  try {
    const response = await api.get(`/api/movies/category/${category}`);
    return response;
  } catch (error) {
    console.error(`Error getting movies by category ${category}:`, error);
    return { data: [] };
  }
};

const searchMovies = async (keyword) => {
  try {
    const response = await api.get(`/api/movies/search?keyword=${keyword}`);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const getTopFavoriteMovies = async () => {
  try {
    const response = await api.get("/api/movies/top-favorites");
    if (response.data && response.data.success) {
      return response.data;
    } else if (response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [],
      };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error("Error fetching top favorite movies:", error);
    return { success: false, data: [] };
  }
};

const incrementMovieViews = async (movieId, userId) => {
  try {
    const payload = userId ? { userId } : {};
    const response = await api.put(
      `/api/movies/increment-views/${movieId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error incrementing movie views:", error);
    return null;
  }
};

const getMoviesByManufacturer = async (manufacturerId) => {
  try {
    const response = await api.get(
      `/api/movies/by-manufacturer/${manufacturerId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error getting movies by manufacturer ID ${manufacturerId}:`,
      error
    );
    return { success: false, data: [], count: 0 };
  }
};

const getMoviesByActor = async (actorId) => {
  try {
    const response = await api.get(`/api/movies/by-actor/${actorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting movies by actor ID ${actorId}:`, error);
    return { success: false, data: [], count: 0 };
  }
};

const getMoviesByDirector = async (directorId) => {
  try {
    const response = await api.get(`/api/movies/by-director/${directorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting movies by director ID ${directorId}:`, error);
    return { success: false, data: [], count: 0 };
  }
};

const getMoviesSortedByViews = async () => {
  try {
    const response = await api.get("/api/movies?sort=views");
    return response;
  } catch (error) {
    console.error("Error getting movies sorted by views:", error);
    return { data: [] };
  }
};

const getMoviesSortedByYear = async () => {
  try {
    const response = await api.get("/api/movies?sort=year");
    return response;
  } catch (error) {
    console.error("Error getting movies sorted by year:", error);
    return { data: [] };
  }
};

const getMoviesSortedByRating = async () => {
  try {
    const response = await api.get("/api/movies?sort=rating");
    return response;
  } catch (error) {
    console.error("Error getting movies sorted by rating:", error);
    return { data: [] };
  }
};

const rateMovie = async (movieId, rating, userId) => {
  try {
    const response = await api.post(`/api/movies/${movieId}/rate`, {
      rating,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error rating movie:", error);
    throw error;
  }
};

const getUserMovieRating = async (movieId, userId) => {
  try {
    const response = await api.get(`/api/movies/${movieId}/rating/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user movie rating:", error);
    return { success: false, hasRated: false };
  }
};

const movieService = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug,
  getMoviesByCategory,
  searchMovies,
  getTopFavoriteMovies,
  incrementMovieViews,
  getMoviesByManufacturer,
  getMoviesByActor,
  getMoviesByDirector,
  getMoviesSortedByViews,
  getMoviesSortedByYear,
  getMoviesSortedByRating,
  rateMovie,
  getUserMovieRating,
};

export default movieService;
