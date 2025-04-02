/**
 * To use this structure
 * import { axiosInstance as axios } from './apis/axios'
 */
import axios from "axios";

const BASE_URL = String(import.meta.env.VITE_APP_BASE_URL || "").trim();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("/auth/refresh-token", { refreshToken });

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          error.config.headers["Authorization"] = `Bearer ${res.data.token}`;
          return axiosInstance(error.config); // Retry request with new token
        } catch (refreshError) {
          console.log("Refresh failed. Logging out.");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          window.location.href = "/auth/signin";
        }
      }
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
