import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Signale au pre-renderer (Puppeteer) que le DOM est prêt à être capturé.
// Délai court pour laisser React monter, react-helmet-async injecter les meta tags,
// et les sections lazy-loaded above-the-fold se rendre.
if (typeof window !== "undefined") {
  setTimeout(() => {
    document.dispatchEvent(new Event("render-event"));
  }, 800);
}
