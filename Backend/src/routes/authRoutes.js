
const express = require("express");
const { rateLimit } = require("express-rate-limit");

const User = require("../models/User");
const RefreshSession = require("../models/RefreshSession");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signAccessToken } = require("../utils/token");
const {
  generateRefreshToken,
  hashRefreshToken,
} = require("../utils/refreshToken");
const {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  getRefreshCookieOptions,
  clearRefreshCookie,
} = require("../utils/refreshCookie");
const { issueOTP, resendOTP, verifyOTP } = require("../services/otpService");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Limit OTP verification and resend requests.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

// Limit password login and login OTP verification attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// Limit refresh requests.
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Create a refresh session and return its raw token.
async function createRefreshSession(userId) {
  const rawToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(rawToken);

  await RefreshSession.create({
    user: userId,
    tokenHash,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return rawToken;
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must contain between 2 and 80 characters.",
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      normalizedEmail.length > 254
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and no more than 72 bytes.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.isEmailVerified
          ? "An account with this email already exists."
          : "An account with this email is awaiting verification. Request a new code.",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      isEmailVerified: false,
    });

    try {
      await issueOTP(user, "registration");
    } catch (emailError) {
      console.error("Registration OTP delivery failed.");

      return res.status(503).json({
        success: false,
        message: "Account created, but email delivery failed. Please request a new code later.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created. Check your email for the verification code.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    next(error);
  }
});

// POST /api/auth/verify-registration
router.post("/verify-registration", otpLimiter, async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid email and six-digit OTP are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified.",
      });
    }

    const result = await verifyOTP(user, "registration", otp);

    if (!result.valid) {
      const message =
        result.reason === "attempts_exceeded"
          ? "Too many incorrect attempts. Request a new code."
          : "Invalid or expired verification code.";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/resend-otp
router.post("/resend-otp", otpLimiter, async (req, res, next) => {
  try {
    const { email, purpose } = req.body || {};

    if (
      typeof email !== "string" ||
      !["registration", "login"].includes(purpose)
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and a valid OTP purpose are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // Return a generic response for ineligible accounts.
    if (
      !user ||
      (purpose === "registration" && user.isEmailVerified) ||
      (purpose === "login" && !user.isEmailVerified)
    ) {
      return res.status(200).json({
        success: true,
        message: "If the account is eligible, a verification code will be sent.",
      });
    }

    await resendOTP(user, purpose);

    return res.status(200).json({
      success: true,
      message: "If the account is eligible, a verification code will be sent.",
    });
  } catch (error) {
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
      });
    }

    next(error);
  }
});

// POST /api/auth/login
// Step 1: Validate the password and send a login OTP.
router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+passwordHash");

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    await issueOTP(user, "login");

    return res.status(200).json({
      success: true,
      message: "Login code sent. Check your email.",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
      });
    }

    console.error("Login OTP delivery failed.");

    return res.status(503).json({
      success: false,
      message: "Unable to send login code. Please check your email configuration and try again later.",
    });
  }
});

// POST /api/auth/login/verify-otp
// Step 2: Verify the OTP, then issue the session tokens.
router.post("/login/verify-otp", otpLimiter, async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid email and six-digit code are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      isEmailVerified: true,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login code.",
      });
    }

    const result = await verifyOTP(user, "login", otp);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login code.",
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshSession(user._id);

    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: 600,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post("/refresh", refreshLimiter, async (req, res, next) => {
  try {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!rawToken || typeof rawToken !== "string") {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh session required.",
      });
    }

    const tokenHash = hashRefreshToken(rawToken);

    const session = await RefreshSession.findOne({
      tokenHash,
    }).select("+tokenHash");

    if (!session) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh session.",
      });
    }

    // A revoked token being reused may indicate token theft.
    if (session.revokedAt) {
      await RefreshSession.updateMany(
        { user: session.user, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh session reuse detected. Please log in again.",
      });
    }

    if (session.expiresAt <= new Date()) {
      session.revokedAt = new Date();
      await session.save();

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh session expired. Please log in again.",
      });
    }

    // Only one concurrent request can rotate this session.
    const rotation = await RefreshSession.updateOne(
      {
        _id: session._id,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: { revokedAt: new Date() },
      }
    );

    if (rotation.modifiedCount !== 1) {
      await RefreshSession.updateMany(
        { user: session.user, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh session is no longer valid. Please log in again.",
      });
    }

    const user = await User.findById(session.user);

    if (!user) {
      await RefreshSession.updateMany(
        { user: session.user, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    const newRawToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRawToken);

    await RefreshSession.create({
      user: user._id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    await RefreshSession.updateOne(
      { _id: session._id },
      { $set: { replacedByTokenHash: newTokenHash } }
    );

    const accessToken = signAccessToken(user);

    res.cookie(
      REFRESH_COOKIE_NAME,
      newRawToken,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Session refreshed.",
      data: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: 600,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post("/logout", async (req, res, next) => {
  try {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (typeof rawToken === "string" && rawToken.length > 0) {
      const tokenHash = hashRefreshToken(rawToken);

      await RefreshSession.updateOne(
        { tokenHash, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out.",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId)
      .select("name email role createdAt")
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
