/**
 * Wizard Configuration System
 * Defines which steps to show based on service type
 */

export type ServiceType = 'vitrine' | 'webapp' | 'mobile' | 'ecommerce' | 'identite' | 'automatisation';

export interface WizardStep {
    id: string;
    label: string;
    component: string; // Component name to render
}

export const WIZARD_CONFIGS: Record<ServiceType, WizardStep[]> = {
    // Sites Vitrine - Steps classiques
    vitrine: [
        { id: 'service', label: 'Service', component: 'ServiceStep' },
        { id: 'structure', label: 'Structure', component: 'StructureStep' },
        { id: 'features', label: 'Fonctionnalités', component: 'FeaturesStep' },
        { id: 'design', label: 'Design', component: 'DesignStep' },
        { id: 'technical', label: 'Technique', component: 'TechnicalStep' },
        { id: 'summary', label: 'Récapitulatif', component: 'SummaryStep' },
    ],

    // Application Web - Idem sites vitrine
    webapp: [
        { id: 'service', label: 'Service', component: 'ServiceStep' },
        { id: 'structure', label: 'Structure', component: 'StructureStep' },
        { id: 'features', label: 'Fonctionnalités', component: 'FeaturesStep' },
        { id: 'design', label: 'Design', component: 'DesignStep' },
        { id: 'technical', label: 'Technique', component: 'TechnicalStep' },
        { id: 'summary', label: 'Récapitulatif', component: 'SummaryStep' },
    ],

    // Automatisation - Steps spécifiques
    automatisation: [
        { id: 'service', label: 'Service', component: 'ServiceStep' },
        { id: 'automation-type', label: 'Type', component: 'AutomationTypeStep' },
        { id: 'automation-integrations', label: 'Intégrations', component: 'AutomationIntegrationsStep' },
        { id: 'automation-complexity', label: 'Complexité', component: 'AutomationComplexityStep' },
        { id: 'summary', label: 'Récapitulatif', component: 'SummaryStep' },
    ],

    // Identité Visuelle - Steps spécifiques
    identite: [
        { id: 'service', label: 'Service', component: 'ServiceStep' },
        { id: 'identity-package', label: 'Package', component: 'IdentityPackageStep' },
        { id: 'identity-style', label: 'Style', component: 'IdentityStyleStep' },
        { id: 'summary', label: 'Récapitulatif', component: 'SummaryStep' },
    ],

    // Application Mobile - Steps spécifiques
    mobile: [
        { id: 'service', label: 'Service', component: 'ServiceStep' },
        { id: 'mobile-platforms', label: 'Plateformes', component: 'MobilePlatformsStep' },
        { id: 'mobile-features', label: 'Fonctionnalités', component: 'MobileFeaturesStep' },
        { id: 'mobile-design', label: 'Design', component: 'MobileDesignStep' },
        { id: 'summary', label: 'Récapitulatif', component: 'SummaryStep' },
    ],

    // E-commerce - Steps spécifiques
    ecommerce: [
        { id: 'service', label: 'Service', component: 'ServiceStep' },
        { id: 'ecommerce-catalog', label: 'Catalogue', component: 'EcommerceCatalogStep' },
        { id: 'ecommerce-payment', label: 'Paiement', component: 'EcommercePaymentStep' },
        { id: 'ecommerce-features', label: 'Fonctionnalités', component: 'EcommerceFeaturesStep' },
        { id: 'summary', label: 'Récapitulatif', component: 'SummaryStep' },
    ],
};

/**
 * Get wizard configuration for a service type
 */
export function getWizardConfig(serviceType: ServiceType): WizardStep[] {
    return WIZARD_CONFIGS[serviceType] || WIZARD_CONFIGS.vitrine;
}

/**
 * Get total steps for a service type
 */
export function getTotalSteps(serviceType: ServiceType): number {
    return getWizardConfig(serviceType).length;
}

/**
 * Get step label by index
 */
export function getStepLabel(serviceType: ServiceType, stepIndex: number): string {
    const config = getWizardConfig(serviceType);
    return config[stepIndex - 1]?.label || '';
}

/**
 * Automation Types Configuration
 */
export const AUTOMATION_TYPES = {
    administrative: {
        label: '📋 Gestion Administrative',
        options: [
            { value: 'devis_auto', label: 'Devis automatiques', description: 'Génération et envoi automatique de devis' },
            { value: 'facturation_auto', label: 'Facturation automatique', description: 'Création et envoi de factures' },
            { value: 'reporting', label: 'Reporting automatique', description: 'Export et envoi de rapports périodiques' },
            { value: 'archivage', label: 'Archivage documents', description: 'Organisation automatique dans Drive/Dropbox' },
        ],
    },
    marketing: {
        label: '📧 Marketing & Communication',
        options: [
            { value: 'email_marketing', label: 'Email marketing', description: 'Campagnes email automatisées' },
            { value: 'sms_auto', label: 'SMS automatiques', description: 'Envoi de SMS (confirmations, rappels)' },
            { value: 'lead_nurturing', label: 'Lead nurturing', description: 'Séquences email pour prospects' },
            { value: 'social_posting', label: 'Publication réseaux sociaux', description: 'Planification et auto-post' },
        ],
    },
    integrations: {
        label: '🔗 Intégrations & Sync',
        options: [
            { value: 'crm_sync', label: 'Sync CRM', description: 'Synchronisation avec CRM externe' },
            { value: 'backup_auto', label: 'Backup automatique', description: 'Sauvegarde quotidienne base de données' },
            { value: 'compta_sync', label: 'Sync comptabilité', description: 'Export vers logiciel comptable' },
            { value: 'notifications', label: 'Notifications équipe', description: 'Alertes Slack/Discord' },
        ],
    },
    tasks: {
        label: '🤖 Tâches Répétitives',
        options: [
            { value: 'rappels_auto', label: 'Rappels automatiques', description: 'Relances factures, RDV' },
            { value: 'classement_auto', label: 'Classement automatique', description: 'Organisation emails/fichiers' },
            { value: 'content_generation', label: 'Génération contenu AI', description: 'Posts/articles automatiques' },
        ],
    },
};

/**
 * Integration Options Configuration
 */
export const INTEGRATION_OPTIONS = [
    // Email
    { value: 'gmail', label: 'Gmail', category: 'Email', icon: '📧' },
    { value: 'outlook', label: 'Outlook', category: 'Email', icon: '📧' },

    // Paiement
    { value: 'stripe', label: 'Stripe', category: 'Paiement', icon: '💳' },
    { value: 'paypal', label: 'PayPal', category: 'Paiement', icon: '💳' },

    // Stockage
    { value: 'google_sheets', label: 'Google Sheets', category: 'Stockage', icon: '📊' },
    { value: 'google_drive', label: 'Google Drive', category: 'Stockage', icon: '📁' },
    { value: 'dropbox', label: 'Dropbox', category: 'Stockage', icon: '📁' },

    // CRM/Outils
    { value: 'hubspot', label: 'HubSpot', category: 'CRM', icon: '🎯' },
    { value: 'notion', label: 'Notion', category: 'Outils', icon: '📝' },
    { value: 'airtable', label: 'Airtable', category: 'Outils', icon: '📋' },

    // Communication
    { value: 'slack', label: 'Slack', category: 'Communication', icon: '💬' },
    { value: 'discord', label: 'Discord', category: 'Communication', icon: '💬' },

    // Base de données
    { value: 'supabase', label: 'Supabase', category: 'Database', icon: '🗄️' },
    { value: 'mysql', label: 'MySQL', category: 'Database', icon: '🗄️' },
];

/**
 * Identity Package Configuration
 */
export const IDENTITY_PACKAGES = [
    {
        value: 'logo',
        label: 'Logo Essentiel',
        priceRange: '400€ - 600€',
        features: [
            'Logo principal (3 propositions)',
            'Déclinaison N&B',
            'Fichiers PNG, JPG, SVG',
            '2 révisions incluses',
        ],
    },
    {
        value: 'charte',
        label: 'Logo + Charte',
        priceRange: '800€ - 1 200€',
        features: [
            'Tout Package Essentiel',
            'Charte graphique complète',
            'Guidelines PDF',
            'Carte de visite + papier en-tête',
        ],
    },
    {
        value: 'complete',
        label: 'Identité Complète',
        priceRange: '1 500€ - 2 000€',
        features: [
            'Tout Package Charte',
            'Kit réseaux sociaux',
            'Signature email',
            'Templates PowerPoint/Canva',
            'Mockups produits',
        ],
    },
];

/**
 * Design Styles for Identity
 */
export const IDENTITY_STYLES = [
    { value: 'minimal', label: 'Minimaliste', description: 'Épuré, simple, moderne' },
    { value: 'vintage', label: 'Vintage/Rétro', description: 'Nostalgique, intemporel' },
    { value: 'modern', label: 'Moderne/Tech', description: 'Futuriste, innovant' },
    { value: 'corporate', label: 'Corporate/Pro', description: 'Sérieux, professionnel' },
    { value: 'creative', label: 'Créatif/Artistique', description: 'Original, expressif' },
    { value: 'luxury', label: 'Luxe/Premium', description: 'Élégant, haut de gamme' },
];
