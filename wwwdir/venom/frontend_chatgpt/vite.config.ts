import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const rawPort = process.env.PORT;
const port = rawPort === undefined || rawPort === "" ? 5173 : Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const rootDir = import.meta.dirname;
const basePath = process.env.BASE_PATH === undefined || process.env.BASE_PATH === "" ? "/" : process.env.BASE_PATH;
const hmrHost = process.env.VITE_HMR_HOST;
const hmrClientPort = process.env.VITE_HMR_CLIENT_PORT === undefined || process.env.VITE_HMR_CLIENT_PORT === "" ? undefined : Number(process.env.VITE_HMR_CLIENT_PORT);

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src")
    },
    dedupe: ["react", "react-dom"]
  },
  root: path.resolve(rootDir),
  build: {
    outDir: path.resolve(rootDir, "dist"),
    emptyOutDir: true
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: ["dev.venom-codes.test", "localhost"],
    hmr: hmrHost
      ? {
          protocol: hmrClientPort === 443 ? "wss" : "ws",
          host: hmrHost,
          clientPort: hmrClientPort
        }
      : {
          protocol: "wss",
          host: "dev.venom-codes.test",
          clientPort: 443
        }
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true
  }
});
