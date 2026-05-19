const express = require("express");
const router = express.Router();

const { uploadAvatarCloud } = require("../config/cloudinary");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  requireAdmin,
  requireSelfOrAdminByParam,
  requireSelfOrAdminByBody,
} = require("../middlewares/roleMiddleware");
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
  resetPassword,
  updateUser,
  getUserFavorites,
  logout,
  verifyEmail,
  resendVerificationEmail,
  checkEmailVerificationStatus,
  googleLogin,
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
router.post("/register", uploadAvatarCloud.single("avatar"), register);

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
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", verifyToken, requireAdmin, getAllUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Self or Admin)
 *     tags: [Users]
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
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, requireSelfOrAdminByParam("id"), getUserById);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
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
 *         description: User deleted
 */
router.delete("/delete/:id", verifyToken, requireAdmin, deleteUser);

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
 *     summary: Update user profile (Self or Admin)
 *     tags: [Users]
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
 *         description: User updated
 */
router.put(
  "/update/:id",
  verifyToken,
  requireSelfOrAdminByParam("id"),
  uploadAvatarCloud.single("avatar"),
  updateUser,
);

router.post("/google-login", googleLogin);

/**
 * @swagger
 * /api/users/add-favorite:
 *   post:
 *     summary: Add movie to favorites (Self or Admin)
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Added to favorites
 */
router.post(
  "/add-favorite",
  verifyToken,
  requireSelfOrAdminByBody("userId"),
  addFavorite,
);

/**
 * @swagger
 * /api/users/remove-favorite:
 *   post:
 *     summary: Remove movie from favorites (Self or Admin)
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.post(
  "/remove-favorite",
  verifyToken,
  requireSelfOrAdminByBody("userId"),
  removeFavorite,
);

/**
 * @swagger
 * /api/users/favorite/{userId}/{movieId}:
 *   get:
 *     summary: Check favorite status (Self or Admin)
 *     tags: [Favorites]
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
 *         description: Favorite status
 */
router.get(
  "/favorite/:userId/:movieId",
  verifyToken,
  requireSelfOrAdminByParam("userId"),
  isFavorite,
);

/**
 * @swagger
 * /api/users/favorites/{userId}:
 *   get:
 *     summary: Get user favorites (Self or Admin)
 *     tags: [Favorites]
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
 *         description: List of favorite movies
 */
router.get(
  "/favorites/:userId",
  verifyToken,
  requireSelfOrAdminByParam("userId"),
  getUserFavorites,
);

/**
 * @swagger
 * /api/users/watch:
 *   post:
 *     summary: Mark movie as watched (Self or Admin)
 *     tags: [WatchHistory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Movie marked as watched
 */
router.post(
  "/watch",
  verifyToken,
  requireSelfOrAdminByBody("userId"),
  watchMovie,
);

/**
 * @swagger
 * /api/users/update/password/{id}:
 *   post:
 *     summary: Change password (Self or Admin)
 *     tags: [Users]
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
 *         description: Password changed
 */
router.post(
  "/update/password/:id",
  verifyToken,
  requireSelfOrAdminByParam("id"),
  changePassword,
);

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

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 */
router.post("/reset-password", resetPassword);

module.exports = router;
