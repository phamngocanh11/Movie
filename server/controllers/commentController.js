const Comment = require("../models/comment");

const createComment = async (req, res) => {
  try {
    const { movie, content, rate, user } = req.body;
    
    const comment = new Comment({ movie, content, rate, user });
    await comment.save();
    
    const savedComment = await Comment.findById(comment._id).populate('user', 'username avatar');
    
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByIdAndDelete(id);
    
    if (!comment) {
      return res.status(404).json({ error: "Bình luận không tồn tại" });
    }
    
    res.status(200).json({ message: "Bình luận đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const comments = await Comment.find({ movie: movieId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
      
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const comments = await Comment.find({ user: userId })
      .populate('movie', 'name poster_url')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ data: comments });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  deleteComment,
  getCommentsByMovieId,
  getCommentsByUserId
};
