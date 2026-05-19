const express = require("express");
const router = express.Router();
const movieWatchedController = require("../controllers/movieWatchedController");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  requireSelfOrAdminByParam,
  requireSelfOrAdminByBody,
} = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/movie-watched:
 *   post:
 *     summary: Create or update watch history (Self or Admin)
 *     tags: [WatchHistory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Watch history created or updated
 */
router.post(
  "/",
  verifyToken,
  requireSelfOrAdminByBody("userId"),
  movieWatchedController.createMovieWatched,
);

/**
 * @swagger
 * /api/movie-watched/{id}:
 *   put:
 *     summary: Update watched duration (Authenticated)
 *     tags: [WatchHistory]
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
 *         description: Watch history updated
 */
router.put("/:id", verifyToken, movieWatchedController.updateWatchedDuration);

/**
 * @swagger
 * /api/movie-watched/{id}:
 *   get:
 *     summary: Get watched duration by record ID (Authenticated)
 *     tags: [WatchHistory]
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
 *         description: Watched duration
 */
router.get("/:id", verifyToken, movieWatchedController.getWatchedDuration);

/**
 * @swagger
 * /api/movie-watched/user/{userId}/continue-watching:
 *   get:
 *     summary: Get continue watching list by user (Self or Admin)
 *     tags: [WatchHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Continue watching list
 */

/**
 * @swagger
 * /api/movie-watched/user/{userId}/movie/{movieId}:
 *   get:
 *     summary: Get watch history by user and movie (Self or Admin)
 *     tags: [WatchHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Watch history detail
 */
router.get(
  "/user/:userId/continue-watching",
  verifyToken,
  requireSelfOrAdminByParam("userId"),
  movieWatchedController.getContinueWatchingByUserId,
);

router.get(
  "/user/:userId/movie/:movieId",
  verifyToken,
  requireSelfOrAdminByParam("userId"),
  movieWatchedController.getMovieWatchedByUserIdAndMovieId,
);

/**
 * @swagger
 * /api/movie-watched/reset/{userId}/{movieId}:
 *   put:
 *     summary: Reset watch history by user and movie (Self or Admin)
 *     tags: [WatchHistory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Watch history reset
 */
router.put(
  "/reset/:userId/:movieId",
  verifyToken,
  requireSelfOrAdminByParam("userId"),
  movieWatchedController.resetMovieWatched,
);

module.exports = router;
