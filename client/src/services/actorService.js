import api from "../config/api";

const getAllActors = async () => {
  try {
    const response = await api.get("/api/actors");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getActorById = async (id) => {
  try {
    const response = await api.get(`/api/actors/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const createActor = async (actorData) => {
  try {
    const response = await api.post("/api/actors/add", actorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const updateActor = async (id, actorData) => {
  try {
    const response = await api.put(`/api/actors/update/${id}`, actorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const deleteActor = async (id) => {
  try {
    const response = await api.delete(`/api/actors/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const actorService = {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
};

export default actorService; 