const express = require("express");
const {
  createComment,
  deleteComment,
  getCommentsByMovieId,
  getCommentsByUserId
} = require("../controllers/commentController");
const router = express.Router();

router.post("/", createComment);
router.delete("/:id", deleteComment);
router.get("/:movieId", getCommentsByMovieId);
router.get("/user/:userId", getCommentsByUserId);

module.exports = router;
