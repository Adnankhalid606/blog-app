import axios from "axios";
import { getToken, setToken } from "./tokenService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let refreshRequest = null;

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message?.toLowerCase();
    const tokenExpired =
      error.response?.status === 401 || message === "jwt expired";
    const isProtectedRequest = Boolean(originalRequest?.headers?.Authorization);

    if (
      !originalRequest ||
      originalRequest._retry ||
      !tokenExpired ||
      !isProtectedRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshRequest) {
        refreshRequest = api.post("/user/refresh-token");
      }
      const response = await refreshRequest;
      setToken(response.data.token);
      originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
      return api(originalRequest);
    } catch (refreshError) {
      setToken(null);
      if (window.location.pathname !== "/login")
        window.location.assign("/login");
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  },
);

export default api;
