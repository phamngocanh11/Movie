const express = require("express");
const {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
} = require("../controllers/directorController");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/directors:
 *   get:
 *     summary: Get all directors
 *     tags: [Directors]
 *     responses:
 *       200:
 *         description: Director list
 */
router.get("/", getAllDirectors);
/**
 * @swagger
 * /api/directors/{id}:
 *   get:
 *     summary: Get director by ID
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Director detail
 *       404:
 *         description: Director not found
 */
router.get("/:id", getDirectorById);
/**
 * @swagger
 * /api/directors/add:
 *   post:
 *     summary: Create director (Admin only)
 *     tags: [Directors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Director created
 */
router.post("/add", verifyToken, requireAdmin, createDirector);
/**
 * @swagger
 * /api/directors/update/{id}:
 *   put:
 *     summary: Update director (Admin only)
 *     tags: [Directors]
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
 *         description: Director updated
 */
router.put("/update/:id", verifyToken, requireAdmin, updateDirector);
/**
 * @swagger
 * /api/directors/delete/{id}:
 *   delete:
 *     summary: Delete director (Admin only)
 *     tags: [Directors]
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
 *         description: Director deleted
 */
router.delete("/delete/:id", verifyToken, requireAdmin, deleteDirector);

module.exports = router;
