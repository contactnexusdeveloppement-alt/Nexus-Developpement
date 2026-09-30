// Helpers CORS pour les Vercel Functions publiques.
// CORS strict : on n'autorise que nos domaines connus.

const PRODUCTION_ORIGINS = ["https://nexusdeveloppement.fr", "https://www.nexusdeveloppement.fr"];
// Origines de développement : jamais acceptées en production.
const DEV_ORIGINS = ["http://localhost:8080", "http://localhost:5173"];
const ALLOWED_ORIGINS = new Set<string>(
  process.env.VERCEL_ENV === "production" ? PRODUCTION_ORIGINS : [...PRODUCTION_ORIGINS, ...DEV_ORIGINS],
);

const FALLBACK_ORIGIN = "https://nexusdeveloppement.fr";

export function buildCorsHeaders(originHeader: string | null): Record<string, string> {
  const allowed = originHeader && ALLOWED_ORIGINS.has(originHeader)
    ? originHeader
    : FALLBACK_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function preflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: buildCorsHeaders(req.headers.get("Origin")) });
  }
  return null;
}

/**
 * Refuse les requêtes cross-site. CORS n'empêche pas un navigateur d'ENVOYER
 * un POST (text/plain, sans préflight) : sans ce contrôle, un site tiers peut
 * faire envoyer des emails depuis notre domaine. Sont acceptés : les origines
 * connues, l'origine servie elle-même (alias, prévisualisations Vercel) et les
 * clients sans en-tête Origin (curl, monitoring), qui restent soumis au rate limiting.
 */
export function isOriginAllowed(req: Request): boolean {
  if (req.headers.get("Sec-Fetch-Site") === "cross-site") return false;
  const origin = req.headers.get("Origin");
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    return origin === new URL(req.url).origin;
  } catch {
    return false;
  }
}

/** Le corps doit être déclaré en JSON : un formulaire HTML classique ou un POST text/plain est refusé. */
export function isJsonRequest(req: Request): boolean {
  const contentType = req.headers.get("Content-Type") ?? "";
  return /^application\/json(\s*;|$)/i.test(contentType.trim());
}
