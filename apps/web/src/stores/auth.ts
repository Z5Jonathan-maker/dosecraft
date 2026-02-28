import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  readonly id: string;
  readonly email: string;
  readonly role: string;
}

interface AuthState {
  readonly user: User | null;
  readonly loading: boolean;
  readonly login: (email: string, password: string) => Promise<boolean>;
  readonly register: (email: string, password: string) => Promise<boolean>;
  readonly logout: () => void;
  readonly checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  login: async (email, password) => {
    const res = await api.post<{ user: User; tokens: { accessToken: string } }>(
      '/auth/login',
      { email, password },
    );
    if (res.success && res.data) {
      localStorage.setItem('dc_token', res.data.tokens.accessToken);
      set({ user: res.data.user });
      return true;
    }
    return false;
  },

  register: async (email, password) => {
    const res = await api.post<{ user: User; tokens: { accessToken: string } }>(
      '/auth/register',
      { email, password },
    );
    if (res.success && res.data) {
      localStorage.setItem('dc_token', res.data.tokens.accessToken);
      set({ user: res.data.user });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('dc_token');
    set({ user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('dc_token');
    if (!token) {
      set({ user: null, loading: false });
      return;
    }
    const res = await api.get<User>('/auth/me');
    set({
      user: res.success ? (res.data ?? null) : null,
      loading: false,
    });
  },
}));
