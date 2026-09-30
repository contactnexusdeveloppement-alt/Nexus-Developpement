// Réponses JSON et lecture du corps pour les Vercel Edge Functions publiques.
//
// Contrat d'erreur commun aux 3 endpoints (send-quote, book-call,
// apporteurs-candidature) : toute réponse d'erreur est
//   { error: string (message français affichable), code: ErrorCode }
// avec un jeu de codes stable que le front peut mapper.

export type ErrorCode =
  | "invalid_json"
  | "missing_fields"
  | "invalid_name"
  | "invalid_email"
  | "invalid_phone"
  | "invalid_service"
  | "invalid_slot"
  | "too_long"
  | "payload_too_large"
  | "rate_limited"
  | "method_not_allowed"
  | "forbidden_origin"
  | "unsupported_media_type"
  | "not_configured"
  | "upstream_error";

export interface ApiError {
  error: string;
  code: ErrorCode;
}

export const CONTACT_EMAIL = "contact.nexus.developpement@gmail.com";

/** Messages français des erreurs transverses (identiques sur les 3 endpoints). */
export const MESSAGES = {
  method_not_allowed: "Méthode non autorisée : utilisez POST.",
  forbidden_origin: "Origine non autorisée.",
  unsupported_media_type: "Le corps de la requête doit être envoyé en JSON (Content-Type: application/json).",
  payload_too_large: "Requête trop volumineuse.",
  invalid_json: "Requête invalide : le corps doit être un objet JSON.",
  not_configured: `Service d'envoi non configuré. Écrivez-nous directement à ${CONTACT_EMAIL}.`,
  upstream_error: `Impossible d'envoyer votre demande pour le moment. Écrivez-nous directement à ${CONTACT_EMAIL}.`,
} as const;

type Headers = Record<string, string>;

export function json(status: number, body: unknown, cors: Headers, extra: Headers = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, ...extra, "Content-Type": "application/json; charset=utf-8" },
  });
}

export function apiError(status: number, code: ErrorCode, error: string, cors: Headers, extra: Headers = {}): Response {
  const body: ApiError = { error, code };
  return json(status, body, cors, extra);
}

/** Vrai si l'en-tête Content-Length annonce un corps plus gros que `maxBytes`. */
export function contentLengthExceeds(req: Request, maxBytes: number): boolean {
  const declared = Number(req.headers.get("content-length") ?? 0);
  return Number.isFinite(declared) && declared > maxBytes;
}

export type JsonObjectResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: Response };

/**
 * Lit le corps, vérifie sa taille réelle (413 même sans Content-Length) et
 * le parse en objet JSON (400 `invalid_json` sinon). Ne lève jamais.
 */
export async function readJsonObject(req: Request, maxBytes: number, cors: Headers): Promise<JsonObjectResult> {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, response: apiError(400, "invalid_json", MESSAGES.invalid_json, cors) };
  }

  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    return { ok: false, response: apiError(413, "payload_too_large", MESSAGES.payload_too_large, cors) };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, response: apiError(400, "invalid_json", MESSAGES.invalid_json, cors) };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, response: apiError(400, "invalid_json", MESSAGES.invalid_json, cors) };
  }

  return { ok: true, body: parsed as Record<string, unknown> };
}
