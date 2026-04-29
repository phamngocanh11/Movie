const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String },
    status: {
      type: String,
      enum: ["released", "upcoming", "cancelled"],
      required: true,
    },
    poster_url: { type: String },
    thumb_url: { type: String },
    trailer_url: { type: String },
    source_url: { type: String },
    time: { type: String },
    quality: { type: String, enum: ["HD", "Full HD"] },
    year: { type: Number },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    director: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "Manufacturer" },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
