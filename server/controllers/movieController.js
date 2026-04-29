const Category = require("../models/category");
const Movie = require("../models/movies");
const User = require("../models/user");
const UserRating = require("../models/userRating");
const logger = require("../config/logger");

const getAllMovies = async (req, res) => {
  try {
    const { sort, limit = 10, skip = 0 } = req.query;
    let sortOption = {};

    if (sort === "views") {
      sortOption = { views: -1 };
    } else if (sort === "year") {
      sortOption = { year: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    const movies = await Movie.find()
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Movie.countDocuments();

    logger.info(`Fetched ${movies.length} movies with sort: ${sort || 'default'}, limit: ${limit}, skip: ${skip}`);
    res.json({
      success: true,
      data: movies,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error(`Error fetching all movies: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Khong tim thay Movie" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMovie = async (req, res) => {
  const movie = new Movie(req.body);
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const movieUpdate = req.body;

  try {
    const existingMovie = await Movie.findByIdAndUpdate(id, movieUpdate, {
      new: true,
    });

    if (!existingMovie) {
      return res.status(404).json({ message: "Khong tim thay Movie" });
    }

    res.json(existingMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Da xoa phim thanh cong" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const movie = await Movie.findOne({ slug });
    if (!movie) {
      return res.status(404).json({ message: "Khong tim thay Movie" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
      return res.status(404).json({ message: "Không tìm thấy danh mục phim" });
    }

    const movies = await Movie.find({
      $or: [
        { categories: category },
        { categories: categoryFound._id },
        { category: category },
        { category: categoryFound._id },
      ],
    });

    if (!movies || movies.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phim trong danh mục này" });
    }

    res.json(movies);
  } catch (error) {
    console.error("Error in getMovieByCategory:", error);
    res.status(500).json({ message: error.message });
  }
};

const searchMovies = async (req, res) => {
  const { keyword } = req.query;
  try {
    let movies;
    if (keyword && keyword.trim() !== "") {
      const escapedKeyword = escapeRegex(keyword);
      movies = await Movie.find({
        name: { $regex: new RegExp(escapedKeyword, "i") },
      });
    } else {
      movies = await Movie.find();
    }
    if (!movies || movies.length === 0) {
      movies = await Movie.find();
    }
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const getMovieFavoritesCount = async (req, res) => {
  try {
    const { movieId } = req.params;
    const count = await User.countDocuments({ favourite: movieId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTopFavoriteMovies = async (req, res) => {
  try {
    const movies = await Movie.find().limit(5);

    return res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error in getTopFavoriteMovies:", error);
    return res.json({
      success: false,
      data: [],
      message: "Không thể lấy danh sách phim yêu thích",
    });
  }
};

const incrementViews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { userId } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phim",
      });
    }

    movie.views = (movie.views || 0) + 1;
    await movie.save();

    return res.status(200).json({
      success: true,
      views: movie.views,
      message: "Đã cập nhật số lượt xem",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMoviesByManufacturerId = async (req, res) => {
  const { manufacturerId } = req.params;

  try {
    const movies = await Movie.find({ manufacturer: manufacturerId }).select(
      "_id name year poster_url",
    );

    res.status(200).json({
      success: true,
      data: movies,
      count: movies.length,
    });
  } catch (error) {
    console.error("Error in getMoviesByManufacturerId:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const getMoviesByActorId = async (req, res) => {
  const { actorId } = req.params;

  try {
    const movies = await Movie.find({ actors: actorId }).select(
      "_id name year poster_url",
    );

    res.status(200).json({
      success: true,
      data: movies,
      count: movies.length,
    });
  } catch (error) {
    console.error("Error in getMoviesByActorId:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const getMoviesByDirectorId = async (req, res) => {
  const { directorId } = req.params;

  try {
    const movies = await Movie.find({ director: directorId }).select(
      "_id name year poster_url",
    );

    res.status(200).json({
      success: true,
      data: movies,
      count: movies.length,
    });
  } catch (error) {
    console.error("Error in getMoviesByDirectorId:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const rateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, userId } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating value. Rating must be between 1 and 5.",
      });
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the movie
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá phim này chưa
    let userRating = await UserRating.findOne({ user: userId, movie: movieId });
    let oldRating = 0;

    if (userRating) {
      // Lưu lại giá trị rating cũ để tính toán
      oldRating = userRating.rating;
      // Cập nhật rating mới
      userRating.rating = rating;
      await userRating.save();
    } else {
      // Tạo mới đánh giá nếu chưa tồn tại
      userRating = new UserRating({
        user: userId,
        movie: movieId,
        rating: rating,
      });
      await userRating.save();
      // Tăng số lượng đánh giá
      movie.ratingCount += 1;
    }

    // Tính toán rating mới
    if (oldRating > 0) {
      // Nếu là cập nhật rating cũ
      const totalRatingPoints = movie.rating * movie.ratingCount;
      const newTotalPoints = totalRatingPoints - oldRating + rating;
      movie.rating = parseFloat(
        (newTotalPoints / movie.ratingCount).toFixed(1),
      );
    } else {
      // Nếu là rating mới
      const totalRatingPoints = movie.rating * (movie.ratingCount - 1);
      const newTotalPoints = totalRatingPoints + rating;
      movie.rating = parseFloat(
        (newTotalPoints / movie.ratingCount).toFixed(1),
      );
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      data: {
        rating: movie.rating,
        ratingCount: movie.ratingCount,
        userRating: rating,
      },
      message: userRating.isNew
        ? "Rating added successfully"
        : "Rating updated successfully",
    });
  } catch (error) {
    console.error("Error in rateMovie:", error);

    // Xử lý lỗi duplicate key khi người dùng cố gắng đánh giá nhiều lần
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this movie",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserMovieRating = async (req, res) => {
  try {
    const { movieId, userId } = req.params;

    if (!movieId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID and User ID are required",
      });
    }

    const userRating = await UserRating.findOne({
      movie: movieId,
      user: userId,
    });

    if (!userRating) {
      return res.status(200).json({
        success: true,
        hasRated: false,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      hasRated: true,
      data: {
        rating: userRating.rating,
        ratedAt: userRating.createdAt,
        updatedAt: userRating.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in getUserMovieRating:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug,
  getMovieByCategory,
  searchMovies,
  getMovieFavoritesCount,
  getTopFavoriteMovies,
  incrementViews,
  getMoviesByManufacturerId,
  getMoviesByActorId,
  getMoviesByDirectorId,
  rateMovie,
  getUserMovieRating,
};
