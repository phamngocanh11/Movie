import api from "../config/api";

const getCommentsByMovieId = async (movieId) => {
  try {
    const response = await api.get(`/api/comments/${movieId}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    throw error;
  }
};

const getCommentsByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/comments/user/${userId}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy bình luận của người dùng:", error);
    return [];
  }
};

const createComment = async (commentData) => {
  try {
    const response = await api.post("/api/comments", commentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi tạo bình luận:", error);
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    throw error;
  }
};

const commentService = {
  getCommentsByMovieId,
  getCommentsByUserId,
  createComment,
  deleteComment,
};

export default commentService;
