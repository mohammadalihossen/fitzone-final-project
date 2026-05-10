import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { authAPI } from '@/services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.login(credentials);
          Cookies.set('fitzone_token', data.token, { expires: 7 });
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const data = await authAPI.register(userData);
          Cookies.set('fitzone_token', data.token, { expires: 7 });
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        Cookies.remove('fitzone_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),

      fetchMe: async () => {
        try {
          const data = await authAPI.getMe();
          set({ user: data.user, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'fitzone-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
