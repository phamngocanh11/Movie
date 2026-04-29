import api from "../config/api";

const getAllCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/api/categories/add", categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/api/categories/update/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/api/categories/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi gọi API!");
  }
};

const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;