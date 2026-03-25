import { createRoot } from "react-dom/client";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client";
import App from "./App";
import "./index.css";
import { getAuthToken } from "@/hooks/use-auth";

// Initialize theme based on user preference or system preference
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme-preference");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  
  // Apply saved accent color or default to violet
  const savedAccent = localStorage.getItem("accent-color") || "violet";
  
  document.documentElement.classList.add(theme, `accent-${savedAccent}`);
}

initializeTheme();

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
if (apiBase) {
  setBaseUrl(apiBase);
}
setAuthTokenGetter(getAuthToken);

createRoot(document.getElementById("root")!).render(<App />);
