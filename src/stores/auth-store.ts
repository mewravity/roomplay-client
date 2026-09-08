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
  demoLogin: () => Promise<void>;
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

  demoLogin: async () => {
    try {
      const res = await api.auth.demoLogin();
      localStorage.setItem('roomplay_token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true });
    } catch (error) {
      console.warn('Server demo login error, using local fallback:', error);
      const fallbackUser: User = {
        id: 'demo-user-1',
        username: 'demouser',
        displayName: 'Demo User',
        email: 'demo@demo.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demouser',
        status: 'Watching with friends 🍿',
        isOnline: true,
      };
      localStorage.setItem('roomplay_token', 'demo-session-token');
      set({ user: fallbackUser, token: 'demo-session-token', isAuthenticated: true });
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
      if (token === 'demo-session-token' || (token && token.length > 20)) {
        const fallbackUser: User = {
          id: 'demo-user-1',
          username: 'demouser',
          displayName: 'Demo User',
          email: 'demo@demo.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demouser',
          status: 'Watching with friends 🍿',
          isOnline: true,
        };
        set({ user: fallbackUser, isAuthenticated: true, isLoading: false });
        return;
      }
      localStorage.removeItem('roomplay_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
