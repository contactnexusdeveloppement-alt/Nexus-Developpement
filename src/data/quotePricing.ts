// Pricing data for the quote generator

export interface PackOption {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
}

export interface AddonOption {
    id: string;
    name: string;
    price: number;
    description: string;
    category: 'technical' | 'content' | 'legal' | 'seo';
}

export const packs: PackOption[] = [
    {
        id: 'essential',
        name: 'Essential',
        price: 950,
        description: 'Site vitrine professionnel pour débuter',
        features: [
            'Design moderne et responsive',
            '3-5 pages (Accueil, Services, À propos, Contact)',
            'Formulaire de contact',
            'Options de base SEO',
            'Hébergement 1 an inclus',
            'Support technique 3 mois',
        ],
    },
    {
        id: 'business',
        name: 'Business',
        price: 1850,
        description: 'Solution complète pour développer votre activité',
        features: [
            'Tout du pack Essential',
            '6-10 pages personnalisées',
            'SEO avancé',
            'Intégration réseaux sociaux',
            'Blog / Actualités',
            'Google Analytics',
            'Support technique 6 mois',
        ],
        popular: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 4000,
        description: 'Application web sur-mesure',
        features: [
            'Tout du pack Business',
            'Système d\'authentification',
            'Base de données personnalisée',
            'Dashboard admin',
            'Fonctionnalités avancées',
            'API intégrations',
            'Support prioritaire 12 mois',
        ],
    },
];

export const addons: AddonOption[] = [
    // Technical addons
    {
        id: 'booking',
        name: 'Module de Réservation',
        price: 300,
        description: 'Système de prise de rendez-vous en ligne',
        category: 'technical',
    },
    {
        id: 'payment',
        name: 'Paiement en Ligne',
        price: 400,
        description: 'Intégration Stripe/PayPal pour paiements sécurisés',
        category: 'technical',
    },
    {
        id: 'ecommerce',
        name: 'E-commerce Avancé',
        price: 800,
        description: 'Boutique en ligne complète avec gestion de stock',
        category: 'technical',
    },
    {
        id: 'multilingual',
        name: 'Site Multilingue',
        price: 250,
        description: 'Version en 2 langues (ex: FR + EN)',
        category: 'technical',
    },
    {
        id: 'chat',
        name: 'Chat en Direct',
        price: 200,
        description: 'Widget de chat pour support client instantané',
        category: 'technical',
    },

    // Content addons
    {
        id: 'copywriting',
        name: 'Rédaction de Contenu',
        price: 350,
        description: 'Rédaction professionnelle de vos textes (jusqu\'à 10 pages)',
        category: 'content',
    },
    {
        id: 'photography',
        name: 'Photographie Professionnelle',
        price: 500,
        description: 'Séance photo pour illustrer votre site (demi-journée)',
        category: 'content',
    },
    {
        id: 'video',
        name: 'Vidéo de Présentation',
        price: 600,
        description: 'Vidéo promotionnelle de 1-2 minutes',
        category: 'content',
    },

    // Legal addons
    {
        id: 'legal',
        name: 'Rédaction Légale',
        price: 150,
        description: 'Mentions légales, politique de confidentialité, CGV',
        category: 'legal',
    },
    {
        id: 'rgpd',
        name: 'Conformité RGPD',
        price: 200,
        description: 'Audit et mise en conformité RGPD complète',
        category: 'legal',
    },

    // SEO addons
    {
        id: 'seo_audit',
        name: 'Audit SEO Complet',
        price: 250,
        description: 'Analyse approfondie et recommandations SEO',
        category: 'seo',
    },
    {
        id: 'seo_optimization',
        name: 'Optimisation SEO Avancée',
        price: 400,
        description: 'Optimisation technique et contenu pour référencement',
        category: 'seo',
    },
];
