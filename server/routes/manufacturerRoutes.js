const express = require("express");
const {
  getAllManufacturer,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
} = require("../controllers/manufacturerController");

const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/manufacturers:
 *   get:
 *     summary: Get all manufacturers
 *     tags: [Manufacturers]
 *     responses:
 *       200:
 *         description: Manufacturer list
 */
router.get("/", getAllManufacturer);
/**
 * @swagger
 * /api/manufacturers/{id}:
 *   get:
 *     summary: Get manufacturer by ID
 *     tags: [Manufacturers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Manufacturer detail
 *       404:
 *         description: Manufacturer not found
 */
router.get("/:id", getManufacturerById);
/**
 * @swagger
 * /api/manufacturers/add:
 *   post:
 *     summary: Create manufacturer (Admin only)
 *     tags: [Manufacturers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Manufacturer created
 */
router.post("/add", verifyToken, requireAdmin, createManufacturer);
/**
 * @swagger
 * /api/manufacturers/update/{id}:
 *   put:
 *     summary: Update manufacturer (Admin only)
 *     tags: [Manufacturers]
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
 *         description: Manufacturer updated
 */
router.put("/update/:id", verifyToken, requireAdmin, updateManufacturer);
/**
 * @swagger
 * /api/manufacturers/delete/{id}:
 *   delete:
 *     summary: Delete manufacturer (Admin only)
 *     tags: [Manufacturers]
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
 *         description: Manufacturer deleted
 */
router.delete("/delete/:id", verifyToken, requireAdmin, deleteManufacturer);

module.exports = router;
