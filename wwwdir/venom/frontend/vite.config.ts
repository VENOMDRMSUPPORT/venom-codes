import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const rawPort = process.env.PORT;
console.log('rawPort:', rawPort);
const port =
  rawPort === undefined || rawPort === ""
    ? 5173
    : Number(rawPort);
console.log('port:', port);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath =
  process.env.BASE_PATH === undefined || process.env.BASE_PATH === ""
    ? "/"
    : process.env.BASE_PATH;

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: ["dev.venom-codes.test", "localhost"],
    hmr: {
      protocol: "wss",
      host: "dev.venom-codes.test",
      clientPort: 443,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
