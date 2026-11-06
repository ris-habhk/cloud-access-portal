import {
  clearAuth,
  getAccessToken,
  refreshAccessToken,
} from "../authStore.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-registration",
  "/auth/login/verify-otp",
  "/auth/resend-otp",
  "/auth/refresh",
  "/auth/logout",
];

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed (${response.status}).`,
      response.status,
      data
    );
  }
  return data;
}

export async function apiRequest(path, options = {}) {
  const {
    skipAuth = false,
    retry = true,
    headers: suppliedHeaders = {},
    body,
    ...fetchOptions
  } = options;

  const headers = new Headers(suppliedHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (!skipAuth && token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    body: body !== undefined && !isFormData && typeof body !== "string"
      ? JSON.stringify(body)
      : body,
    credentials: "include",
  });

  const shouldSkipRefresh = NO_REFRESH_PATHS.some((item) => path.startsWith(item));

  if (response.status === 401 && retry && !skipAuth && !shouldSkipRefresh) {
    try {
      const newToken = await refreshAccessToken(API_BASE_URL);
      const retryHeaders = new Headers(suppliedHeaders);
      if (!isFormData && body !== undefined && !retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }
      retryHeaders.set("Authorization", `Bearer ${newToken}`);

      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...fetchOptions,
        headers: retryHeaders,
        body: body !== undefined && !isFormData && typeof body !== "string"
          ? JSON.stringify(body)
          : body,
        credentials: "include",
      });

      return readResponse(retryResponse);
    } catch (error) {
      clearAuth();
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
      throw error;
    }
  }

  return readResponse(response);
}
