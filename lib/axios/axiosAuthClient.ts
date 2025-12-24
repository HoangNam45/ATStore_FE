import axios from "axios";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";

export const axiosAuthClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor to handle FormData
axiosAuthClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors (token expired)
axiosAuthClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized - Token expired or invalid");

      // Sign out from Firebase
      try {
        if (auth) {
          await auth.signOut();
        }
      } catch (signOutError) {
        console.error("Error signing out:", signOutError);
      }

      // Clear Zustand state
      useAuthStore.getState().logout();

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
