const MovieWatched = require("../models/movieWatched");
const User = require("../models/user");

exports.createMovieWatched = async (req, res) => {
  try {
    const { userId, movieId, currentTime, duration } = req.body;
    
    // Kiểm tra tham số
    if (!userId || !movieId) {
      return res.status(400).json({ 
        success: false,
        message: "Thiếu thông tin userId hoặc movieId" 
      });
    }
    
    console.log("Creating watch history:", { userId, movieId, currentTime, duration });
    
    // Cập nhật User Model để thêm phim vào danh sách đã xem
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy người dùng" 
      });
    }
    
    // Thêm phim vào danh sách movieWatched nếu chưa có
    const movieWatchedIds = user.movieWatched.map(id => id.toString());
    if (!movieWatchedIds.includes(movieId.toString())) {
      user.movieWatched.push(movieId);
      await user.save();
      console.log(`Added movie ${movieId} to user ${userId} watched list`);
    }

    // Kiểm tra và cập nhật bản ghi MovieWatched
    const existingRecord = await MovieWatched.findOne({ 
      user: userId, 
      movie: movieId 
    });

    if (existingRecord) {
      // Chỉ cập nhật nếu thời gian mới lớn hơn 0 và lớn hơn thời gian cũ
      // QUAN TRỌNG: Không ghi đè thời gian đã lưu bằng 0
      if (currentTime > 0 && currentTime > existingRecord.watchedDuration) {
        existingRecord.watchedDuration = currentTime;
        existingRecord.totalDuration = duration || existingRecord.totalDuration;
        await existingRecord.save();
        
        console.log(`Updated watch history for movie ${movieId}, user ${userId}, time: ${currentTime}s`);
      } else {
        console.log(`Skipped updating watch history: current time (${currentTime}) <= existing time (${existingRecord.watchedDuration})`);
      }
      
      return res.status(200).json({
        success: true,
        data: existingRecord,
        message: "Đã cập nhật lịch sử xem phim"
      });
    }

    // Tạo bản ghi mới
    const movieWatched = await MovieWatched.create({
      user: userId,
      movie: movieId,
      totalDuration: duration || 0,
      watchedDuration: currentTime || 0,
    });
    
    res.status(201).json({
      success: true,
      data: movieWatched,
      message: "Đã tạo lịch sử xem phim mới"
    });
  } catch (error) {
    console.error("Error in createMovieWatched:", error);
    res.status(500).json({ 
      success: false,
      error: "Lỗi server", 
      details: error.message 
    });
  }
};

exports.updateWatchedDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchedDuration, totalDuration } = req.body;

    const movieWatched = await MovieWatched.findByIdAndUpdate(
      id,
      { watchedDuration, totalDuration },
      { new: true }
    );

    if (!movieWatched) {
      return res.status(404).json({ error: "Khong tim thay movieWatched" });
    }

    res.json(movieWatched);
  } catch (error) {
    res.status(500).json({ error: "Loi server" });
  }
};

exports.getWatchedDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const movieWatched = await MovieWatched.findById(id);
    if (!movieWatched) {
      return res.status(404).json({ error: "Khong tim thay phim da xem" });
    }
    res.json({ watchedDuration: movieWatched.watchedDuration });
  } catch (error) {
    res.status(500).json({ error: "Loi server" });
  }
};

exports.getMovieWatchedByUserIdAndMovieId = async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    
    console.log(`Server: Getting watch history for userId: ${userId}, movieId: ${movieId}`);
    
    const movieWatched = await MovieWatched.findOne({ 
      user: userId, 
      movie: movieId 
    });
    
    if (!movieWatched) {
      console.log(`Server: No watch history found for userId: ${userId}, movieId: ${movieId}`);
      return res.status(404).json({ 
        success: false,
        found: false,
        message: "Chưa có lịch sử xem phim" 
      });
    }
    
    const percentWatched = movieWatched.totalDuration > 0 
      ? (movieWatched.watchedDuration / movieWatched.totalDuration) * 100 
      : 0;
    
    const responseData = {
      success: true,
      found: true,
      data: {
        ...movieWatched._doc,
        percentWatched: Math.round(percentWatched)
      },
      message: "Đã tìm thấy lịch sử xem phim"
    };
    
    console.log(`Server: Found watch history:`, JSON.stringify(responseData));
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getMovieWatchedByUserIdAndMovieId:", error);
    res.status(500).json({ error: "Lỗi server", details: error.message });
  }
};

exports.resetMovieWatched = async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    
    const movieWatched = await MovieWatched.findOne({ 
      user: userId, 
      movie: movieId 
    });
    
    if (!movieWatched) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy lịch sử xem phim" 
      });
    }
    
    movieWatched.watchedDuration = 0;
    await movieWatched.save();
    
    res.status(200).json({
      success: true,
      data: movieWatched,
      message: "Đã reset lịch sử xem phim"
    });
  } catch (error) {
    console.error("Error in resetMovieWatched:", error);
    res.status(500).json({ error: "Lỗi server", details: error.message });
  }
};
