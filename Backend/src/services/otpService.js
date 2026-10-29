
const crypto = require("crypto");

const EmailOTP = require("../models/EmailOTP");
const { sendOTPEmail } = require("../utils/email");
const {
  generateOTP,
  hashOTP,
  getOTPExpiry,
} = require("../utils/otp");

const RESEND_COOLDOWN_SECONDS = Number(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || 60
);

const MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

// Check the most recent OTP, including a code that was consumed
// after a failed email delivery or successful verification.
async function checkCooldown(userId, purpose) {
  const latestOTP = await EmailOTP.findOne({
    user: userId,
    purpose,
  }).sort({ createdAt: -1 });

  if (!latestOTP) {
    return;
  }

  const elapsedMs = Date.now() - latestOTP.lastSentAt.getTime();
  const cooldownMs = RESEND_COOLDOWN_SECONDS * 1000;

  if (elapsedMs < cooldownMs) {
    const error = new Error(
      "Please wait before requesting another code."
    );

    error.statusCode = 429;
    error.retryAfterSeconds = Math.ceil(
      (cooldownMs - elapsedMs) / 1000
    );

    throw error;
  }
}

// Generate and email a new OTP.
async function issueOTP(user, purpose) {
  // Prevent repeated login or resend requests from bypassing cooldown.
  await checkCooldown(user._id, purpose);

  // Invalidate any previous active codes for this purpose.
  await EmailOTP.updateMany(
    {
      user: user._id,
      purpose,
      consumedAt: null,
    },
    {
      $set: { consumedAt: new Date() },
    }
  );

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const now = new Date();

  // Store only the hash, never the plain OTP.
  const record = await EmailOTP.create({
    user: user._id,
    purpose,
    otpHash,
    expiresAt: getOTPExpiry(),
    attempts: 0,
    lastSentAt: now,
  });

  try {
    await sendOTPEmail(user.email, otp, purpose);
  } catch (error) {
    // Invalidate the unsent code, but retain its timestamp
    // so repeated attempts cannot bypass the cooldown.
    await EmailOTP.updateOne(
      { _id: record._id, consumedAt: null },
      { $set: { consumedAt: new Date() } }
    );

    throw error;
  }
}

// Resend uses the same cooldown and delivery rules.
async function resendOTP(user, purpose) {
  return issueOTP(user, purpose);
}

// Verify an OTP and consume it after successful verification.
async function verifyOTP(user, purpose, submittedOTP) {
  const record = await EmailOTP.findOne({
    user: user._id,
    purpose,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .select("+otpHash")
    .sort({ createdAt: -1 });

  if (!record) {
    return {
      valid: false,
      reason: "expired_or_missing",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return {
      valid: false,
      reason: "attempts_exceeded",
    };
  }

  const submittedHash = hashOTP(submittedOTP);
  const expected = Buffer.from(record.otpHash, "hex");
  const actual = Buffer.from(submittedHash, "hex");

  const matches =
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual);

  if (!matches) {
    record.attempts += 1;
    await record.save();

    return {
      valid: false,
      reason:
        record.attempts >= MAX_ATTEMPTS
          ? "attempts_exceeded"
          : "invalid",
    };
  }

  // Atomically consume the code so it cannot be reused.
  const consumed = await EmailOTP.updateOne(
    {
      _id: record._id,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
      attempts: { $lt: MAX_ATTEMPTS },
    },
    {
      $set: { consumedAt: new Date() },
    }
  );

  if (consumed.modifiedCount !== 1) {
    return {
      valid: false,
      reason: "expired_or_used",
    };
  }

  return { valid: true };
}

module.exports = {
  issueOTP,
  resendOTP,
  verifyOTP,
};
