import { buildCorsHeaders, preflight } from "./_lib/cors";
import { rateLimit, getClientIP } from "./_lib/rate-limit";
import { escapeHtml, isValidEmail, safeString } from "./_lib/validation";

export const config = { runtime: "edge" };

const VALID_DURATIONS = new Set([15, 30, 60]);
const VALID_TIME_SLOTS = new Set([
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]);
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^[\d+\s().-]{6,30}$/;
const MAX_BODY_BYTES = 10_000;

interface ValidatedBooking {
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  duration: number;
}

function validateBody(body: unknown): { ok: true; data: ValidatedBooking } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;

  const name = safeString(b.name, 100);
  if (!name) return { ok: false, error: "Invalid name" };

  const email = safeString(b.email, 254);
  if (!email || !isValidEmail(email)) return { ok: false, error: "Invalid email" };

  const phone = safeString(b.phone, 30);
  if (!phone || !PHONE_REGEX.test(phone)) return { ok: false, error: "Invalid phone" };

  const booking_date = safeString(b.booking_date, 10);
  if (!booking_date || !DATE_REGEX.test(booking_date)) return { ok: false, error: "Invalid booking_date" };

  // Refuser les dates dans le passé / au-delà de 6 mois
  const target = new Date(booking_date + "T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const sixMonths = new Date();
  sixMonths.setUTCMonth(sixMonths.getUTCMonth() + 6);
  if (isNaN(target.getTime()) || target < today || target > sixMonths) {
    return { ok: false, error: "booking_date out of range" };
  }

  const time_slot = safeString(b.time_slot, 5);
  if (!time_slot || !VALID_TIME_SLOTS.has(time_slot)) return { ok: false, error: "Invalid time_slot" };

  const duration = typeof b.duration === "number" ? b.duration : Number(b.duration);
  if (!VALID_DURATIONS.has(duration)) return { ok: false, error: "Invalid duration" };

  return { ok: true, data: { name, email, phone, booking_date, time_slot, duration } };
}

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "Payload too large" }), {
      status: 413,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = getClientIP(req);
  if (!rateLimit(`book-call:${ip}`, 3, 3_600_000)) {
    return new Response(JSON.stringify({ error: "Trop de réservations. Réessayez plus tard." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "3600" },
    });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact.nexus.developpement@gmail.com";
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Nexus Développement <noreply@send.nexusdeveloppement.fr>";

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const validation = validateBody(body);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const data = validation.data;

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

  const adminHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
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

  const clientHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
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
<p style="margin:0;color:#e2e8f0;font-size:14px;line-height:1.5;">Pour modifier ou annuler, écrivez à <a href="mailto:${escapeHtml(ADMIN_EMAIL)}" style="color:#38bdf8;">${escapeHtml(ADMIN_EMAIL)}</a>.</p>
</td></tr></table>
</td></tr></table></td></tr></table></body></html>`;

  const [adminRes, clientRes] = await Promise.allSettled([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: data.email,
        subject: `📞 Nouvelle réservation - ${safeName}`,
        html: adminHtml,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [data.email],
        subject: `✅ Confirmation de votre appel - ${safeFormattedDate} à ${safeTimeSlot}`,
        html: clientHtml,
      }),
    }),
  ]);

  const adminOk = adminRes.status === "fulfilled" && adminRes.value.ok;
  const clientOk = clientRes.status === "fulfilled" && clientRes.value.ok;

  if (!adminOk && !clientOk) {
    return new Response(JSON.stringify({ error: "Email service unavailable" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "Réservation confirmée" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
