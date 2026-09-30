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

export const config = { runtime: "edge" };

const ENDPOINT = "send-quote";
const MAX_BODY_BYTES = 20_000;
const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 30;
const MAX_BUSINESS_TYPE_LENGTH = 100;
const MAX_PROJECT_DETAILS_LENGTH = 5000;
const MAX_SERVICES = 10;

const SERVICE_LABELS: Record<string, string> = {
  website: "Création d'un site web",
  ecommerce: "Site e-commerce",
  webapp: "Application web",
  mobile: "Application mobile",
  automation: "Automatisation de processus",
  logo: "Création de logo",
  branding: "Branding visuel complet",
  custom: "Service sur mesure",
};
const BUDGET_LABELS: Record<string, string> = {
  "<500": "Moins de 500 €",
  "500-1000": "500 € – 1 000 €",
  "1000-2500": "1 000 € – 2 500 €",
  "2500-5000": "2 500 € – 5 000 €",
  "5000-10000": "5 000 € – 10 000 €",
  ">10000": "Plus de 10 000 €",
};
const TIMELINE_LABELS: Record<string, string> = {
  urgent: "Urgent (moins de 2 semaines)",
  "1month": "Dans le mois",
  "2-3months": "2 à 3 mois",
  flexible: "Flexible",
};
const VALID_SERVICES = new Set(Object.keys(SERVICE_LABELS));
const VALID_BUDGETS = new Set(Object.keys(BUDGET_LABELS));
const VALID_TIMELINES = new Set(Object.keys(TIMELINE_LABELS));

const SUCCESS_BODY = { success: true, message: "Demande envoyée" };

interface ValidatedQuote {
  name: string;
  email: string;
  phone: string | null;
  businessType: string | null;
  services: string[];
  projectDetails: string | null;
  budget: string | null;
  timeline: string | null;
}

type Validation = { ok: true; data: ValidatedQuote } | { ok: false; code: ErrorCode; error: string };

const fail = (code: ErrorCode, error: string): Validation => ({ ok: false, code, error });

function validateBody(b: Record<string, unknown>): Validation {
  const name = trimString(b.name);
  const email = trimString(b.email);
  const phone = optionalString(b.phone);
  const businessType = optionalString(b.businessType);
  const projectDetails = optionalString(b.projectDetails);
  const budget = optionalString(b.budget);
  const timeline = optionalString(b.timeline);

  // 1. Obligatoires absents, mauvais types, valeurs de liste inconnues → un seul message
  const problems: string[] = [];
  if (name === null) problems.push("nom");
  if (email === null) problems.push("email");
  if (phone === false) problems.push("téléphone");
  if (businessType === false) problems.push("activité");
  if (projectDetails === false) problems.push("description du projet");
  if (budget === false || (budget !== null && !VALID_BUDGETS.has(budget))) problems.push("budget");
  if (timeline === false || (timeline !== null && !VALID_TIMELINES.has(timeline))) problems.push("délai");
  if (!Array.isArray(b.services) || b.services.length === 0) problems.push("services");
  if (b.consentGiven !== true) problems.push("consentement (politique de confidentialité)");
  // Les conditions sur name/email/services sont redondantes avec `problems` : elles servent au typage.
  if (problems.length > 0 || name === null || email === null || !Array.isArray(b.services)) {
    return fail("missing_fields", `Champs manquants ou invalides : ${problems.join(", ")}.`);
  }

  // 2. Longueurs
  if (name.length > MAX_NAME_LENGTH) {
    return fail("too_long", `Nom trop long : ${MAX_NAME_LENGTH} caractères maximum.`);
  }
  if (phone && phone.length > MAX_PHONE_LENGTH) {
    return fail("too_long", `Numéro de téléphone trop long : ${MAX_PHONE_LENGTH} caractères maximum.`);
  }
  if (businessType && businessType.length > MAX_BUSINESS_TYPE_LENGTH) {
    return fail("too_long", `Activité trop longue : ${MAX_BUSINESS_TYPE_LENGTH} caractères maximum.`);
  }
  if (projectDetails && projectDetails.length > MAX_PROJECT_DETAILS_LENGTH) {
    return fail("too_long", `Description du projet trop longue : ${MAX_PROJECT_DETAILS_LENGTH} caractères maximum.`);
  }

  // 3. Formats
  if (!isValidPersonName(name)) return fail("invalid_name", `Nom invalide : ${NAME_RULE_MESSAGE}.`);
  if (!isValidEmail(email)) return fail("invalid_email", "Adresse email invalide.");
  if (phone && !PHONE_LOOSE_REGEX.test(phone)) {
    return fail("invalid_phone", "Numéro de téléphone invalide : chiffres, espaces, +, (), - uniquement.");
  }

  // 4. Services
  const rawServices = b.services as unknown[];
  if (rawServices.length > MAX_SERVICES) {
    return fail("invalid_service", `Trop de services sélectionnés : ${MAX_SERVICES} maximum.`);
  }
  const services: string[] = [];
  for (const s of rawServices) {
    if (typeof s !== "string" || !VALID_SERVICES.has(s)) {
      return fail("invalid_service", `Service inconnu. Valeurs acceptées : ${[...VALID_SERVICES].join(", ")}.`);
    }
    if (!services.includes(s)) services.push(s);
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone: phone || null,
      businessType: businessType || null,
      services,
      projectDetails: projectDetails || null,
      budget: budget || null,
      timeline: timeline || null,
    },
  };
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
  if (!rateLimit(`send-quote:${ip}`, 3, 3_600_000)) {
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

  // Préparation HTML emails (escape complet)
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone ?? "");
  const safeBusinessType = escapeHtml(data.businessType ?? "");
  const safeProjectDetails = escapeHtml(data.projectDetails ?? "");
  const safeBudget = escapeHtml(data.budget ? BUDGET_LABELS[data.budget] : "");
  const safeTimeline = escapeHtml(data.timeline ? TIMELINE_LABELS[data.timeline] : "");

  const servicesListHtml = data.services
    .map((id) => `<tr><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">✓ ${escapeHtml(SERVICE_LABELS[id])}</td></tr>`)
    .join("");

  // ----- Email admin : toutes les données, échappées ------------------------

  const adminHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouvelle Demande de Devis</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:20px 10px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0ea5e9 100%);border-radius:20px;overflow:hidden;">
<tr><td style="padding:30px 20px 20px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">📩 Nouvelle Demande de Devis</h1><p style="margin:10px 0 0;color:#93c5fd;font-size:15px;">Une nouvelle opportunité vous attend !</p></td></tr>
<tr><td style="padding:10px 15px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;margin-bottom:15px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">👤 Contact Client</h2>
<table width="100%"><tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">Nom :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeName}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Email :</td><td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#38bdf8;font-size:14px;text-decoration:none;">${safeEmail}</a></td></tr>
${safePhone ? `<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Téléphone :</td><td style="padding:6px 0;"><a href="tel:${safePhone}" style="color:#38bdf8;font-size:14px;text-decoration:none;">${safePhone}</a></td></tr>` : ""}
${safeBusinessType ? `<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Activité :</td><td style="padding:6px 0;color:#fff;font-size:14px;">${safeBusinessType}</td></tr>` : ""}
</table></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;margin-bottom:15px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">🎯 Services Demandés</h2><table width="100%">${servicesListHtml}</table>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">📋 Détails du Projet</h2><table width="100%">
${safeBudget ? `<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">💰 Budget :</td><td style="padding:6px 0;color:#4ade80;font-size:14px;font-weight:600;">${safeBudget}</td></tr>` : ""}
${safeTimeline ? `<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">⏱️ Délai :</td><td style="padding:6px 0;color:#fbbf24;font-size:14px;">${safeTimeline}</td></tr>` : ""}
${safeProjectDetails ? `<tr><td colspan="2" style="padding:10px 0;"><span style="color:#93c5fd;font-size:13px;">📝 Description :</span><p style="color:#e2e8f0;font-size:14px;line-height:1.5;margin:6px 0 0;white-space:pre-wrap;">${safeProjectDetails}</p></td></tr>` : ""}
</table></td></tr></table></td></tr></table></td></tr></table></body></html>`;

  // ----- Email client : récapitulatif structuré uniquement (aucun texte libre,
  // pour ne pas servir de relais d'emails vers des tiers) ---------------------

  const clientHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Confirmation</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px 20px;">
<tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0ea5e9 100%);border-radius:20px;overflow:hidden;">
<tr><td style="padding:40px 40px 20px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">✅ Demande Reçue !</h1>
<p style="margin:10px 0 0;color:#93c5fd;font-size:16px;">Merci ${safeName} pour votre confiance</p>
</td></tr>
<tr><td style="padding:20px 40px 40px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#166534;border-radius:16px;margin-bottom:20px;border:1px solid #22c55e;"><tr><td style="padding:25px;text-align:center;">
<p style="margin:0;color:#86efac;font-size:16px;font-weight:600;">🎉 Votre demande a bien été enregistrée</p></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:16px;margin-bottom:20px;border:1px solid #3b82f6;"><tr><td style="padding:25px;">
<h2 style="margin:0 0 15px;color:#fff;font-size:18px;font-weight:600;">📋 Récapitulatif</h2>
<table width="100%" style="margin-bottom:15px;"><tr><td style="padding-bottom:10px;"><span style="color:#93c5fd;font-size:13px;">Services demandés</span></td></tr>${servicesListHtml}</table>
${safeBudget ? `<table width="100%" style="border-top:1px solid #3b82f6;padding-top:12px;margin-top:12px;"><tr><td><span style="color:#93c5fd;font-size:13px;">💰 Budget</span><br><span style="color:#4ade80;font-size:15px;">${safeBudget}</span></td></tr></table>` : ""}
${safeTimeline ? `<table width="100%" style="border-top:1px solid #3b82f6;padding-top:12px;margin-top:12px;"><tr><td><span style="color:#93c5fd;font-size:13px;">⏱️ Délai</span><br><span style="color:#fbbf24;font-size:15px;">${safeTimeline}</span></td></tr></table>` : ""}
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e40af;border-radius:16px;margin-bottom:20px;border:2px solid #3b82f6;"><tr><td style="padding:20px;text-align:center;">
<p style="margin:0;color:#fff;font-size:15px;font-weight:500;">⏱️ Notre équipe vous recontactera sous <strong style="color:#7dd3fc;">24-48h</strong>.</p></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px 0;">
<p style="margin:0;color:#e2e8f0;font-size:15px;">Cordialement,<br><strong style="color:#7dd3fc;">L'équipe Nexus Développement</strong></p>
</td></tr></table></td></tr></table></td></tr></table></body></html>`;

  const delivered = await deliverAdminThenClient({
    endpoint: ENDPOINT,
    apiKey: RESEND_API_KEY,
    admin: {
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: data.email,
      subject: `📩 Nouvelle demande de devis - ${data.name}`,
      html: adminHtml,
    },
    client: {
      from: FROM_EMAIL,
      to: [data.email],
      subject: "✅ Confirmation de votre demande de devis - Nexus Développement",
      html: clientHtml,
    },
  });

  if (!delivered) {
    return apiError(502, "upstream_error", MESSAGES.upstream_error, cors);
  }

  return json(200, SUCCESS_BODY, cors);
}
