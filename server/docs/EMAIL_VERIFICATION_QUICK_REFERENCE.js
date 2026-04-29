// ============================================================
// EMAIL VERIFICATION WORKFLOW - QUICK REFERENCE GUIDE
// ============================================================

/**
 * IMPORTS & INITIALIZATION
 */

// 1. Email Service (Email Transport)
const emailService = require("../services/emailService");
// Usage: await emailService.sendVerificationEmail(email, link, name);

// 2. Token Utilities (JWT Payload & Token Expiration)
const {
  generateVerificationToken,      // Creates JWT with 24h expiration
  verifyVerificationToken,         // Validates JWT Payload
  getTokenExpirationDate,         // Calculates Token Expiration
  isTokenExpired                  // Checks Token Expiration
} = require("../utils/tokenUtils");

// 3. Email Verification Middleware
const verifyEmailMiddleware = require("../middlewares/verifyEmailMiddleware");
// Usage: router.post("/protected", verifyToken, verifyEmailMiddleware, handler);


/**
 * USER MODEL SCHEMA ADDITIONS
 */

const userSchema = {
  // ... existing fields ...
  isEmailVerified: {
    type: Boolean,
    default: false  // Email not verified on registration
  },
  emailVerificationToken: {
    type: String,
    default: null   // Stores the JWT token
  },
  emailVerificationTokenExpiry: {
    type: Date,
    default: null   // Stores 24-hour expiration deadline
  }
};


/**
 * EMAIL SERVICE (emailService.js)
 */

class EmailTransport {
  // Initialize Email Transport with Gmail SMTP
  initializeTransport() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  }

  // Send email with error handling
  async sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) reject(error);
        else resolve(info);
      });
    });
  }

  // Send verification email with HTML template
  async sendVerificationEmail(email, verificationLink, userName) {
    const mailOptions = {
      to: email,
      subject: "Email Verification - Movie App",
      html: `<p>Welcome ${userName}!</p>
             <a href="${verificationLink}">Verify Email</a>
             <p>Link expires in 24 hours.</p>`
    };
    return this.sendEmail(mailOptions);
  }
}


/**
 * TOKEN UTILITIES (tokenUtils.js)
 */

// Generate JWT Payload with 24h expiration
function generateVerificationToken(userId, email) {
  const jwtPayload = {
    id: userId,
    email: email,
    purpose: "email_verification"  // Prevents token reuse
  };

  return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "24h"  // Token Expiration
  });
}

// Verify JWT and validate payload purpose
function verifyVerificationToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.purpose !== "email_verification") {
    throw new Error("Invalid token purpose");
  }

  return decoded;
}

// Calculate absolute Token Expiration date
function getTokenExpirationDate(hours = 24) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// Check if Token Expiration has passed
function isTokenExpired(expiryDate) {
  return new Date() > expiryDate;
}


/**
 * VERIFICATION MIDDLEWARE (verifyEmailMiddleware.js)
 */

function verifyEmailMiddleware(req, res, next) {
  const user = req.user;

  if (!user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Email verification required.",
      code: "EMAIL_NOT_VERIFIED",
      resendLink: "/api/users/resend-verification"
    });
  }

  next();
}


/**
 * CONTROLLER FUNCTIONS (userController.js)
 */

// 1. REGISTER - Send verification email
async function register(req, res) {
  // ... validation ...

  // Generate JWT Payload
  const verificationToken = generateVerificationToken(null, email);
  const tokenExpiry = getTokenExpirationDate(24);

  const user = new User({
    name, username, email,
    password: bcrypt.hashSync(password, 10),
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpiry: tokenExpiry
  });

  await user.save();

  // Update with actual userId
  const updatedToken = generateVerificationToken(user._id, email);
  user.emailVerificationToken = updatedToken;
  await user.save();

  // Send Email Transport email
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${updatedToken}`;
  await emailService.sendVerificationEmail(email, link, name);

  return res.status(201).json({
    success: true,
    token: generateToken(user),
    message: "Check your email to verify your account."
  });
}

// 2. VERIFY EMAIL - Main verification endpoint
async function verifyEmail(req, res) {
  const { token } = req.body;

  try {
    // Verify JWT Payload and check signature
    const decoded = verifyVerificationToken(token);

    // Find user by decoded ID
    const user = await User.findById(decoded.id);

    // Verify token matches database
    if (user.emailVerificationToken !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
        code: "TOKEN_MISMATCH"
      });
    }

    // Check Token Expiration
    if (isTokenExpired(user.emailVerificationTokenExpiry)) {
      return res.status(401).json({
        success: false,
        message: "Verification token has expired.",
        code: "TOKEN_EXPIRED"
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. Your account is now active."
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
        code: "TOKEN_EXPIRED"
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid verification token"
    });
  }
}

// 3. RESEND VERIFICATION EMAIL
async function resendVerificationEmail(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Security: Don't reveal if email exists
    return res.status(200).json({
      success: true,
      message: "If the email exists, a verification link has been sent."
    });
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: "This email is already verified."
    });
  }

  // Generate new JWT Payload and Token Expiration
  const newToken = generateVerificationToken(user._id, email);
  user.emailVerificationToken = newToken;
  user.emailVerificationTokenExpiry = getTokenExpirationDate(24);
  await user.save();

  // Send Email Transport email
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${newToken}`;
  await emailService.sendVerificationEmail(email, link, user.name);

  return res.status(200).json({
    success: true,
    message: "Verification email has been sent."
  });
}

// 4. CHECK VERIFICATION STATUS
async function checkEmailVerificationStatus(req, res) {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    success: true,
    isEmailVerified: user.isEmailVerified,
    email: user.email
  });
}


/**
 * ROUTES (userRoutes.js)
 */

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/verification-status", verifyToken, checkEmailVerificationStatus);


/**
 * ENVIRONMENT VARIABLES (.env)
 */

GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000


/**
 * ERROR HANDLING SUMMARY
 */

// Registration: 201 Created → user receives verification email
// Verify Email: 200 OK → email verified, account active
// Verify Email (expired): 401 Unauthorized → suggest resend
// Verify Email (invalid): 400 Bad Request → token invalid
// Resend: 200 OK → new email sent (security: doesn't reveal if email exists)


/**
 * FRONTEND INTEGRATION
 */

// 1. After registration, show message: "Check your email for verification link"
// 2. Verification link format: /verify-email?token=JWT_TOKEN
// 3. Frontend extracts token from URL and posts to /api/users/verify-email
// 4. On success: "Your email is verified. You can now login."
// 5. On expired: Show button to resend verification email

// Example:
fetch('/api/users/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: urlParams.get('token') })
})
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      showSuccess(data.message); // "Email verified successfully!"
    } else if (data.code === 'TOKEN_EXPIRED') {
      showError(data.message);
      showResendButton(); // User can request new email
    }
  });


/**
 * PROTECTING ROUTES WITH EMAIL VERIFICATION
 */

// For routes that require email verification:
router.post("/protected-feature", verifyToken, verifyEmailMiddleware, handler);

// The middleware will return 403 if email not verified with resendLink
