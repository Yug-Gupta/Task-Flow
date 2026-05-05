import { create } from 'zustand';
import api from '../utils/api';

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('userInfo')) || null; }
  catch { return null; }
};

const useAuthStore = create((set) => ({
  userInfo: getStoredUser(),
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/auth/profile', updates);
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Update failed', isLoading: false });
      return false;
    }
  },
}));

export default useAuthStore;
