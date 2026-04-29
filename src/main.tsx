import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Signal au plugin de pre-rendering Puppeteer (CI uniquement) que React a
// fini son rendu initial et que le HTML peut être capturé.
if (typeof window !== "undefined") {
  requestAnimationFrame(() => {
    document.dispatchEvent(new Event("render-event"));
  });
}
