const Director = require("../models/director");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.createDirector = async (req, res) => {
  try {
    const { name } = req.body;
    const director = new Director({ name });
    await director.save();
    return successResponse(res, director, "Director created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getAllDirectors = async (req, res) => {
  try {
    const directors = await Director.find();
    return successResponse(res, directors, "Directors fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getDirectorById = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (!director) {
      return errorResponse(res, "Khong tim thay dao dien", 404);
    }

    return successResponse(res, director, "Director fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateDirector = async (req, res) => {
  try {
    const { name } = req.body;
    const director = await Director.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );
    if (!director) {
      return errorResponse(res, "Khong tim thay dao dien", 404);
    }

    return successResponse(res, director, "Director updated");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteDirector = async (req, res) => {
  try {
    const director = await Director.findByIdAndDelete(req.params.id);
    if (!director) {
      return errorResponse(res, "Khong tim thay dao dien", 404);
    }

    return successResponse(res, {}, "Director deleted");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
