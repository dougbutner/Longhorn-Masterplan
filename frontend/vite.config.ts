import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  build: { sourcemap: true, target: "es2022" },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    esbuildOptions: { target: "es2022" },
  },
});
