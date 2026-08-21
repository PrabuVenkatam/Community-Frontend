import axios from "axios";

/**
 * Resolve Backend Base URL
 * Uses Vite environment variable first, then sensible local/prod fallbacks.
 */
const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  if (envUrl) return envUrl;

  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // Fallback to Azure production backend
  return "https://community-backend-bwgcfcbvhfefexan.centralus-01.azurewebsites.net";
};

const BASE_URL = resolveBaseUrl();

/**
 * Create Axios Instance
 */
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: false, // JWT is sent via Authorization header, not cookies
  timeout: 15000, // Prevents hanging requests
  headers: {
    "Content-Type": "application/json",
  },
});



/**
 * REQUEST INTERCEPTOR
 * Attaches JWT token and custom headers automatically.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Centralized error handling.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Unauthorized globally
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      // Optionally redirect:
      // window.location.href = "/login";
    }

    // Log other errors (optional)
    console.error("API Error:", error.response || error.message);

    return Promise.reject(error);
  }
);

export default API;
