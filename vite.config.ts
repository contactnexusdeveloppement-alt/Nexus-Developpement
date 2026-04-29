import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    copyPublicDir: true,
    minify: "esbuild",
    // Remove all console.* and debugger statements in production
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
  },
}));
