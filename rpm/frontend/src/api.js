import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
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
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  googleLogin: (userData) => api.post('/api/auth/google', userData),
  getUserStatus: () => api.get('/api/user/status'),
  completeProfile: (profileData) => api.post('/api/user/profile', profileData),
};

export const tutorAPI = {
  sendMessage: (data) => api.post('/api/tutor', data),
  generateQuiz: (data) => api.post('/api/quiz', data),
  getCredits: () => api.get('/api/credits'),
};

export const uploadAPI = {
  uploadFile: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getUserUploads: () => api.get('/api/uploads'),
};

export const adminAPI = {
  whitelistUser: (userId) => api.patch(`/api/admin/whitelist/${userId}`),
  getUsers: () => api.get('/api/admin/users'),
};

export default api;

