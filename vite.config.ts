import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// NOTE pre-rendering : @prerenderer/rollup-plugin avec Puppeteer ne tourne pas
// dans le sandbox build Vercel (Chrome ne peut pas être lancé : libs système
// manquantes). Pour activer le pre-rendering, deux options :
//   1) GitHub Actions : build local avec Puppeteer + deploy du dist statique sur Vercel
//   2) Migration vers Astro ou Next.js (SSG natif sans Puppeteer)
// En attendant, le site reste un SPA pur. Tous les autres fixes SEO restent
// actifs (sitemap, llms.txt, schemas JSON-LD enrichis, redirects, headers).

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
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // react + router + helmet + query dans un seul vendor pour éviter
          // les chunks circulaires (query → ui → query qu'on avait avant)
          "react-vendor": [
            "react",
            "react-dom",
            "react-router-dom",
            "react-helmet-async",
            "@tanstack/react-query",
          ],
          "ui-vendor": ["framer-motion", "lucide-react"],
        },
      },
    },
  },
}));
