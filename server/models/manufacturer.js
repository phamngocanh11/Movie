const mongoose = require("mongoose");

const ManufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
  },
  { timestamps: true }
);

const Manufacturer = mongoose.model("Manufacturer", ManufacturerSchema);

module.exports = Manufacturer;
