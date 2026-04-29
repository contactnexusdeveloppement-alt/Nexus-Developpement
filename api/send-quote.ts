import { buildCorsHeaders, preflight } from "./_lib/cors";
import { rateLimit, getClientIP } from "./_lib/rate-limit";
import { escapeHtml, isValidEmail, safeOptString, safeString } from "./_lib/validation";

export const config = { runtime: "edge" };

const VALID_SERVICES = new Set(["website", "webapp", "mobile", "automation", "logo", "branding", "custom"]);
const VALID_BUDGETS = new Set(["<500", "500-1000", "1000-2500", "2500-5000", "5000-10000", ">10000"]);
const VALID_TIMELINES = new Set(["urgent", "1month", "2-3months", "flexible"]);
const PHONE_REGEX = /^[\d+\s().-]{6,30}$/;
const MAX_BODY_BYTES = 20_000;

const SERVICE_LABELS: Record<string, string> = {
  website: "Création d'un site web",
  webapp: "Application web",
  mobile: "Application mobile",
  automation: "Automatisation de processus",
  logo: "Création de logo",
  branding: "Branding visuel complet",
  custom: "Service sur mesure",
};

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

function validateBody(body: unknown): { ok: true; data: ValidatedQuote } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;

  const name = safeString(b.name, 100);
  if (!name) return { ok: false, error: "Invalid name" };

  const email = safeString(b.email, 254);
  if (!email || !isValidEmail(email)) return { ok: false, error: "Invalid email" };

  const phone = safeOptString(b.phone, 30);
  if (phone && !PHONE_REGEX.test(phone)) return { ok: false, error: "Invalid phone" };

  const businessType = safeOptString(b.businessType, 100);
  const projectDetails = safeOptString(b.projectDetails, 5000);

  const budget = safeOptString(b.budget, 30);
  if (budget && !VALID_BUDGETS.has(budget)) return { ok: false, error: "Invalid budget" };

  const timeline = safeOptString(b.timeline, 30);
  if (timeline && !VALID_TIMELINES.has(timeline)) return { ok: false, error: "Invalid timeline" };

  if (!Array.isArray(b.services) || b.services.length === 0 || b.services.length > 10) {
    return { ok: false, error: "Invalid services" };
  }
  const services: string[] = [];
  for (const s of b.services) {
    if (typeof s !== "string" || !VALID_SERVICES.has(s)) {
      return { ok: false, error: "Invalid service value" };
    }
    services.push(s);
  }

  if (b.consentGiven !== true) return { ok: false, error: "Consent required" };

  return {
    ok: true,
    data: { name, email, phone, businessType, services, projectDetails, budget, timeline },
  };
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

  // Rate-limit : 3 demandes / heure / IP
  const ip = getClientIP(req);
  if (!rateLimit(`send-quote:${ip}`, 3, 3_600_000)) {
    return new Response(JSON.stringify({ error: "Trop de demandes. Réessayez plus tard." }), {
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

  // Préparation HTML emails (escape complet)
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone ?? "");
  const safeBusinessType = escapeHtml(data.businessType ?? "");
  const safeProjectDetails = escapeHtml(data.projectDetails ?? "");
  const safeBudget = escapeHtml(data.budget ?? "");
  const safeTimeline = escapeHtml(data.timeline ?? "");

  const servicesListHtml = data.services
    .map((id) => `<tr><td style="padding:8px 0;color:#e2e8f0;font-size:14px;">✓ ${escapeHtml(SERVICE_LABELS[id] || id)}</td></tr>`)
    .join("");

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
${safeProjectDetails ? `<table width="100%" style="border-top:1px solid #3b82f6;padding-top:12px;margin-top:12px;"><tr><td><span style="color:#93c5fd;font-size:13px;">📝 Description</span><p style="color:#e2e8f0;font-size:14px;line-height:1.5;margin:8px 0 0;white-space:pre-wrap;">${safeProjectDetails}</p></td></tr></table>` : ""}
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1e40af;border-radius:16px;margin-bottom:20px;border:2px solid #3b82f6;"><tr><td style="padding:20px;text-align:center;">
<p style="margin:0;color:#fff;font-size:15px;font-weight:500;">⏱️ Notre équipe vous recontactera sous <strong style="color:#7dd3fc;">24-48h</strong>.</p></td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px 0;">
<p style="margin:0;color:#e2e8f0;font-size:15px;">Cordialement,<br><strong style="color:#7dd3fc;">L'équipe Nexus Développement</strong></p>
</td></tr></table></td></tr></table></td></tr></table></body></html>`;

  // Envoi parallèle (échec d'un email = on log mais on retourne quand même OK pour l'autre)
  const [adminRes, clientRes] = await Promise.allSettled([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: data.email,
        subject: `📩 Nouvelle demande de devis - ${safeName}`,
        html: adminHtml,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [data.email],
        subject: "✅ Confirmation de votre demande de devis - Nexus Développement",
        html: clientHtml,
      }),
    }),
  ]);

  const adminOk = adminRes.status === "fulfilled" && adminRes.value.ok;
  const clientOk = clientRes.status === "fulfilled" && clientRes.value.ok;

  // Log les détails Resend pour debug (visible dans Vercel Logs)
  for (const [label, res] of [["admin", adminRes], ["client", clientRes]] as const) {
    if (res.status === "rejected") {
      console.error(`Resend ${label} fetch rejected:`, res.reason);
    } else if (!res.value.ok) {
      const errBody = await res.value.text().catch(() => "<no body>");
      console.error(`Resend ${label} ${res.value.status}: ${errBody}`);
    }
  }

  if (!adminOk && !clientOk) {
    return new Response(JSON.stringify({ error: "Email service unavailable" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "Demande envoyée" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
