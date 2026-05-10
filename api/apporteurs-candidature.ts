import { buildCorsHeaders, preflight } from "./_lib/cors";
import { rateLimit, getClientIP } from "./_lib/rate-limit";
import { escapeHtml, isValidEmail, safeOptString, safeString } from "./_lib/validation";

export const config = { runtime: "edge" };

// --- Constantes de validation -----------------------------------------------

const VALID_CIVILITIES = new Set(["mme", "m", "autre"]);
const VALID_WORK_STATUS = new Set(["etudiant", "salarie", "independant", "sans_emploi", "autre"]);
const VALID_AE_STATUS = new Set(["yes", "no", "in_progress"]);
const VALID_SOURCES = new Set(["instagram", "linkedin", "tiktok", "bouche_a_oreille", "autre"]);
const VALID_NETWORK_SIZES = new Set(["0-5", "6-15", "16-50", "50+"]);

const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_BODY_BYTES = 30_000;
const MIN_REASON_LENGTH = 200;
const MAX_REASON_LENGTH = 5000;

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

function isAtLeast16(dateString: string): boolean {
  const birth = new Date(dateString + "T00:00:00Z");
  if (isNaN(birth.getTime())) return false;
  const cutoff = new Date();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 16);
  return birth <= cutoff;
}

function validateBody(
  body: unknown,
): { ok: true; data: ValidatedCandidature } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;

  // Honeypot — un humain ne remplit pas ce champ
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return { ok: false, error: "Spam detected" };
  }

  const civility = safeString(b.civility, 10);
  if (!civility || !VALID_CIVILITIES.has(civility)) return { ok: false, error: "Invalid civility" };

  const lastName = safeString(b.lastName, 100);
  if (!lastName) return { ok: false, error: "Invalid lastName" };

  const firstName = safeString(b.firstName, 100);
  if (!firstName) return { ok: false, error: "Invalid firstName" };

  const email = safeString(b.email, 254);
  if (!email || !isValidEmail(email)) return { ok: false, error: "Invalid email" };

  const phoneRaw = safeString(b.phone, 30);
  if (!phoneRaw || !PHONE_REGEX.test(phoneRaw.trim())) return { ok: false, error: "Invalid phone" };

  const birthDate = safeString(b.birthDate, 10);
  if (!birthDate || !DATE_REGEX.test(birthDate) || !isAtLeast16(birthDate)) {
    return { ok: false, error: "Invalid birthDate" };
  }

  const city = safeString(b.city, 100);
  if (!city) return { ok: false, error: "Invalid city" };

  const workStatus = safeString(b.workStatus, 30);
  if (!workStatus || !VALID_WORK_STATUS.has(workStatus)) {
    return { ok: false, error: "Invalid workStatus" };
  }

  const aeStatus = safeString(b.aeStatus, 30);
  if (!aeStatus || !VALID_AE_STATUS.has(aeStatus)) {
    return { ok: false, error: "Invalid aeStatus" };
  }

  const source = safeOptString(b.source, 30);
  if (source && !VALID_SOURCES.has(source)) return { ok: false, error: "Invalid source" };

  const reasonRaw = safeString(b.reason, MAX_REASON_LENGTH);
  if (!reasonRaw || reasonRaw.length < MIN_REASON_LENGTH) {
    return { ok: false, error: "Invalid reason" };
  }

  const networkSize = safeString(b.networkSize, 10);
  if (!networkSize || !VALID_NETWORK_SIZES.has(networkSize)) {
    return { ok: false, error: "Invalid networkSize" };
  }

  if (b.consentRgpd !== true) return { ok: false, error: "RGPD consent required" };
  if (b.consentContract !== true) return { ok: false, error: "Contract consent required" };

  return {
    ok: true,
    data: {
      civility,
      lastName,
      firstName,
      email,
      phone: phoneRaw,
      birthDate,
      city,
      workStatus,
      aeStatus,
      source,
      reason: reasonRaw,
      networkSize,
    },
  };
}

// --- Handler ----------------------------------------------------------------

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

  // Rate-limit : 3 candidatures / heure / IP (cohérent avec /api/send-quote)
  const ip = getClientIP(req);
  if (!rateLimit(`apporteurs:${ip}`, 3, 3_600_000)) {
    return new Response(
      JSON.stringify({ error: "Trop de candidatures. Réessayez plus tard." }),
      {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "3600" },
      },
    );
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL =
    process.env.EMAIL_TO_RECRUITMENT ||
    process.env.ADMIN_EMAIL ||
    "contact.nexus.developpement@gmail.com";
  const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL ||
    "Nexus Développement <noreply@send.nexusdeveloppement.fr>";

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
  const d = validation.data;

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

  // ----- Email candidat (sobre, accusé de réception) -----------------------

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
    <a href="mailto:contact.nexus.developpement@gmail.com" style="color:#4A9EFF;text-decoration:none;">Nous contacter</a>
  </p>
</td></tr>
</table></td></tr></table></body></html>`;

  // Envoi parallèle (échec d'un email = on log mais on retourne quand même OK)
  const [adminRes, candidateRes] = await Promise.allSettled([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: d.email,
        subject: `Candidature apporteur — ${d.firstName} ${d.lastName}`,
        html: adminHtml,
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [d.email],
        subject: "Votre candidature apporteur — Nexus Développement",
        html: candidateHtml,
      }),
    }),
  ]);

  const adminOk = adminRes.status === "fulfilled" && adminRes.value.ok;
  const candidateOk = candidateRes.status === "fulfilled" && candidateRes.value.ok;

  if (!adminOk && !candidateOk) {
    return new Response(JSON.stringify({ error: "Email service unavailable" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "Candidature reçue" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

// --- Helpers HTML -----------------------------------------------------------

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;width:42%;color:#C8CDD3;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">${label}</td>
    <td style="padding:8px 0;color:#E8EAED;font-size:14px;">${value}</td>
  </tr>`;
}
