import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach token
api.interceptors.request.use((config) => {
  const token = Cookies.get('fitzone_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    if (error.response?.status === 401) {
      Cookies.remove('fitzone_token');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
    }
    return Promise.reject(new Error(message));
  }
);

// ──── AUTH ────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ──── PRODUCTS ────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  bulkUpload: (products) => api.post('/products/bulk', { products }),
};

// ──── ORDERS ────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: (params) => api.get('/orders/user', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status, note) => api.put(`/orders/${id}/status`, { status, note }),
};

// ──── USERS / WISHLIST ────
export const userAPI = {
  getWishlist: () => api.get('/users/wishlist'),
  toggleWishlist: (productId) => api.put('/users/wishlist', { productId }),
};

// ──── ADMIN ────
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
};

export default api;
