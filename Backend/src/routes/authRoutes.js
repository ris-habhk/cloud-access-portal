const express = require("express");
const { rateLimit } = require("express-rate-limit");

const User = require("../models/User");
const RefreshSession = require("../models/RefreshSession");

const { hashPassword, verifyPassword } = require("../utils/password");
const { signAccessToken } = require("../utils/token");
const {
  generateRefreshToken,
  hashRefreshToken
} = require("../utils/refreshToken");
const {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  getRefreshCookieOptions,
  clearRefreshCookie
} = require("../utils/refreshCookie");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

async function createRefreshSession(userId) {
  const rawToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(rawToken);

  await RefreshSession.create({
    user: userId,
    tokenHash,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
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
        message: "Name, email, and password are required."
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must contain between 2 and 80 characters."
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 254 ||
      !emailPattern.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and no more than 72 bytes."
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    }).select("_id");

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    next(error);
  }
});

// POST /api/auth/login
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
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+passwordHash");

    if (
      !user ||
      !(await verifyPassword(password, user.passwordHash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
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
          role: user.role
        }
      }
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
        message: "Refresh session required."
      });
    }

    const tokenHash = hashRefreshToken(rawToken);

    const session = await RefreshSession.findOne({
      tokenHash
    }).select("+tokenHash");

    if (!session) {
      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh session."
      });
    }

    // Reuse of a rotated/revoked token can indicate token theft.
    if (session.revokedAt) {
      await RefreshSession.updateMany(
        { user: session.user, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh session reuse detected. Please log in again."
      });
    }

    if (session.expiresAt <= new Date()) {
      session.revokedAt = new Date();
      await session.save();

      clearRefreshCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh session expired. Please log in again."
      });
    }

    // Atomically claim this session so concurrent refreshes
    // cannot both rotate the same token successfully.
    const rotation = await RefreshSession.updateOne(
      {
        _id: session._id,
        revokedAt: null,
        expiresAt: { $gt: new Date() }
      },
      {
        $set: { revokedAt: new Date() }
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
        message: "Refresh session is no longer valid. Please log in again."
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
        message: "User account no longer exists."
      });
    }

    const newRawToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRawToken);

    await RefreshSession.create({
      user: user._id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
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
        expiresIn: 600
      }
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
      message: "Logged out."
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
        message: "User account no longer exists."
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;