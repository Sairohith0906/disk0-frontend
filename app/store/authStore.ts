import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;

  hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;

  login: (accessToken: string, user: User) => void;

  setUser: (user: User) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,

      user: null,

      hasHydrated: false,

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),

      login: (accessToken, user) =>
        set({
          accessToken,
          user,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
        }),
    }),

    {
      name: "auth-storage",
      partialize : (state)=>({user : state.user}),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);