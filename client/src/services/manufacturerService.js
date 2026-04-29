import api from "../config/api";

const getAllManufacturers = async () => {
  try {
    const response = await api.get("/api/manufacturers");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getManufacturerById = async (id) => {
  try {
    const response = await api.get(`/api/manufacturers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const createManufacturer = async (manufacturerData) => {
  try {
    const response = await api.post("/api/manufacturers/add", manufacturerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const updateManufacturer = async (id, manufacturerData) => {
  try {
    const response = await api.put(`/api/manufacturers/update/${id}`, manufacturerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const deleteManufacturer = async (id) => {
  try {
    const response = await api.delete(`/api/manufacturers/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const manufacturerService = {
  getAllManufacturers,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
};

export default manufacturerService;