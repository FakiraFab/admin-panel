import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';

const ADMIN_PASSWORD = 'admin123'; // In production, this should be environment variable

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (password === ADMIN_PASSWORD) {
          const user: User = {
            id: '1',
            name: 'Andre tate',
            role: 'Admin',
            avatar: '/shape.png'
          };
          
          set({ isAuthenticated: true, user });
          return true;
        }
        return false;
      },
      logout: () => {
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