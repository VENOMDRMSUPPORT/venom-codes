import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientProfile } from "@/api/client";
import { customFetch } from "@/api/client";

const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

interface AuthState {
  token: string | null;
  user: ClientProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: ClientProfile) => void;
  setUser: (user: ClientProfile) => void;
  logout: () => void;
  checkExpiry: () => boolean;
  refreshToken: () => Promise<boolean>;
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function isTokenExpiringSoon(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return Date.now() >= (payload.exp * 1000) - REFRESH_BEFORE_EXPIRY_MS;
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => {
        const { token } = get();
        if (token) {
          customFetch<{ success: boolean }>("/api/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => undefined);
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
      checkExpiry: () => {
        const { token, isAuthenticated } = get();
        if (!isAuthenticated || !token) return false;
        if (isTokenExpired(token)) {
          set({ token: null, user: null, isAuthenticated: false });
          return false;
        }
        return true;
      },
      refreshToken: async () => {
        const { token, isAuthenticated } = get();
        if (!isAuthenticated || !token) return false;
        if (!isTokenExpiringSoon(token)) return true;
        try {
          const data = await customFetch<{ token: string }>("/api/auth/refresh", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data?.token) {
            set({ token: data.token });
            return true;
          }
          return false;
        } catch {
          set({ token: null, user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "venom-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("venom-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    const token = parsed?.state?.token ?? null;
    if (token && isTokenExpired(token)) return null;
    return token;
  } catch {
    return null;
  }
}
