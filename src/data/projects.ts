export type Project = {
    title: string;
    description: string;
    image: string;
    url: string;
    technologies: string[];
    category: string;
    altText: string;
};

/**
 * Réalisations clients en ligne (sites livrés par l'agence). Captures en
 * 800×500 WebP dans public/projects/ : en cas de refonte d'un site client,
 * refaire la capture et incrémenter le paramètre ?v= pour casser le cache.
 */
export const projects: Project[] = [
    {
        title: "BodyStart Nutrition",
        description:
            "Boutique en ligne d'une enseigne de compléments alimentaires à Coignières : catalogue, packs, Click & Collect et livraison, synchronisés avec la boutique physique.",
        image: "/projects/bodystart.webp?v=4",
        url: "https://bodystart-nutrition.fr/",
        technologies: ["Next.js", "Shopify", "Vercel"],
        category: "E-commerce",
        altText: "Page d'accueil de la boutique BodyStart Nutrition",
    },
    {
        title: "Gym Coach",
        description:
            "Site d'une salle de sport indépendante à Coignières : présentation du club, tarifs, offres et inscription en ligne, pensé d'abord pour le mobile.",
        image: "/projects/gym-coach.webp?v=1",
        url: "https://gym-coach.com/",
        technologies: ["Next.js", "Vercel"],
        category: "Site vitrine",
        altText: "Page d'accueil du site de la salle Gym Coach",
    },
    {
        title: "Cookies Jo",
        description:
            "Boutique en ligne d'un atelier de cookies et spécialités créoles à Chatou : catalogue, commande en ligne, retrait sur place ou livraison dans l'ouest parisien.",
        image: "/projects/cookies-jo.webp?v=1",
        url: "https://www.cookiesjo.fr/",
        technologies: ["Next.js", "Shopify", "Vercel"],
        category: "E-commerce",
        altText: "Page d'accueil de la boutique Cookies Jo",
    },
    {
        title: "Il Vicolo",
        description:
            "Site d'une pizzeria italienne à Nancy : carte, réservation de table en ligne, commande en click & collect et demande de privatisation.",
        image: "/projects/il-vicolo.webp?v=1",
        url: "https://il-vicolo-site.vercel.app/",
        technologies: ["Next.js", "Resend", "Vercel"],
        category: "Restaurant",
        altText: "Page d'accueil du site de la pizzeria Il Vicolo",
    },
    {
        title: "Arno Polynice",
        description:
            "Conception complète d'un e-commerce pour une marque de vêtements sur mesure fait main. Catalogue produits, paiement sécurisé et tunnel de commande optimisé.",
        image: "/projects/arno-polynice.webp?v=3",
        url: "https://www.arno-polynice.com/",
        technologies: ["React", "Shopify", "Resend"],
        category: "E-commerce",
        altText: "Capture d'écran du site Arno Polynice",
    },
    {
        title: "Orient Relais",
        description:
            "Refonte premium d'un e-commerce de produits bio. Modernisation complète de l'expérience utilisateur, optimisation du tunnel d'achat et performance maximale.",
        image: "/projects/orient-relais.webp?v=3",
        url: "https://www.orient-relais.com/",
        technologies: ["React", "WooCommerce", "Stripe"],
        category: "E-commerce",
        altText: "Capture d'écran du site Orient Relais",
    },
];

/** Toutes les réalisations sont des sites clients réels (les démos ont été retirées le 28/10/2026). */
export const clientProjects = projects;

/** Site externe (client) : ouvre une nouvelle fenêtre. Sinon route interne ou ancre. */
export const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

/**
 * Card d'appel à l'action affichée en fin de portfolio.
 * - Sur la home (Portfolio) : insérée en 6ème position après les 5 premiers projets
 * - Sur /catalogue (ProjectsCatalog) : ajoutée à la toute fin
 * Sortie du tableau `projects` pour pouvoir la positionner différemment selon le contexte.
 */
export const ctaProject: Project = {
    title: "Votre Futur Projet ?",
    description:
        "Vous avez une vision ambitieuse ? Transformons-la en réalité digitale. Cliquez ici pour démarrer votre projet avec nous.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&fm=webp&fit=crop",
    url: "#contact",
    technologies: ["Innovation", "Performance", "Design"],
    category: "Prochain Succès",
    altText: "Concept abstrait technologique",
};
