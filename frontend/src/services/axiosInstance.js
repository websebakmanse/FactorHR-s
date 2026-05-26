import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with every request
});

// Queue for concurrent 401 requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach access token to every request
export const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Response interceptor — silent refresh on 401
export const setupInterceptors = (onLogout) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only intercept 401s that haven't been retried yet
      // Skip the refresh endpoint itself to avoid infinite loop
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        if (isRefreshing) {
          // Queue this request until refresh completes
          return new Promise((resolve, reject) => {
            if (failedQueue.length >= 50) {
              reject(new Error("Too many queued requests"));
              return;
            }
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axiosInstance.post("/auth/refresh");
          const newToken = data.data.accessToken;

          setAuthHeader(newToken);
          processQueue(null, newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          setAuthHeader(null);
          onLogout(); // clear context + redirect to login
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
