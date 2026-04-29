const express = require("express");
const router = express.Router();

const { uploadCloud } = require("../config/cloudinary");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  isFavorite,
  getAllUser,
  getUserById,
  changePassword,
  deleteUser,
  getUserByUsername,
  login,
  register,
  watchMovie,
  addFavorite,
  removeFavorite,
  forgotPassword,
  updateUser,
  getUserFavorites,
  logout,
  verifyEmail,
  resendVerificationEmail,
  checkEmailVerificationStatus,
} = require("../controllers/userController");

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Invalid input or user exists
 */
router.post("/register", register);

/**
 * @swagger
 * /api/users/verify-email:
 *   post:
 *     summary: Verify user email with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT verification token from email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       401:
 *         description: Token expired
 *       404:
 *         description: User not found
 */
router.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/users/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 */
router.post("/resend-verification", resendVerificationEmail);

/**
 * @swagger
 * /api/users/verification-status:
 *   get:
 *     summary: Check email verification status
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/verification-status", verifyToken, checkEmailVerificationStatus);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getAllUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/delete/:id", deleteUser);

/**
 * @swagger
 * /api/users/info/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/info/:username", getUserByUsername);

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/update/:id", uploadCloud.single("avatar"), updateUser);

/**
 * @swagger
 * /api/users/add-favorite:
 *   post:
 *     summary: Add movie to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               movieId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added to favorites
 */
router.post("/add-favorite", addFavorite);

/**
 * @swagger
 * /api/users/remove-favorite:
 *   post:
 *     summary: Remove movie from favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               movieId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.post("/remove-favorite", removeFavorite);

/**
 * @swagger
 * /api/users/favorite/{userId}/{movieId}:
 *   get:
 *     summary: Check if movie is favorite
 *     tags: [Favorites]
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
 *         description: Favorite status
 */
router.get("/favorite/:userId/:movieId", isFavorite);

/**
 * @swagger
 * /api/users/favorites/{userId}:
 *   get:
 *     summary: Get user's favorite movies
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of favorite movies
 */
router.get("/favorites/:userId", getUserFavorites);

/**
 * @swagger
 * /api/users/watch:
 *   post:
 *     summary: Mark movie as watched
 *     tags: [WatchHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               movieId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie marked as watched
 */
router.post("/watch", watchMovie);

/**
 * @swagger
 * /api/users/update/password/{id}:
 *   post:
 *     summary: Change password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
router.post("/update/password/:id", changePassword);

/**
 * @swagger
 * /api/users/forgotpassword:
 *   post:
 *     summary: Forgot password - send reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 *       404:
 *         description: User not found
 */
router.post("/forgotpassword", forgotPassword);

module.exports = router;
