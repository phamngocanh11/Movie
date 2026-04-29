const express = require("express");
const {
  getAllManufacturer,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
} = require("../controllers/manufacturerController");

const router = express.Router();

router.get("/", getAllManufacturer);
router.get("/:id", getManufacturerById);
router.post("/add", createManufacturer);
router.put("/update/:id", updateManufacturer);
router.delete("/delete/:id", deleteManufacturer);

module.exports = router;
