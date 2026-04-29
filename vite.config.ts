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
    // Code-splitting : isole React/Router/UI dans des chunks séparés pour
    // améliorer le LCP (le chunk initial passe de ~305 KB à ~150-180 KB).
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "form-vendor": ["@radix-ui/react-checkbox", "@radix-ui/react-radio-group", "@radix-ui/react-select", "@radix-ui/react-label"],
          "query-vendor": ["@tanstack/react-query"],
          "helmet-vendor": ["react-helmet-async"],
        },
      },
    },
  },
}));
