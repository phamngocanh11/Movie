const Comment = require("../models/comment");
const logger = require("../config/logger");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createComment = async (req, res) => {
  try {
    const { movie, content, rate } = req.body;
    const user = req.user?.id;

    if (!user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const comment = new Comment({ movie, content, rate, user });
    await comment.save();

    const savedComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar",
    );

    return successResponse(res, savedComment, "Comment created", 201);
  } catch (error) {
    logger.error(`Error creating comment: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return errorResponse(res, "Bình luận không tồn tại", 404);
    }

    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;

    if (!requesterId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (
      String(comment.user) !== String(requesterId) &&
      requesterRole !== "admin"
    ) {
      return errorResponse(res, "Forbidden", 403);
    }

    await Comment.findByIdAndDelete(id);

    return successResponse(res, {}, "Bình luận đã được xóa thành công");
  } catch (error) {
    logger.error(`Lỗi khi xóa bình luận: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const getCommentsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    const comments = await Comment.find({ movie: movieId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    return successResponse(res, comments, "Comments fetched");
  } catch (error) {
    logger.error(`Error fetching comments: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const getCommentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const comments = await Comment.find({ user: userId })
      .populate("movie", "name poster_url")
      .sort({ createdAt: -1 });

    return successResponse(res, comments, "User comments fetched");
  } catch (error) {
    logger.error(`Error fetching user comments: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createComment,
  deleteComment,
  getCommentsByMovieId,
  getCommentsByUserId,
};
