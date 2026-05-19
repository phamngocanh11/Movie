import api from "../config/api";

const handleApiError = (error) => {
  console.error(error);
  throw new Error(error.response?.data?.error || "Something went wrong");
};

const hasFileValue = (data = {}) =>
  Object.values(data).some((value) => value instanceof File);

const appendFormValue = (formData, key, value) => {
  if (value === undefined || value === null) return;

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (Array.isArray(value) || typeof value === "object") {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, value);
};

const buildMoviePayload = (movieData = {}) => {
  if (!hasFileValue(movieData)) {
    return movieData;
  }

  const formData = new FormData();
  Object.entries(movieData).forEach(([key, value]) => {
    appendFormValue(formData, key, value);
  });

  return formData;
};

const getAllMovies = async () => {
  try {
    const response = await api.get("/api/movies");
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
  } catch (error) {
    handleApiError(error);
  }
};

const getMovieById = async (id) => {
  try {
    const response = await api.get(`/api/movies/${id}`);
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || null,
    };
  } catch (error) {
    handleApiError(error);
  }
};

const getMovieBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/movies/slug/${slug}`);
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || null,
    };
  } catch (error) {
    handleApiError(error);
  }
};

const createMovie = async (movieData) => {
  try {
    const payload = buildMoviePayload(movieData);
    const config = payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    const response = await api.post("/api/movies/add", payload, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateMovie = async (id, movieData) => {
  try {
    const payload = buildMoviePayload(movieData);
    const config = payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    const response = await api.put(`/api/movies/update/${id}`, payload, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteMovie = async (id) => {
  try {
    const response = await api.delete(`/api/movies/delete/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getMoviesByCategory = async (category) => {
  try {
    let categoryId = category;

    if (typeof category === "string" && !/^[a-f\d]{24}$/i.test(category)) {
      const categoriesResponse = await api.get("/api/categories");
      const categories = categoriesResponse?.data?.data || [];
      const matched = categories.find((c) => {
        const normalizedName = (c.name || "").toLowerCase().trim();
        const normalizedSlug = normalizedName.replace(/\s+/g, "-");
        return (
          normalizedName === category.toLowerCase().trim() ||
          normalizedSlug === category.toLowerCase().trim()
        );
      });

      if (matched?._id) {
        categoryId = matched._id;
      }
    }

    const response = await api.get(`/api/movies/category/${categoryId}`);
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
  } catch (error) {
    console.error(`Error getting movies by category ${category}:`, error);
    return { data: [] };
  }
};

const searchMovies = async (keywordOrFilters) => {
  try {
    const params =
      typeof keywordOrFilters === "object"
        ? new URLSearchParams(
            Object.entries(keywordOrFilters).filter(([, value]) => value),
          )
        : new URLSearchParams({ keyword: keywordOrFilters || "" });
    const response = await api.get(`/api/movies/search?${params.toString()}`);
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
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
      payload,
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
      `/api/movies/by-manufacturer/${manufacturerId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error getting movies by manufacturer ID ${manufacturerId}:`,
      error,
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
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
  } catch (error) {
    console.error("Error getting movies sorted by views:", error);
    return { data: [] };
  }
};

const getMoviesSortedByYear = async () => {
  try {
    const response = await api.get("/api/movies?sort=year");
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
  } catch (error) {
    console.error("Error getting movies sorted by year:", error);
    return { data: [] };
  }
};

const getMoviesSortedByRating = async () => {
  try {
    const response = await api.get("/api/movies?sort=rating");
    const payload = response.data || {};
    return {
      ...payload,
      data: payload.data || [],
    };
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
    return { success: false, hasRated: false, data: null };
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
