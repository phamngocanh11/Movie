const User = require("../models/user");
const bcrypt = require("bcrypt");
const Movie = require("../models/movies");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
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
const { successResponse, errorResponse } = require("../utils/apiResponse");

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
};

const normalizeGoogleUsername = async (email) => {
  const baseUsername = (email || "google-user")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20) || "google-user";

  let candidate = baseUsername;
  let suffix = 1;

  while (await User.findOne({ username: candidate })) {
    candidate = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const createGoogleFallbackPassword = () => {
  const randomPassword = crypto.randomBytes(24).toString("hex");
  return bcrypt.hashSync(randomPassword, 10);
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return successResponse(res, users, "Users fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return errorResponse(res, "User khong duoc tim thay", 404);
    }

    return successResponse(res, user, "User fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return errorResponse(res, "User khong duoc tim thay", 404);
    }

    return successResponse(res, {}, "Nguoi dung xoa thanh cong");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return errorResponse(res, "User khong duoc tim thay", 404);
    }

    return successResponse(res, user, "User fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      logger.warn(`Login attempt with missing credentials: ${username}`);
      return errorResponse(
        res,
        "Username và password không được để trống",
        400,
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login attempt with non-existent user: ${username}`);
      return errorResponse(res, "User khong ton tai", 404);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      logger.warn(`Failed login attempt for user: ${username}`);
      return errorResponse(res, "Sai mat khau", 400);
    }

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in successfully: ${username}`);
    return successResponse(res, userResponse, "Login successful", 200, {
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error(`Login error for user ${username}: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const register = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    // Validation
    if (!name || !username || !email || !password) {
      logger.warn(`Register attempt with missing fields`);
      return errorResponse(res, "Tất cả các trường không được để trống", 400);
    }

    if (!validateName(name)) {
      logger.warn(`Register attempt with invalid name: ${name}`);
      return errorResponse(res, "Tên phải từ 2-50 ký tự", 400);
    }

    if (!validateUsername(username)) {
      logger.warn(`Register attempt with invalid username: ${username}`);
      return errorResponse(
        res,
        "Username phải từ 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới",
        400,
      );
    }

    if (!validateEmail(email)) {
      logger.warn(`Register attempt with invalid email: ${email}`);
      return errorResponse(res, "Email không hợp lệ", 400);
    }

    if (!validatePassword(password)) {
      logger.warn(`Register attempt with weak password for user: ${username}`);
      return errorResponse(
        res,
        "Password phải ít nhất 6 ký tự, chứa chữ hoa, chữ thường và số",
        400,
      );
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      logger.warn(
        `Register attempt with existing user: ${username} or email: ${email}`,
      );
      return errorResponse(res, "Nguoi dung da ton tai", 400);
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
        req.file?.path ||
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
    return successResponse(
      res,
      userResponse,
      "Registration successful. Please check your email to verify your account.",
      201,
      {
        token,
        user: userResponse,
      },
    );
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    let existingUser = await User.findById(id);
    if (!existingUser) {
      return errorResponse(res, "User khong ton tai", 404);
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

    if (req.file?.path) {
      updatedFields.avatar = req.file.path;
    }

    if (Object.keys(updatedFields).length > 0) {
      existingUser = await User.findByIdAndUpdate(id, updatedFields, {
        new: true,
      }).select("-password");
      return successResponse(
        res,
        existingUser,
        "User cap nhat thanh cong",
        200,
        {
          user: existingUser,
        },
      );
    }

    return successResponse(res, null, "Khong co gi thay doi");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return errorResponse(res, "Thiếu credential Google", 400);
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return errorResponse(res, "Google client id chưa được cấu hình", 500);
    }

    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
        credential,
      )}`,
    );

    if (!tokenInfoResponse.ok) {
      return errorResponse(res, "Google token không hợp lệ", 401);
    }

    const tokenInfo = await tokenInfoResponse.json();

    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return errorResponse(res, "Google token không khớp ứng dụng", 401);
    }

    if (tokenInfo.email_verified !== "true" && tokenInfo.email_verified !== true) {
      return errorResponse(res, "Email Google chưa được xác minh", 401);
    }

    const email = tokenInfo.email;
    const googleId = tokenInfo.sub;
    const displayName = tokenInfo.name || tokenInfo.given_name || email.split("@")[0];
    const avatar = tokenInfo.picture || "";

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      const username = await normalizeGoogleUsername(email);
      user = new User({
        name: displayName,
        username,
        email,
        googleId,
        password: createGoogleFallbackPassword(),
        role: "user",
        avatar,
        movieWatched: [],
        favourite: [],
        isEmailVerified: true,
      });
    } else {
      user.googleId = googleId;
      user.name = user.name || displayName;
      
      // Chỉ lấy avatar từ Google nếu user chưa có avatar hoặc đang dùng avatar mặc định
      if (!user.avatar || user.avatar.includes("fe4uocps0ibylndvppk9.webp")) {
        user.avatar = avatar || user.avatar;
      }
      
      user.isEmailVerified = true;
    }

    await user.save();

    const token = generateToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;

    return successResponse(res, userResponse, "Google login successful", 200, {
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error(`Google login error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return errorResponse(res, "Password không được để trống", 400);
    }

    if (!validatePassword(newPassword)) {
      return errorResponse(
        res,
        "Password phải ít nhất 6 ký tự, chứa chữ hoa, chữ thường và số",
        400,
      );
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return errorResponse(res, "User khong ton tai", 404);
    }

    const isPasswordChanged = bcrypt.compareSync(
      newPassword,
      existingUser.password,
    );
    if (isPasswordChanged) {
      return errorResponse(res, "Mat khau moi trung voi mat khau cu", 400);
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return successResponse(res, null, "Mat khau da duoc cap nhat");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const watchMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return errorResponse(res, "Thiếu thông tin userId hoặc movieId", 400);
    }

    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return errorResponse(res, "User hoặc Movie không tồn tại", 404);
    }

    if (!existingUser.movieWatched.includes(movieId)) {
      existingUser.movieWatched.push(movieId);
      await existingUser.save();
      logger.info(`Added movie ${movieId} to user ${userId} watched list`);
    }

    existingMovie.views = (existingMovie.views || 0) + 1;
    await existingMovie.save();

    return successResponse(
      res,
      null,
      "Đã thêm phim vào danh sách đã xem và tăng lượt xem",
    );
  } catch (error) {
    logger.error(`Error in watchMovie: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const addFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    logger.info(
      `Add Favorite Request - userId: ${userId}, movieId: ${movieId}`,
    );

    if (!userId || !movieId) {
      return errorResponse(res, "Thiếu thông tin userId hoặc movieId", 400);
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(movieId)
    ) {
      return errorResponse(res, "Định dạng ID không hợp lệ", 400);
    }

    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return errorResponse(res, "User hoặc Movie không tồn tại", 404);
    }

    const favoriteIds = existingUser.favourite.map((id) => id.toString());
    if (favoriteIds.includes(movieId.toString())) {
      return successResponse(res, null, "Phim đã có trong danh sách yêu thích");
    }

    existingUser.favourite.push(movieId);
    await existingUser.save();

    return successResponse(
      res,
      null,
      "Đã thêm vào danh sách yêu thích thành công",
    );
  } catch (error) {
    logger.error(`Add Favorite Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return errorResponse(res, "User hoặc Movie không tồn tại", 404);
    }

    if (!existingUser.favourite.includes(movieId)) {
      return errorResponse(res, "Phim không có trong danh sách yêu thích", 400);
    }

    existingUser.favourite = existingUser.favourite.filter(
      (item) => item != movieId,
    );
    await existingUser.save();

    return successResponse(
      res,
      null,
      "Đã xóa khỏi danh sách yêu thích thành công",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const isFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const existingUser = await User.findById(userId);
    const existingMovie = await Movie.findById(movieId);

    if (!existingUser || !existingMovie) {
      return errorResponse(res, "User hoặc Movie không tồn tại", 404);
    }

    const isFavoriteValue = existingUser.favourite.includes(movieId);

    return successResponse(
      res,
      { isFavorite: isFavoriteValue },
      "Favorite status fetched",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const forgotPassword = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username, email });

    if (!user) {
      return errorResponse(res, "User khong ton tai", 404);
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        purpose: "password_reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${encodeURIComponent(resetToken)}`;

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

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
      subject: "Dat lai mat khau",
      text: `Vui long truy cap lien ket sau de dat lai mat khau trong 15 phut: ${resetLink}`,
      html: `
        <p>Xin chao ${user.name || user.username},</p>
        <p>Vui long bam vao lien ket ben duoi de dat lai mat khau. Lien ket co hieu luc trong 15 phut.</p>
        <p><a href="${resetLink}">Dat lai mat khau</a></p>
        <p>Neu ban khong yeu cau thao tac nay, hay bo qua email nay.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return errorResponse(res, error.message, 500);
      }
      return successResponse(
        res,
        null,
        "Link dat lai mat khau da duoc gui toi email cua ban",
      );
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return errorResponse(res, "Token và mật khẩu mới không được để trống", 400);
    }

    if (!validatePassword(newPassword)) {
      return errorResponse(
        res,
        "Password phải ít nhất 6 ký tự, chứa chữ hoa, chữ thường và số",
        400,
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "password_reset") {
      return errorResponse(res, "Token không hợp lệ", 400);
    }

    const user = await User.findOne({
      _id: decoded.id,
      email: decoded.email,
      passwordResetToken: token,
      passwordResetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return errorResponse(res, "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn", 400);
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    await user.save();

    return successResponse(res, null, "Mật khẩu đã được đặt lại thành công");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Token đặt lại mật khẩu đã hết hạn", 401);
    }

    return errorResponse(res, error.message, 500);
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
      return errorResponse(res, "Không tìm thấy người dùng", 404);
    }

    return successResponse(res, user.favourite || [], "User favorites fetched");
  } catch (error) {
    logger.error(`Error in getUserFavorites: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

const logout = async (req, res) => {
  try {
    // Token validation happens in middleware
    // Client should clear token from localStorage/sessionStorage
    return successResponse(res, null, "Đã đăng xuất thành công");
  } catch (error) {
    return errorResponse(res, error.message, 500);
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
      logger.warn(
        `User not found during email verification for ID: ${decoded.id}`,
      );
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
      logger.warn(
        `Token mismatch during verification for user: ${user.username}`,
      );
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
      logger.warn(
        `Resend verification attempted for non-existent email: ${email}`,
      );
      // Don't reveal whether email exists for security
      return res.status(200).json({
        success: true,
        message: "If the email exists, a verification link has been sent.",
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      logger.info(
        `Resend verification requested for already verified email: ${email}`,
      );
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
      await emailService.sendVerificationEmail(
        email,
        verificationLink,
        user.name,
      );
      logger.info(`Verification email resent to: ${email}`);
      return res.status(200).json({
        success: true,
        message: "Verification email has been sent. Please check your inbox.",
      });
    } catch (emailError) {
      logger.error(
        `Failed to resend verification email to ${email}: ${emailError.message}`,
      );
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
  resetPassword,
  getUserFavorites,
  logout,
  verifyEmail,
  resendVerificationEmail,
  checkEmailVerificationStatus,
  googleLogin,
};
