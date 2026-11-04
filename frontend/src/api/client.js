import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('streakup_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear token if an authenticated endpoint fails with 401 (not during login/register)
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config?.url?.includes('/auth/login') &&
      !error.config?.url?.includes('/auth/register')
    ) {
      console.warn('Authentication token invalid or expired. Clearing stored token.');
      localStorage.removeItem('streakup_token');
    }
    return Promise.reject(error);
  }
);

export default api;
