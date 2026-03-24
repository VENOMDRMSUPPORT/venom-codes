import React from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore, type AccentColor } from "@/hooks/use-theme";
import { motion } from "framer-motion";

const ACCENTS: { value: AccentColor; color: string; label: string }[] = [
  { value: "violet", color: "hsl(262 83% 58%)", label: "Violet" },
  { value: "blue",   color: "hsl(217 91% 60%)", label: "Blue" },
  { value: "green",  color: "hsl(142 71% 45%)", label: "Green" },
  { value: "orange", color: "hsl(25 95% 53%)",  label: "Orange" },
  { value: "red",    color: "hsl(0 84% 60%)",   label: "Red" },
];

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function ThemeSwitcher({ compact = false, className = "" }: ThemeSwitcherProps) {
  const { theme, accent, toggleTheme, setAccent } = useThemeStore();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={toggleTheme}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
        aria-label="Toggle dark/light mode"
      >
        {theme === "dark" ? (
          <Sun className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        ) : (
          <Moon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        )}
      </motion.button>

      <div className="flex items-center gap-1.5">
        {ACCENTS.map(({ value, color, label }) => (
          <motion.button
            key={value}
            whileTap={{ scale: 0.82 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => setAccent(value)}
            title={`${label} accent`}
            aria-label={`Set ${label} accent`}
            className="relative rounded-full transition-shadow"
            style={{
              width: compact ? "14px" : "16px",
              height: compact ? "14px" : "16px",
              backgroundColor: color,
              boxShadow: accent === value ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
