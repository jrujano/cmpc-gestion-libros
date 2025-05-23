import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://0.0.0.0:3000/api'  // En Docker
  : 'https://api.tudominio.com';  // En producción

const api = axios.create({
  baseURL: API_URL,
});


// Request interceptor
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshAuthToken } = useAuth();
        await refreshAuthToken();
        return api(originalRequest);
      } catch (refreshError) {
        const { logout } = useAuth();
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
