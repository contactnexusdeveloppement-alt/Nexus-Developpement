import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    /** Vrai pendant l'hydratation d'une page pré-rendue (voir useTypewriter). */
    __NED_PRERENDERED__?: boolean;
  }
}

const container = document.getElementById("root")!;

// En production, chaque route est pré-rendue en CI (Puppeteer) : le HTML est
// déjà dans #root. On l'hydrate au lieu de le remplacer, pour que le contenu
// au-dessus de la ligne de flottaison reste affiché pendant le chargement du
// JavaScript (LCP) au lieu d'être jeté au premier rendu React. Les sections
// chargées en lazy sont re-rendues côté client (pas de marqueur Suspense dans
// une capture DOM), ce qui correspond au comportement précédent pour elles.
// Sans pré-rendu (dev, build local) : rendu client classique.
const prerendered = container.hasChildNodes();
window.__NED_PRERENDERED__ = prerendered;

if (prerendered) {
  hydrateRoot(container, <App />, {
    onRecoverableError: (error) => {
      console.warn("Hydratation partielle, rendu client de secours :", error);
    },
  });
  // Une fois l'hydratation passée, les montages suivants (navigation interne)
  // peuvent à nouveau animer le titre de l'accueil.
  window.setTimeout(() => {
    window.__NED_PRERENDERED__ = false;
  }, 3000);
} else {
  createRoot(container).render(<App />);
}

// Après un déploiement, un chunk lazy peut avoir disparu (nouveaux hashes) :
// recharger la page récupère un HTML frais au lieu de laisser un écran vide.
window.addEventListener("vite:preloadError", () => {
  // Un seul rechargement automatique : si la page vient déjà d'être rechargée,
  // on n'insiste pas (évite une boucle quand un chunk reste injoignable).
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === "reload") return;
  window.location.reload();
});

// Signal au plugin de pre-rendering Puppeteer (CI uniquement) que React a
// fini son rendu initial ET que les composants lazy-loaded de la route
// courante sont résolus. On attend 2s : largement suffisant pour que les
// chunks dynamiques import() soient fetch + parsed + montés. En production
// browser, l'event est dispatché aussi mais sans listener donc no-op.
window.setTimeout(() => {
  document.dispatchEvent(new Event("render-event"));
}, 2000);
