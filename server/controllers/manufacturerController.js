const Manufacturer = require("../models/manufacturer");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.createManufacturer = async (req, res) => {
  try {
    const { name, logo } = req.body;
    const manu = new Manufacturer({ name, logo });
    await manu.save();
    return successResponse(res, manu, "Manufacturer created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getAllManufacturer = async (req, res) => {
  try {
    const manus = await Manufacturer.find();
    return successResponse(res, manus, "Manufacturers fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getManufacturerById = async (req, res) => {
  try {
    const manu = await Manufacturer.findById(req.params.id);
    if (!manu) {
      return errorResponse(res, "Khong tim thay nha san xuat", 404);
    }

    return successResponse(res, manu, "Manufacturer fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    const { name, logo } = req.body;
    const manu = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      { name, logo },
      { new: true },
    );
    if (!manu) {
      return errorResponse(res, "Khong tim thay nha san xuat", 404);
    }

    return successResponse(res, manu, "Manufacturer updated");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const manu = await Manufacturer.findByIdAndDelete(req.params.id);
    if (!manu) {
      return errorResponse(res, "Khong tim thay nha san xuat", 404);
    }

    return successResponse(res, {}, "Manufacturer deleted");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
