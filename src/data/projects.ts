export type Project = {
    title: string;
    description: string;
    image: string;
    url: string;
    technologies: string[];
    category: string;
    altText: string;
};

export const projects: Project[] = [
    // --- Réalisations clients en ligne ----------------------------------
    {
        title: "Arno Polynice",
        description:
            "Conception complète d'un e-commerce pour une marque de vêtements sur mesure fait main. Catalogue produits, paiement sécurisé et tunnel de commande optimisé.",
        image: "/projects/arno-polynice.webp",
        url: "https://www.arno-polynice.com/",
        technologies: ["React", "Shopify", "Resend"],
        category: "E-commerce",
        altText: "Capture d'écran du site Arno Polynice",
    },
    {
        title: "Orient Relais",
        description:
            "Refonte premium d'un e-commerce de produits bio. Modernisation complète de l'expérience utilisateur, optimisation du tunnel d'achat et performance maximale.",
        image: "/projects/orient-relais.webp",
        url: "https://www.orient-relais.com/",
        technologies: ["React", "WooCommerce", "Stripe"],
        category: "E-commerce",
        altText: "Capture d'écran du site Orient Relais",
    },
    {
        title: "Bodystart Nutrition",
        description:
            "Boutique en ligne de compléments alimentaires, prolongement digital de la boutique physique. Catalogue, paiement et logistique synchronisés.",
        image: "/projects/bodystart.webp",
        url: "https://bodystart.vercel.app/",
        technologies: ["React", "Shopify", "Resend"],
        category: "E-commerce",
        altText: "Capture d'écran de la boutique Bodystart Nutrition",
    },

    // --- Cas d'usage & démos sectorielles -------------------------------
    {
        title: "Élégance Coiffure",
        description:
            "Site vitrine complet pour un salon de coiffure avec présentation des services, réalisations et histoire.",
        image: "/salon/screenshot.webp",
        url: "/salon-coiffure",
        technologies: ["React", "Tailwind", "Framer Motion"],
        category: "Site Vitrine",
        altText: "Interface du site Élégance Coiffure",
    },
    {
        title: "Saveurs & Traditions",
        description:
            "Site vitrine élégant pour un restaurant gastronomique. Menu digital interactif, galerie photos immersive et module de réservation de table en temps réel.",
        image: "/restaurant/screenshot.webp",
        url: "/restaurant",
        technologies: ["React", "Framer Motion", "Reservation API"],
        category: "Site Vitrine",
        altText: "Ambiance restaurant gastronomique",
    },
    {
        title: "Héritage Auto",
        description:
            "Concession automobile de prestige. Vitrine immersive avec filtres dynamiques, galerie de véhicules et services d'atelier haut de gamme.",
        image: "/projects/concession-home.webp",
        url: "/concession-automobile",
        technologies: ["React", "CSS Modules", "Responsive Design"],
        category: "Site Vitrine",
        altText: "Garage Héritage Auto",
    },
    {
        title: "Prestige Immobilier Vosges",
        description:
            "Agence immobilière de luxe. Site vitrine élégant avec catalogue de biens, recherche avancée et présentation des services haut de gamme.",
        image: "/agence-immo/screenshot.webp",
        url: "/agence-immobiliere",
        technologies: ["React", "Tailwind", "Responsive Design"],
        category: "Site Vitrine",
        altText: "Agence immobilière de prestige",
    },

    // --- CTA en fin de portfolio ----------------------------------------
    {
        title: "Votre Futur Projet ?",
        description:
            "Vous avez une vision ambitieuse ? Transformons-la en réalité digitale. Cliquez ici pour démarrer votre projet avec nous.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&fm=webp&fit=crop",
        url: "#contact",
        technologies: ["Innovation", "Performance", "Design"],
        category: "Prochain Succès",
        altText: "Concept abstrait technologique",
    },
];
