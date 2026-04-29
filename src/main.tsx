import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Signal au plugin de pre-rendering Puppeteer (CI uniquement) que React a
// fini son rendu initial ET que les composants lazy-loaded de la route
// courante sont résolus. On attend 2s : largement suffisant pour que les
// chunks dynamiques import() soient fetch + parsed + montés. En production
// browser, l'event est dispatché aussi mais sans listener donc no-op.
if (typeof window !== "undefined") {
  setTimeout(() => {
    document.dispatchEvent(new Event("render-event"));
  }, 2000);
}
