import { useEffect, useState, type ReactNode } from "react";

/**
 * Rend `fallback` pendant le pré-rendu (Puppeteer) et pendant l'hydratation,
 * puis `children` une fois monté côté client.
 *
 * Sert aux blocs lourds chargés en lazy (formulaires) : le HTML pré-rendu et
 * le premier rendu client contiennent le même placeholder, donc l'hydratation
 * de la page réussit ; le composant réel et sa frontière Suspense ne sont
 * créés qu'après, sans jamais être comparés au HTML statique.
 */
export default function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Pas de montage sous Puppeteer : le placeholder reste dans le HTML capturé.
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    setMounted(true);
  }, []);

  return <>{mounted ? children : fallback}</>;
}
