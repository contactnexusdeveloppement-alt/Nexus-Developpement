import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Search, Globe, Star, Send } from "lucide-react";
import SEO from "@/components/SEO";
import AnimatedBackground from "@/components/AnimatedBackground";
import ClientOnly from "@/components/ClientOnly";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { intro } from "@/lib/motion";
import { readCampaign, trackEvent } from "@/lib/analytics";
import logo from "@/assets/nexus-logo.webp";

/**
 * Page d'atterrissage des flyers (QR code) : audit gratuit de visibilité.
 * Comme /links : sans Navigation ni Footer global, mobile d'abord (le QR est
 * scanné au téléphone). Non indexée : elle ne sert qu'aux campagnes.
 *
 * Suivi : l'URL du QR porte ?utm_campaign=… ; la campagne est envoyée en
 * événement Vercel Web Analytics (vue + demande) et reprise dans l'email.
 */

const CHECKS = [
  { icon: Search, text: "Votre fiche Google : catégories, horaires, photos et informations à jour." },
  { icon: MapPin, text: "Votre adresse et vos horaires sur les annuaires (Pages Jaunes, Apple Plans, Bing…) : sont-ils partout les mêmes ?" },
  { icon: Globe, text: "Votre site et votre prise de rendez-vous ou de réservation en ligne." },
  { icon: Star, text: "Vos avis : nombre, note et réponses apportées." },
];

const AuditGratuit = () => {
  const { search } = useLocation();
  const [campaign, setCampaign] = useState<string | null>(null);

  useEffect(() => {
    const value = readCampaign(search);
    setCampaign(value);
    trackEvent("Audit gratuit - vue", { campaign: value ?? "direct" });
  }, [search]);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#0a0f1e" }}>
      <SEO
        title="Audit gratuit de votre visibilité en ligne | Nexus Développement"
        description="Fiche Google, annuaires, site, réservation et avis : on vérifie ce que vos clients voient de votre commerce. Gratuit, sans engagement, résultat sous 48 h."
        canonical="https://nexusdeveloppement.fr/audit-gratuit"
        noindex
      />

      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6">
        <div className="w-full max-w-[560px]">
          <motion.header
            initial={intro({ opacity: 0, y: -10 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <img
              src={logo}
              alt="Logo Nexus Développement"
              width={88}
              height={88}
              className="w-[88px] h-[88px] mx-auto drop-shadow-[0_0_25px_rgba(100,150,255,0.4)]"
              loading="eager"
              fetchPriority="high"
            />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Commerces de proximité
            </p>
            <h1 className="mt-3 text-[28px] sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Audit gratuit de votre visibilité en ligne, en 48&nbsp;h
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
              Avant de pousser votre porte, vos clients vous cherchent sur leur téléphone. On vérifie ce
              qu'ils trouvent et on vous dit quoi corriger en priorité.
            </p>
          </motion.header>

          <motion.ul
            initial={intro({ opacity: 0, y: 10 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="audit-card space-y-3 mb-8"
            aria-label="Ce que nous vérifions"
          >
            {CHECKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-slate-200">
                <span className="audit-check" aria-hidden="true">
                  <Icon className="w-4 h-4 text-blue-300" />
                </span>
                <span>{text}</span>
              </li>
            ))}
            <li className="pt-2 text-sm font-semibold text-teal-300">
              Gratuit et sans engagement. Résultat envoyé par email sous 48&nbsp;h ouvrées.
            </li>
          </motion.ul>

          <section aria-labelledby="audit-form-title" className="audit-card">
            <h2 id="audit-form-title" className="text-xl font-bold text-white mb-1">
              Demander mon audit
            </h2>
            <p className="text-sm text-slate-400 mb-5">1 minute, 5 champs.</p>
            <ClientOnly fallback={<div className="min-h-[520px]" aria-hidden="true" />}>
              <AuditForm campaign={campaign} />
            </ClientOnly>
          </section>

          <p className="mt-8 text-center text-sm text-slate-300">
            Théo, Nexus Développement · Lyon 6<sup>e</sup>
          </p>

          <footer className="mt-6 text-center text-[11px] uppercase tracking-wider text-slate-500 space-x-2">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Notre site
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/mentions-legales" className="hover:text-blue-400 transition-colors">
              Mentions légales
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/confidentialite" className="hover:text-blue-400 transition-colors">
              Confidentialité
            </Link>
          </footer>
        </div>
      </main>

      <style>{`
        .audit-card {
          background: rgba(15, 30, 54, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(74, 158, 255, 0.25);
          border-radius: 16px;
          padding: 20px;
        }
        @media (min-width: 640px) {
          .audit-card { padding: 28px; }
        }
        .audit-check {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background-color: rgba(74, 158, 255, 0.12);
          border: 1px solid rgba(74, 158, 255, 0.25);
        }
      `}</style>
    </div>
  );
};

interface FormState {
  business: string;
  firstName: string;
  phone: string;
  email: string;
  location: string;
  consent: boolean;
  /** Honeypot : doit rester vide. */
  website: string;
}

const initialState: FormState = {
  business: "",
  firstName: "",
  phone: "",
  email: "",
  location: "",
  consent: false,
  website: "",
};

type Errors = Partial<Record<keyof FormState | "form", string>>;

const PHONE_REGEX = /^[\d+\s().-]{6,30}$/;

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(5, 11, 31, 0.6)",
  borderColor: "rgba(74, 158, 255, 0.25)",
  color: "#f1f5f9",
};

const AuditForm = ({ campaign }: { campaign: string | null }) => {
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        delete next.form;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!data.business.trim()) e.business = "Nom du commerce obligatoire";
    if (!data.firstName.trim()) e.firstName = "Prénom obligatoire";
    if (!PHONE_REGEX.test(data.phone.trim())) e.phone = "Numéro de téléphone invalide";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Email invalide";
    if (!data.location.trim()) e.location = "Adresse ou lien obligatoire";
    if (!data.consent) e.consent = "Votre accord est nécessaire pour réaliser l'audit";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/audit-gratuit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, campaign }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erreur ${res.status}`);
      }
      trackEvent("Audit gratuit - demande", { campaign: campaign ?? "direct" });
      setSuccess(true);
      setData(initialState);
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Impossible d'envoyer la demande. Réessayez ou écrivez à contact@nexusdeveloppement.fr.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6" role="status">
        <CheckCircle2 className="w-12 h-12 mx-auto text-teal-300" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold text-white">Demande reçue, merci&nbsp;!</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Vous recevez le résultat par email sous 48&nbsp;h ouvrées. Pensez à regarder dans vos spams.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot anti-spam : caché aux humains */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      >
        <label htmlFor="audit-website">Votre site web</label>
        <input
          id="audit-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <Field id="audit-business" label="Nom du commerce" error={errors.business}>
        <Input
          id="audit-business"
          value={data.business}
          onChange={(e) => update("business", e.target.value)}
          autoComplete="organization"
          maxLength={100}
          style={inputStyle}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="audit-firstName" label="Prénom" error={errors.firstName}>
          <Input
            id="audit-firstName"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            autoComplete="given-name"
            maxLength={60}
            style={inputStyle}
          />
        </Field>
        <Field id="audit-phone" label="Téléphone" error={errors.phone}>
          <Input
            id="audit-phone"
            type="tel"
            inputMode="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            maxLength={30}
            style={inputStyle}
          />
        </Field>
      </div>

      <Field id="audit-email" label="Email" error={errors.email}>
        <Input
          id="audit-email"
          type="email"
          inputMode="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
          style={inputStyle}
        />
      </Field>

      <Field id="audit-location" label="Adresse du commerce ou lien de votre fiche Google" error={errors.location}>
        <Input
          id="audit-location"
          value={data.location}
          onChange={(e) => update("location", e.target.value)}
          autoComplete="street-address"
          placeholder="Adresse ou lien Google Maps"
          maxLength={300}
          style={inputStyle}
        />
      </Field>

      <div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="audit-consent"
            checked={data.consent}
            onCheckedChange={(v) => update("consent", v === true)}
            className="mt-0.5 border-[rgba(74,158,255,0.4)] data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
          <Label htmlFor="audit-consent" className="text-sm leading-relaxed cursor-pointer text-slate-300 font-normal">
            J'accepte que Nexus Développement utilise ces informations pour réaliser l'audit et me
            recontacter à son sujet, conformément à sa{" "}
            <Link to="/confidentialite" target="_blank" className="underline text-blue-300">
              politique de confidentialité
            </Link>
            .
          </Label>
        </div>
        <FieldError msg={errors.consent} />
      </div>

      {errors.form && (
        <p className="text-sm font-medium text-red-400" role="alert">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_24px_-4px_rgba(74,158,255,0.6)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        {isSubmitting ? "Envoi en cours…" : "Recevoir mon audit gratuit"}
        {!isSubmitting && <Send className="w-4 h-4" aria-hidden="true" />}
      </button>
    </form>
  );
};

const Field = ({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label htmlFor={id} className="text-slate-200">
      {label} <span className="text-blue-400" aria-hidden="true">*</span>
    </Label>
    <div className="mt-1.5">{children}</div>
    <FieldError msg={error} />
  </div>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs mt-1.5 font-medium text-red-400" role="alert">
      {msg}
    </p>
  ) : null;

export default AuditGratuit;
