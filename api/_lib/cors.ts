// Helpers CORS pour les Vercel Functions publiques.
// CORS strict : on n'autorise que nos domaines connus.

const ALLOWED_ORIGINS = new Set<string>([
  "https://nexusdeveloppement.fr",
  "https://www.nexusdeveloppement.fr",
  "http://localhost:8080",
  "http://localhost:5173",
]);

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
