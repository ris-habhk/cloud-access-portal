let accessToken = null;
let currentUser = null;
let refreshPromise = null;

export function setAuth(token, user = currentUser) {
  accessToken = token;
  currentUser = user;
}

export function getAccessToken() {
  return accessToken;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearAuth() {
  accessToken = null;
  currentUser = null;
}

export function refreshAccessToken(apiBaseUrl) {
  if (!refreshPromise) {
    refreshPromise = fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || "Your session has expired.");
        }
        const token = result.data?.accessToken;
        if (!token) throw new Error("The server did not return an access token.");
        setAuth(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
