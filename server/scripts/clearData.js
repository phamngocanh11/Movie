const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Import models
const Actor = require("../models/actor");
const Category = require("../models/category");
const Director = require("../models/director");
const Manufacturer = require("../models/manufacturer");
const Movie = require("../models/movies");
const User = require("../models/user");
const Comment = require("../models/comment");
const MovieWatched = require("../models/movieWatched");
const UserRating = require("../models/userRating");

const clearData = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Đã kết nối MongoDB");

    await UserRating.deleteMany({});
    console.log("🗑️  Đã xóa User Ratings");

    await MovieWatched.deleteMany({});
    console.log("🗑️  Đã xóa Movie Watched");

    await Comment.deleteMany({});
    console.log("🗑️  Đã xóa Comments");

    await User.deleteMany({});
    console.log("🗑️  Đã xóa Users");

    await Movie.deleteMany({});
    console.log("🗑️  Đã xóa Movies");

    await Manufacturer.deleteMany({});
    console.log("🗑️  Đã xóa Manufacturers");

    await Director.deleteMany({});
    console.log("🗑️  Đã xóa Directors");

    await Actor.deleteMany({});
    console.log("🗑️  Đã xóa Actors");

    await Category.deleteMany({});
    console.log("🗑️  Đã xóa Categories");

    console.log("\n🎉 Đã xóa toàn bộ dữ liệu!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi xóa dữ liệu:", error);
    process.exit(1);
  }
};

clearData();
