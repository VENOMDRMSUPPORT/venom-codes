import { useThemeStore } from "@/hooks/use-theme";
import { Sun, Moon, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function ThemeSwitcher({ className, compact = false }: ThemeSwitcherProps) {
  const { theme, accent, toggleTheme, setAccent } = useThemeStore();
  const [colorMenuOpen, setColorMenuOpen] = React.useState(false);

  const accents = [
    { value: "violet" as const, label: "Violet", color: "#8B5CF6" },
    { value: "blue" as const, label: "Blue", color: "#3B82F6" },
    { value: "green" as const, label: "Green", color: "#22C55E" },
    { value: "orange" as const, label: "Orange", color: "#F97316" },
    { value: "red" as const, label: "Red", color: "#EF4444" },
  ];

  const currentAccent = accents.find((a) => a.value === accent);

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-full border border-border/70 bg-card/80 p-1.5 shadow-lg shadow-foreground/[0.04] backdrop-blur-xl",
        compact ? "pr-1.5" : "pr-2",
        className
      )}
    >
      <button
        onClick={toggleTheme}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/80 transition-colors hover:bg-secondary"
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        type="button"
      >
        {theme === "light" ? (
          <Sun className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Moon className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setColorMenuOpen((prev) => !prev)}
          className="flex h-8 items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2.5 transition-colors hover:bg-secondary"
          type="button"
        >
          <div
            className="h-4 w-4 rounded-full border border-white/30"
            style={{ backgroundColor: currentAccent?.color }}
          />
          {!compact && <span className="text-xs font-medium text-muted-foreground">Accent</span>}
          <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", colorMenuOpen && "rotate-180")} />
        </button>

        {colorMenuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2">
            <button
              className="fixed inset-0 cursor-default"
              onClick={() => setColorMenuOpen(false)}
              type="button"
              aria-label="Close accent picker"
            />
            <div className="relative min-w-[188px] rounded-2xl border border-border bg-card p-3 shadow-xl">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {accents.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => {
                      setAccent(a.value);
                      setColorMenuOpen(false);
                    }}
                    title={a.label}
                    type="button"
                    className={cn(
                      "h-8 w-8 rounded-full transition-all hover:scale-110",
                      accent === a.value
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110"
                        : "opacity-80 hover:opacity-100"
                    )}
                    style={{ backgroundColor: a.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
