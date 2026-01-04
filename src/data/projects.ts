import bodystartImage from "@/assets/bodystart-project.png";

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
    {
        title: "Élégance Coiffure",
        description: "Site vitrine complet pour un salon de coiffure avec présentation des services, réalisations et histoire.",
        image: "/salon/screenshot.webp",
        url: "/salon-coiffure",
        technologies: ["React", "Tailwind", "Framer Motion"],
        category: "Site Vitrine",
        altText: "Interface du site Élégance Coiffure"
    },
    {
        title: "Saveurs & Traditions",
        description: "Site vitrine élégant pour un restaurant gastronomique. Menu digital interactif, galerie photos immersive et module de réservation de table en temps réel.",
        image: "/restaurant/screenshot.webp",
        url: "/restaurant",
        technologies: ["React", "Framer Motion", "Reservation API"],
        category: "Site Vitrine",
        altText: "Ambiance restaurant gastronomique"
    },
    {
        title: "Héritage Auto",
        description: "Concession automobile de prestige. Vitrine immersive avec filtres dynamiques, galerie de véhicules et services d'atelier haut de gamme.",
        image: "/projects/concession-home.webp",
        url: "/concession-automobile",
        technologies: ["React", "CSS Modules", "Responsive Design"],
        category: "Site Vitrine",
        altText: "Garage Héritage Auto"
    },
    {
        title: "Prestige Immobilier Vosges",
        description: "Agence immobilière de luxe. Site vitrine élégant avec catalogue de biens, recherche avancée et présentation des services haut de gamme.",
        image: "/agence-immo/screenshot.png",
        url: "/agence-immobiliere",
        technologies: ["React", "Tailwind", "Responsive Design"],
        category: "Site Vitrine",
        altText: "Agence immobilière de prestige"
    },
    {
        title: "Votre Futur Projet ?",
        description: "Vous avez une vision ambitieuse ? Transformons-la en réalité digitale. Cliquez ici pour démarrer votre projet avec nous.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&fm=webp&fit=crop",
        url: "#contact",
        technologies: ["Innovation", "Performance", "Design"],
        category: "Prochain Succès",
        altText: "Concept abstrait technologique"
    }
];
