const crypto = require("crypto");

function generateOTP() {
  // Generate a cryptographically secure six-digit code.
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOTP(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

function getOTPExpiry() {
  const minutes = Number(process.env.OTP_EXPIRES_MINUTES || 5);

  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = {
  generateOTP,
  hashOTP,
  getOTPExpiry
};