// ============================================================
// services/axiosInstance.js — Configured Axios Client
// ============================================================
// Instead of using plain axios everywhere, we create one
// configured instance with:
// 1. Base URL set to our backend
// 2. Credentials (cookies) sent automatically
// 3. An interceptor that silently refreshes expired tokens
//
// What is an interceptor?
// It's like a middleware for HTTP requests/responses.
// Our response interceptor catches 401 errors and automatically
// gets a new access token — the user never sees an error.
// ============================================================

import axios from "axios";

// Read API URL from .env file, fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Always send cookies (needed for refresh token)
});

// -------------------------------------------------------
// Token refresh queue
// Problem: If 3 requests fail with 401 at the same time,
// we don't want to call /refresh 3 times.
// Solution: Queue the extra requests and replay them after
// the first refresh completes.
// -------------------------------------------------------
let isRefreshing = false;  // Are we currently refreshing?
let failedQueue = [];      // Requests waiting for new token

// Process all queued requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Refresh failed — reject all queued requests
    } else {
      prom.resolve(token); // Refresh succeeded — retry with new token
    }
  });
  failedQueue = []; // Clear the queue
};

// -------------------------------------------------------
// setAuthHeader
// Sets the Authorization header on all future requests
// Called after login and after token refresh
// -------------------------------------------------------
export const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove header when logging out
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// -------------------------------------------------------
// setupInterceptors
// Sets up the response interceptor
// Called once when the app loads (in AuthProvider)
// onLogout is called when refresh fails (session expired)
// -------------------------------------------------------
export const setupInterceptors = (onLogout) => {
  axiosInstance.interceptors.response.use(
    // If response is successful (2xx), just return it as-is
    (response) => response,

    // If response has an error, handle it here
    async (error) => {
      const originalRequest = error.config;

      // Only handle 401 errors that haven't been retried yet
      // Skip the /auth/refresh endpoint to avoid infinite loop
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            if (failedQueue.length >= 50) {
              reject(new Error("Too many queued requests"));
              return;
            }
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // Retry original request with new token
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // Mark this request as retried (prevents infinite loop)
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call /api/auth/refresh to get a new access token
          // The refresh token cookie is sent automatically
          const { data } = await axiosInstance.post("/auth/refresh");
          const newToken = data.data.accessToken;

          // Update the Authorization header for future requests
          setAuthHeader(newToken);

          // Retry all queued requests with the new token
          processQueue(null, newToken);

          // Retry the original failed request
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed — session is truly expired
          processQueue(refreshError, null);
          setAuthHeader(null);
          onLogout(); // Clear auth state and redirect to login
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // Reset flag
        }
      }

      // For all other errors, just reject normally
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
