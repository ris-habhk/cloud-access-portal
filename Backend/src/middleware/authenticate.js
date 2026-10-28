const { verifyAccessToken } = require("../utils/token");

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required."
    });
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required."
    });
  }

  try {
    const payload = verifyAccessToken(token);

    if (
      typeof payload.sub !== "string" ||
      !["requester", "manager", "admin"].includes(payload.role)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token."
      });
    }

    req.auth = {
      userId: payload.sub,
      role: payload.role
    };

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token."
      });
    }

    next(error);
  }
}

module.exports = authenticate;