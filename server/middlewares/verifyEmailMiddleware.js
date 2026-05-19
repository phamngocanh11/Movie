const logger = require("../config/logger");
const User = require("../models/user");

/**
 * Email Verification Middleware
 * Checks if user's email is verified before granting access to protected resources
 *
 * Usage:
 *   router.post("/protected-route", verifyToken, verifyEmailMiddleware, controller);
 */
const verifyEmailMiddleware = async (req, res, next) => {
  try {
    const tokenUser = req.user;

    if (!tokenUser || !tokenUser.id) {
      logger.warn("Middleware: User not found in request");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }

    const user = await User.findById(tokenUser.id).select(
      "isEmailVerified email",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      logger.warn(`Email verification check failed for user: ${tokenUser.id}`);
      return res.status(403).json({
        success: false,
        message:
          "Email verification required. Please verify your email to continue.",
        code: "EMAIL_NOT_VERIFIED",
        resendLink: "/api/users/resend-verification",
      });
    }

    logger.info(`Email verified for user: ${tokenUser.id}`);
    next();
  } catch (error) {
    logger.error("Email verification middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during email verification check",
    });
  }
};

module.exports = verifyEmailMiddleware;
