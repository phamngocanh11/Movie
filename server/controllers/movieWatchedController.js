const MovieWatched = require("../models/movieWatched");
const User = require("../models/user");
const logger = require("../config/logger");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.createMovieWatched = async (req, res) => {
  try {
    const { userId, movieId, currentTime, duration } = req.body;

    // Kiểm tra tham số
    if (!userId || !movieId) {
      return errorResponse(res, "Thiếu thông tin userId hoặc movieId", 400);
    }

    logger.info(
      `Creating watch history - userId: ${userId}, movieId: ${movieId}, currentTime: ${currentTime}, duration: ${duration}`,
    );

    // Cập nhật User Model để thêm phim vào danh sách đã xem
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "Không tìm thấy người dùng", 404);
    }

    // Thêm phim vào danh sách movieWatched nếu chưa có
    const movieWatchedIds = user.movieWatched.map((id) => id.toString());
    if (!movieWatchedIds.includes(movieId.toString())) {
      user.movieWatched.push(movieId);
      await user.save();
      logger.info(`Added movie ${movieId} to user ${userId} watched list`);
    }

    // Kiểm tra và cập nhật bản ghi MovieWatched
    const existingRecord = await MovieWatched.findOne({
      user: userId,
      movie: movieId,
    });

    if (existingRecord) {
      // Chỉ cập nhật nếu thời gian mới lớn hơn 0 và lớn hơn thời gian cũ
      // QUAN TRỌNG: Không ghi đè thời gian đã lưu bằng 0
      if (currentTime > 0 && currentTime > existingRecord.watchedDuration) {
        existingRecord.watchedDuration = currentTime;
        existingRecord.totalDuration = duration || existingRecord.totalDuration;
        await existingRecord.save();

        logger.info(
          `Updated watch history for movie ${movieId}, user ${userId}, time: ${currentTime}s`,
        );
      } else {
        logger.debug(
          `Skipped updating watch history: current time (${currentTime}) <= existing time (${existingRecord.watchedDuration})`,
        );
      }

      return successResponse(
        res,
        existingRecord,
        "Đã cập nhật lịch sử xem phim",
      );
    }

    // Tạo bản ghi mới
    const movieWatched = await MovieWatched.create({
      user: userId,
      movie: movieId,
      totalDuration: duration || 0,
      watchedDuration: currentTime || 0,
    });

    return successResponse(
      res,
      movieWatched,
      "Đã tạo lịch sử xem phim mới",
      201,
    );
  } catch (error) {
    logger.error(`Error in createMovieWatched: ${error.message}`);
    return errorResponse(res, "Lỗi server", 500, { details: error.message });
  }
};

exports.updateWatchedDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchedDuration, totalDuration } = req.body;

    const movieWatched = await MovieWatched.findByIdAndUpdate(
      id,
      { watchedDuration, totalDuration },
      { new: true },
    );

    if (!movieWatched) {
      return errorResponse(res, "Khong tim thay movieWatched", 404);
    }

    return successResponse(res, movieWatched, "Watch history updated");
  } catch (error) {
    return errorResponse(res, "Loi server", 500);
  }
};

exports.getWatchedDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const movieWatched = await MovieWatched.findById(id);
    if (!movieWatched) {
      return errorResponse(res, "Khong tim thay phim da xem", 404);
    }

    return successResponse(
      res,
      { watchedDuration: movieWatched.watchedDuration },
      "Watched duration fetched",
    );
  } catch (error) {
    return errorResponse(res, "Loi server", 500);
  }
};

exports.getMovieWatchedByUserIdAndMovieId = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    logger.info(
      `Getting watch history for userId: ${userId}, movieId: ${movieId}`,
    );

    const movieWatched = await MovieWatched.findOne({
      user: userId,
      movie: movieId,
    });

    if (!movieWatched) {
      logger.info(
        `No watch history found for userId: ${userId}, movieId: ${movieId}`,
      );
      return successResponse(
        res,
        null,
        "Chưa có lịch sử xem phim",
        200,
        {
          found: false,
        },
      );
    }

    const percentWatched =
      movieWatched.totalDuration > 0
        ? (movieWatched.watchedDuration / movieWatched.totalDuration) * 100
        : 0;

    const responseData = {
      ...movieWatched._doc,
      percentWatched: Math.round(percentWatched),
    };

    logger.info(
      `Found watch history for userId: ${userId}, movieId: ${movieId}`,
    );

    return successResponse(
      res,
      responseData,
      "Đã tìm thấy lịch sử xem phim",
      200,
      {
        found: true,
      },
    );
  } catch (error) {
    logger.error(
      `Error in getMovieWatchedByUserIdAndMovieId: ${error.message}`,
    );
    return errorResponse(res, "Lỗi server", 500, { details: error.message });
  }
};

exports.getContinueWatchingByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const records = await MovieWatched.find({ user: userId })
      .populate({
        path: "movie",
        select: "_id name slug poster_url year rating views categories time",
      })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit, 10));

    const data = records
      .filter((item) => item.movie)
      .filter((item) => (item.watchedDuration || 0) > 0)
      .filter(
        (item) =>
          !item.totalDuration ||
          (item.watchedDuration || 0) < item.totalDuration,
      )
      .map((item) => ({
        _id: item._id,
        movie: item.movie,
        watchedDuration: item.watchedDuration,
        totalDuration: item.totalDuration,
        percentWatched:
          item.totalDuration > 0
            ? Math.round((item.watchedDuration / item.totalDuration) * 100)
            : 0,
        updatedAt: item.updatedAt,
      }));

    return successResponse(res, data, "Continue watching fetched");
  } catch (error) {
    logger.error(`Error in getContinueWatchingByUserId: ${error.message}`);
    return errorResponse(res, "Lỗi server", 500, { details: error.message });
  }
};

exports.resetMovieWatched = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const movieWatched = await MovieWatched.findOne({
      user: userId,
      movie: movieId,
    });

    if (!movieWatched) {
      return errorResponse(res, "Không tìm thấy lịch sử xem phim", 404);
    }

    movieWatched.watchedDuration = 0;
    await movieWatched.save();

    return successResponse(res, movieWatched, "Đã reset lịch sử xem phim");
  } catch (error) {
    logger.error(`Error in resetMovieWatched: ${error.message}`);
    return errorResponse(res, "Lỗi server", 500, { details: error.message });
  }
};
