const Actor = require("../models/actor");

exports.createActor = async (req, res) => {
  try {
    const { name } = req.body;
    const actor = new Actor({ name });
    await actor.save();
    res.status(201).json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.status(200).json({ success: true, data: actors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay dien vien" });
    }
    res.status(200).json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const { name } = req.body;
    const actor = await Actor.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay dien vien" });
    }
    res.status(200).json({ success: true, data: actor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Khong tim thay dien vien" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
