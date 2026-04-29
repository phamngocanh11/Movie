const express = require("express");
const {
  searchMovies,
  getAllMovies,
  getMovieById,
  getMovieByCategory,
  getMovieBySlug,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieFavoritesCount,
  getTopFavoriteMovies,
  incrementViews,
  getMoviesByManufacturerId,
  getMoviesByActorId,
  getMoviesByDirectorId,
  rateMovie,
  getUserMovieRating,
} = require("../controllers/movieController");
const router = express.Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies with pagination and sorting
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [views, year, rating]
 *     responses:
 *       200:
 *         description: List of movies with pagination info
 */
router.get("/", getAllMovies);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search movies by keyword
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchMovies);

/**
 * @swagger
 * /api/movies/top-favorites:
 *   get:
 *     summary: Get top favorite movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Top 5 favorite movies
 */
router.get("/top-favorites", getTopFavoriteMovies);

/**
 * @swagger
 * /api/movies/category/{category}:
 *   get:
 *     summary: Get movies by category
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movies in category
 */
router.get("/category/:category", getMovieByCategory);

/**
 * @swagger
 * /api/movies/by-manufacturer/{manufacturerId}:
 *   get:
 *     summary: Get movies by manufacturer
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: manufacturerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movies by manufacturer
 */
router.get("/by-manufacturer/:manufacturerId", getMoviesByManufacturerId);

/**
 * @swagger
 * /api/movies/by-actor/{actorId}:
 *   get:
 *     summary: Get movies by actor
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movies by actor
 */
router.get("/by-actor/:actorId", getMoviesByActorId);

/**
 * @swagger
 * /api/movies/by-director/{directorId}:
 *   get:
 *     summary: Get movies by director
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: directorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movies by director
 */
router.get("/by-director/:directorId", getMoviesByDirectorId);

/**
 * @swagger
 * /api/movies/slug/{slug}:
 *   get:
 *     summary: Get movie by slug
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie found
 */
router.get("/slug/:slug", getMovieBySlug);

/**
 * @swagger
 * /api/movies/favorites-count/{movieId}:
 *   get:
 *     summary: Get count of users who favorited a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite count
 */
router.get("/favorites-count/:movieId", getMovieFavoritesCount);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 */
router.get("/:id", getMovieById);

/**
 * @swagger
 * /api/movies/add:
 *   post:
 *     summary: Create new movie (Admin only)
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               year:
 *                 type: number
 *     responses:
 *       201:
 *         description: Movie created
 */
router.post("/add", createMovie);

/**
 * @swagger
 * /api/movies/update/{id}:
 *   put:
 *     summary: Update movie (Admin only)
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie updated
 */
router.put("/update/:id", updateMovie);

/**
 * @swagger
 * /api/movies/delete/{id}:
 *   delete:
 *     summary: Delete movie (Admin only)
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted
 */
router.delete("/delete/:id", deleteMovie);

/**
 * @swagger
 * /api/movies/increment-views/{movieId}:
 *   put:
 *     summary: Increment movie views
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Views incremented
 */
router.put("/increment-views/:movieId", incrementViews);

/**
 * @swagger
 * /api/movies/{movieId}/rate:
 *   post:
 *     summary: Rate a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Movie rated
 */
router.post("/:movieId/rate", rateMovie);

/**
 * @swagger
 * /api/movies/{movieId}/rating/{userId}:
 *   get:
 *     summary: Get user's rating for a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's rating
 */
router.get("/:movieId/rating/:userId", getUserMovieRating);

module.exports = router;
