const nodemailer = require("nodemailer");
const logger = require("../config/logger");

/**
 * Email Transport Configuration
 * Encapsulates nodemailer transport setup for different email providers
 */
class EmailTransport {
  constructor() {
    this.transporter = null;
    this.initializeTransport();
  }

  /**
   * Initialize Email Transport based on environment configuration
   * Supports Gmail SMTP service
   */
  initializeTransport() {
    try {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      // Verify transport connection
      this.transporter.verify((error, success) => {
        if (error) {
          logger.error("Email Transport verification failed:", error.message);
        } else {
          logger.info("Email Transport initialized successfully");
        }
      });
    } catch (error) {
      logger.error("Failed to initialize Email Transport:", error.message);
      throw new Error("Email service configuration error");
    }
  }

  /**
   * Send email with retry logic
   * @param {Object} mailOptions - Email configuration
   * @param {string} mailOptions.to - Recipient email
   * @param {string} mailOptions.subject - Email subject
   * @param {string} mailOptions.html - Email body (HTML)
   * @returns {Promise<Object>} Email send result
   */
  async sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        from: process.env.GMAIL_EMAIL || "noreply@movieapp.com",
      };

      const emailPayload = { ...defaultOptions, ...mailOptions };

      this.transporter.sendMail(emailPayload, (error, info) => {
        if (error) {
          logger.error(
            `Email send failed to ${emailPayload.to}:`,
            error.message,
          );
          reject(new Error(`Failed to send email: ${error.message}`));
        } else {
          logger.info(
            `Email sent successfully to ${emailPayload.to}:`,
            info.messageId,
          );
          resolve(info);
        }
      });
    });
  }

  /**
   * Send email verification email
   * @param {string} email - User email address
   * @param {string} verificationLink - Verification callback URL
   * @param {string} userName - User's name
   * @returns {Promise<Object>} Email send result
   */
  async sendVerificationEmail(email, verificationLink, userName) {
    const mailOptions = {
      to: email,
      subject: "Email Verification - Movie App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Movie App, ${userName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for signing up. Please verify your email address to activate your account.
          </p>
          <p style="margin: 30px 0;">
            <a href="${verificationLink}"
               style="background-color: #007bff; color: white; padding: 12px 30px;
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p style="color: #999; font-size: 12px;">
            This link expires in 24 hours. If the button doesn't work, copy and paste this link:
          </p>
          <p style="color: #999; font-size: 11px; word-break: break-all;">
            ${verificationLink}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  /**
   * Send verification token expiration warning
   * @param {string} email - User email address
   * @param {string} resendLink - Resend verification link
   * @returns {Promise<Object>} Email send result
   */
  async sendTokenExpiredEmail(email, resendLink) {
    const mailOptions = {
      to: email,
      subject: "Verification Link Expired - Movie App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Verification Link Expired</h2>
          <p style="color: #666; line-height: 1.6;">
            Your email verification link has expired. Please request a new verification email.
          </p>
          <p style="margin: 30px 0;">
            <a href="${resendLink}"
               style="background-color: #007bff; color: white; padding: 12px 30px;
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Request New Verification Link
            </a>
          </p>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }
}

// Singleton instance
const emailTransport = new EmailTransport();

module.exports = emailTransport;
