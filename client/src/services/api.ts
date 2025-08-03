import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  loginUser: (data: { email: string; password: string }) =>
    api.post('/auth/user/login', data),
  
  loginBusiness: (data: { email: string; password: string }) =>
    api.post('/auth/business/login', data),
  
  registerUser: (data: any) =>
    api.post('/auth/user/register', data),
  
  registerBusiness: (data: any) =>
    api.post('/auth/business/register', data),
  
  getCurrentUser: () =>
    api.get('/auth/user/me'),
  
  getCurrentBusiness: () =>
    api.get('/auth/business/me'),
};

// Business API
export const businessAPI = {
  getBusinesses: (params?: any) =>
    api.get('/business', { params }),
  
  getBusiness: (id: string) =>
    api.get(`/business/${id}`),
  
  getFeaturedBusinesses: () =>
    api.get('/business/featured/list'),
  
  getBusinessesByCategory: (category: string, params?: any) =>
    api.get(`/business/category/${category}`, { params }),
  
  updateProfile: (data: any) =>
    api.put('/business/profile', data),
  
  updateHours: (hours: any) =>
    api.put('/business/hours', { hours }),
};

// Search API
export const searchAPI = {
  searchBusinesses: (params: any) =>
    api.get('/search', { params }),
  
  getSuggestions: (query: string) =>
    api.get('/search/suggestions', { params: { query } }),
};

// Review API
export const reviewAPI = {
  createReview: (data: any) =>
    api.post('/review', data),
  
  getBusinessReviews: (businessId: string, params?: any) =>
    api.get(`/review/business/${businessId}`, { params }),
  
  updateReview: (id: string, data: any) =>
    api.put(`/review/${id}`, data),
  
  deleteReview: (id: string) =>
    api.delete(`/review/${id}`),
  
  markHelpful: (id: string) =>
    api.post(`/review/${id}/helpful`),
};

// User API
export const userAPI = {
  getProfile: () =>
    api.get('/user/profile'),
  
  updateProfile: (data: any) =>
    api.put('/user/profile', data),
  
  getUserReviews: (params?: any) =>
    api.get('/user/reviews', { params }),
};

export default api;