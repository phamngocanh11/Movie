const mongoose = require("mongoose");
const fs = require("fs");
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

// Đường dẫn đến folder chứa JSON
const dataPath = path.join(__dirname, "../../lythuyet");

// Hàm chuyển đổi MongoDB JSON format sang JavaScript object
const parseMongoJSON = (data) => {
  return data.map((item) => {
    const newItem = {};
    for (let key in item) {
      if (key === "_id" && item[key].$oid) {
        // Chuyển _id
        newItem[key] = item[key].$oid;
      } else if (key === "createdAt" || key === "updatedAt") {
        // Chuyển date
        newItem[key] = item[key].$date ? new Date(item[key].$date) : item[key];
      } else if (Array.isArray(item[key])) {
        // Chuyển array of ObjectIds
        newItem[key] = item[key].map((elem) => {
          if (elem && elem.$oid) {
            return elem.$oid;
          }
          return elem;
        });
      } else if (item[key] && typeof item[key] === "object" && item[key].$oid) {
        // Chuyển single ObjectId
        newItem[key] = item[key].$oid;
      } else {
        newItem[key] = item[key];
      }
    }
    return newItem;
  });
};

// Hàm import dữ liệu
const importData = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Đã kết nối MongoDB");

    // Xóa dữ liệu cũ (tùy chọn - bỏ comment nếu muốn xóa)
    // await Actor.deleteMany({});
    // await Category.deleteMany({});
    // await Director.deleteMany({});
    // await Manufacturer.deleteMany({});
    // await Movie.deleteMany({});
    // await User.deleteMany({});
    // await Comment.deleteMany({});
    // await MovieWatched.deleteMany({});
    // await UserRating.deleteMany({});
    // console.log("🗑️  Đã xóa dữ liệu cũ");

    // Import theo thứ tự (các collection không phụ thuộc trước)
    
    // 1. Categories
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.categories.json"), "utf-8")
    );
    await Category.insertMany(parseMongoJSON(categoriesData));
    console.log("✅ Đã import Categories");

    // 2. Actors
    const actorsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.actors.json"), "utf-8")
    );
    await Actor.insertMany(parseMongoJSON(actorsData));
    console.log("✅ Đã import Actors");

    // 3. Directors
    const directorsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.directors.json"), "utf-8")
    );
    await Director.insertMany(parseMongoJSON(directorsData));
    console.log("✅ Đã import Directors");

    // 4. Manufacturers
    const manufacturersData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.manufacturers.json"), "utf-8")
    );
    await Manufacturer.insertMany(parseMongoJSON(manufacturersData));
    console.log("✅ Đã import Manufacturers");

    // 5. Movies
    const moviesData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.movies.json"), "utf-8")
    );
    await Movie.insertMany(parseMongoJSON(moviesData));
    console.log("✅ Đã import Movies");

    // 6. Users
    const usersData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.users.json"), "utf-8")
    );
    await User.insertMany(parseMongoJSON(usersData));
    console.log("✅ Đã import Users");

    // 7. Comments
    const commentsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.comments.json"), "utf-8")
    );
    await Comment.insertMany(parseMongoJSON(commentsData));
    console.log("✅ Đã import Comments");

    // 8. Movie Watched
    const movieWatchedData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.moviewatcheds.json"), "utf-8")
    );
    await MovieWatched.insertMany(parseMongoJSON(movieWatchedData));
    console.log("✅ Đã import Movie Watched");

    // 9. User Ratings
    const userRatingsData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "movie.userratings.json"), "utf-8")
    );
    await UserRating.insertMany(parseMongoJSON(userRatingsData));
    console.log("✅ Đã import User Ratings");

    console.log("\n🎉 Import hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi import:", error);
    process.exit(1);
  }
};

// Chạy import
importData();
