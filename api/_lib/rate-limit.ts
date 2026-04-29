// Rate-limiter en mémoire pour Vercel Functions.
//
// Limite : sur Edge Runtime, chaque cold start a sa propre instance — donc le
// compteur n'est pas global. C'est suffisant pour bloquer un attaquant qui
// frappe une seule instance, mais pas un attaquant distribué.
//
// Si abus avéré : remplacer par Vercel KV ou Upstash Redis (gratuit
// jusqu'à plusieurs milliers de commandes/mois).

interface Entry {
  count: number;
  windowStart: number;
}

const store = new Map<string, Entry>();
const MAX_ENTRIES = 10_000;

function evictIfNeeded() {
  if (store.size <= MAX_ENTRIES) return;
  // Évince le tiers le plus ancien
  const entries = [...store.entries()];
  entries.sort((a, b) => a[1].windowStart - b[1].windowStart);
  for (let i = 0; i < Math.floor(MAX_ENTRIES / 3); i++) {
    store.delete(entries[i][0]);
  }
}

export function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * @returns true si la requête est autorisée, false sinon.
 */
export function rateLimit(bucketKey: string, maxCount: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(bucketKey);

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(bucketKey, { count: 1, windowStart: now });
    evictIfNeeded();
    return true;
  }

  if (entry.count >= maxCount) return false;

  entry.count += 1;
  return true;
}
