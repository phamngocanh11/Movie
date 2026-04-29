const User = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const Movie = require("../models/movies");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../config/logger");
const {
  validateEmail,
  validateUsername,
  validatePassword,
  validateName,
} = require("../utils/validation");
const emailService = require("../services/emailService");
const {
  generateVerificationToken,
  verifyVerificationToken,
  getTokenExpirationDate,
  isTokenExpired,
} = require("../utils/tokenUtils");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" },
  );
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User khong duoc tim thay" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ message: "User khong duoc tim thay" });

    return res.json({ message: "Nguoi dung xoa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user)
      return res.status(404).json({ message: "User khong duoc tim thay" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      logger.warn(`Login attempt with missing credentials: ${username}`);
      return res
        .status(400)
        .json({ message: "Username và password không được để trống" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login attempt with non-existent user: ${username}`);
      return res.status(404).json({ message: "User khong ton tai" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      logger.warn(`Failed login attempt for user: ${username}`);
      return res.status(400).json({ message: "Sai mat khau" });
    }

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in successfully: ${username}`);
    return res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error(`Login error for user ${username}: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    // Validation
    if (!name || !username || !email || !password) {
      logger.warn(`Register attempt with missing fields`);
      return res
        .status(400)
        .json({ message: "Tất cả các trường không được để trống" });
    }

    if (!validateName(name)) {
      logger.warn(`Register attempt with invalid name: ${name}`);
      return res.status(400).json({ message: "Tên phải từ 2-50 ký tự" });
    }

    if (!validateUsername(username)) {
      logger.warn(`Register attempt with invalid username: ${username}`);
      return res
        .status(400)
        .json({
          message:
            "Username phải từ 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới",
        });
    }

    if (!validateEmail(email)) {
      logger.warn(`Register attempt with invalid email: ${email}`);
      return res.status(400).json({ message: "Email không hợp lệ" });
    }

    if (!validatePassword(password)) {
      logger.warn(`Register attempt with weak password for user: ${username}`);
      return res
        .status(400)
        .json({
          message:
            "Password phải ít nhất 6 ký tự, chứa chữ hoa, chữ thường và số",
        });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      logger.warn(
        `Register attempt with existing user: ${username} or email: ${email}`,
      );
      return res.status(400).json({ message: "Nguoi dung da ton tai" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate JWT Payload for email verification
    const verificationToken = generateVerificationToken(null, email);
    const tokenExpiry = getTokenExpirationDate(24);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar:
        "https://res.cloudinary.com/dprthmqgl/image/upload/v1708944715/avatars/fe4uocps0ibylndvppk9.webp",
      movieWatched: [],
      favourite: [],
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: tokenExpiry,
    });

    await user.save();

    // Update token with actual userId
    const updatedVerificationToken = generateVerificationToken(user._id, email);
    user.emailVerificationToken = updatedVerificationToken;
    await user.save();

    // Build verification link
    const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${updatedVerificationToken}`;

    // Send verification email via Email Transport
    try {
      await emailService.sendVerificationEmail(email, verificationLink, name);
      logger.info(`Verification email sent to: ${email}`);
    } catch (emailError) {
      logger.error(`Failed to send verification email: ${emailError.message}`);
      // Don't fail registration if email fails
      // User can request resend later
    }

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;

    logger.info(`New user registered: ${username}`);
    return res.status(201).json({
      success: true,
      token,
      user: userResponse,
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    let avatar = null;

    if (req.file) {
      avatar = req.file.path;
    }

    let existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User khong ton tai" });
    }

    let updatedFields = {};

    if (name !== undefined && name !== existingUser.name) {
      updatedFields.name = name;
    }

    if (email !== undefined && email !== existingUser.email) {
      updatedFields.email = email;
    }

    if (password !== undefined) {
      const isPasswordChanged = bcrypt.compareSync(
        password,
        existingUser.password,
      );
      if (!isPasswordChanged) {
        updatedFields.password = bcrypt.hashSync(password, 10);
      }
    }

    if (role !== undefined && role !== existingUser.role) {
      updatedFields.role = role;
    }

    if (avatar) {
      const cloudinaryResponse = await cloudinary.uploader.upload(avatar);
      updatedFields.avatar = cloudinaryResponse.secure_url;
    }

    if (Object.keys(updatedFields).length > 0) {
      existingUser = await User.findByIdAndUpdate(id, updatedFields, {
        new: true,
      }).select("-password");
      res.json({
        message: "User cap nhat thanh cong",
        user: existingUser,
      });
    } else {
      res.json({ message: "Khong co gi thay doi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Password không được để trống" });
    }

    if (!validatePassword(newPassword)) {
      return res
        .status(400)
        .json({
          message:
            "Password phải ít nhất 6 ký tự, chứa chữ hoa, chữ thường và số",
        });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User khong ton tai" });
    }

    const isPasswordChanged = bcrypt.compareSync(
      newPassword,
      existingUser.password,
    );
    if (isPasswordChanged) {
      return res
        .status(400)
        .json({ message: "Mat khau moi trung voi mat khau cu" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return res.json({ message: "Mat khau da duoc cap nhat" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const watchMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin userId hoặc movieId",
      });
    }

    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return res.status(404).json({
        success: false,
        message: "User hoặc Movie không tồn tại",
      });
    }

    // Thêm phim vào danh sách đã xem nếu chưa có
    if (!existingUser.movieWatched.includes(movieId)) {
      existingUser.movieWatched.push(movieId);
      await existingUser.save();
      console.log(`Added movie ${movieId} to user ${userId} watched list`);
    }

    // Tăng lượt xem phim
    existingMovie.views = (existingMovie.views || 0) + 1;
    await existingMovie.save();

    return res.status(200).json({
      success: true,
      message: "Đã thêm phim vào danh sách đã xem và tăng lượt xem",
    });
  } catch (error) {
    console.error("Error in watchMovie:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    console.log("Add Favorite Request:", { userId, movieId }); // Thêm log để debug

    if (!userId || !movieId) {
      return res.status(400).json({
        error: true,
        message: "Thiếu thông tin userId hoặc movieId",
      });
    }

    // Kiểm tra định dạng ObjectId hợp lệ
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(movieId)
    ) {
      return res.status(400).json({
        error: true,
        message: "Định dạng ID không hợp lệ",
      });
    }

    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return res.status(404).json({
        error: true,
        message: "User hoặc Movie không tồn tại",
      });
    }

    // Convert ObjectId to string for comparison
    const favoriteIds = existingUser.favourite.map((id) => id.toString());
    if (favoriteIds.includes(movieId.toString())) {
      // Nếu đã tồn tại, không báo lỗi mà trả về thành công luôn
      return res.status(200).json({
        success: true,
        message: "Phim đã có trong danh sách yêu thích",
      });
    }

    existingUser.favourite.push(movieId);
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Đã thêm vào danh sách yêu thích thành công",
    });
  } catch (error) {
    console.error("Add Favorite Error:", error); // Thêm log để debug
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return res.status(404).json({ message: "User hoặc Movie không tồn tại" });
    }

    if (!existingUser.favourite.includes(movieId)) {
      return res
        .status(400)
        .json({ message: "Phim không có trong danh sách yêu thích" });
    }

    existingUser.favourite = existingUser.favourite.filter(
      (item) => item != movieId,
    );
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Đã xóa khỏi danh sách yêu thích thành công",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return res.status(404).json({ message: "User hoặc Movie không tồn tại" });
    }

    const isFavorite = existingUser.favourite.includes(movieId);

    return res.status(200).json({
      isFavorite,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(404).json({ message: "User khong ton tai" });
    }

    // tao mật khẩu ramdom mới
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // cập nhật mật khẩu mới vào database
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    // gửi email thông báo mật khẩu mới
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "testmail31012002@gmail.com",
      to: user.email,
      subject: "Mat khau moi",
      text: `Mat khau moi cua ban la: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.json({
        message: "Mat khau moi da duoc gui toi email cua ban",
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "favourite",
      select: "_id name poster_url year rating",
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({
      success: true,
      data: user.favourite || [],
    });
  } catch (error) {
    console.error("Error in getUserFavorites:", error);
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // Token validation happens in middleware
    // Client should clear token from localStorage/sessionStorage
    return res.status(200).json({
      success: true,
      message: "Đã đăng xuất thành công",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Verify Email - Main email verification endpoint
 * Validates the JWT verification token and marks email as verified
 *
 * Error Handling:
 * - Invalid/expired tokens: Return 400/401 with specific error messages
 * - User not found: Return 404
 * - Database errors: Return 500
 */
const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      logger.warn("Email verification attempted without token");
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Verify JWT Payload and Token Expiration
    let decoded;
    try {
      decoded = verifyVerificationToken(token);
    } catch (error) {
      if (error.message.includes("expired")) {
        logger.warn(`Token Expiration exceeded for verification attempt`);
        return res.status(401).json({
          success: false,
          message: "Verification token has expired. Please request a new one.",
          code: "TOKEN_EXPIRED",
          resendLink: "/api/users/resend-verification",
        });
      }
      logger.warn(`Invalid verification token: ${error.message}`);
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
        code: "INVALID_TOKEN",
      });
    }

    // Find user by decoded userId
    const user = await User.findById(decoded.id);

    if (!user) {
      logger.warn(`User not found during email verification for ID: ${decoded.id}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      logger.info(`Email already verified for user: ${user.username}`);
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
      });
    }

    // Verify token stored in database matches
    if (user.emailVerificationToken !== token) {
      logger.warn(`Token mismatch during verification for user: ${user.username}`);
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
        code: "TOKEN_MISMATCH",
      });
    }

    // Check Token Expiration in database
    if (isTokenExpired(user.emailVerificationTokenExpiry)) {
      logger.warn(`Token Expiration exceeded for user: ${user.username}`);
      return res.status(401).json({
        success: false,
        message: "Verification token has expired. Please request a new one.",
        code: "TOKEN_EXPIRED",
        resendLink: "/api/users/resend-verification",
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    logger.info(`Email verified successfully for user: ${user.username}`);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully. Your account is now active.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error during email verification",
    });
  }
};

/**
 * Resend Verification Email - Generates new token and sends email
 * Allows users to request a new verification email if the previous one expired
 *
 * Error Handling:
 * - User not found: Return 404
 * - Already verified: Return 200 with info message
 * - Email send failure: Return 500 but don't expose transporter details
 */
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      logger.warn("Resend verification attempted without email");
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Resend verification attempted for non-existent email: ${email}`);
      // Don't reveal whether email exists for security
      return res.status(200).json({
        success: true,
        message: "If the email exists, a verification link has been sent.",
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      logger.info(`Resend verification requested for already verified email: ${email}`);
      return res.status(200).json({
        success: true,
        message: "This email is already verified.",
      });
    }

    // Generate new JWT Payload and Token Expiration
    const newVerificationToken = generateVerificationToken(user._id, email);
    const newTokenExpiry = getTokenExpirationDate(24);

    user.emailVerificationToken = newVerificationToken;
    user.emailVerificationTokenExpiry = newTokenExpiry;
    await user.save();

    // Build verification link
    const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${newVerificationToken}`;

    // Send verification email via Email Transport
    try {
      await emailService.sendVerificationEmail(email, verificationLink, user.name);
      logger.info(`Verification email resent to: ${email}`);
      return res.status(200).json({
        success: true,
        message: "Verification email has been sent. Please check your inbox.",
      });
    } catch (emailError) {
      logger.error(`Failed to resend verification email to ${email}: ${emailError.message}`);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
      });
    }
  } catch (error) {
    logger.error(`Resend verification error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error during verification email resend",
    });
  }
};

/**
 * Check Email Verification Status - Allows clients to check if email is verified
 * Useful for frontend to display verification status
 */
const checkEmailVerificationStatus = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`Email verification status checked for user: ${user.username}`);
    return res.status(200).json({
      success: true,
      isEmailVerified: user.isEmailVerified,
      email: user.email,
    });
  } catch (error) {
    logger.error(`Check email verification status error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllUser,
  getUserById,
  deleteUser,
  getUserByUsername,
  login,
  register,
  updateUser,
  changePassword,
  watchMovie,
  addFavorite,
  removeFavorite,
  isFavorite,
  forgotPassword,
  getUserFavorites,
  logout,
  verifyEmail,
  resendVerificationEmail,
  checkEmailVerificationStatus,
};
