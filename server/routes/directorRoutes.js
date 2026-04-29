const express = require("express");
const {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
} = require("../controllers/directorController");
const router = express.Router();

router.get("/", getAllDirectors);
router.get("/:id", getDirectorById);
router.post("/add", createDirector);
router.put("/update/:id", updateDirector);
router.delete("/delete/:id", deleteDirector);

module.exports = router;
