import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fait défiler jusqu'à l'élément dont l'id correspond à une ancre, en
 * réessayant tant qu'il n'est pas monté (les sections de l'accueil sont
 * chargées en lazy), puis réaligne une fois que les sections situées
 * au-dessus ont pris leur hauteur définitive.
 *
 * - Le retry utilise setTimeout et non requestAnimationFrame : rAF est gelé
 *   quand l'onglet n'est pas au premier plan.
 * - Les réalignements sont « instant » : `html { scroll-behavior: smooth }`
 *   rend les défilements « auto » animés, et ces animations peuvent rester
 *   figées dans un onglet en arrière-plan.
 */
const RETRY_MS = 80;

export function scrollToId(id: string, maxWaitMs = 4000): void {
  const start = Date.now();

  const misaligned = (el: HTMLElement) => {
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    return Math.abs(el.getBoundingClientRect().top - margin) > 4;
  };

  const realign = () => {
    const el = document.getElementById(id);
    if (el && misaligned(el)) el.scrollIntoView({ behavior: "instant", block: "start" });
  };

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(realign, 1200);
      window.setTimeout(realign, 2200);
      return;
    }
    if (Date.now() - start < maxWaitMs) window.setTimeout(tryScroll, RETRY_MS);
  };

  tryScroll();
}

/** À monter dans le routeur : réagit à chaque changement d'URL avec ancre. */
export default function HashScroll() {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;
    let id = "";
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return; // fragment mal encodé (ex. « #% ») : on ignore au lieu de planter
    }
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id), 50);
    return () => window.clearTimeout(t);
  }, [hash, key]);

  return null;
}
