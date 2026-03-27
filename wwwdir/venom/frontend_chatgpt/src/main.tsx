import { createRoot } from "react-dom/client";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client";
import App from "./App";
import "./index.css";
import { getAuthToken } from "@/hooks/use-auth";

function initializeTheme() {
  try {
    const saved = localStorage.getItem("venom-theme");
    const parsed = saved ? (JSON.parse(saved) as { state?: { theme?: "dark" | "light" } }) : undefined;
    const theme = parsed?.state?.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    document.documentElement.classList.add("dark");
  }
}

initializeTheme();

if (import.meta.env.VITE_API_BASE_URL) {
  setBaseUrl(import.meta.env.VITE_API_BASE_URL);
}

setAuthTokenGetter(getAuthToken);

createRoot(document.getElementById("root")!).render(<App />);
