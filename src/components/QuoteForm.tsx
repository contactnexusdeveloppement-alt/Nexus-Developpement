import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Send,
  Sparkles,
  Globe,
  Smartphone,
  Zap,
  Palette,
  PenTool,
  LayoutTemplate,
  ShoppingCart,
} from "lucide-react";

const CONTACT_EMAIL = "contact.nexus.developpement@gmail.com";
const REQUEST_TIMEOUT_MS = 15_000;

// Limites alignées sur la validation serveur (api/send-quote.ts)
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const PHONE_MAX = 30;
const DETAILS_MAX = 5000;
const PHONE_REGEX = /^[\d+\s().-]{6,30}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Même règle que PHONE_REGEX, écrite pour l'attribut HTML `pattern` (compilé avec le
// flag "v" par les navigateurs : parenthèses, point et tiret doivent être échappés).
const PHONE_PATTERN = "[\\d+\\s\\(\\)\\.\\-]{6,30}";
const PHONE_HINT = "Chiffres, espaces, +, (), - (6 à 30 caractères)";

const businessTypes = [
  "Pizzeria / Restaurant",
  "Salon de coiffure / Esthétique",
  "E-commerce",
  "Coach / Consultant",
  "Artisan / Métier manuel",
  "Professionnel libéral",
  "Startup / Tech",
  "Autre"
];

const serviceTypes = [
  { id: "website", label: "Création d'un site web", icon: Globe, description: "Vitrine ou complet" },
  { id: "ecommerce", label: "Site e-commerce", icon: ShoppingCart, description: "Boutique en ligne" },
  { id: "webapp", label: "Application web", icon: LayoutTemplate, description: "SaaS ou outil métier" },
  { id: "mobile", label: "Application mobile", icon: Smartphone, description: "iOS & Android" },
  { id: "automation", label: "Automatisation", icon: Zap, description: "Gain de temps" },
  { id: "logo", label: "Création de logo", icon: PenTool, description: "Identité forte" },
  { id: "branding", label: "Branding complet", icon: Palette, description: "Charte graphique" },
  { id: "custom", label: "Sur mesure", icon: Sparkles, description: "Projet spécifique" }
];

type FieldName = "name" | "email" | "phone" | "services" | "projectDetails";
type FieldErrors = Partial<Record<FieldName, string>>;
type ApiErrorBody = { error?: unknown; code?: unknown; field?: unknown } | null;

const FIELD_ORDER: FieldName[] = ["name", "email", "phone", "services", "projectDetails"];

const isFieldName = (value: unknown): value is FieldName =>
  typeof value === "string" && (FIELD_ORDER as string[]).includes(value);

// Codes d'erreur serveur qui désignent directement un champ
const FIELD_BY_CODE: Partial<Record<string, FieldName>> = {
  invalid_name: "name",
  invalid_email: "email",
  invalid_phone: "phone",
  invalid_service: "services",
};

const DEFAULT_FIELD_MESSAGES: Record<FieldName, string> = {
  name: `Indiquez votre nom (${NAME_MAX} caractères maximum).`,
  email: "Adresse email invalide.",
  phone: `Numéro invalide. ${PHONE_HINT}.`,
  services: "Sélectionnez au moins un service parmi la liste.",
  projectDetails: `La description ne doit pas dépasser ${DETAILS_MAX.toLocaleString("fr-FR")} caractères.`,
};

const codeFromStatus = (status: number): string => {
  switch (status) {
    case 413:
      return "payload_too_large";
    case 429:
      return "rate_limited";
    case 502:
      return "upstream_error";
    case 503:
      return "not_configured";
    default:
      return "unknown";
  }
};

const readString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const describedBy = (...ids: Array<string | false | undefined>) => ids.filter(Boolean).join(" ") || undefined;

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="flex items-start gap-1.5 text-sm text-red-400" aria-live="polite">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  ) : null;

// Helper function to generate pre-filled message based on category and plan
const generatePrefilledMessage = (category: string, planName: string): string => {
  const messages: Record<string, string> = {
    sites: `Bonjour,\n\nJe suis intéressé(e) par votre offre ${planName} pour la création d'un site vitrine. J'aimerais discuter de mon projet avec vous.\n\nPouvons-nous en discuter ?`,
    automatisation: `Bonjour,\n\nJe souhaiterais automatiser certains processus dans mon entreprise. Votre offre ${planName} semble correspondre à mes besoins.\n\nPouvons-nous en discuter ?`,
    webapp: `Bonjour,\n\nJ'ai un projet d'application web et votre offre ${planName} m'intéresse particulièrement.\n\nPouvons-nous en discuter ?`,
    ecommerce: `Bonjour,\n\nJe souhaite créer une boutique en ligne avec votre offre ${planName}.\n\nPouvons-nous en discuter ?`,
    mobile: `Bonjour,\n\nJ'ai besoin d'une application mobile et votre formule ${planName} correspond à mes attentes.\n\nPouvons-nous en discuter ?`,
    identite: `Bonjour,\n\nJ'ai besoin de développer l'identité visuelle de ma marque avec votre pack ${planName}.\n\nPouvons-nous en discuter ?`,
    custom: `Bonjour,\n\nJ'ai un besoin spécifique qui ne rentre pas exactement dans vos offres standard. J'aimerais discuter d'une solution sur-mesure adaptée à mon projet.\n\nPouvons-nous en discuter ?`
  };
  return messages[category] || `Bonjour,\n\nJe suis intéressé(e) par votre offre ${planName}.\n\nPouvons-nous en discuter ?`;
};

// Helper function to map category to service ID
const getCategoryServiceId = (category: string, planName: string): string => {
  const mapping: Record<string, string> = {
    sites: "website",
    automatisation: "automation",
    webapp: "webapp",
    ecommerce: "ecommerce",
    mobile: "mobile",
    identite: planName.toLowerCase().includes("branding") ? "branding" : "logo"
  };
  return mapping[category] || "custom";
};

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  businessType: "",
  services: [] as string[],
  projectDetails: "",
  budget: "",
  timeline: "",
  consentGiven: false,
  // Honeypot anti-spam : doit rester vide (rempli uniquement par les robots)
  website: "",
};

type FormState = typeof initialFormData;

const validateClient = (data: FormState): FieldErrors => {
  const errors: FieldErrors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();

  if (!name) errors.name = "Indiquez votre nom.";
  else if (name.length > NAME_MAX) errors.name = `Le nom ne doit pas dépasser ${NAME_MAX} caractères.`;

  if (!email) errors.email = "Indiquez votre adresse email.";
  else if (email.length > EMAIL_MAX || !EMAIL_REGEX.test(email)) errors.email = DEFAULT_FIELD_MESSAGES.email;

  if (phone && !PHONE_REGEX.test(phone)) errors.phone = DEFAULT_FIELD_MESSAGES.phone;

  if (data.services.length === 0) errors.services = "Sélectionnez au moins un service.";

  if (data.projectDetails.length > DETAILS_MAX) errors.projectDetails = DEFAULT_FIELD_MESSAGES.projectDetails;

  return errors;
};

const inputClass =
  "bg-slate-800/50 border-white/10 text-white placeholder:text-blue-200/20 focus:border-blue-400/50 focus:bg-slate-800/80 transition-all h-11";
const inputErrorClass = "border-red-400/60 focus:border-red-400";

const QuoteForm = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Message lu par les lecteurs d'écran (zone aria-live toujours présente dans le DOM)
  const [statusMessage, setStatusMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const servicesRef = useRef<HTMLFieldSetElement>(null);

  // Pre-fill form from URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    const plan = searchParams.get("plan");

    if (category && plan) {
      const serviceId = getCategoryServiceId(category, plan);
      const message = generatePrefilledMessage(category, plan);

      setFormData(prev => ({
        ...prev,
        services: [serviceId],
        projectDetails: message
      }));

      // Retire les paramètres de l'URL sans passer par le routeur : setSearchParams
      // déclencherait une navigation qui perd l'ancre #devis (et donc le scroll).
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
    }
  }, [searchParams]);

  const clearFieldError = (field: FieldName) => {
    setFieldErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (isFieldName(key)) clearFieldError(key);
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
    clearFieldError("services");
  };

  const focusField = (field: FieldName) => {
    const target: HTMLElement | null | undefined =
      field === "name" ? nameRef.current
        : field === "email" ? emailRef.current
          : field === "phone" ? phoneRef.current
            : field === "projectDetails" ? detailsRef.current
              : servicesRef.current?.querySelector<HTMLButtonElement>("button");
    target?.focus();
  };

  const showFieldErrors = (errors: FieldErrors) => {
    const first = FIELD_ORDER.find(field => errors[field]);
    if (!first) return false;
    const count = FIELD_ORDER.filter(field => errors[field]).length;
    setFieldErrors(errors);
    setStatusMessage(
      `${count > 1 ? `Le formulaire contient ${count} erreurs.` : "Le formulaire contient une erreur."} ${errors[first]}`,
    );
    focusField(first);
    return true;
  };

  const handleApiError = (status: number, body: ApiErrorBody) => {
    // `error` n'est affiché que si le serveur renvoie aussi un `code` (contrat actuel :
    // message français affichable). Sinon on retombe sur nos messages par statut HTTP.
    const code = readString(body?.code) ?? codeFromStatus(status);
    const serverMessage = readString(body?.code) ? readString(body?.error) : null;

    const fieldFromCode = FIELD_BY_CODE[code];
    if (fieldFromCode) {
      showFieldErrors({ [fieldFromCode]: serverMessage ?? DEFAULT_FIELD_MESSAGES[fieldFromCode] });
      return;
    }

    if (code === "too_long" || code === "missing_fields") {
      // Le serveur ne nomme pas toujours le champ : on le retrouve côté client.
      const clientErrors = validateClient(formData);
      const target = isFieldName(body?.field)
        ? body.field
        : FIELD_ORDER.find(field => clientErrors[field]);
      if (target) {
        showFieldErrors({ [target]: serverMessage ?? clientErrors[target] ?? DEFAULT_FIELD_MESSAGES[target] });
        return;
      }
      toast({
        title: "Formulaire incomplet",
        description: serverMessage ?? "Vérifiez les champs obligatoires puis réessayez.",
        variant: "destructive",
      });
      return;
    }

    switch (code) {
      case "rate_limited":
        toast({
          title: "Trop de tentatives",
          description: `Trop de tentatives. Réessayez dans une heure ou écrivez-nous à ${CONTACT_EMAIL}`,
          variant: "destructive",
        });
        return;
      case "upstream_error":
      case "not_configured":
      case "payload_too_large":
        toast({
          title: "Envoi impossible",
          description: `${serverMessage ?? "Le service d'envoi est momentanément indisponible."} Écrivez-nous directement à ${CONTACT_EMAIL}.`,
          variant: "destructive",
        });
        return;
      default:
        toast({
          title: "Erreur",
          description: `${serverMessage ?? `Une erreur est survenue lors de l'envoi (code ${status}).`} Réessayez ou écrivez-nous à ${CONTACT_EMAIL}.`,
          variant: "destructive",
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const clientErrors = validateClient(formData);
    if (showFieldErrors(clientErrors)) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez corriger les champs signalés",
        variant: "destructive"
      });
      return;
    }

    if (!formData.consentGiven) {
      toast({
        title: "Consentement requis",
        description: "Merci de confirmer avoir pris connaissance de la politique de confidentialité pour continuer",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setStatusMessage("");

    // Timeout réseau : on abandonne la requête après 15 s
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      // Appel à la Vercel Function /api/send-quote :
      // - validation côté serveur
      // - envoi de l'email de notification + confirmation via Resend (clé serveur)
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          businessType: formData.businessType || null,
          services: formData.services,
          projectDetails: formData.projectDetails || null,
          budget: formData.budget || null,
          timeline: formData.timeline || null,
          consentGiven: formData.consentGiven,
          website: formData.website,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as ApiErrorBody;
        handleApiError(res.status, body);
        return;
      }

      toast({
        title: "✅ Demande envoyée !",
        description: "Vous allez recevoir un email de confirmation. Nous reviendrons vers vous sous 24 h ouvrées.",
      });

      // Reset form
      setFormData(initialFormData);
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "AbortError";
      toast({
        title: isTimeout ? "Délai dépassé" : "Connexion impossible",
        description: isTimeout
          ? `Le serveur n'a pas répondu en ${REQUEST_TIMEOUT_MS / 1000} secondes. Si vous ne recevez pas d'email de confirmation, réessayez ou écrivez-nous à ${CONTACT_EMAIL}.`
          : `Impossible de joindre le serveur. Vérifiez votre connexion puis réessayez, ou écrivez-nous à ${CONTACT_EMAIL}.`,
        variant: "destructive",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="devis" className="py-12 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[40px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[40px] md:blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]"
          >
            Demande de Devis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100/80 max-w-2xl mx-auto"
          >
            Parlez-nous de votre projet, nous construisons l'avenir ensemble
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

            <CardHeader className="text-center pb-8 border-b border-white/5">
              <CardTitle className="text-2xl text-white">Démarrons votre projet</CardTitle>
              <CardDescription className="text-blue-200/60">
                Remplissez ce formulaire pour obtenir une estimation précise
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-6 md:px-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Zone d'annonce pour les lecteurs d'écran (toujours présente dans le DOM) */}
                <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                  {statusMessage}
                </p>

                {/* Honeypot anti-spam : hors écran, hors tabulation, ignoré par les lecteurs d'écran */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                  <label htmlFor="quote-website">Site web (ne pas remplir)</label>
                  <input
                    id="quote-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                  />
                </div>

                {/* Section: Contact */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm border border-blue-500/30">1</span>
                    Vos informations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="quote-name" className="text-blue-200">Nom complet *</Label>
                      <Input
                        id="quote-name"
                        ref={nameRef}
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Jean Dupont"
                        required
                        maxLength={NAME_MAX}
                        aria-invalid={fieldErrors.name ? true : undefined}
                        aria-describedby={describedBy(fieldErrors.name && "quote-name-error")}
                        className={cn(inputClass, fieldErrors.name && inputErrorClass)}
                      />
                      <FieldError id="quote-name-error" message={fieldErrors.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-email" className="text-blue-200">Email *</Label>
                      <Input
                        id="quote-email"
                        ref={emailRef}
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="jean@exemple.fr"
                        required
                        maxLength={EMAIL_MAX}
                        aria-invalid={fieldErrors.email ? true : undefined}
                        aria-describedby={describedBy(fieldErrors.email && "quote-email-error")}
                        className={cn(inputClass, fieldErrors.email && inputErrorClass)}
                      />
                      <FieldError id="quote-email-error" message={fieldErrors.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-phone" className="text-blue-200">Téléphone</Label>
                      <Input
                        id="quote-phone"
                        ref={phoneRef}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        pattern={PHONE_PATTERN}
                        maxLength={PHONE_MAX}
                        title={PHONE_HINT}
                        aria-invalid={fieldErrors.phone ? true : undefined}
                        aria-describedby={describedBy("quote-phone-help", fieldErrors.phone && "quote-phone-error")}
                        className={cn(inputClass, fieldErrors.phone && inputErrorClass)}
                      />
                      <p id="quote-phone-help" className="text-xs text-blue-200/50">{PHONE_HINT}</p>
                      <FieldError id="quote-phone-error" message={fieldErrors.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-businessType" className="text-blue-200">Type d'activité</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => updateField("businessType", value)}
                      >
                        <SelectTrigger id="quote-businessType" className="bg-slate-800/50 border-white/10 text-white h-11 focus:ring-blue-500/30">
                          <SelectValue placeholder="Sélectionnez votre secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                {/* Section: Services (groupe de boutons à bascule, obligatoire) */}
                <fieldset
                  ref={servicesRef}
                  className="min-w-0"
                  aria-describedby={describedBy("quote-services-help", fieldErrors.services && "quote-services-error")}
                >
                  <legend className="w-full">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm border border-blue-500/30">2</span>
                      Services souhaités *
                    </h3>
                  </legend>
                  <p id="quote-services-help" className="sr-only">
                    Obligatoire : sélectionnez un ou plusieurs services.
                  </p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {serviceTypes.map((service) => {
                      const Icon = service.icon;
                      const isSelected = formData.services.includes(service.id);
                      return (
                        <motion.button
                          key={service.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleServiceToggle(service.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "cursor-pointer relative w-full p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]",
                            isSelected
                              ? "bg-blue-600/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              : "bg-slate-800/30 border-white/5 hover:bg-slate-800/60 hover:border-white/20",
                          )}
                        >
                          <span className={cn("p-2 rounded-lg", isSelected ? "bg-blue-500 text-white" : "bg-slate-700/50 text-slate-400")}>
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </span>
                          <span className="space-y-1">
                            <span className={cn("block text-sm font-semibold", isSelected ? "text-white" : "text-blue-100/70")}>
                              {service.label}
                            </span>
                            <span className="block text-xs text-blue-200/40">{service.description}</span>
                          </span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 text-blue-400" aria-hidden="true">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-3">
                    <FieldError id="quote-services-error" message={fieldErrors.services} />
                  </div>
                </fieldset>

                <div className="w-full h-px bg-white/5" />

                {/* Section: Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm border border-blue-500/30">3</span>
                    Détails du projet
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="quote-projectDetails" className="text-blue-200">Description</Label>
                    <Textarea
                      id="quote-projectDetails"
                      ref={detailsRef}
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={(e) => updateField("projectDetails", e.target.value)}
                      placeholder="Décrivez vos objectifs, vos références, et les fonctionnalités clés..."
                      rows={5}
                      maxLength={DETAILS_MAX}
                      aria-invalid={fieldErrors.projectDetails ? true : undefined}
                      aria-describedby={describedBy("quote-projectDetails-count", fieldErrors.projectDetails && "quote-projectDetails-error")}
                      className={cn(
                        "bg-slate-800/50 border-white/10 text-white placeholder:text-blue-200/20 focus:border-blue-400/50 focus:bg-slate-800/80 transition-all resize-none",
                        fieldErrors.projectDetails && inputErrorClass,
                      )}
                    />
                    <p id="quote-projectDetails-count" className="text-xs text-blue-200/50 text-right">
                      {formData.projectDetails.length.toLocaleString("fr-FR")} / {DETAILS_MAX.toLocaleString("fr-FR")} caractères
                    </p>
                    <FieldError id="quote-projectDetails-error" message={fieldErrors.projectDetails} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="quote-budget" className="text-blue-200">Budget estimé</Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => updateField("budget", value)}
                      >
                        <SelectTrigger id="quote-budget" className="bg-slate-800/50 border-white/10 text-white h-11">
                          <SelectValue placeholder="Votre budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<500">Moins de 500€</SelectItem>
                          <SelectItem value="500-1000">500€ - 1 000€</SelectItem>
                          <SelectItem value="1000-2500">1 000€ - 2 500€</SelectItem>
                          <SelectItem value="2500-5000">2 500€ - 5 000€</SelectItem>
                          <SelectItem value="5000-10000">5 000€ - 10 000€</SelectItem>
                          <SelectItem value=">10000">Plus de 10 000€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-timeline" className="text-blue-200">Délai souhaité</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => updateField("timeline", value)}
                      >
                        <SelectTrigger id="quote-timeline" className="bg-slate-800/50 border-white/10 text-white h-11">
                          <SelectValue placeholder="Votre échéance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (moins de 2 semaines)</SelectItem>
                          <SelectItem value="1month">Dans le mois</SelectItem>
                          <SelectItem value="2-3months">2-3 mois</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="flex items-start space-x-3 p-4 bg-blue-900/10 border border-blue-500/10 rounded-lg">
                  <Checkbox
                    id="quote-consent"
                    name="consentGiven"
                    checked={formData.consentGiven}
                    aria-required="true"
                    onCheckedChange={(checked) => updateField("consentGiven", checked === true)}
                    className="mt-1 border-blue-400/50 data-[state=checked]:bg-blue-500"
                  />
                  <label
                    htmlFor="quote-consent"
                    className="text-sm text-blue-200/80 leading-relaxed cursor-pointer select-none"
                  >
                    J'ai pris connaissance de la{" "}
                    <Link
                      to="/confidentialite"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      politique de confidentialité
                    </Link>
                    <span> et j'accepte que mes données soient utilisées pour répondre à cette demande.</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.consentGiven}
                  aria-busy={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold h-14 text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                    {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteForm;
