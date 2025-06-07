
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://your-laravel-api.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    user_type: string;
  }) => api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post('/auth/reset-password', data),
};

// Properties API calls
export const propertiesAPI = {
  getProperties: (params?: any) =>
    api.get('/properties', { params }),
  
  getProperty: (id: string) =>
    api.get(`/properties/${id}`),
  
  createProperty: (data: FormData) =>
    api.post('/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updateProperty: (id: string, data: FormData) =>
    api.put(`/properties/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteProperty: (id: string) =>
    api.delete(`/properties/${id}`),
  
  getMyProperties: () =>
    api.get('/my-properties'),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentProperties: () => api.get('/dashboard/recent-properties'),
};

export default api;
