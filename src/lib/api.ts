import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      } catch {}
    }
  }
  return config;
});

export default api;
