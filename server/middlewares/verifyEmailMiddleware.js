const logger = require("../config/logger");

/**
 * Email Verification Middleware
 * Checks if user's email is verified before granting access to protected resources
 *
 * Usage:
 *   router.post("/protected-route", verifyToken, verifyEmailMiddleware, controller);
 */
const verifyEmailMiddleware = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      logger.warn("Middleware: User not found in request");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      logger.warn(`Email verification check failed for user: ${user.id}`);
      return res.status(403).json({
        success: false,
        message:
          "Email verification required. Please verify your email to continue.",
        code: "EMAIL_NOT_VERIFIED",
        resendLink: "/api/users/resend-verification",
      });
    }

    logger.info(`Email verified for user: ${user.id}`);
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
