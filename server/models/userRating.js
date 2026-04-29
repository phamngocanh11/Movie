const mongoose = require("mongoose");

const UserRatingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
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

// Tạo index cho cặp user-movie để đảm bảo mỗi người dùng chỉ đánh giá một phim một lần
UserRatingSchema.index({ user: 1, movie: 1 }, { unique: true });

const UserRating = mongoose.model("UserRating", UserRatingSchema);

module.exports = UserRating; 