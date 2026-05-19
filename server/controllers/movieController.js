const Category = require("../models/category");
const Movie = require("../models/movies");
const User = require("../models/user");
const Actor = require("../models/actor");
const Director = require("../models/director");
const Manufacturer = require("../models/manufacturer");
const UserRating = require("../models/userRating");
const logger = require("../config/logger");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const parseMaybeJson = (value, fallback = null) => {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      return value;
    }
  }

  return value;
};

const normalizeIdList = (value) => {
  const parsed = parseMaybeJson(value, []);

  if (Array.isArray(parsed)) {
    return parsed.filter(Boolean);
  }

  if (typeof parsed === "string") {
    return parsed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const pickUploadedField = (req, fieldName) =>
  req.files?.[fieldName]?.[0]?.path || null;

const normalizeMoviePayload = (req, existingMovie = null) => {
  const payload = { ...req.body };

  const fileFields = ["poster_url", "backdrop_url", "thumb_url"];
  fileFields.forEach((fieldName) => {
    const uploaded = pickUploadedField(req, fieldName);
    if (uploaded) {
      payload[fieldName] = uploaded;
    } else if (payload[fieldName] === undefined && existingMovie) {
      payload[fieldName] = existingMovie[fieldName];
    }
  });

  payload.categories = normalizeIdList(payload.categories);
  payload.actors = normalizeIdList(payload.actors);
  payload.director = normalizeIdList(payload.director);

  if (payload.manufacturer === "") {
    delete payload.manufacturer;
  }

  return payload;
};

const getAllMovies = async (req, res) => {
  try {
    const { sort, limit = 50, skip = 0 } = req.query;
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

    logger.info(
      `Fetched ${movies.length} movies with sort: ${sort || "default"}, limit: ${limit}, skip: ${skip}`,
    );

    return successResponse(res, movies, "Movies fetched", 200, {
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error(`Error fetching all movies: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return errorResponse(res, "Khong tim thay Movie", 404);
    }

    return successResponse(res, movie, "Movie fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createMovie = async (req, res) => {
  try {
    const movieData = normalizeMoviePayload(req);
    const movie = new Movie(movieData);
    const newMovie = await movie.save();
    return successResponse(res, newMovie, "Movie created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movieDocument = await Movie.findById(id);
    if (!movieDocument) {
      return errorResponse(res, "Khong tim thay Movie", 404);
    }

    const movieUpdate = normalizeMoviePayload(req, movieDocument.toObject());
    const updatedMovie = await Movie.findByIdAndUpdate(id, movieUpdate, {
      new: true,
    });

    return successResponse(res, updatedMovie, "Movie updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await Movie.findByIdAndDelete(id);
    return successResponse(res, {}, "Da xoa phim thanh cong");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMovieBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const movie = await Movie.findOne({ slug });
    if (!movie) {
      return errorResponse(res, "Khong tim thay Movie", 404);
    }

    return successResponse(res, movie, "Movie fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMovieByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
      return errorResponse(res, "Không tìm thấy danh mục phim", 404);
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
      return errorResponse(res, "Không tìm thấy phim trong danh mục này", 404);
    }

    return successResponse(res, movies, "Movies by category fetched");
  } catch (error) {
    logger.error(`Error in getMovieByCategory: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const searchMovies = async (req, res) => {
  const { keyword, actor, director, year, category, quality, manufacturer } =
    req.query;
  try {
    const query = {};

    if (keyword && keyword.trim() !== "") {
      const escapedKeyword = escapeRegex(keyword);
      query.name = { $regex: new RegExp(escapedKeyword, "i") };
    }

    if (actor && actor.trim() !== "") {
      const actorIds = await Actor.find({
        name: { $regex: new RegExp(escapeRegex(actor), "i") },
      }).distinct("_id");
      query.actors = { $in: actorIds };
    }

    if (director && director.trim() !== "") {
      const directorIds = await Director.find({
        name: { $regex: new RegExp(escapeRegex(director), "i") },
      }).distinct("_id");
      query.director = { $in: directorIds };
    }

    if (category && category.trim() !== "") {
      const categoryIds = await Category.find({
        name: { $regex: new RegExp(escapeRegex(category), "i") },
      }).distinct("_id");
      query.categories = { $in: categoryIds };
    }

    if (manufacturer && manufacturer.trim() !== "") {
      const manufacturerIds = await Manufacturer.find({
        name: { $regex: new RegExp(escapeRegex(manufacturer), "i") },
      }).distinct("_id");
      query.manufacturer = { $in: manufacturerIds };
    }

    if (year && year.trim() !== "") {
      query.year = Number(year);
    }

    if (quality && quality.trim() !== "") {
      query.quality = quality;
    }

    const movies = await Movie.find(query)
      .populate("actors", "name")
      .populate("director", "name")
      .populate("categories", "name")
      .populate("manufacturer", "name")
      .limit(50);

    return successResponse(res, movies, "Movies searched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const getMovieFavoritesCount = async (req, res) => {
  try {
    const { movieId } = req.params;
    const count = await User.countDocuments({ favourite: movieId });

    return successResponse(
      res,
      { count },
      "Movie favorites count fetched",
      200,
      {
        count,
      },
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getTopFavoriteMovies = async (req, res) => {
  try {
    const favoriteStats = await User.aggregate([
      { $unwind: "$favourite" },
      { $group: { _id: "$favourite", favoriteCount: { $sum: 1 } } },
      { $sort: { favoriteCount: -1 } },
      { $limit: 5 },
    ]);

    if (favoriteStats.length === 0) {
      const fallbackMovies = await Movie.find().sort({ views: -1 }).limit(5);
      return successResponse(
        res,
        fallbackMovies.map((movie) => ({
          ...movie.toObject(),
          favoriteCount: 0,
        })),
        "Top favorite movies fetched",
      );
    }

    const favoriteCountByMovieId = new Map(
      favoriteStats.map((item) => [item._id.toString(), item.favoriteCount]),
    );
    const movieIds = favoriteStats.map((item) => item._id);
    const movies = await Movie.find({ _id: { $in: movieIds } });
    const sortedMovies = movieIds
      .map((id) => movies.find((movie) => movie._id.toString() === id.toString()))
      .filter(Boolean)
      .map((movie) => ({
        ...movie.toObject(),
        favoriteCount: favoriteCountByMovieId.get(movie._id.toString()) || 0,
      }));

    return successResponse(res, sortedMovies, "Top favorite movies fetched");
  } catch (error) {
    logger.error(`Error in getTopFavoriteMovies: ${error.message}`);
    return errorResponse(res, "Không thể lấy danh sách phim yêu thích", 500, {
      data: [],
    });
  }
};

const incrementViews = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return errorResponse(res, "Không tìm thấy phim", 404);
    }

    movie.views = (movie.views || 0) + 1;
    await movie.save();

    return successResponse(
      res,
      { views: movie.views },
      "Đã cập nhật số lượt xem",
      200,
      { views: movie.views },
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMoviesByManufacturerId = async (req, res) => {
  const { manufacturerId } = req.params;

  try {
    const movies = await Movie.find({ manufacturer: manufacturerId }).select(
      "_id name year poster_url",
    );

    return successResponse(res, movies, "Movies by manufacturer fetched", 200, {
      count: movies.length,
    });
  } catch (error) {
    logger.error(`Error in getMoviesByManufacturerId: ${error.message}`);
    return errorResponse(res, error.message, 500, { data: [] });
  }
};

const getMoviesByActorId = async (req, res) => {
  const { actorId } = req.params;

  try {
    const movies = await Movie.find({ actors: actorId }).select(
      "_id name year poster_url",
    );

    return successResponse(res, movies, "Movies by actor fetched", 200, {
      count: movies.length,
    });
  } catch (error) {
    logger.error(`Error in getMoviesByActorId: ${error.message}`);
    return errorResponse(res, error.message, 500, { data: [] });
  }
};

const getMoviesByDirectorId = async (req, res) => {
  const { directorId } = req.params;

  try {
    const movies = await Movie.find({ director: directorId }).select(
      "_id name year poster_url",
    );

    return successResponse(res, movies, "Movies by director fetched", 200, {
      count: movies.length,
    });
  } catch (error) {
    logger.error(`Error in getMoviesByDirectorId: ${error.message}`);
    return errorResponse(res, error.message, 500, { data: [] });
  }
};

const rateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, userId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse(
        res,
        "Invalid rating value. Rating must be between 1 and 5.",
        400,
      );
    }

    if (!userId) {
      return errorResponse(res, "User ID is required", 400);
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return errorResponse(res, "Movie not found", 404);
    }

    let userRating = await UserRating.findOne({ user: userId, movie: movieId });
    let oldRating = 0;

    if (userRating) {
      oldRating = userRating.rating;
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = new UserRating({
        user: userId,
        movie: movieId,
        rating: rating,
      });
      await userRating.save();
      movie.ratingCount += 1;
    }

    if (oldRating > 0) {
      const totalRatingPoints = movie.rating * movie.ratingCount;
      const newTotalPoints = totalRatingPoints - oldRating + rating;
      movie.rating = parseFloat(
        (newTotalPoints / movie.ratingCount).toFixed(1),
      );
    } else {
      const totalRatingPoints = movie.rating * (movie.ratingCount - 1);
      const newTotalPoints = totalRatingPoints + rating;
      movie.rating = parseFloat(
        (newTotalPoints / movie.ratingCount).toFixed(1),
      );
    }

    await movie.save();

    return successResponse(
      res,
      {
        rating: movie.rating,
        ratingCount: movie.ratingCount,
        userRating: rating,
      },
      userRating.isNew
        ? "Rating added successfully"
        : "Rating updated successfully",
    );
  } catch (error) {
    logger.error(`Error in rateMovie: ${error.message}`);

    if (error.code === 11000) {
      return errorResponse(res, "You have already rated this movie", 400);
    }

    return errorResponse(res, error.message, 500);
  }
};

const getUserMovieRating = async (req, res) => {
  try {
    const { movieId, userId } = req.params;

    if (!movieId || !userId) {
      return errorResponse(res, "Movie ID and User ID are required", 400);
    }

    const userRating = await UserRating.findOne({
      movie: movieId,
      user: userId,
    });

    if (!userRating) {
      return successResponse(res, null, "User rating fetched", 200, {
        hasRated: false,
      });
    }

    return successResponse(
      res,
      {
        rating: userRating.rating,
        ratedAt: userRating.createdAt,
        updatedAt: userRating.updatedAt,
      },
      "User rating fetched",
      200,
      {
        hasRated: true,
      },
    );
  } catch (error) {
    logger.error(`Error in getUserMovieRating: ${error.message}`);
    return errorResponse(res, error.message, 500);
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
