// Envoi d'emails via l'API HTTP Resend + politique de livraison commune aux
// 3 endpoints :
//   - l'email ADMIN est le critère de succès (échec → le handler répond 502) ;
//   - l'email de confirmation au visiteur n'est envoyé qu'après succès de
//     l'email admin, en best-effort (échec → console.warn, statut inchangé) ;
//   - un console.log structuré (JSON, une ligne) par envoi réussi, exploitable
//     dans Vercel Logs. Aucune donnée personnelle dans ces logs : uniquement
//     l'endpoint, l'événement, les ids Resend et le corps d'erreur Resend.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
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

async function sendOnce(apiKey: string, payload: EmailPayload): Promise<SendResult> {
  let res: Response;
  try {
    res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return { ok: false, status: null, reason: truncate(err instanceof Error ? err.message : String(err)) };
  }

  const text = await res.text().catch(() => "");
  if (!res.ok) return { ok: false, status: res.status, reason: truncate(text) };

  let id: string | null = null;
  try {
    const parsed = JSON.parse(text) as { id?: unknown };
    if (typeof parsed.id === "string") id = parsed.id;
  } catch {
    // Corps non JSON : l'envoi a réussi, on garde id = null.
  }
  return { ok: true, id };
}

/** Un envoi, avec une seule nouvelle tentative sur erreur réseau / 429 / 5xx. */
export async function sendEmail(apiKey: string, payload: EmailPayload): Promise<SendResult> {
  const first = await sendOnce(apiKey, payload);
  if (!isRetryable(first)) return first;
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  return sendOnce(apiKey, payload);
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
  const admin = await sendEmail(input.apiKey, input.admin);
  if (admin.ok === false) {
    console.error(
      JSON.stringify({
        endpoint: input.endpoint,
        event: "admin_email_failed",
        status: admin.status,
        reason: admin.reason,
      }),
    );
    return false;
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
