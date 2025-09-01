import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { AuthState, User } from '../types';
import { API_URL } from '../constant';

// Set up axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (password: string) => {
        try {
          const response = await axios.post(`${API_URL}/admin/login`, { password });
          
          if (response.data.success) {
            const { token, user } = response.data.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            
            set({ isAuthenticated: true, user });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem('token');
        set({ isAuthenticated: false, user: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user 
      }),
    }
  )
);