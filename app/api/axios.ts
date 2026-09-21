// api/axios.ts

import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { RefreshResponse } from "./authApi";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    console.log(
      "➡️ API REQUEST:",
      config.method?.toUpperCase(),
      config.url
    );

    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ REQUEST INTERCEPTOR ERROR:", error);

    return Promise.reject(error);
  }
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API RESPONSE:",
      response.config.method?.toUpperCase(),
      response.config.url,
      response.status
    );

    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    console.log(
      "❌ API ERROR:",
      originalRequest?.method?.toUpperCase(),
      originalRequest?.url,
      error.response?.status
    );

    /*
     * =====================================================
     * HANDLE 401
     * =====================================================
     */

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      console.log(
        "🔄 ACCESS TOKEN EXPIRED — REFRESHING TOKEN..."
      );

      try {
        /*
         * Refresh access token
         */
        const { data } = await api.post<RefreshResponse>(
          "/auth/refresh"
        );

        console.log(
          "✅ TOKEN REFRESH SUCCESSFUL"
        );

        /*
         * Get current user
         */
        const user = useAuthStore.getState().user;

        if (!user) {
          throw new Error("User not found");
        }

        /*
         * Save new access token
         */
        useAuthStore.getState().login(
          data.accessToken,
          user
        );

        /*
         * Attach new token to original request
         */
        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        console.log(
          "🔁 RETRYING ORIGINAL REQUEST:",
          originalRequest.url
        );

        /*
         * Retry original request
         */
        return api(originalRequest);

      } catch (refreshError) {

        console.error(
          "❌ TOKEN REFRESH FAILED:",
          refreshError
        );

        /*
         * Logout user
         */
        useAuthStore.getState().logout();

        /*
         * Redirect to login
         */
        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;