const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

// Đảm bảo mỗi người dùng chỉ đánh giá một phim một lần
RatingSchema.index({ movie: 1, user: 1 }, { unique: true });

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating; 