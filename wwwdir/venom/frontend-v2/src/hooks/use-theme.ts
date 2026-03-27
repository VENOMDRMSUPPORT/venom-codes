import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";
type Accent = "violet" | "blue" | "green" | "orange" | "red";

interface ThemeState {
  theme: Theme;
  accent: Accent;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      accent: "violet",
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "venom-theme",
    }
  )
);
