import { create } from 'zustand';
import axios from 'axios';

// ─── Axios instance ────────────────────────────────────────
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.skillvalix.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Simple in-memory cache ────────────────────────────────
const CACHE = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getCached = (key) => {
  const item = CACHE[key];
  if (!item) return null;
  if (Date.now() - item.ts > CACHE_TTL) {
    delete CACHE[key];
    return null;
  }
  return item.data;
};

export const setCache = (key, data) => {
  CACHE[key] = { data, ts: Date.now() };
};

export const clearCache = (key) => {
  if (key) delete CACHE[key];
  else Object.keys(CACHE).forEach(k => delete CACHE[k]);
};

// Cached API helper — returns cached data if fresh, else fetches
export const cachedGet = async (key, url) => {
  const cached = getCached(key);
  if (cached) return cached;
  const res = await api.get(url);
  setCache(key, res.data);
  return res.data;
};

// ─── Auth Store ────────────────────────────────────────────
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // On app boot — load from cache first, then validate token
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }

    // Optimisation 1: if user already in memory, skip the API call
    if (get().user) {
      set({ loading: false });
      return;
    }

    // Optimisation 2: try sessionStorage cache before hitting backend
    try {
      const cached = sessionStorage.getItem('skillvalix_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        set({ user: parsed, isAuthenticated: true, loading: false });
        return;
      }
    } catch (_) {}

    try {
      const res = await api.get('/auth/me');
      sessionStorage.setItem('skillvalix_user', JSON.stringify(res.data));
      set({ user: res.data, isAuthenticated: true, loading: false });
    } catch (err) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('skillvalix_user');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);

    const userRes = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    sessionStorage.setItem('skillvalix_user', JSON.stringify(userRes.data));
    clearCache(); // clear all stale cache on login
    set({ user: userRes.data, isAuthenticated: true });
  },

  register: async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);

    const userRes = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    sessionStorage.setItem('skillvalix_user', JSON.stringify(userRes.data));
    clearCache();
    set({ user: userRes.data, isAuthenticated: true, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('skillvalix_user');
    clearCache(); // wipe all cached data on logout
    set({ user: null, isAuthenticated: false });
  },

  googleLogin: async (credential) => {
    const res = await api.post('/auth/google', { credential });
    localStorage.setItem('token', res.data.token);

    const userRes = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    sessionStorage.setItem('skillvalix_user', JSON.stringify(userRes.data));
    clearCache();
    set({ user: userRes.data, isAuthenticated: true, loading: false });
  }
}));
