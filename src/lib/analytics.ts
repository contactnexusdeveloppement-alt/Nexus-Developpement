import { track } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean | null>;

/**
 * Événement personnalisé Vercel Web Analytics (sans cookie).
 *
 * `track` n'envoie rien tant que `window.va` n'existe pas, or <Analytics />
 * n'est monté qu'après l'hydratation (ClientOnly dans App.tsx) : un événement
 * émis au montage d'une page serait perdu. On crée donc la même file d'attente
 * que la librairie (window.vaq), que le script vide à son chargement.
 */
export function trackEvent(name: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { va?: (...args: unknown[]) => void; vaq?: unknown[][] };
  if (!w.va) {
    w.va = (...args: unknown[]) => {
      (w.vaq = w.vaq || []).push(args);
    };
  }
  track(name, props);
}

/** Campagne lue dans ?utm_campaign= (ex. « lyon6-beaute »), ou null. */
export function readCampaign(search: string): string | null {
  const value = new URLSearchParams(search).get("utm_campaign");
  return value && /^[a-z0-9-]{1,40}$/.test(value) ? value : null;
}
