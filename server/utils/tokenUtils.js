const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

/**
 * JWT Token Generator for Email Verification
 * Handles generation and verification of email verification tokens
 *
 * Domain-specific terms:
 * - JWT Payload: Data encoded in the token (userId, email, purpose)
 * - Token Expiration: Time-to-live for the token (24 hours)
 * - Token Signature: HMAC signature for token integrity verification
 */

/**
 * Generate Email Verification Token
 * Creates a JWT Payload with user data and 24-hour expiration
 *
 * @param {string} userId - MongoDB user ID
 * @param {string} email - User email address
 * @returns {string} Signed JWT token
 * @throws {Error} If token generation fails
 */
const generateVerificationToken = (userId, email) => {
  try {
    const jwtPayload = {
      id: userId,
      email: email,
      purpose: "email_verification",
      iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    const token = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }, // Token Expiration: 24 hours
    );

    logger.info(`Verification token generated for user: ${userId}`);
    return token;
  } catch (error) {
    logger.error(
      `Failed to generate verification token for ${userId}:`,
      error.message,
    );
    throw new Error("Token generation failed");
  }
};

/**
 * Verify Email Verification Token
 * Validates JWT signature, expiration, and payload
 *
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded JWT Payload or null if invalid
 * @throws {Error} Detailed error about token validation failure
 */
const verifyVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Validate JWT Payload purpose
    if (decoded.purpose !== "email_verification") {
      throw new Error("Invalid token purpose");
    }

    logger.info(`Verification token verified for user: ${decoded.id}`);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn("Token Expiration exceeded:", error.message);
      throw new Error("Email verification token has expired");
    } else if (error.name === "JsonWebTokenError") {
      logger.warn("Invalid token signature:", error.message);
      throw new Error("Invalid verification token");
    }
    throw error;
  }
};

/**
 * Calculate Token Expiration timestamp
 * Returns MongoDB-compatible Date for token expiration
 *
 * @param {number} hours - Hours until expiration (default: 24)
 * @returns {Date} Expiration timestamp
 */
const getTokenExpirationDate = (hours = 24) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

/**
 * Check if token is expired
 * Compares Token Expiration with current time
 *
 * @param {Date} expiryDate - Token expiration date
 * @returns {boolean} True if expired
 */
const isTokenExpired = (expiryDate) => {
  return new Date() > expiryDate;
};

module.exports = {
  generateVerificationToken,
  verifyVerificationToken,
  getTokenExpirationDate,
  isTokenExpired,
};
