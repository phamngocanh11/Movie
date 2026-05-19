const express = require("express");
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
} = require("../controllers/actorController");

const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/actors:
 *   get:
 *     summary: Get all actors
 *     tags: [Actors]
 *     responses:
 *       200:
 *         description: Actor list
 */
router.get("/", getAllActors);
/**
 * @swagger
 * /api/actors/{id}:
 *   get:
 *     summary: Get actor by ID
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actor detail
 *       404:
 *         description: Actor not found
 */
router.get("/:id", getActorById);
/**
 * @swagger
 * /api/actors/add:
 *   post:
 *     summary: Create actor (Admin only)
 *     tags: [Actors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Actor created
 */
router.post("/add", verifyToken, requireAdmin, createActor);
/**
 * @swagger
 * /api/actors/update/{id}:
 *   put:
 *     summary: Update actor (Admin only)
 *     tags: [Actors]
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
 *         description: Actor updated
 */
router.put("/update/:id", verifyToken, requireAdmin, updateActor);
/**
 * @swagger
 * /api/actors/delete/{id}:
 *   delete:
 *     summary: Delete actor (Admin only)
 *     tags: [Actors]
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
 *         description: Actor deleted
 */
router.delete("/delete/:id", verifyToken, requireAdmin, deleteActor);

module.exports = router;
