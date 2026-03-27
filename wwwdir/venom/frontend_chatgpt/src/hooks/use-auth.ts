import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientProfile } from "@/lib/site";
import { previewClient } from "@/lib/site";
import { logoutRequest, refreshTokenRequest } from "@/lib/api";

const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

type AuthState = {
  token: string | null;
  client: ClientProfile | null;
  isAuthenticated: boolean;
  previewMode: boolean;
  hydrated: boolean;
  setAuth: (token: string, client: ClientProfile) => void;
  setClient: (client: ClientProfile) => void;
  startPreview: () => void;
  exitPreview: () => void;
  logout: () => Promise<void>;
  checkExpiry: () => boolean;
  refreshToken: () => Promise<boolean>;
};

function parsePayload(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    return JSON.parse(atob(parts[1])) as { exp?: number };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string) {
  const payload = parsePayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

function isTokenExpiringSoon(token: string) {
  const payload = parsePayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000 - REFRESH_BEFORE_EXPIRY_MS;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      client: null,
      isAuthenticated: false,
      previewMode: false,
      hydrated: false,
      setAuth: (token, client) => set({ token, client, isAuthenticated: true, previewMode: false }),
      setClient: (client) => set({ client }),
      startPreview: () => set({ token: null, client: previewClient, isAuthenticated: true, previewMode: true, hydrated: true }),
      exitPreview: () => set({ token: null, client: null, isAuthenticated: false, previewMode: false }),
      logout: async () => {
        const { token, previewMode } = get();
        if (previewMode) {
          set({ token: null, client: null, isAuthenticated: false, previewMode: false });
          return;
        }

        if (token) {
          try {
            await logoutRequest(token);
          } catch {
            // ignore transport failures during logout
          }
        }

        set({ token: null, client: null, isAuthenticated: false, previewMode: false });
      },
      checkExpiry: () => {
        const { token, isAuthenticated, previewMode } = get();
        if (previewMode) return true;
        if (!isAuthenticated || !token) return false;

        if (isTokenExpired(token)) {
          set({ token: null, client: null, isAuthenticated: false, previewMode: false });
          return false;
        }

        return true;
      },
      refreshToken: async () => {
        const { token, isAuthenticated, previewMode } = get();
        if (previewMode) return true;
        if (!isAuthenticated || !token) return false;
        if (!isTokenExpiringSoon(token)) return true;

        try {
          const response = await refreshTokenRequest(token);
          if (response.token) {
            set({ token: response.token });
            return true;
          }

          set({ token: null, client: null, isAuthenticated: false, previewMode: false });
          return false;
        } catch {
          set({ token: null, client: null, isAuthenticated: false, previewMode: false });
          return false;
        }
      }
    }),
    {
      name: "venom-auth",
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (state.token && isTokenExpired(state.token)) {
          state.token = null;
          state.client = null;
          state.isAuthenticated = false;
          state.previewMode = false;
        }

        state.hydrated = true;
      }
    }
  )
);

export function getAuthToken() {
  try {
    const raw = localStorage.getItem("venom-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null; previewMode?: boolean } };
    const previewMode = parsed?.state?.previewMode ?? false;
    const token = parsed?.state?.token ?? null;
    if (previewMode) return null;
    if (token && isTokenExpired(token)) return null;
    return token;
  } catch {
    return null;
  }
}
