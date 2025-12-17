export type PricingPlan = {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    buttonText?: string;
    priceColor: string;
    additionalInfo?: string;
    targetAudience?: string;
};

export type Category = {
    id: string;
    label: string;
    icon: string;
    plans: PricingPlan[];
};

export const pricingData: Category[] = [
    {
        id: "sites",
        label: "Sites Vitrine",
        icon: "🌐",
        plans: [
            {
                name: "Essential",
                price: "890€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Votre présence digitale professionnelle clé en main.",
                features: [
                    "Design responsive mobile-first",
                    "Formulaire de contact sécurisé",
                    "Optimisation SEO de base",
                    "Certificat SSL inclus",
                    "Hébergement rapide",
                    "Support technique dédié"
                ],
                additionalInfo: "Hébergement 50€/mois après 3 mois offerts",
                targetAudience: "Entrepreneurs & Indépendants"
            },
            {
                name: "Business",
                price: "1 290€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "L'excellence visuelle pour convertir vos visiteurs.",
                features: [
                    "Site multi-pages immersion",
                    "Animations fluides & interactives",
                    "SEO avancé & performance top-tier",
                    "Intégration réseaux & analytics",
                    "Blog / Actualités dynamique",
                    "Formation à la gestion du contenu",
                    "Support prioritaire 24/7"
                ],
                isPopular: true,
                additionalInfo: "Hébergement 90€/mois après 3 mois offerts",
                targetAudience: "PME & Entreprises en croissance"
            },
            {
                name: "Premium",
                price: "1 990€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Une identité numérique unique et sur-mesure.",
                features: [
                    "UI/UX Design exclusif (Figma)",
                    "Fonctionnalités avancées custom",
                    "Référencement local stratégique",
                    "CMS personnalisé intuitif",
                    "Maintenance préventive incluse",
                    "Formation équipe complète",
                    "Support VIP dédié"
                ],
                additionalInfo: "Hébergement 150€/mois après 3 mois offerts",
                targetAudience: "Marques & Projets ambitieux"
            }
        ]
    },
    {
        id: "automatisation",
        label: "Automatisation",
        icon: "⚡",
        plans: [
            {
                name: "Audit & Stratégie",
                price: "490€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Comprendre vos goulots d'étranglement pour libérer du temps.",
                features: [
                    "Analyse complète de vos processus",
                    "Identification des tâches 'perte de temps'",
                    "Plan d'action d'automatisation",
                    "Recommandation d'outils (No-Code/IA)",
                    "Estimation du ROI potentiel",
                    "Restitution vidéo ou visio",
                    "Déductible si devis validé"
                ],
                buttonText: "Réserver mon audit",
                additionalInfo: "Prix fixe unique, sans engagement",
                targetAudience: "Pour savoir par où commencer"
            },
            {
                name: "Workflow Custom",
                price: "Sur devis",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Mise en place concrète de vos automatisations.",
                features: [
                    "Design des scénarios (Make/Zapier/n8n)",
                    "Connexion de vos outils (CRM, Mail, etc.)",
                    "Tests & Recette complets",
                    "Documentation technique",
                    "Formation à l'utilisation",
                    "Maintenance & Monitoring",
                    "Support réactif inclus"
                ],
                isPopular: true,
                additionalInfo: "Tarif selon complexité du workflow",
                targetAudience: "Pour gagner des heures chaque semaine"
            }
        ]
    },
    {
        id: "webapp",
        label: "Applications Web",
        icon: "💻",
        plans: [
            {
                name: "MVP Starter",
                price: "Dès 5k€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Lancez votre idée rapidement pour tester le marché.",
                features: [
                    "Fonctionnalités essentielles (MVP)",
                    "Interface utilisateur propre",
                    "Base de données sécurisée",
                    "Authentification utilisateurs",
                    "Hébergement cloud scalable",
                    "Code maintenable & évolutif"
                ],
                additionalInfo: "Délai moyen : 4 à 6 semaines",
                targetAudience: "Startups & Nouveaux projets"
            },
            {
                name: "SaaS & Platform",
                price: "Sur devis",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Une solution robuste pour votre business model.",
                features: [
                    "Architecture technique avancée",
                    "Tableaux de bord complexes",
                    "Paiements (Stripe/LemonSqueezy)",
                    "Emails transactionnels & Notifs",
                    "API & Webhooks",
                    "Tests unitaires & E2E",
                    "Support & SLA garantis"
                ],
                isPopular: true,
                targetAudience: "Plateformes SaaS & Outils métiers"
            }
        ]
    },
    {
        id: "mobile",
        label: "Applications Mobiles",
        icon: "📱",
        plans: [
            {
                name: "App Hybride",
                price: "Dès 4k€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Une app performante iOS & Android à coût maîtrisé.",
                features: [
                    "Technologie React Native / Expo",
                    "Code unique pour 2 plateformes",
                    "Design adaptatif natif",
                    "Notifications push",
                    "Publication Stores incluse",
                    "Maintenance simplifiée"
                ],
                targetAudience: "Le meilleur rapport qualité/prix"
            },
            {
                name: "App Native / Complexe",
                price: "Sur devis",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Performance maximale et fonctionnalités avancées.",
                features: [
                    "Architecture complexe sur-mesure",
                    "Utilisation capteurs (GPS, Caméra...)",
                    "Mode hors-ligne avancé",
                    "Bluetooth / IoT",
                    "Animations natives 60fps",
                    "Analytics & Tracking poussés"
                ],
                isPopular: true,
                targetAudience: "Projets techniques ambitieux"
            }
        ]
    },
    {
        id: "identite",
        label: "Identité Visuelle",
        icon: "🎨",
        plans: [
            {
                name: "Logo & Basics",
                price: "Dès 990€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Les fondations solides de votre image de marque.",
                features: [
                    "Création de Logo (3 pistes)",
                    "Déclinaisons (Noir/Blanc, Favicon)",
                    "Palette de couleurs & Typos",
                    "Cartes de visite design",
                    "Cession des droits incluse"
                ],
                targetAudience: "Pour démarrer pro"
            },
            {
                name: "Branding 360",
                price: "Sur devis",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Un univers de marque complet et cohérent.",
                features: [
                    "Charte graphique complète",
                    "Brand Book & Guidelines",
                    "Templates Réseaux Sociaux",
                    "Signatures email & Papeterie",
                    "Illustrations ou Iconographie",
                    "Direction artistique shooting"
                ],
                isPopular: true,
                targetAudience: "Pour une image inoubliable"
            }
        ]
    }
];
