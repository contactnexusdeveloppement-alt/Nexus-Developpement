// Helpers de validation et sanitisation pour les Vercel Functions.

export function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

export function safeString(v: unknown, max = 255): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

export function safeOptString(v: unknown, max = 255): string | null {
  if (v == null) return null;
  return safeString(v, max);
}

/** Chaîne non vide après trim, sinon null (mauvais type ou vide). */
export function trimString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Champ facultatif : `undefined` si absent/vide (→ null pour l'appelant),
 * la chaîne trimée sinon, ou `false` si le type n'est pas une chaîne.
 */
export function optionalString(v: unknown): string | null | false {
  if (v == null) return null;
  if (typeof v !== "string") return false;
  const trimmed = v.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// Téléphone « souple » (devis / réservation) : chiffres, espaces, +, (), - et point.
export const PHONE_LOOSE_REGEX = /^[\d+\s().-]{6,30}$/;
// Téléphone français strict (candidature apporteur).
export const PHONE_FR_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Nom / prénom : lettres (tout alphabet), espaces, apostrophes, points, tirets.
// Pas de chiffres, ni de retour à la ligne, ni de caractères d'URL (: / @).
const NAME_ALLOWED_REGEX = /^[\p{L}\p{M} .'’-]+$/u;
// Refuse les séquences de type domaine (« exemple.com ») : un point suivi
// directement d'au moins 2 lettres. « M. Dupont » (point + espace) reste valide.
const NAME_URLISH_REGEX = /\.\p{L}{2,}/u;
const LETTER_REGEX = /\p{L}/gu;

/**
 * Vrai si `s` ressemble à un nom de personne. Le nom est réinjecté (échappé)
 * dans l'email de confirmation envoyé au visiteur : cette règle empêche d'y
 * glisser une URL, un numéro ou un message libre.
 */
export function isValidPersonName(s: string): boolean {
  if (!NAME_ALLOWED_REGEX.test(s)) return false;
  if (NAME_URLISH_REGEX.test(s)) return false;
  const letters = s.match(LETTER_REGEX);
  return letters !== null && letters.length >= 2;
}

export const NAME_RULE_MESSAGE =
  "lettres, espaces, apostrophes, points et tirets uniquement (2 lettres minimum)";

/**
 * Honeypot : le champ `website` doit rester vide. Un humain ne le voit pas ;
 * un bot qui remplit tous les champs le renseigne.
 */
export function isHoneypotFilled(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  return true;
}
