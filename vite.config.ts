import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import prerender from "@prerenderer/rollup-plugin";

// Routes à pre-rendre en HTML statique (toutes les pages publiques)
const ROUTES = [
  "/",
  "/creation-site-web",
  "/automatisation",
  "/applications-web",
  "/applications-mobiles",
  "/identite-visuelle",
  "/salon-coiffure",
  "/restaurant",
  "/agence-immobiliere",
  "/concession-automobile",
  "/catalogue",
  "/equipe",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
  "/cgv",
  "/cookies",
];

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Pre-rendering : génère du HTML statique pour chaque route au build.
    // Critique pour le SEO (titles/meta dynamiques, contenu visible aux crawlers Google + AI bots).
    mode === "production" &&
      prerender({
        routes: ROUTES,
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions: {
          renderAfterDocumentEvent: "render-event",
          maxConcurrentRoutes: 4,
          headless: true,
        },
      }),
  ].filter(Boolean),
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
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "form-vendor": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-label",
          ],
          "query-vendor": ["@tanstack/react-query"],
          "helmet-vendor": ["react-helmet-async"],
        },
      },
    },
  },
}));
