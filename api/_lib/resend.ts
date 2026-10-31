// Envoi d'emails via l'API HTTP Resend + politique de livraison commune aux
// endpoints des formulaires :
//   - l'email ADMIN est le critère de succès (échec → le handler répond 502) ;
//   - si Resend refuse l'email admin et que BREVO_API_KEY est définie, il
//     part en secours par l'API Brevo, objet préfixé « [Secours Resend] » :
//     la demande n'est pas perdue et le préfixe signale la panne ;
//   - l'email de confirmation au visiteur n'est envoyé qu'après succès de
//     l'email admin, en best-effort (échec → console.warn, statut inchangé) ;
//   - un console.log structuré (JSON, une ligne) par envoi réussi, exploitable
//     dans Vercel Logs. Aucune donnée personnelle dans ces logs : uniquement
//     l'endpoint, l'événement, les ids Resend et le corps d'erreur Resend.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
// Expéditeur du secours : adresse du domaine authentifié dans Brevo.
const BREVO_DEFAULT_SENDER = "contact@nexusdeveloppement.fr";
const FALLBACK_SUBJECT_PREFIX = "[Secours Resend] ";
const MAX_REASON_CHARS = 500;
const RETRY_DELAY_MS = 700;

export interface EmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; status: number | null; reason: string };

function truncate(s: string): string {
  return s.length > MAX_REASON_CHARS ? `${s.slice(0, MAX_REASON_CHARS)}…` : s;
}

function isRetryable(result: SendResult): boolean {
  if (result.ok === true) return false;
  // Erreur réseau (status null), quota Resend (429) ou erreur serveur (5xx).
  return result.status === null || result.status === 429 || result.status >= 500;
}

interface HttpRequest {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  /** Champ de la réponse JSON qui porte l'identifiant du message. */
  idField: string;
}

async function postOnce(request: HttpRequest): Promise<SendResult> {
  let res: Response;
  try {
    res = await fetch(request.url, {
      method: "POST",
      headers: { ...request.headers, "Content-Type": "application/json" },
      body: JSON.stringify(request.body),
    });
  } catch (err) {
    return { ok: false, status: null, reason: truncate(err instanceof Error ? err.message : String(err)) };
  }

  const text = await res.text().catch(() => "");
  if (!res.ok) return { ok: false, status: res.status, reason: truncate(text) };

  let id: string | null = null;
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (typeof parsed[request.idField] === "string") id = parsed[request.idField] as string;
  } catch {
    // Corps non JSON : l'envoi a réussi, on garde id = null.
  }
  return { ok: true, id };
}

/** Un envoi, avec une seule nouvelle tentative sur erreur réseau / 429 / 5xx. */
async function postWithRetry(request: HttpRequest): Promise<SendResult> {
  const first = await postOnce(request);
  if (!isRetryable(first)) return first;
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  return postOnce(request);
}

/** Envoi par Resend. */
export function sendEmail(apiKey: string, payload: EmailPayload): Promise<SendResult> {
  return postWithRetry({
    url: RESEND_ENDPOINT,
    headers: { Authorization: `Bearer ${apiKey}` },
    body: payload,
    idField: "id",
  });
}

/** Envoi de secours par Brevo (API transactionnelle), même contenu, objet préfixé. */
export function sendFallbackEmail(apiKey: string, senderEmail: string, payload: EmailPayload): Promise<SendResult> {
  return postWithRetry({
    url: BREVO_ENDPOINT,
    headers: { "api-key": apiKey, Accept: "application/json" },
    body: {
      sender: { name: "Nexus Développement", email: senderEmail },
      to: payload.to.map((email) => ({ email })),
      ...(payload.reply_to ? { replyTo: { email: payload.reply_to } } : {}),
      subject: `${FALLBACK_SUBJECT_PREFIX}${payload.subject}`,
      htmlContent: payload.html,
    },
    idField: "messageId",
  });
}

export interface DeliveryInput {
  /** Nom court de l'endpoint pour les logs (ex. "send-quote"). */
  endpoint: string;
  apiKey: string;
  admin: EmailPayload;
  client: EmailPayload;
}

/**
 * Envoie l'email admin puis, seulement s'il est parti, l'email client.
 * @returns true si l'email admin a été accepté par Resend, false sinon
 *          (le handler doit alors répondre 502 `upstream_error`).
 */
export async function deliverAdminThenClient(input: DeliveryInput): Promise<boolean> {
  let admin = await sendEmail(input.apiKey, input.admin);
  if (admin.ok === false) {
    console.error(
      JSON.stringify({
        endpoint: input.endpoint,
        event: "admin_email_failed",
        status: admin.status,
        reason: admin.reason,
      }),
    );

    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) return false;
    admin = await sendFallbackEmail(brevoKey, process.env.BREVO_SENDER_EMAIL || BREVO_DEFAULT_SENDER, input.admin);
    if (admin.ok === false) {
      console.error(
        JSON.stringify({
          endpoint: input.endpoint,
          event: "fallback_email_failed",
          status: admin.status,
          reason: admin.reason,
        }),
      );
      return false;
    }
    console.warn(JSON.stringify({ endpoint: input.endpoint, event: "fallback_email_sent", adminId: admin.id }));
  }

  const client = await sendEmail(input.apiKey, input.client);
  if (client.ok === false) {
    console.warn(
      JSON.stringify({
        endpoint: input.endpoint,
        event: "client_email_failed",
        status: client.status,
        reason: client.reason,
        adminId: admin.id,
      }),
    );
  }

  console.log(
    JSON.stringify({
      endpoint: input.endpoint,
      event: "emails_sent",
      adminId: admin.id,
      clientId: client.ok === true ? client.id : null,
    }),
  );
  return true;
}
