import { buildCorsHeaders, isJsonRequest, isOriginAllowed, preflight } from "./_lib/cors";
import { rateLimit, getClientIP } from "./_lib/rate-limit";
import { CONTACT_EMAIL, MESSAGES, apiError, contentLengthExceeds, json, readJsonObject, type ErrorCode } from "./_lib/http";
import { deliverAdminThenClient } from "./_lib/resend";
import {
  NAME_RULE_MESSAGE,
  PHONE_LOOSE_REGEX,
  escapeHtml,
  isHoneypotFilled,
  isValidEmail,
  isValidPersonName,
  optionalString,
  trimString,
} from "./_lib/validation";

// Demande d'audit gratuit de visibilité (page /audit-gratuit, campagnes de
// flyers avec QR code). Même contrat que les autres endpoints : email admin
// obligatoire, confirmation au visiteur en best-effort.

export const config = { runtime: "edge" };

const ENDPOINT = "audit-gratuit";
const MAX_BODY_BYTES = 10_000;
const MAX_BUSINESS_LENGTH = 100;
const MAX_NAME_LENGTH = 60;
const MAX_PHONE_LENGTH = 30;
const MAX_LOCATION_LENGTH = 300;
// Identifiant de campagne repris de ?utm_campaign= (ex. « lyon6-beaute »).
const CAMPAIGN_REGEX = /^[a-z0-9-]{1,40}$/;
// Pas de retour à la ligne ni de caractère de contrôle (le nom du commerce
// part dans l'objet de l'email admin).
// eslint-disable-next-line no-control-regex -- c'est précisément ce qu'on refuse
const CONTROL_CHARS_REGEX = /[\u0000-\u001f\u007f]/;

const SUCCESS_BODY = { success: true, message: "Demande d'audit reçue" };

interface ValidatedAudit {
  business: string;
  firstName: string;
  phone: string;
  email: string;
  location: string;
  campaign: string | null;
}

type Validation = { ok: true; data: ValidatedAudit } | { ok: false; code: ErrorCode; error: string };

const fail = (code: ErrorCode, error: string): Validation => ({ ok: false, code, error });

function validateBody(b: Record<string, unknown>): Validation {
  const business = trimString(b.business);
  const firstName = trimString(b.firstName);
  const phone = trimString(b.phone);
  const email = trimString(b.email);
  const location = trimString(b.location);

  // 1. Obligatoires absents → un seul message
  const problems: string[] = [];
  if (business === null) problems.push("nom du commerce");
  if (firstName === null) problems.push("prénom");
  if (phone === null) problems.push("téléphone");
  if (email === null) problems.push("email");
  if (location === null) problems.push("adresse ou lien de la fiche Google");
  if (b.consent !== true) problems.push("consentement");
  if (problems.length > 0 || business === null || firstName === null || phone === null || email === null || location === null) {
    return fail("missing_fields", `Champs manquants ou invalides : ${problems.join(", ")}.`);
  }

  // 2. Longueurs
  if (business.length > MAX_BUSINESS_LENGTH) {
    return fail("too_long", `Nom du commerce trop long : ${MAX_BUSINESS_LENGTH} caractères maximum.`);
  }
  if (firstName.length > MAX_NAME_LENGTH) {
    return fail("too_long", `Prénom trop long : ${MAX_NAME_LENGTH} caractères maximum.`);
  }
  if (phone.length > MAX_PHONE_LENGTH) {
    return fail("too_long", `Numéro de téléphone trop long : ${MAX_PHONE_LENGTH} caractères maximum.`);
  }
  if (location.length > MAX_LOCATION_LENGTH) {
    return fail("too_long", `Adresse ou lien trop long : ${MAX_LOCATION_LENGTH} caractères maximum.`);
  }

  // 3. Formats
  if (CONTROL_CHARS_REGEX.test(business) || CONTROL_CHARS_REGEX.test(location)) {
    return fail("missing_fields", "Le nom du commerce et l'adresse doivent tenir sur une ligne.");
  }
  if (!isValidPersonName(firstName)) return fail("invalid_name", `Prénom invalide : ${NAME_RULE_MESSAGE}.`);
  if (!isValidEmail(email)) return fail("invalid_email", "Adresse email invalide.");
  if (!PHONE_LOOSE_REGEX.test(phone)) {
    return fail("invalid_phone", "Numéro de téléphone invalide : chiffres, espaces, +, (), - uniquement.");
  }

  // Campagne : facultative, ignorée si elle ne respecte pas le format attendu.
  const rawCampaign = optionalString(b.campaign);
  const campaign = typeof rawCampaign === "string" && CAMPAIGN_REGEX.test(rawCampaign) ? rawCampaign : null;

  return { ok: true, data: { business, firstName, phone, email, location, campaign } };
}

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

  // Rate-limit : 3 demandes / heure / IP
  const ip = getClientIP(req);
  if (!rateLimit(`audit-gratuit:${ip}`, 3, 3_600_000)) {
    return apiError(
      429,
      "rate_limited",
      `Trop de demandes depuis votre connexion. Réessayez dans une heure ou écrivez-nous à ${CONTACT_EMAIL}.`,
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
  const data = validation.data;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Nexus Développement <noreply@send.nexusdeveloppement.fr>";

  if (!RESEND_API_KEY) {
    return apiError(503, "not_configured", MESSAGES.not_configured, cors);
  }

  const safeBusiness = escapeHtml(data.business);
  const safeFirstName = escapeHtml(data.firstName);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeLocation = escapeHtml(data.location);
  const safeCampaign = escapeHtml(data.campaign ?? "aucune (accès direct)");
  const safeContactEmail = escapeHtml(CONTACT_EMAIL);
  // Lien cliquable seulement pour une URL http(s) (fiche Google, Maps…).
  const locationHtml = /^https?:\/\/\S+$/i.test(data.location)
    ? `<a href="${safeLocation}" style="color:#38bdf8;font-size:14px;text-decoration:none;word-break:break-all;">${safeLocation}</a>`
    : `<span style="color:#fff;font-size:14px;font-weight:600;">${safeLocation}</span>`;

  // ----- Email admin -----------------------------------------------------------

  const adminHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Demande d'audit gratuit</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:20px 10px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0ea5e9 100%);border-radius:20px;overflow:hidden;">
<tr><td style="padding:30px 20px 20px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">🔎 Demande d'audit gratuit</h1>
<p style="margin:10px 0 0;color:#93c5fd;font-size:15px;">Résultat promis sous 48 h</p></td></tr>
<tr><td style="padding:10px 15px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;margin-bottom:15px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">🏪 Commerce</h2>
<table width="100%"><tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">Nom :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeBusiness}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Adresse / fiche Google :</td><td style="padding:6px 0;">${locationHtml}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Campagne :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeCampaign}</td></tr></table>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">👤 Contact</h2>
<table width="100%"><tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">Prénom :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeFirstName}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Email :</td><td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#38bdf8;font-size:14px;text-decoration:none;">${safeEmail}</a></td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Téléphone :</td><td style="padding:6px 0;"><a href="tel:${safePhone}" style="color:#38bdf8;font-size:14px;text-decoration:none;">${safePhone}</a></td></tr></table>
</td></tr></table>
</td></tr></table></td></tr></table></body></html>`;

  // ----- Email client : prénom validé uniquement, aucun texte libre (le nom
  // du commerce et l'adresse ne sont pas réinjectés) ------------------------------

  const clientHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Votre demande d'audit est bien reçue</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:20px 10px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0ea5e9 100%);border-radius:20px;overflow:hidden;">
<tr><td style="padding:30px 20px 20px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">✅ Demande d'audit reçue</h1>
<p style="margin:10px 0 0;color:#93c5fd;font-size:15px;">Merci ${safeFirstName} !</p>
</td></tr>
<tr><td style="padding:10px 15px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">🔎 La suite</h2>
<p style="margin:0 0 12px;color:#e2e8f0;font-size:14px;line-height:1.5;">Nous vérifions votre fiche Google, vos informations sur les annuaires, votre site et votre réservation en ligne, ainsi que vos avis. Vous recevez le résultat sous 48 h ouvrées, gratuitement et sans engagement.</p>
<p style="margin:0;color:#e2e8f0;font-size:14px;line-height:1.5;">Une question ? Écrivez à <a href="mailto:${safeContactEmail}" style="color:#38bdf8;">${safeContactEmail}</a>.</p>
</td></tr></table>
</td></tr></table></td></tr></table></body></html>`;

  const delivered = await deliverAdminThenClient({
    endpoint: ENDPOINT,
    apiKey: RESEND_API_KEY,
    admin: {
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: data.email,
      subject: `Audit gratuit — ${data.business}`,
      html: adminHtml,
    },
    client: {
      from: FROM_EMAIL,
      to: [data.email],
      subject: "✅ Votre demande d'audit gratuit est bien reçue",
      html: clientHtml,
    },
  });

  if (!delivered) {
    return apiError(502, "upstream_error", MESSAGES.upstream_error, cors);
  }

  return json(200, SUCCESS_BODY, cors);
}
