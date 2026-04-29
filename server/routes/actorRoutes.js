const express = require("express");
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
} = require("../controllers/actorController");

const router = express.Router();

router.get("/", getAllActors);
router.get("/:id", getActorById);
router.post("/add", createActor);
router.put("/update/:id", updateActor);
router.delete("/delete/:id", deleteActor);

module.exports = router;
