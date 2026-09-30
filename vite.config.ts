import { defineConfig, type PluginOption, type UserConfig } from "vite";
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
  "/e-commerce",
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
  "/apporteurs",
  "/links",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
  "/cgv",
  "/cookies",
  "/404",
  "/agence-web-versailles",
  "/agence-web-saint-quentin-en-yvelines",
  "/agence-web-trappes",
  "/agence-web-plaisir",
  "/agence-web-montigny-le-bretonneux",
  "/agence-web-maurepas",
];

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const plugins: PluginOption[] = [react()];

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
    // Option de premier niveau : sous `build`, elle était ignorée par Vite
    // et les console.log partaient en production.
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      copyPublicDir: true,
      minify: "esbuild",
      rollupOptions: {
        output: {
          // Un seul chunk vendor pour React et les bibliothèques qui touchent à
          // ses internes (framer-motion, react-router, react-query). Deux chunks
          // séparés créaient un cycle react-vendor ↔ ui-vendor (avertissement
          // Rollup) qui plantait le bundle de développement au démarrage.
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (
              /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run|@tanstack|use-sync-external-store|framer-motion|motion-dom|motion-utils|lucide-react)[\\/]/.test(id)
            ) {
              return "vendor";
            }
            return undefined;
          },
        },
      },
    },
  };
});
