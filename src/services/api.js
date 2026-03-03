import axios from "axios";
import Cookies from "js-cookie";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
};

export const providerAPI = {
  createService: (serviceData) => api.post("/provider/service", serviceData),
  getServices: () => api.get("/provider/services"),
  updateBookingStatus: (bookingData) => api.patch("/provider/booking-status", bookingData),
};

export const adminAPI = {
  getAllUsers: () => api.get("/admin/users"),
  approveProvider: (providerId, userId) => api.post("/admin/approve-provider", { provider_id: providerId, user_id: userId }),
  blockUser: (id) => api.patch("/admin/block-user", { id }),
};

export const categoryAPI = {
  getAll: () => api.get("/admin/categories"),
  getById: (id) => api.get(`/admin/category/${id}`),
  create: (categoryData) => api.post("/admin/category", categoryData),
  update: (id, categoryData) => api.put(`/admin/category/${id}`, categoryData),
  delete: (id) => api.delete(`/admin/category/${id}`),
};

export default api;
