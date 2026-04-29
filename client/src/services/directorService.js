import api from "../config/api";

const getAllDirectors = async () => {
  try {
    const response = await api.get("/api/directors");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getDirectorById = async (id) => {
  try {
    const response = await api.get(`/api/directors/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const createDirector = async (directorData) => {
  try {
    const response = await api.post("/api/directors/add", directorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const updateDirector = async (id, directorData) => {
  try {
    const response = await api.put(`/api/directors/update/${id}`, directorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const deleteDirector = async (id) => {
  try {
    const response = await api.delete(`/api/directors/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const directorService = {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
};

export default directorService; 