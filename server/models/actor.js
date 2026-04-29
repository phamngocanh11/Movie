const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Actor = mongoose.model("Actor", ActorSchema);

module.exports = Actor;
