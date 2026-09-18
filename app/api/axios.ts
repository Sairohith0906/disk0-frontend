// api/axios.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { RefreshResponse } from "./authApi";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor — attach token (you should already have this)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post<RefreshResponse>(
          "/auth/refresh"
        );

        const user = useAuthStore.getState().user;

        if (!user) {
          throw new Error("User not found");
        }

        useAuthStore.getState().login(
          data.accessToken,
          user
        );

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        useAuthStore.getState().logout();

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;