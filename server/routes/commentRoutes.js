const express = require("express");
const {
  createComment,
  deleteComment,
  getCommentsByMovieId,
  getCommentsByUserId,
} = require("../controllers/commentController");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireSelfOrAdminByParam } = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a comment (Authenticated)
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/", verifyToken, createComment);
/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete comment (Owner or Admin)
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete("/:id", verifyToken, deleteComment);
/**
 * @swagger
 * /api/comments/user/{userId}:
 *   get:
 *     summary: Get comments by user (Self or Admin)
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User comments
 */
router.get(
  "/user/:userId",
  verifyToken,
  requireSelfOrAdminByParam("userId"),
  getCommentsByUserId,
);
/**
 * @swagger
 * /api/comments/{movieId}:
 *   get:
 *     summary: Get comments by movie ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie comments
 */
router.get("/:movieId", getCommentsByMovieId);

module.exports = router;
