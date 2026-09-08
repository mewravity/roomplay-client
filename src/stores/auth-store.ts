import { create } from 'zustand';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('roomplay_token'),
  isAuthenticated: !!localStorage.getItem('roomplay_token'),
  isLoading: true,

  login: async (data) => {
    try {
      const res = await api.auth.login(data);
      localStorage.setItem('roomplay_token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (data) => {
    try {
      const res = await api.auth.register(data);
      localStorage.setItem('roomplay_token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('roomplay_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const user = await api.auth.updateProfile(data);
      set({ user });
    } catch (error) {
      throw error;
    }
  },

  loadUser: async () => {
    const { token } = get();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await api.auth.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('roomplay_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
