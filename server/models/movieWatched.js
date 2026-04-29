const mongoose = require("mongoose");

const MovieWatchedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    totalDuration: { type: Number, required: true },
    watchedDuration: { type: Number, required: true },
  },
  { timestamps: true }
);

const MovieWatched = mongoose.model("MovieWatched", MovieWatchedSchema);

module.exports = MovieWatched;
