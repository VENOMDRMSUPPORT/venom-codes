import { createRoot } from "react-dom/client";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client";
import App from "./App";
import "./index.css";
import { getAuthToken } from "@/hooks/use-auth";

document.documentElement.classList.add("dark", "accent-violet");

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
if (apiBase) {
  setBaseUrl(apiBase);
}
setAuthTokenGetter(getAuthToken);

createRoot(document.getElementById("root")!).render(<App />);
