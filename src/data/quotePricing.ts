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
    description: string;
    price: number;
    categories?: string[]; // Array of category IDs (e.g. 'sites', 'automatisation')
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
    // --- SITES VITRINE ---
    {
        id: 'seo-master',
        name: 'Rédaction & SEO Advanced',
        description: 'Optimisation complète du contenu pour les moteurs de recherche.',
        price: 450,
        categories: ['sites']
    },
    {
        id: 'training-admin',
        name: 'Formation Administration',
        description: '1h de formation pour apprendre à gérer votre site.',
        price: 150,
        categories: ['sites']
    },
    {
        id: 'maintenance-yearly',
        name: 'Maintenance Annuelle',
        description: 'Mises à jour, sauvegardes et sécurité pendant 1 an.',
        price: 400,
        categories: ['sites']
    },

    // --- AUTOMATISATION ---
    {
        id: 'auto-invoice',
        name: 'Générateur de devis et facture',
        description: 'Création automatique de vos documents comptables.',
        price: 500,
        categories: ['automatisation']
    },
    {
        id: 'auto-reminder',
        name: 'Relance client automatique',
        description: 'Séquence emailing pour relancer les impayés/devis.',
        price: 350,
        categories: ['automatisation']
    },
    {
        id: 'auto-crm',
        name: 'Connexion CRM',
        description: 'Synchronisation bidirectionnelle avec votre CRM.',
        price: 400,
        categories: ['automatisation']
    },

    // --- APPLICATION WEB ---
    {
        id: 'webapp-payment',
        name: 'Module de Paiement',
        description: 'Intégration Stripe/Paypal sécurisée.',
        price: 800,
        categories: ['webapp']
    },
    {
        id: 'webapp-admin',
        name: 'Panel Admin Avancé',
        description: 'Gestion complète des données et utilisateurs.',
        price: 1200,
        categories: ['webapp']
    },
    {
        id: 'webapp-auth',
        name: 'Système Comptes Utilisateurs',
        description: 'Inscription, Connexion, Profils, Sécurité.',
        price: 600,
        categories: ['webapp']
    },

    // --- E-COMMERCE ---
    {
        id: 'ecom-import',
        name: 'Import Catalogue CSV',
        description: 'Importation en masse de vos produits.',
        price: 400,
        categories: ['ecommerce']
    },
    {
        id: 'ecom-blog',
        name: 'Blog Intégré',
        description: 'Pour votre content marketing et SEO.',
        price: 300,
        categories: ['ecommerce']
    },
    {
        id: 'ecom-loyalty',
        name: 'Programme de Fidélité',
        description: 'Points récompenses et codes promo automatiques.',
        price: 500,
        categories: ['ecommerce']
    },

    // --- MOBILE ---
    {
        id: 'mobile-publish',
        name: 'Publication Stores',
        description: 'Gestion des comptes et validation Apple/Google.',
        price: 600,
        categories: ['mobile']
    },
    {
        id: 'mobile-push',
        name: 'Notifications Push',
        description: 'Envoi de notifications ciblées aux utilisateurs.',
        price: 450,
        categories: ['mobile']
    },
    {
        id: 'mobile-offline',
        name: 'Mode Hors-ligne',
        description: 'Fonctionnement de l\'app sans connexion internet.',
        price: 800,
        categories: ['mobile']
    },

    // --- IDENTITE ---
    {
        id: 'brand-guide',
        name: 'Brand Guide PDF',
        description: 'Document complet des normes graphiques.',
        price: 400,
        categories: ['identite']
    },
    {
        id: 'social-kit',
        name: 'Pack Réseaux Sociaux',
        description: 'Bannières et templates de posts (Insta/LinkedIn).',
        price: 300,
        categories: ['identite']
    },
    {
        id: 'print-assets',
        name: 'Supports Imprimés',
        description: 'Design de cartes de visite, flyers, papier à en-tête.',
        price: 250,
        categories: ['identite']
    },

    // --- OPTIONS GENERALES / OLD FALLBACK ---
    {
        id: 'content',
        name: 'Création de Contenu',
        description: 'Rédaction optimisée des textes de votre site.',
        price: 450,
        categories: ['sites', 'ecommerce', 'webapp']
    },
    {
        id: 'legal',
        name: 'Pack Légal (RGPD)',
        description: 'Mise en conformité, mentions légales, cookie bar.',
        price: 250,
        categories: ['sites', 'ecommerce', 'webapp', 'mobile']
    },
    {
        id: 'booking',
        name: 'Module de Réservation',
        description: 'Système de prise de rendez-vous en ligne (Calendly/Cal.com).',
        price: 300,
        categories: ['sites', 'webapp']
    }
];
