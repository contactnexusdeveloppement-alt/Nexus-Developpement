import { buildCorsHeaders, isJsonRequest, isOriginAllowed, preflight } from "./_lib/cors";
import { rateLimit, getClientIP } from "./_lib/rate-limit";
import { CONTACT_EMAIL, MESSAGES, apiError, contentLengthExceeds, json, readJsonObject, type ErrorCode } from "./_lib/http";
import { deliverAdminThenClient } from "./_lib/resend";
import {
  DATE_REGEX,
  NAME_RULE_MESSAGE,
  PHONE_LOOSE_REGEX,
  escapeHtml,
  isHoneypotFilled,
  isValidEmail,
  isValidPersonName,
  trimString,
} from "./_lib/validation";

export const config = { runtime: "edge" };

const ENDPOINT = "book-call";
const MAX_BODY_BYTES = 10_000;
const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 30;

const VALID_DURATIONS = new Set([15, 30, 60]);
const VALID_TIME_SLOTS = new Set([
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]);

const SUCCESS_BODY = { success: true, message: "Réservation confirmée" };

interface ValidatedBooking {
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  duration: number;
}

type Validation = { ok: true; data: ValidatedBooking } | { ok: false; code: ErrorCode; error: string };

const fail = (code: ErrorCode, error: string): Validation => ({ ok: false, code, error });

function validateBody(b: Record<string, unknown>): Validation {
  const name = trimString(b.name);
  const email = trimString(b.email);
  const phone = trimString(b.phone);
  const booking_date = trimString(b.booking_date);
  const time_slot = trimString(b.time_slot);

  // 1. Obligatoires absents → un seul message
  const problems: string[] = [];
  if (name === null) problems.push("nom");
  if (email === null) problems.push("email");
  if (phone === null) problems.push("téléphone");
  if (booking_date === null) problems.push("date (booking_date)");
  if (time_slot === null) problems.push("créneau (time_slot)");
  if (b.duration == null || b.duration === "") problems.push("durée (duration)");
  // Redondant avec `problems` pour name/email/... : sert au typage.
  if (problems.length > 0 || name === null || email === null || phone === null || booking_date === null || time_slot === null) {
    return fail("missing_fields", `Champs manquants ou invalides : ${problems.join(", ")}.`);
  }

  // 2. Longueurs
  if (name.length > MAX_NAME_LENGTH) {
    return fail("too_long", `Nom trop long : ${MAX_NAME_LENGTH} caractères maximum.`);
  }
  if (phone.length > MAX_PHONE_LENGTH) {
    return fail("too_long", `Numéro de téléphone trop long : ${MAX_PHONE_LENGTH} caractères maximum.`);
  }

  // 3. Formats
  if (!isValidPersonName(name)) return fail("invalid_name", `Nom invalide : ${NAME_RULE_MESSAGE}.`);
  if (!isValidEmail(email)) return fail("invalid_email", "Adresse email invalide.");
  if (!PHONE_LOOSE_REGEX.test(phone)) {
    return fail("invalid_phone", "Numéro de téléphone invalide : chiffres, espaces, +, (), - uniquement.");
  }

  // 4. Créneau : date (AAAA-MM-JJ, d'aujourd'hui à +6 mois), horaire, durée
  if (!DATE_REGEX.test(booking_date)) {
    return fail("invalid_slot", "Date invalide : format AAAA-MM-JJ attendu.");
  }
  const target = new Date(booking_date + "T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const sixMonths = new Date();
  sixMonths.setUTCMonth(sixMonths.getUTCMonth() + 6);
  if (isNaN(target.getTime()) || target < today || target > sixMonths) {
    return fail("invalid_slot", "Date hors plage : choisissez un jour entre aujourd'hui et dans 6 mois.");
  }

  if (!VALID_TIME_SLOTS.has(time_slot)) {
    return fail("invalid_slot", "Créneau invalide : horaires possibles de 09:00 à 11:30 et de 14:00 à 17:30, par tranches de 30 minutes.");
  }

  const duration = typeof b.duration === "number" ? b.duration : Number(b.duration);
  if (!VALID_DURATIONS.has(duration)) {
    return fail("invalid_slot", "Durée invalide : 15, 30 ou 60 minutes.");
  }

  return { ok: true, data: { name, email, phone, booking_date, time_slot, duration } };
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

  // Rate-limit : 3 réservations / heure / IP
  const ip = getClientIP(req);
  if (!rateLimit(`book-call:${ip}`, 3, 3_600_000)) {
    return apiError(
      429,
      "rate_limited",
      `Trop de réservations depuis votre connexion. Réessayez dans une heure ou écrivez-nous à ${CONTACT_EMAIL}.`,
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

  const dateObj = new Date(data.booking_date + "T00:00:00Z");
  const formattedDate = dateObj.toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Paris",
  });
  const durationLabel = data.duration === 15 ? "15 minutes" : data.duration === 30 ? "30 minutes" : "1 heure";

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeTimeSlot = escapeHtml(data.time_slot);
  const safeFormattedDate = escapeHtml(formattedDate);
  const safeAdminEmail = escapeHtml(ADMIN_EMAIL);

  // ----- Email admin -----------------------------------------------------------

  const adminHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouvelle réservation d'appel</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:20px 10px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0ea5e9 100%);border-radius:20px;overflow:hidden;">
<tr><td style="padding:30px 20px 20px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">📞 Nouvelle Réservation d'Appel</h1></td></tr>
<tr><td style="padding:10px 15px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;margin-bottom:15px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">📅 Détails du rendez-vous</h2>
<table width="100%"><tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">Date :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeFormattedDate}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Heure :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeTimeSlot}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Durée :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${durationLabel}</td></tr></table>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">👤 Coordonnées du client</h2>
<table width="100%"><tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">Nom :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeName}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Email :</td><td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#38bdf8;font-size:14px;text-decoration:none;">${safeEmail}</a></td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Téléphone :</td><td style="padding:6px 0;"><a href="tel:${safePhone}" style="color:#38bdf8;font-size:14px;text-decoration:none;">${safePhone}</a></td></tr></table>
</td></tr></table>
</td></tr></table></td></tr></table></body></html>`;

  // ----- Email client : récapitulatif structuré (nom validé, date, heure,
  // durée, téléphone au format contrôlé) — aucun texte libre --------------------

  const clientHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Votre appel est confirmé</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:20px 10px;">
<tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0ea5e9 100%);border-radius:20px;overflow:hidden;">
<tr><td style="padding:30px 20px 20px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">✅ Votre appel est confirmé !</h1>
<p style="margin:10px 0 0;color:#93c5fd;font-size:15px;">Merci ${safeName} pour votre réservation</p>
</td></tr>
<tr><td style="padding:10px 15px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;margin-bottom:15px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">📅 Récapitulatif</h2>
<table width="100%"><tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;width:35%;">Date :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeFormattedDate}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Heure :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${safeTimeSlot}</td></tr>
<tr><td style="padding:6px 0;color:#93c5fd;font-size:13px;">Durée :</td><td style="padding:6px 0;color:#fff;font-size:14px;font-weight:600;">${durationLabel}</td></tr></table>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e3a5a;border-radius:12px;border:2px solid #3b82f6;"><tr><td style="padding:20px;">
<h2 style="margin:0 0 12px;color:#fff;font-size:16px;">📞 Comment ça se passe ?</h2>
<p style="margin:0 0 12px;color:#e2e8f0;font-size:14px;line-height:1.5;">Nous vous appellerons au numéro <strong style="color:#38bdf8;">${safePhone}</strong> à l'heure convenue.</p>
<p style="margin:0;color:#e2e8f0;font-size:14px;line-height:1.5;">Pour modifier ou annuler, écrivez à <a href="mailto:${safeAdminEmail}" style="color:#38bdf8;">${safeAdminEmail}</a>.</p>
</td></tr></table>
</td></tr></table></td></tr></table></body></html>`;

  const delivered = await deliverAdminThenClient({
    endpoint: ENDPOINT,
    apiKey: RESEND_API_KEY,
    admin: {
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: data.email,
      subject: `📞 Nouvelle réservation - ${data.name}`,
      html: adminHtml,
    },
    client: {
      from: FROM_EMAIL,
      to: [data.email],
      subject: `✅ Confirmation de votre appel - ${formattedDate} à ${data.time_slot}`,
      html: clientHtml,
    },
  });

  if (!delivered) {
    return apiError(502, "upstream_error", MESSAGES.upstream_error, cors);
  }

  return json(200, SUCCESS_BODY, cors);
}
