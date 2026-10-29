const mongoose = require("mongoose");

const emailOTPSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    purpose: {
      type: String,
      enum: ["registration", "login"],
      required: true
    },

    otpHash: {
      type: String,
      required: true,
      select: false
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0
    },

    lastSentAt: {
      type: Date,
      required: true
    },

    consumedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Allow only one active OTP record per user and purpose.
// We will enforce active-code behavior in the route logic.
emailOTPSchema.index(
  { user: 1, purpose: 1, consumedAt: 1 },
  { name: "user_purpose_consumed" }
);

module.exports = mongoose.model("EmailOTP", emailOTPSchema);