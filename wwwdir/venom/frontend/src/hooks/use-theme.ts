import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light";
export type AccentColor = "violet" | "blue" | "green" | "orange" | "red";

interface ThemeState {
  theme: ThemeMode;
  accent: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      accent: "violet",
      setTheme: (theme) => {
        set({ theme });
      },
      setAccent: (accent) => {
        set({ accent });
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
      },
    }),
    {
      name: "venom-theme",
    }
  )
);
