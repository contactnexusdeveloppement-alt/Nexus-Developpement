/**
 * Options à ajouter à un pack site vitrine ou e-commerce.
 *
 * Source unique pour l'affichage (OptionsCatalog) et le formulaire de devis.
 * Les identifiants sont repris tels quels dans api/send-quote.ts (OPTION_LABELS) :
 * toute option ajoutée ici doit l'être aussi côté API.
 *
 * Prix HT, alignés sur le marché des agences et indépendants en Île-de-France
 * (grille du 28/10/2026).
 */
export type QuoteOption = {
  id: string;
  label: string;
  description: string;
  price: string;
  recurring?: boolean;
};

export const quoteOptions: QuoteOption[] = [
  {
    id: "google-business",
    label: "Fiche Google Business Profile",
    description: "Création ou reprise de la fiche, catégories, description, prestations et photos.",
    price: "190 €",
  },
  {
    id: "extra-page",
    label: "Page supplémentaire",
    description: "Une page de plus que le pack, au même niveau de finition.",
    price: "150 € / page",
  },
  {
    id: "copywriting",
    label: "Rédaction des textes",
    description: "Nous écrivons vos textes à partir d'un échange, optimisés pour Google.",
    price: "90 € / page",
  },
  {
    id: "booking",
    label: "Réservation ou prise de rendez-vous en ligne",
    description: "Créneaux en ligne, confirmation et rappel automatiques par email.",
    price: "350 €",
  },
  {
    id: "translation",
    label: "Version dans une autre langue",
    description: "Site traduit et navigation multilingue (traduction fournie ou à notre charge).",
    price: "à partir de 450 € / langue",
  },
  {
    id: "blog",
    label: "Blog + 3 premiers articles",
    description: "Module d'articles administrable et trois articles rédigés pour lancer le référencement.",
    price: "390 €",
  },
  {
    id: "form-automation",
    label: "Automatisation des demandes",
    description: "Chaque formulaire envoyé part dans votre tableur ou CRM, avec réponse automatique au client.",
    price: "290 €",
  },
  {
    id: "logo",
    label: "Logo Essential",
    description: "3 propositions, déclinaisons, palette et fichiers sources.",
    price: "250 €",
  },
  {
    id: "local-seo-monthly",
    label: "Suivi Google local",
    description: "2 publications par mois sur votre fiche, réponses aux avis, bilan mensuel.",
    price: "89 € / mois",
    recurring: true,
  },
  {
    id: "blog-monthly",
    label: "Un article de blog par mois",
    description: "Un article rédigé et publié chaque mois sur un sujet qui fait venir vos clients.",
    price: "120 € / mois",
    recurring: true,
  },
  {
    id: "on-demand",
    label: "Intervention à la demande",
    description: "Modification, ajout de contenu ou petite fonctionnalité, facturée au temps passé.",
    price: "60 € / heure",
  },
];

/** Services du formulaire de devis auxquels les options s'appliquent. */
export const SERVICES_WITH_OPTIONS = ["website", "ecommerce"];
