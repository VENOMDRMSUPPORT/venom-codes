import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const devHost = process.env.VITE_DEV_HOST ?? "dev2.venom-codes.test";
const devClientPort = Number(process.env.VITE_HMR_CLIENT_PORT ?? "443");
const devProtocol = (process.env.VITE_HMR_PROTOCOL ?? "wss") as "ws" | "wss";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
    allowedHosts: [devHost, "localhost"],
    origin: `https://${devHost}`,
    hmr: {
      host: devHost,
      protocol: devProtocol,
      clientPort: devClientPort,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
