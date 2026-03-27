import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button type="button" variant="outline" size="sm" className="w-11 px-0" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
