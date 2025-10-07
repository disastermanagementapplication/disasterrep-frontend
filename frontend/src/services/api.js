import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { resetToken: token, newPassword }),
};

// Reports API
export const reportsAPI = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (reportData) => api.post('/reports', reportData),
  update: (id, reportData) => api.put(`/reports/${id}`, reportData),
  delete: (id) => api.delete(`/reports/${id}`),
  getStats: () => api.get('/reports/stats/data'),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (userData) => api.put('/profile', userData),
  changePassword: (passwordData) => api.put('/profile/password', passwordData),
};

// Admin API
export const adminAPI = {
  // Reports
  getAllReports: () => api.get('/admin/reports'),
  updateReportStatus: (id, status) => api.put(`/admin/reports/${id}/status`, { status }),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
  
  // Users
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deactivateUser: (id) => api.put(`/admin/users/${id}/deactivate`),
  nominateSuperadmin: (id) => api.post(`/admin/users/${id}/nominate-superadmin`),
  verifySuperadmin: ({ email, code }) => api.post(`/admin/verify-superadmin`, { email, code }, { headers: { Accept: 'application/json' } }),
  
  // Stats & Logs
  getStats: () => api.get('/admin/stats'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

// Upload API
export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;

