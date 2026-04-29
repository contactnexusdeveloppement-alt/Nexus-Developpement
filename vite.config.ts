import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Pre-rendering : activé uniquement quand PRERENDER=true (CI GitHub Actions).
// Sur Vercel ce flag est absent → le plugin n'est pas chargé, le build passe.
// Le pre-rendering est exécuté en CI (GitHub Actions installe Chrome puis
// `vercel deploy --prebuilt` upload le dist déjà construit avec les 17 pages
// HTML statiques. Voir .github/workflows/deploy.yml.
const PRERENDER = process.env.PRERENDER === "true";

const ROUTES_TO_PRERENDER = [
  "/",
  "/creation-site-web",
  "/automatisation",
  "/applications-web",
  "/applications-mobiles",
  "/identite-visuelle",
  "/salon-coiffure",
  "/restaurant",
  "/concession-automobile",
  "/agence-immobiliere",
  "/catalogue",
  "/equipe",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
  "/cgv",
  "/cookies",
  "/agence-web-versailles",
  "/agence-web-saint-quentin-en-yvelines",
  "/agence-web-trappes",
  "/agence-web-plaisir",
  "/agence-web-montigny-le-bretonneux",
  "/agence-web-maurepas",
];

export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()];

  if (PRERENDER) {
    const { default: prerender } = await import("@prerenderer/rollup-plugin");
    plugins.push(
      prerender({
        routes: ROUTES_TO_PRERENDER,
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions: {
          renderAfterDocumentEvent: "render-event",
          maxConcurrentRoutes: 4,
          headless: true,
        },
      }),
    );
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
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
  };
});
