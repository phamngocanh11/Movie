# Email Verification Workflow Documentation

## Overview

This document explains the **Email Verification Workflow** using **Nodemailer** and **JWT**. The system provides a production-ready email verification mechanism with proper error handling, token expiration, and middleware support.

---

## Domain-Specific Terminology

### Email Transport

**Definition**: The nodemailer transporter object that manages SMTP connections and email delivery.

- Initialized once in `emailService.js`
- Supports multiple email providers (Gmail, custom SMTP, etc.)
- Handles connection verification and retry logic
- **Example**: `emailService.sendVerificationEmail(email, link, userName)`

### JWT Payload

**Definition**: The data encoded inside a JWT token that contains user identification and verification metadata.

**Payload Structure**:

```javascript
{
  id: "user_id",           // MongoDB user ID
  email: "user@email.com", // User email
  purpose: "email_verification", // Token purpose validation
  iat: 1234567890         // Issued at timestamp
}
```

**Purpose**: Prevents token reuse by validating the `purpose` field matches "email_verification"

### Token Expiration

**Definition**: The time-to-live (TTL) mechanism for verification tokens.

**Implementation**:

- JWT expiration: 24 hours (via `expiresIn: "24h"` in `jwt.sign()`)
- Database field: `emailVerificationTokenExpiry` stores absolute expiration date
- Validation: `isTokenExpired()` function checks against current time

**Error Handling**:

- If token expired: JWT throws `TokenExpiredError`
- If database expiry exceeded: Manual check via `isTokenExpired()`

### Middleware

**Definition**: Express functions that validate email verification status before allowing access to protected routes.

**Types**:

1. **verifyEmailMiddleware**: Checks if `isEmailVerified === true`
2. **verifyToken**: Validates JWT authentication (existing)

**Usage**:

```javascript
router.post("/protected-route", verifyToken, verifyEmailMiddleware, handler);
```

---

## Architecture

### File Structure

```
server/
├── models/
│   └── user.js                          # Added: isEmailVerified, emailVerificationToken, emailVerificationTokenExpiry
├── services/
│   └── emailService.js                  # NEW: Email Transport configuration
├── utils/
│   └── tokenUtils.js                    # NEW: JWT token generation/verification
├── middlewares/
│   └── verifyEmailMiddleware.js         # NEW: Email verification middleware
├── controllers/
│   └── userController.js                # Updated: Register + 3 new functions
└── routes/
    └── userRoutes.js                    # Updated: +3 new endpoints
```

---

## Data Flow

### 1. Registration with Email Verification

```
User Registration Request
    ↓
Input Validation
    ↓
Check Duplicate Username/Email
    ↓
Hash Password
    ↓
Generate JWT Payload (user ID + email + "email_verification")
    ↓
Create User + Store Token Expiration
    ↓
Generate Updated JWT (with actual user ID)
    ↓
Send Email via Email Transport
    ↓
Return Login Token + User Data
    ↓
Response: 201 Created (with message)
```

### 2. Email Verification Flow

```
User Clicks Verification Link (with token)
    ↓
Frontend POST /api/users/verify-email { token }
    ↓
Verify JWT Signature + Payload Purpose
    ↓
Check Token Expiration (JWT + Database)
    ↓
Find User by Decoded User ID
    ↓
Verify Token Matches Database
    ↓
Mark isEmailVerified = true
    ↓
Clear Verification Token Fields
    ↓
Response: 200 OK (with user data)
```

### 3. Resend Verification Email

```
User Requests Resend
    ↓
Find User by Email
    ↓
Check if Already Verified
    ↓
Generate New JWT Payload + Token Expiration
    ↓
Update Database
    ↓
Send Email via Email Transport
    ↓
Response: 200 OK
```

---

## Error Handling

### Token Expiration Errors

| Error                   | Cause                    | Status | Message             | Client Action       |
| ----------------------- | ------------------------ | ------ | ------------------- | ------------------- |
| `TokenExpiredError`     | JWT expired (24h passed) | 401    | "Token has expired" | Resend verification |
| `isTokenExpired()` true | Database expiry exceeded | 401    | "Token has expired" | Resend verification |
| `TOKEN_MISMATCH`        | Token doesn't match DB   | 400    | "Invalid token"     | Resend verification |

### Invalid Token Errors

| Error               | Cause                        | Status | Message          | Client Action            |
| ------------------- | ---------------------------- | ------ | ---------------- | ------------------------ |
| `JsonWebTokenError` | Invalid signature            | 400    | "Invalid token"  | Contact support          |
| `Invalid purpose`   | Not email verification token | 400    | "Invalid token"  | Contact support          |
| Missing token       | No token provided            | 400    | "Token required" | Request new verification |

### User Not Found

| Error           | Cause                    | Status | Message                         |
| --------------- | ------------------------ | ------ | ------------------------------- |
| User not found  | Invalid user ID in token | 404    | "User not found"                |
| Email not found | During resend            | 200    | "If email exists..." (security) |

### Email Service Errors

| Error          | Cause            | Status           | Message                | Recovery              |
| -------------- | ---------------- | ---------------- | ---------------------- | --------------------- |
| Transport fail | SMTP error       | 500              | "Failed to send email" | User can retry resend |
| Invalid config | Missing env vars | Error on startup | "Config error"         | Check .env file       |

---

## Environment Variables

Add to `.env`:

```bash
# Email Configuration
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password    # Use Gmail App Password, not main password

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production

# Frontend URL (for verification link)
FRONTEND_URL=http://localhost:3000  # Or your production URL
```

**Security Notes**:

- Use Gmail App Password (not main password)
- Never commit `.env` file
- Rotate `JWT_SECRET` in production
- Use HTTPS for verification links in production

---

## API Endpoints

### 1. Register User

**Endpoint**: `POST /api/users/register`

**Request**:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "isEmailVerified": false
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Email Sent**:

```
To: john@example.com
Subject: Email Verification - Movie App
Body: HTML with verification link + 24-hour expiration warning
```

---

### 2. Verify Email

**Endpoint**: `POST /api/users/verify-email`

**Request**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Email verified successfully. Your account is now active.",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

**Error Response** (401 Unauthorized - Token Expired):

```json
{
  "success": false,
  "message": "Verification token has expired. Please request a new one.",
  "code": "TOKEN_EXPIRED",
  "resendLink": "/api/users/resend-verification"
}
```

---

### 3. Resend Verification Email

**Endpoint**: `POST /api/users/resend-verification`

**Request**:

```json
{
  "email": "john@example.com"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Verification email has been sent. Please check your inbox."
}
```

**Note**: Returns success even if email not found (security: prevents user enumeration)

---

### 4. Check Verification Status

**Endpoint**: `GET /api/users/verification-status`

**Headers**:

```
Authorization: Bearer eyJhbGc...
```

**Response** (200 OK):

```json
{
  "success": true,
  "isEmailVerified": false,
  "email": "john@example.com"
}
```

---

## Implementation Guide

### Step 1: Frontend Registration Flow

```javascript
// register.js (Frontend)
const registerUser = async (formData) => {
  const response = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (data.success) {
    // Store token
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Show: "Check your email for verification link"
    showMessage(data.message);

    // Redirect to email verification page (optional)
    navigate("/verify-email-pending");
  }
};
```

### Step 2: Frontend Verification Link

```javascript
// verify-email.js (Frontend)
useEffect(() => {
  const token = new URLSearchParams(window.location.search).get("token");

  if (token) {
    verifyEmailToken(token);
  }
}, []);

const verifyEmailToken = async (token) => {
  const response = await fetch("/api/users/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();

  if (data.success) {
    showSuccess("Email verified! Your account is active.");
    navigate("/login");
  } else if (data.code === "TOKEN_EXPIRED") {
    showError(data.message);
    setShowResendOption(true);
  }
};
```

### Step 3: Resend Request

```javascript
// resend-verification.js (Frontend)
const resendVerification = async () => {
  const response = await fetch("/api/users/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail }),
  });

  const data = await response.json();

  if (data.success) {
    showSuccess("Verification email sent! Check your inbox.");
  }
};
```

### Step 4: Protected Routes (Optional)

```javascript
// routes/userRoutes.js
// Protect sensitive routes with email verification
router.post("/protected-endpoint", verifyToken, verifyEmailMiddleware, handler);
```

---

## Testing Guide

### Test Case 1: Successful Registration & Verification

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234"
  }'

# Response includes token in URL: /verify-email?token=eyJhbGc...

# 2. Verify email with token (extract from email or response)
curl -X POST http://localhost:5000/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGc..."}'

# Should return: success: true, isEmailVerified: true
```

### Test Case 2: Expired Token

```bash
# Wait 24+ hours (or manually set emailVerificationTokenExpiry in DB to past date)

# Try to verify with expired token
curl -X POST http://localhost:5000/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "expired-token"}'

# Should return: code: "TOKEN_EXPIRED", status: 401

# Request new verification email
curl -X POST http://localhost:5000/api/users/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Should return: success: true
```

### Test Case 3: Invalid Token

```bash
# Try to verify with invalid token
curl -X POST http://localhost:5000/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "invalid-token"}'

# Should return: code: "INVALID_TOKEN", status: 400
```

---

## Security Best Practices

1. **Token Storage** (Frontend)
   - Store token in HTTP-only cookie (if possible)
   - Never store in localStorage if sensitive
   - Clear on logout

2. **Token Expiration**
   - 24 hours is recommended for email verification
   - Can be reduced to 1 hour for higher security
   - Always validate in both JWT and database

3. **Email Validation**
   - Use regex to prevent invalid emails
   - Consider verifying email delivery (bounce handling)
   - Implement rate limiting on resend endpoint

4. **HTTPS Only**
   - Always use HTTPS for verification links in production
   - Never expose tokens in logs
   - Use secure flag on cookies

5. **Rate Limiting**

   ```javascript
   // Add rate limiter to resend endpoint
   const rateLimit = require("express-rate-limit");

   const resendLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 3, // Max 3 resend requests
     message: "Too many resend requests",
   });

   router.post("/resend-verification", resendLimiter, resendVerificationEmail);
   ```

---

## Troubleshooting

| Issue                         | Solution                                                  |
| ----------------------------- | --------------------------------------------------------- |
| Email not sending             | Check `.env` credentials, enable Gmail App Password       |
| Token always expired          | Verify system time is correct, check `JWT_SECRET` matches |
| "User not found" on verify    | Token might be from different deployment, check user ID   |
| Verification link not working | Ensure `FRONTEND_URL` is correct in `.env`                |
| CORS errors on email request  | Check origin in frontend, verify CORS middleware          |

---

## Future Enhancements

1. **Email Templates**: Move HTML to separate template files
2. **Retry Logic**: Implement exponential backoff for failed emails
3. **Rate Limiting**: Add per-user/email resend limits
4. **SMS Verification**: Alternative verification method
5. **Account Recovery**: Link email verification to recovery process
6. **Batch Operations**: Bulk email sending for admin features

---

## References

- [JWT.io - Introduction to JWT](https://jwt.io/introduction)
- [Nodemailer Documentation](https://nodemailer.com/)
- [OWASP - Email Validation](https://owasp.org/www-community/attacks/Email_Injection)
- [Express Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
