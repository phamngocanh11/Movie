const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/categories/add:
 *   post:
 *     summary: Create category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/add", verifyToken, requireAdmin, createCategory);
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Category list
 */
router.get("/", getCategories);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category detail
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryById);
/**
 * @swagger
 * /api/categories/update/{id}:
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Categories]
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
 *         description: Category updated
 */
router.put("/update/:id", verifyToken, requireAdmin, updateCategory);
/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
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
 *         description: Category deleted
 */
router.delete("/delete/:id", verifyToken, requireAdmin, deleteCategory);

module.exports = router;
