const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured.");
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role
    },
    secret,
    {
      expiresIn: "10m",
      issuer: "cloud-access-portal",
      audience: "cloud-access-portal-api"
    }
  );
}

function verifyAccessToken(token) {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured.");
  }

  return jwt.verify(token, secret, {
    issuer: "cloud-access-portal",
    audience: "cloud-access-portal-api"
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};