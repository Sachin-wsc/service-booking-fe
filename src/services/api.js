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
  // Service Management
  createService: (serviceData) => api.post("/provider/service", serviceData),
  getServices: () => api.get("/provider/services"),
  getService: (id) => api.get(`/provider/service/${id}`),
  updateService: (id, serviceData) => api.put(`/provider/service/${id}`, serviceData),
  deleteService: (id) => api.delete(`/provider/service/${id}`),
  
  // Availability Management
  addAvailability: (availabilityData) => api.post("/provider/availability", availabilityData),
  getAvailability: (serviceId) => api.get(`/provider/service/${serviceId}/availability`),
  updateAvailability: (id, availabilityData) => api.put(`/provider/availability/${id}`, availabilityData),
  deleteAvailability: (id) => api.delete(`/provider/availability/${id}`),
  
  // Booking Management
  updateBookingStatus: (bookingData) => api.patch("/provider/booking-status", bookingData),
};

export const adminAPI = {
  getAllUsers: () => api.get("/admin/users"),
  getPendingProviders: () => api.get("/admin/providers"),
  approveProvider: (providerId) => api.post("/admin/approve-provider", { provider_id: providerId }),
  blockUser: (id) => api.patch("/admin/block-user", { id }),
};

export const categoryAPI = {
  // Public endpoints - accessible to everyone
  getAll: () => api.get("/services/categories"),
  getCategories: () => api.get("/services/categories"),
  getById: (id) => api.get(`/services/category/${id}`),
  
  // Admin-only endpoints
  create: (categoryData) => api.post("/admin/category", categoryData),
  update: (id, categoryData) => api.put(`/admin/category/${id}`, categoryData),
  delete: (id) => api.delete(`/admin/category/${id}`),
};

export default api;
