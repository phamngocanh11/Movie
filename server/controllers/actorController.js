const Actor = require("../models/actor");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.createActor = async (req, res) => {
  try {
    const { name } = req.body;
    const actor = new Actor({ name });
    await actor.save();
    return successResponse(res, actor, "Actor created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    return successResponse(res, actors, "Actors fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) {
      return errorResponse(res, "Khong tim thay dien vien", 404);
    }

    return successResponse(res, actor, "Actor fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateActor = async (req, res) => {
  try {
    const { name } = req.body;
    const actor = await Actor.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );
    if (!actor) {
      return errorResponse(res, "Khong tim thay dien vien", 404);
    }

    return successResponse(res, actor, "Actor updated");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) {
      return errorResponse(res, "Khong tim thay dien vien", 404);
    }

    return successResponse(res, {}, "Actor deleted");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
