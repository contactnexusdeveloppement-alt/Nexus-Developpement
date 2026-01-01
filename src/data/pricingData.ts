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
                price: "À partir de 950€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Votre présence digitale professionnelle clé en main.",
                features: [
                    "Design responsive mobile-first",
                    "1 à 3 pages professionnelles",
                    "Formulaire de contact sécurisé",
                    "Optimisation SEO de base",
                    "Certificat SSL inclus",
                    "Livraison sous 10 jours"
                ],
                additionalInfo: "Hébergement 50€/mois après 1 mois offert",
                targetAudience: "Entrepreneurs & Indépendants"
            },
            {
                name: "Business",
                price: "À partir de 1 850€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Site professionnel complet pour convertir vos visiteurs.",
                features: [
                    "4 à 10 pages structurées",
                    "Design personnalisé à votre image",
                    "CMS pour gérer le contenu",
                    "Section blog/actualités",
                    "SEO optimisé avancé",
                    "Formation incluse",
                    "Support 1 mois"
                ],
                isPopular: true,
                additionalInfo: "Hébergement 75€/mois après 2 mois offerts",
                targetAudience: "PME & Entreprises en croissance"
            },
            {
                name: "Premium",
                price: "À partir de 4 000€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Site sur-mesure premium avec design exclusif.",
                features: [
                    "11 à 20 pages complexes",
                    "Design 100% sur-mesure (Figma)",
                    "Animations & interactions avancées",
                    "Référencement SEO expert",
                    "Fonctionnalités custom",
                    "Formation équipe complète",
                    "Support prioritaire 3 mois"
                ],
                additionalInfo: "Hébergement 115€/mois après 3 mois offerts",
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
                name: "Audit Approfondi",
                price: "390€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "J'analyse vos processus et vous dis exactement quoi automatiser.",
                features: [
                    "Analyse complète de vos processus",
                    "Identification des tâches chronophages",
                    "Plan d'action d'automatisation détaillé",
                    "Estimation du ROI potentiel",
                    "Recommandation d'outils adaptés",
                    "Restitution vidéo ou visio",
                    "Déductible si projet validé"
                ],
                buttonText: "Réserver mon audit",
                additionalInfo: "Idéal pour savoir par où commencer",
                targetAudience: "Pour comprendre vos besoins"
            },
            {
                name: "1 Automatisation",
                price: "À partir de 450€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Automatisez un processus clé et gagnez du temps.",
                features: [
                    "1 automatisation sur-mesure",
                    "Design du scénario (Make/Zapier)",
                    "Connexion de vos outils",
                    "Tests & Recette",
                    "Documentation",
                    "Formation à l'utilisation"
                ],
                additionalInfo: "Hébergement et maintenance 25€/mois",
                targetAudience: "Pour démarrer l'automatisation"
            },
            {
                name: "3 Automatisations",
                price: "À partir de 1 200€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Automatisez vos processus récurrents et gagnez des heures.",
                features: [
                    "3 automatisations sur-mesure",
                    "Ex: Facturation auto, suivi clients, rappels RDV",
                    "Design des scénarios (Make/Zapier)",
                    "Connexion de vos outils (CRM, Mail, etc.)",
                    "Tests & Recette complets",
                    "Documentation technique",
                    "Formation à l'utilisation",
                    "Support & Monitoring 1 mois"
                ],
                isPopular: true,
                additionalInfo: "Hébergement et maintenance 60€/mois",
                targetAudience: "Pour gagner du temps au quotidien"
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
                price: "Dès 5 000€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Version 1 pour tester rapidement votre idée sur le marché.",
                features: [
                    "Fonctionnalités essentielles (MVP)",
                    "Interface utilisateur propre",
                    "Base de données sécurisée",
                    "Authentification utilisateurs",
                    "Hébergement cloud scalable",
                    "Code maintenable & évolutif"
                ],
                additionalInfo: "Hébergement et maintenance à partir de 150€/mois",
                targetAudience: "Startups & Nouveaux projets"
            },
            {
                name: "SaaS Standard",
                price: "Dès 7 500€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Logiciel complet que vos clients paient mensuellement.",
                features: [
                    "Architecture évolutive professionnelle",
                    "Dashboard de gestion complet",
                    "Paiements intégrés (Stripe)",
                    "Emails transactionnels automatiques",
                    "API & Intégrations tierces",
                    "Analytics et statistiques",
                    "Support technique 3 mois"
                ],
                isPopular: true,
                additionalInfo: "Hébergement et maintenance à partir de 250€/mois",
                targetAudience: "Outils SaaS & Plateformes B2B"
            },
            {
                name: "SaaS Premium",
                price: "Dès 12 000€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Solution professionnelle complexe avec architecture avancée.",
                features: [
                    "Architecture technique avancée",
                    "Tableaux de bord multi-niveaux",
                    "Système de rôles & permissions",
                    "API complète & Webhooks",
                    "Tests unitaires & E2E",
                    "Monitoring & Alertes",
                    "Support & SLA garantis"
                ],
                additionalInfo: "Hébergement et maintenance à partir de 400€/mois",
                targetAudience: "Plateformes enterprise"
            }
        ]
    },
    {
        id: "ecommerce",
        label: "E-commerce",
        icon: "🛒",
        plans: [
            {
                name: "Boutique Starter",
                price: "Dès 2 000€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Boutique en ligne pour petits catalogues (jusqu'à 50 produits).",
                features: [
                    "Catalogue jusqu'à 50 produits",
                    "Panier & Paiement sécurisé CB",
                    "Gestion des commandes",
                    "Stock basique",
                    "Responsive mobile",
                    "Certificat SSL inclus"
                ],
                additionalInfo: "Hébergement et maintenance à partir de 100€/mois",
                targetAudience: "Petits commerces & Artisans"
            },
            {
                name: "E-commerce Standard",
                price: "Dès 3 500€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Boutique professionnelle complète (50-200 produits).",
                features: [
                    "Catalogue 50 à 200 produits",
                    "Paiements Stripe/PayPal",
                    "Gestion stock & variantes",
                    "Calcul frais de port",
                    "Comptes clients",
                    "Analytics e-commerce",
                    "Support 2 mois"
                ],
                isPopular: true,
                additionalInfo: "Hébergement et maintenance à partir de 150€/mois",
                targetAudience: "E-commerçants professionnels"
            },
            {
                name: "E-commerce Advanced",
                price: "Dès 5 500€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Grande boutique avec fonctionnalités avancées (200-500 produits).",
                features: [
                    "Catalogue 200 à 500 produits",
                    "Multi-devises & Multi-langues",
                    "Suivi des expéditions",
                    "Wishlist & Avis clients",
                    "Codes promo & Promotions",
                    "Dashboard analytique complet",
                    "Support prioritaire 3 mois"
                ],
                additionalInfo: "Hébergement et maintenance à partir de 250€/mois",
                targetAudience: "Grandes boutiques en ligne"
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
                price: "Dès 4 000€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Une app performante sur 1 plateforme (iOS ou Android).",
                features: [
                    "Technologie React Native/Expo",
                    "1 plateforme au choix",
                    "Design adaptatif natif",
                    "Notifications push",
                    "Publication Store incluse",
                    "Maintenance simplifiée"
                ],
                additionalInfo: "Hébergement et maintenance à partir de 100€/mois",
                targetAudience: "Démarrage économique"
            },
            {
                name: "Multi-plateformes",
                price: "Dès 6 000€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Une seule app pour iOS ET Android - Le meilleur rapport qualité/prix.",
                features: [
                    "Code unique pour 2 plateformes",
                    "iOS + Android simultanés",
                    "Design optimisé pour chaque OS",
                    "Features natives",
                    "Publication sur les 2 stores",
                    "Maintenance unifiée"
                ],
                isPopular: true,
                additionalInfo: "Hébergement et maintenance à partir de 150€/mois",
                targetAudience: "Le plus populaire"
            },
            {
                name: "App Complexe + Backend",
                price: "Dès 9 000€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Application native avec backend sur-mesure et features avancées.",
                features: [
                    "Architecture complexe optimisée",
                    "Backend API custom",
                    "Utilisation capteurs (GPS, Caméra, etc.)",
                    "Mode hors-ligne avancé",
                    "Synchronisation cloud",
                    "Analytics & Tracking poussés",
                    "Support technique étendu"
                ],
                additionalInfo: "Hébergement et maintenance à partir de 250€/mois",
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
                name: "Logo Essential",
                price: "250€",
                priceColor: "from-cyan-400 to-cyan-600",
                description: "Logo professionnel avec les fondations de votre marque.",
                features: [
                    "Création de Logo (3 propositions)",
                    "Déclinaisons Noir/Blanc",
                    "Palette de couleurs",
                    "Typographies",
                    "Fichiers sources (.AI, .SVG, .PNG)",
                    "Cession des droits incluse"
                ],
                targetAudience: "Pour démarrer pro"
            },
            {
                name: "Logo + Supports",
                price: "600€",
                priceColor: "from-blue-400 via-blue-500 to-blue-600",
                description: "Identité cohérente avec supports professionnels.",
                features: [
                    "Logo complet (option Essential)",
                    "Cartes de visite design",
                    "Signature email professionnelle",
                    "En-tête de documents",
                    "Guidelines d'utilisation basiques",
                    "Tous formats livrés"
                ],
                isPopular: true,
                targetAudience: "Identité professionnelle complète"
            },
            {
                name: "Branding Complet",
                price: "1 200€",
                priceColor: "from-blue-500 via-blue-600 to-blue-700",
                description: "Univers de marque complet et cohérent pour tous vos supports.",
                features: [
                    "Charte graphique complète",
                    "Brand Book & Guidelines",
                    "Templates Réseaux Sociaux",
                    "Papeterie complète (CV, factures, etc.)",
                    "Illustrations ou Iconographie",
                    "Présentation PowerPoint template"
                ],
                targetAudience: "Pour une image inoubliable"
            }
        ]
    }
];
