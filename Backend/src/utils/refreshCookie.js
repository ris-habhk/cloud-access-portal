const REFRESH_COOKIE_NAME = "refreshToken";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_TTL_MS
  };
}

function clearRefreshCookie(res) {
  const options = getRefreshCookieOptions();
  delete options.maxAge;

  res.clearCookie(REFRESH_COOKIE_NAME, options);
}

module.exports = {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  getRefreshCookieOptions,
  clearRefreshCookie
};