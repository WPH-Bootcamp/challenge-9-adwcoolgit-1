import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthSession, AuthUser } from "@/types/domain";

interface AuthStore extends AuthSession {
  setSession: (input: { accessToken: string; user?: AuthUser | null }) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  markHydrated: () => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const initialState: AuthSession = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  persistedAt: null,
  hasHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ accessToken, user = null }) =>
        set({
          accessToken,
          user,
          isAuthenticated: true,
          persistedAt: Date.now(),
          hasHydrated: true,
        }),
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: Boolean(state.accessToken),
          persistedAt: state.persistedAt ?? Date.now(),
          hasHydrated: true,
        })),
      clearSession: () => set({ ...initialState, hasHydrated: true }),
      markHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "restaurant-app-auth",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage,
      ),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        persistedAt: state.persistedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

export function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

export function clearAuthSession() {
  useAuthStore.getState().clearSession();
}
