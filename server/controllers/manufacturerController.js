const Manufacturer = require("../models/manufacturer");

exports.createManufacturer = async (req, res) => {
  try {
    const { name, logo } = req.body;
    const manu = new Manufacturer({ name, logo });
    await manu.save();
    res.status(201).json({ success: true, data: manu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllManufacturer = async (req, res) => {
  try {
    const manus = await Manufacturer.find();
    res.status(200).json({ success: true, data: manus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getManufacturerById = async (req, res) => {
  try {
    const manu = await Manufacturer.findById(req.params.id);
    if (!manu) {
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay nha san xuat" });
    }
    res.status(200).json({ success: true, data: manu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    const { name, logo } = req.body;
    const manu = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      { name, logo },
      { new: true }
    );
    if (!manu) {
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay nha san xuat" });
    }
    res.status(200).json({ success: true, data: manu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const manu = await Manufacturer.findByIdAndDelete(req.params.id);
    if (!manu) {
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay nha san xuat" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
