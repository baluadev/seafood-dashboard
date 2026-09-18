import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      },

      register: async (formData) => {
        const { data } = await api.post('/auth/register', formData);
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
