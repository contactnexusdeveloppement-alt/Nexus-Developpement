import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import ApporteursLegalModal from "@/components/apporteurs/ApporteursLegalModal";

const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const MIN_REASON_LENGTH = 200;

type CivilityValue = "mme" | "m" | "autre";
type AEStatus = "yes" | "no" | "in_progress";
type WorkStatus = "etudiant" | "salarie" | "independant" | "sans_emploi" | "autre";
type Source = "instagram" | "linkedin" | "tiktok" | "bouche_a_oreille" | "autre";
type NetworkSize = "0-5" | "6-15" | "16-50" | "50+";

interface FormState {
  civility: CivilityValue | "";
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  workStatus: WorkStatus | "";
  aeStatus: AEStatus | "";
  source: Source | "";
  reason: string;
  networkSize: NetworkSize | "";
  consentRgpd: boolean;
  consentContract: boolean;
  /** Honeypot — doit rester vide. Si rempli, on rejette côté serveur. */
  website: string;
}

const initialState: FormState = {
  civility: "",
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
  birthDate: "",
  city: "",
  workStatus: "",
  aeStatus: "",
  source: "",
  reason: "",
  networkSize: "",
  consentRgpd: false,
  consentContract: false,
  website: "",
};

function isAdult(dateString: string): boolean {
  if (!dateString) return false;
  const birth = new Date(dateString);
  if (isNaN(birth.getTime())) return false;
  const now = new Date();
  const sixteenYearsAgo = new Date(
    now.getFullYear() - 16,
    now.getMonth(),
    now.getDate(),
  );
  return birth <= sixteenYearsAgo;
}

const ApporteursForm = () => {
  const { toast } = useToast();
  const [data, setData] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!data.civility) e.civility = "Sélectionnez une civilité";
    if (!data.lastName.trim()) e.lastName = "Nom obligatoire";
    if (!data.firstName.trim()) e.firstName = "Prénom obligatoire";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Email invalide";
    if (!PHONE_REGEX.test(data.phone.trim())) e.phone = "Numéro français attendu";
    if (!isAdult(data.birthDate)) e.birthDate = "Vous devez avoir au moins 16 ans";
    if (!data.city.trim()) e.city = "Ville obligatoire";
    if (!data.workStatus) e.workStatus = "Sélectionnez un statut";
    if (!data.aeStatus) e.aeStatus = "Précisez votre statut auto-entrepreneur";
    if (data.reason.trim().length < MIN_REASON_LENGTH)
      e.reason = `Minimum ${MIN_REASON_LENGTH} caractères (actuel : ${data.reason.trim().length})`;
    if (!data.networkSize) e.networkSize = "Estimez votre réseau";
    if (!data.consentRgpd) e.consentRgpd = "Consentement RGPD requis";
    if (!data.consentContract) e.consentContract = "Acceptation requise";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Formulaire incomplet",
        description: "Vérifiez les champs en rouge.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/apporteurs-candidature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      setSuccess(true);
      setData(initialState);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof Error
            ? err.message
            : "Impossible d'envoyer la candidature. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section
        id="postuler"
        className="py-20 md:py-28 px-4"
        style={{ backgroundColor: "var(--ned-bg-elevated)" }}
        aria-labelledby="success-title"
      >
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 border"
              style={{
                backgroundColor: "rgba(45, 212, 191, 0.15)",
                borderColor: "var(--ned-success)",
              }}
            >
              <CheckCircle2
                className="w-8 h-8"
                style={{ color: "var(--ned-success)" }}
                aria-hidden="true"
              />
            </div>
            <h2
              id="success-title"
              className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight"
              style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
            >
              Candidature reçue&nbsp;!
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--ned-silver)" }}>
              On revient vers vous sous 48h ouvrées. Pensez à vérifier vos spams si vous ne voyez
              rien dans votre boîte principale.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-8 text-sm underline underline-offset-4 hover:no-underline focus:outline-none"
              style={{ color: "var(--ned-accent)" }}
            >
              Envoyer une autre candidature
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(5, 11, 31, 0.6)",
    borderColor: "var(--ned-border)",
    color: "var(--ned-silver-light)",
  };

  return (
    <section
      id="postuler"
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-elevated)" }}
      aria-labelledby="form-title"
    >
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2
            id="form-title"
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-3"
            style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
          >
            Postuler en 2 minutes
          </h2>
          <p className="text-base md:text-lg" style={{ color: "var(--ned-silver)" }}>
            On revient vers vous sous 48h ouvrées.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border p-6 md:p-8 space-y-6"
          style={{
            backgroundColor: "var(--ned-bg-deep)",
            borderColor: "var(--ned-border)",
          }}
        >
          {/* Honeypot anti-spam — caché aux humains, visible aux bots */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="apporteurs-website">Votre site web</label>
            <input
              id="apporteurs-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          {/* Civilité */}
          <fieldset>
            <legend
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--ned-silver-light)" }}
            >
              Civilité <Required />
            </legend>
            <RadioGroup
              value={data.civility}
              onValueChange={(v) => update("civility", v as CivilityValue)}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "mme", label: "Mme" },
                { value: "m", label: "M." },
                { value: "autre", label: "Autre" },
              ].map((o) => (
                <div key={o.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={o.value}
                    id={`civility-${o.value}`}
                    className="border-[var(--ned-border)] text-[var(--ned-accent)]"
                  />
                  <Label
                    htmlFor={`civility-${o.value}`}
                    className="cursor-pointer"
                    style={{ color: "var(--ned-silver)" }}
                  >
                    {o.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <FieldError msg={errors.civility} />
          </fieldset>

          {/* Nom + Prénom */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastName" style={{ color: "var(--ned-silver-light)" }}>
                Nom <Required />
              </Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                autoComplete="family-name"
                required
                className="mt-1.5"
                style={inputStyle}
              />
              <FieldError msg={errors.lastName} />
            </div>
            <div>
              <Label htmlFor="firstName" style={{ color: "var(--ned-silver-light)" }}>
                Prénom <Required />
              </Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                autoComplete="given-name"
                required
                className="mt-1.5"
                style={inputStyle}
              />
              <FieldError msg={errors.firstName} />
            </div>
          </div>

          {/* Email + Téléphone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" style={{ color: "var(--ned-silver-light)" }}>
                Email <Required />
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                required
                className="mt-1.5"
                style={inputStyle}
              />
              <FieldError msg={errors.email} />
            </div>
            <div>
              <Label htmlFor="phone" style={{ color: "var(--ned-silver-light)" }}>
                Téléphone (mobile) <Required />
              </Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                required
                className="mt-1.5"
                style={inputStyle}
              />
              <FieldError msg={errors.phone} />
            </div>
          </div>

          {/* Date naissance + Ville */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate" style={{ color: "var(--ned-silver-light)" }}>
                Date de naissance <Required />
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={data.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
                required
                className="mt-1.5"
                style={inputStyle}
              />
              <FieldError msg={errors.birthDate} />
            </div>
            <div>
              <Label htmlFor="city" style={{ color: "var(--ned-silver-light)" }}>
                Ville de résidence <Required />
              </Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
                autoComplete="address-level2"
                required
                className="mt-1.5"
                style={inputStyle}
              />
              <FieldError msg={errors.city} />
            </div>
          </div>

          {/* Statut + AE */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workStatus" style={{ color: "var(--ned-silver-light)" }}>
                Statut actuel <Required />
              </Label>
              <Select
                value={data.workStatus}
                onValueChange={(v) => update("workStatus", v as WorkStatus)}
              >
                <SelectTrigger id="workStatus" className="mt-1.5" style={inputStyle}>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="salarie">Salarié</SelectItem>
                  <SelectItem value="independant">Indépendant</SelectItem>
                  <SelectItem value="sans_emploi">Sans emploi</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FieldError msg={errors.workStatus} />
            </div>
            <div>
              <Label htmlFor="aeStatus" style={{ color: "var(--ned-silver-light)" }}>
                Statut auto-entrepreneur ? <Required />
              </Label>
              <Select value={data.aeStatus} onValueChange={(v) => update("aeStatus", v as AEStatus)}>
                <SelectTrigger id="aeStatus" className="mt-1.5" style={inputStyle}>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                </SelectContent>
              </Select>
              <FieldError msg={errors.aeStatus} />
            </div>
          </div>

          {/* Source */}
          <div>
            <Label htmlFor="source" style={{ color: "var(--ned-silver-light)" }}>
              Comment nous avez-vous connus&nbsp;?
            </Label>
            <Select value={data.source} onValueChange={(v) => update("source", v as Source)}>
              <SelectTrigger id="source" className="mt-1.5" style={inputStyle}>
                <SelectValue placeholder="Optionnel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="bouche_a_oreille">Bouche à oreille</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pourquoi */}
          <div>
            <Label htmlFor="reason" style={{ color: "var(--ned-silver-light)" }}>
              Pourquoi devenir apporteur Ned&nbsp;? <Required />
            </Label>
            <Textarea
              id="reason"
              rows={5}
              value={data.reason}
              onChange={(e) => update("reason", e.target.value)}
              required
              className="mt-1.5 resize-y"
              style={inputStyle}
              placeholder="Parlez-nous de vos motivations, de votre réseau, de vos disponibilités..."
            />
            <p
              className="text-xs mt-1.5 tabular-nums"
              style={{
                color:
                  data.reason.trim().length >= MIN_REASON_LENGTH
                    ? "var(--ned-success)"
                    : "var(--ned-silver)",
              }}
            >
              {data.reason.trim().length} / {MIN_REASON_LENGTH} caractères minimum
            </p>
            <FieldError msg={errors.reason} />
          </div>

          {/* Réseau */}
          <div>
            <Label htmlFor="networkSize" style={{ color: "var(--ned-silver-light)" }}>
              Estimation : combien de personnes dans votre réseau pourraient avoir besoin de nos
              services&nbsp;? <Required />
            </Label>
            <Select
              value={data.networkSize}
              onValueChange={(v) => update("networkSize", v as NetworkSize)}
            >
              <SelectTrigger id="networkSize" className="mt-1.5" style={inputStyle}>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5">0 à 5 personnes</SelectItem>
                <SelectItem value="6-15">6 à 15 personnes</SelectItem>
                <SelectItem value="16-50">16 à 50 personnes</SelectItem>
                <SelectItem value="50+">Plus de 50 personnes</SelectItem>
              </SelectContent>
            </Select>
            <FieldError msg={errors.networkSize} />
          </div>

          {/* Consentements */}
          <div className="space-y-3 pt-2">
            <CheckboxRow
              id="consentRgpd"
              checked={data.consentRgpd}
              onChange={(v) => update("consentRgpd", v)}
              error={errors.consentRgpd}
            >
              J'accepte que Ned traite mes données personnelles dans le cadre de ma candidature,
              conformément à sa{" "}
              <a
                href="/confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--ned-accent)" }}
              >
                politique de confidentialité
              </a>
              . <Required />
            </CheckboxRow>

            <CheckboxRow
              id="consentContract"
              checked={data.consentContract}
              onChange={(v) => update("consentContract", v)}
              error={errors.consentContract}
            >
              J'accepte de recevoir le contrat d'apporteur d'affaires par email si ma candidature
              est validée. <Required />
            </CheckboxRow>

            {/* Lien discret vers les mentions légales du programme */}
            <div className="pt-1 pl-7">
              <ApporteursLegalModal />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="ned-cta-glow group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-base transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B1F]"
            style={{
              backgroundColor: "var(--ned-accent)",
              color: "#050B1F",
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer ma candidature
                <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

const Required = () => (
  <span style={{ color: "var(--ned-accent)" }} aria-hidden="true">
    *
  </span>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs mt-1.5 font-medium" style={{ color: "#f87171" }} role="alert">
      {msg}
    </p>
  ) : null;

const CheckboxRow = ({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-0.5 border-[var(--ned-border)] data-[state=checked]:bg-[var(--ned-accent)] data-[state=checked]:border-[var(--ned-accent)]"
      />
      <Label
        htmlFor={id}
        className="text-sm leading-relaxed cursor-pointer select-none"
        style={{ color: "var(--ned-silver)" }}
      >
        {children}
      </Label>
    </div>
    <FieldError msg={error} />
  </div>
);

const Spinner = () => (
  <span
    className="inline-block w-4 h-4 rounded-full border-2 border-[#050B1F] border-t-transparent animate-spin"
    aria-hidden="true"
  />
);

export default ApporteursForm;
