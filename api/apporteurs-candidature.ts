import { buildCorsHeaders, isJsonRequest, isOriginAllowed, preflight } from "./_lib/cors";
import { rateLimit, getClientIP } from "./_lib/rate-limit";
import { CONTACT_EMAIL, MESSAGES, apiError, contentLengthExceeds, json, readJsonObject, type ErrorCode } from "./_lib/http";
import { deliverAdminThenClient } from "./_lib/resend";
import {
  DATE_REGEX,
  NAME_RULE_MESSAGE,
  PHONE_FR_REGEX,
  escapeHtml,
  isHoneypotFilled,
  isValidEmail,
  isValidPersonName,
  safeOptString,
  safeString,
} from "./_lib/validation";

export const config = { runtime: "edge" };

const ENDPOINT = "apporteurs-candidature";

// --- Constantes de validation -----------------------------------------------

const VALID_CIVILITIES = new Set(["mme", "m", "autre"]);
const VALID_WORK_STATUS = new Set(["etudiant", "salarie", "independant", "sans_emploi", "autre"]);
const VALID_AE_STATUS = new Set(["yes", "no", "in_progress"]);
const VALID_SOURCES = new Set(["instagram", "linkedin", "tiktok", "bouche_a_oreille", "autre"]);
const VALID_NETWORK_SIZES = new Set(["0-5", "6-15", "16-50", "50+"]);

const MAX_BODY_BYTES = 30_000;
const MAX_NAME_LENGTH = 100;
const MAX_CITY_LENGTH = 100;
const MAX_PHONE_LENGTH = 30;
const MIN_REASON_LENGTH = 200;
const MAX_REASON_LENGTH = 5000;

const UPSTREAM_ERROR_MESSAGE = `Impossible d'envoyer votre candidature pour le moment. Écrivez-nous directement à ${CONTACT_EMAIL}.`;
const SUCCESS_BODY = { success: true, message: "Candidature reçue" };

// --- Libellés humanisés (pour les emails) -----------------------------------

const CIVILITY_LABEL: Record<string, string> = { mme: "Mme", m: "M.", autre: "Autre" };
const WORK_STATUS_LABEL: Record<string, string> = {
  etudiant: "Étudiant",
  salarie: "Salarié",
  independant: "Indépendant",
  sans_emploi: "Sans emploi",
  autre: "Autre",
};
const AE_STATUS_LABEL: Record<string, string> = {
  yes: "Oui",
  no: "Non",
  in_progress: "En cours",
};
const SOURCE_LABEL: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  bouche_a_oreille: "Bouche à oreille",
  autre: "Autre",
};
const NETWORK_SIZE_LABEL: Record<string, string> = {
  "0-5": "0 à 5 personnes",
  "6-15": "6 à 15 personnes",
  "16-50": "16 à 50 personnes",
  "50+": "Plus de 50 personnes",
};

// --- Validation -------------------------------------------------------------

interface ValidatedCandidature {
  civility: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  workStatus: string;
  aeStatus: string;
  source: string | null;
  reason: string;
  networkSize: string;
}

type Validation = { ok: true; data: ValidatedCandidature } | { ok: false; code: ErrorCode; error: string };

const fail = (code: ErrorCode, error: string): Validation => ({ ok: false, code, error });

// Majorité exigée : la modale juridique et le statut (auto-entrepreneur, contrat
// d'apporteur) supposent un apporteur majeur.
function isAtLeast18(dateString: string): boolean {
  const birth = new Date(dateString + "T00:00:00Z");
  if (isNaN(birth.getTime())) return false;
  const cutoff = new Date();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 18);
  return birth <= cutoff;
}

function validateBody(b: Record<string, unknown>): Validation {
  // Lecture brute : null = absent / vide / mauvais type. Les longueurs sont
  // vérifiées séparément pour renvoyer `too_long` plutôt que « manquant ».
  const civility = safeString(b.civility, 10);
  const lastName = safeString(b.lastName, 10_000);
  const firstName = safeString(b.firstName, 10_000);
  const email = safeString(b.email, 10_000);
  const phone = safeString(b.phone, 10_000);
  const birthDate = safeString(b.birthDate, 10);
  const city = safeString(b.city, 10_000);
  const workStatus = safeString(b.workStatus, 30);
  const aeStatus = safeString(b.aeStatus, 30);
  const source = safeOptString(b.source, 30);
  const reason = safeString(b.reason, 100_000);
  const networkSize = safeString(b.networkSize, 10);

  // 1. Obligatoires absents, valeurs de liste inconnues, consentements → un seul message
  const problems: string[] = [];
  if (!civility || !VALID_CIVILITIES.has(civility)) problems.push("civilité");
  if (!lastName) problems.push("nom");
  if (!firstName) problems.push("prénom");
  if (!email) problems.push("email");
  if (!phone) problems.push("téléphone");
  if (!birthDate || !DATE_REGEX.test(birthDate) || !isAtLeast18(birthDate)) {
    problems.push("date de naissance (18 ans minimum)");
  }
  if (!city) problems.push("ville");
  if (!workStatus || !VALID_WORK_STATUS.has(workStatus)) problems.push("statut actuel");
  if (!aeStatus || !VALID_AE_STATUS.has(aeStatus)) problems.push("statut auto-entrepreneur");
  if (b.source != null && (source === null || !VALID_SOURCES.has(source))) problems.push("source");
  if (!reason) problems.push("motivation");
  if (!networkSize || !VALID_NETWORK_SIZES.has(networkSize)) problems.push("taille du réseau");
  if (b.consentRgpd !== true) problems.push("consentement (politique de confidentialité)");
  if (b.consentContract !== true) problems.push("acceptation des conditions du programme");

  // Les tests de nullité ci-dessous sont redondants avec `problems` : ils servent au typage.
  if (
    problems.length > 0 ||
    !civility || !lastName || !firstName || !email || !phone ||
    !birthDate || !city || !workStatus || !aeStatus || !reason || !networkSize
  ) {
    return fail("missing_fields", `Champs manquants ou invalides : ${problems.join(", ")}.`);
  }

  // 2. Longueurs
  if (lastName.length > MAX_NAME_LENGTH || firstName.length > MAX_NAME_LENGTH) {
    return fail("too_long", `Nom ou prénom trop long : ${MAX_NAME_LENGTH} caractères maximum.`);
  }
  if (email.length > 254) return fail("too_long", "Adresse email trop longue.");
  if (phone.length > MAX_PHONE_LENGTH) {
    return fail("too_long", `Numéro de téléphone trop long : ${MAX_PHONE_LENGTH} caractères maximum.`);
  }
  if (city.length > MAX_CITY_LENGTH) {
    return fail("too_long", `Ville trop longue : ${MAX_CITY_LENGTH} caractères maximum.`);
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return fail("too_long", `Motivation trop longue : ${MAX_REASON_LENGTH} caractères maximum.`);
  }
  if (reason.length < MIN_REASON_LENGTH) {
    return fail("missing_fields", `Motivation trop courte : ${MIN_REASON_LENGTH} caractères minimum.`);
  }

  // 3. Formats
  if (!isValidPersonName(lastName) || !isValidPersonName(firstName)) {
    return fail("invalid_name", `Nom ou prénom invalide : ${NAME_RULE_MESSAGE}.`);
  }
  if (!isValidEmail(email)) return fail("invalid_email", "Adresse email invalide.");
  if (!PHONE_FR_REGEX.test(phone)) {
    return fail("invalid_phone", "Numéro de téléphone invalide : numéro français attendu (ex. 06 12 34 56 78).");
  }

  return {
    ok: true,
    data: {
      civility,
      lastName,
      firstName,
      email,
      phone,
      birthDate,
      city,
      workStatus,
      aeStatus,
      source: source || null,
      reason,
      networkSize,
    },
  };
}

// --- Handler ----------------------------------------------------------------

export default async function handler(req: Request): Promise<Response> {
  const cors = buildCorsHeaders(req.headers.get("Origin"));
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== "POST") {
    return apiError(405, "method_not_allowed", MESSAGES.method_not_allowed, cors, { Allow: "POST, OPTIONS" });
  }

  // Cross-site ou non JSON : refus avant toute lecture du corps (voir isOriginAllowed).
  if (!isOriginAllowed(req)) {
    return apiError(403, "forbidden_origin", MESSAGES.forbidden_origin, cors);
  }
  if (!isJsonRequest(req)) {
    return apiError(415, "unsupported_media_type", MESSAGES.unsupported_media_type, cors);
  }

  if (contentLengthExceeds(req, MAX_BODY_BYTES)) {
    return apiError(413, "payload_too_large", MESSAGES.payload_too_large, cors);
  }

  // Rate-limit : 3 candidatures / heure / IP (cohérent avec /api/send-quote)
  const ip = getClientIP(req);
  if (!rateLimit(`apporteurs:${ip}`, 3, 3_600_000)) {
    return apiError(
      429,
      "rate_limited",
      `Trop de candidatures depuis votre connexion. Réessayez dans une heure ou écrivez-nous à ${CONTACT_EMAIL}.`,
      cors,
      { "Retry-After": "3600" },
    );
  }

  const parsed = await readJsonObject(req, MAX_BODY_BYTES, cors);
  if (parsed.ok === false) return parsed.response;
  const body = parsed.body;

  // Honeypot : réponse strictement identique au succès, mais rien n'est envoyé.
  if (isHoneypotFilled(body.website)) {
    console.log(JSON.stringify({ endpoint: ENDPOINT, event: "honeypot" }));
    return json(200, SUCCESS_BODY, cors);
  }

  const validation = validateBody(body);
  if (validation.ok === false) return apiError(400, validation.code, validation.error, cors);
  const d = validation.data;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.EMAIL_TO_RECRUITMENT || process.env.ADMIN_EMAIL || CONTACT_EMAIL;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Nexus Développement <noreply@send.nexusdeveloppement.fr>";

  if (!RESEND_API_KEY) {
    return apiError(503, "not_configured", MESSAGES.not_configured, cors);
  }

  // Escape HTML pour tous les champs avant injection dans les templates
  const safe = {
    civility: escapeHtml(CIVILITY_LABEL[d.civility] || d.civility),
    lastName: escapeHtml(d.lastName),
    firstName: escapeHtml(d.firstName),
    email: escapeHtml(d.email),
    phone: escapeHtml(d.phone),
    birthDate: escapeHtml(d.birthDate),
    city: escapeHtml(d.city),
    workStatus: escapeHtml(WORK_STATUS_LABEL[d.workStatus] || d.workStatus),
    aeStatus: escapeHtml(AE_STATUS_LABEL[d.aeStatus] || d.aeStatus),
    source: escapeHtml(d.source ? SOURCE_LABEL[d.source] || d.source : "Non précisé"),
    reason: escapeHtml(d.reason),
    networkSize: escapeHtml(NETWORK_SIZE_LABEL[d.networkSize] || d.networkSize),
  };

  // ----- Email admin (tableau lisible avec toutes les données) --------------

  const adminHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouvelle candidature apporteur</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#050B1F;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#050B1F 0%,#0A1628 100%);padding:24px 12px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#0F1E36;border-radius:16px;overflow:hidden;border:1px solid rgba(74,158,255,0.25);">
<tr><td style="padding:28px 28px 16px;border-bottom:1px solid rgba(200,205,211,0.1);">
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#4A9EFF;">Nouvelle candidature</p>
  <h1 style="margin:0;color:#E8EAED;font-size:22px;font-weight:700;">Programme apporteur d'affaires</h1>
  <p style="margin:8px 0 0;color:#C8CDD3;font-size:14px;">${safe.civility} ${safe.firstName} ${safe.lastName}</p>
</td></tr>
<tr><td style="padding:24px 28px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#E8EAED;">
    ${row("Email", `<a href="mailto:${safe.email}" style="color:#4A9EFF;text-decoration:none;">${safe.email}</a>`)}
    ${row("Téléphone", `<a href="tel:${safe.phone}" style="color:#4A9EFF;text-decoration:none;">${safe.phone}</a>`)}
    ${row("Date de naissance", safe.birthDate)}
    ${row("Ville", safe.city)}
    ${row("Statut actuel", safe.workStatus)}
    ${row("Auto-entrepreneur", safe.aeStatus)}
    ${row("Source", safe.source)}
    ${row("Taille réseau estimée", safe.networkSize)}
  </table>
</td></tr>
<tr><td style="padding:0 28px 28px;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#C8CDD3;">Motivation</p>
  <div style="background:#050B1F;border:1px solid rgba(200,205,211,0.1);border-radius:10px;padding:14px 16px;color:#E8EAED;font-size:14px;line-height:1.55;white-space:pre-wrap;">${safe.reason}</div>
</td></tr>
</table></td></tr></table></body></html>`;

  // ----- Email candidat : accusé de réception sans aucun texte libre --------
  // (le prénom est validé comme nom de personne : pas d'URL ni de message)

  const candidateHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Candidature reçue</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#050B1F;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#050B1F 0%,#0A1628 100%);padding:32px 16px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0F1E36;border-radius:16px;overflow:hidden;border:1px solid rgba(74,158,255,0.25);">
<tr><td style="padding:36px 32px 24px;text-align:center;border-bottom:1px solid rgba(200,205,211,0.1);">
  <div style="display:inline-block;padding:14px;border-radius:50%;background:rgba(45,212,191,0.15);border:1px solid #2DD4BF;margin-bottom:16px;font-size:24px;line-height:1;">✓</div>
  <h1 style="margin:0;color:#E8EAED;font-size:24px;font-weight:700;">Candidature reçue</h1>
  <p style="margin:10px 0 0;color:#C8CDD3;font-size:15px;">Bonjour ${safe.firstName},</p>
</td></tr>
<tr><td style="padding:24px 32px;color:#C8CDD3;font-size:15px;line-height:1.6;">
  <p style="margin:0 0 14px;">Merci pour votre candidature au programme apporteur d'affaires de Nexus Développement.</p>
  <p style="margin:0 0 14px;">Notre équipe va étudier votre profil et reviendra vers vous <strong style="color:#E8EAED;">sous 48h ouvrées</strong>.</p>
  <p style="margin:0 0 14px;">Si vous êtes retenu(e), vous recevrez par email votre contrat d'apporteur ainsi que votre code apporteur unique pour commencer à présenter vos contacts.</p>
  <p style="margin:24px 0 0;">À très vite,<br><strong style="color:#E8EAED;">L'équipe Ned</strong></p>
</td></tr>
<tr><td style="padding:0 32px 28px;">
  <p style="margin:0;font-size:12px;color:#C8CDD3;text-align:center;border-top:1px solid rgba(200,205,211,0.1);padding-top:16px;">
    <a href="https://nexusdeveloppement.fr/apporteurs" style="color:#4A9EFF;text-decoration:none;">Programme apporteur</a>
    &nbsp;·&nbsp;
    <a href="mailto:${CONTACT_EMAIL}" style="color:#4A9EFF;text-decoration:none;">Nous contacter</a>
  </p>
</td></tr>
</table></td></tr></table></body></html>`;

  // L'email admin est le critère de succès ; l'accusé de réception au candidat
  // n'est envoyé qu'après, en best-effort (voir _lib/resend.ts).
  const delivered = await deliverAdminThenClient({
    endpoint: ENDPOINT,
    apiKey: RESEND_API_KEY,
    admin: {
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: d.email,
      subject: `Candidature apporteur — ${d.firstName} ${d.lastName}`,
      html: adminHtml,
    },
    client: {
      from: FROM_EMAIL,
      to: [d.email],
      subject: "Votre candidature apporteur — Nexus Développement",
      html: candidateHtml,
    },
  });

  if (!delivered) {
    return apiError(502, "upstream_error", UPSTREAM_ERROR_MESSAGE, cors);
  }

  return json(200, SUCCESS_BODY, cors);
}

// --- Helpers HTML -----------------------------------------------------------

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;width:42%;color:#C8CDD3;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">${label}</td>
    <td style="padding:8px 0;color:#E8EAED;font-size:14px;">${value}</td>
  </tr>`;
}
