import { QuoteFormData } from "@/components/admin/modals/QuoteWizardModal";

export interface QuoteEstimate {
    min: number;
    max: number;
    recommended: number;
    breakdown: PriceBreakdown;
    confidence: 'low' | 'medium' | 'high';
    packLevel: 'essentiel' | 'standard' | 'premium' | 'enterprise';
}

export interface PriceBreakdown {
    packBase: number;           // Pack base price
    packName: string;            // Pack name
    extraPages: number;          // Additional pages beyond pack
    features: number;            // Feature additions
    options: number;             // Options (multilingue, etc)
    urgencyMultiplier: number;   // Urgency factor
}

/**
 * PRICING GRID 2025 - Realistic rates for small agency/freelance
 * Competitive and accessible pricing
 */

// Pack Essentiel: 1-3 pages (sites simples)
const PACK_ESSENTIEL = {
    name: "Pack Essentiel",
    minPages: 1,
    maxPages: 3,
    baseMin: 600,
    baseMax: 1000,
    baseRecommended: 800,
    includes: [
        "1 à 3 pages professionnelles",
        "Design responsive (mobile/tablette)",
        "Formulaire de contact",
        "Optimisation SEO de base",
        "Hébergement & SSL",
        "Livraison sous 10 jours"
    ]
};

// Pack Standard: 4-10 pages (sites professionnels)
const PACK_STANDARD = {
    name: "Pack Standard",
    minPages: 4,
    maxPages: 10,
    baseMin: 1200,
    baseMax: 2500,
    baseRecommended: 1850,
    includes: [
        "4 à 10 pages structurées",
        "Design personnalisé à votre image",
        "CMS pour gérer le contenu",
        "Section blog/actualités",
        "SEO optimisé (mots-clés)",
        "Formation incluse",
        "Support 1 mois"
    ]
};

// Pack Premium: 11-20 pages (sites avancés)
const PACK_PREMIUM = {
    name: "Pack Premium",
    minPages: 11,
    maxPages: 20,
    baseMin: 2800,
    baseMax: 5500,
    baseRecommended: 4000,
    includes: [
        "11 à 20 pages complexes",
        "Design 100% sur-mesure",
        "Animations & interactions",
        "SEO avancé",
        "Intégrations tierces",
        "Support prioritaire 3 mois"
    ]
};

// Pack Enterprise: Applications web custom
const PACK_ENTERPRISE = {
    name: "Application Web",
    minPages: 20,
    maxPages: 999,
    baseMin: 3500,
    baseMax: 15000,
    baseRecommended: 7500,
    includes: [
        "Application web sur-mesure",
        "Gestion utilisateurs",
        "Base de données",
        "API & intégrations",
        "Dashboard admin",
        "Support technique"
    ]
};

// Options additionnelles (tarifs accessibles)
const OPTIONS = {
    extraPage: 80,              // Page supplémentaire
    multilingue: 250,           // 2e langue (technique)
    seo: 300,                   // SEO Priority
    performance: 400,           // Performance critique
    accessibility: 600,         // Audit accessibilité
    maintenance: 250,           // Maintenance annuelle
};

// Pricing pour autres services (réaliste petite agence)
const SERVICE_PRICING = {
    'mobile': {
        baseMin: 4000,
        baseMax: 12000,
        baseRecommended: 7000,
        name: "Application Mobile"
    },
    'ecommerce': {
        baseMin: 1500,
        baseMax: 8000,
        baseRecommended: 3500,
        name: "Boutique E-commerce"
    },
    'identite': {
        baseMin: 400,
        baseMax: 1500,
        baseRecommended: 800,
        name: "Identité Visuelle"
    },
    'automatisation': {
        baseMin: 800,
        baseMax: 3500,
        baseRecommended: 1500,
        name: "Automatisation"
    }
};

// Urgency multipliers (moins agressifs)
const URGENCY_MULTIPLIERS = {
    'urgent': 1.25,      // +25% for rush (<2 weeks)
    'normal': 1.0,       // Standard
    'flexible': 0.90,    // -10% for flexible (>2 months)
};

/**
 * Determine which pack based on page count and service type
 */
function determinePackLevel(formData: QuoteFormData): 'essentiel' | 'standard' | 'premium' | 'enterprise' {
    const pages = formData.pagesCount || 5;

    // Special services use different logic
    if (formData.serviceType === 'webapp' || formData.serviceType === 'mobile') {
        return 'enterprise';
    }

    if (pages <= PACK_ESSENTIEL.maxPages) return 'essentiel';
    if (pages <= PACK_STANDARD.maxPages) return 'standard';
    return 'premium';
}

/**
 * Calculate features cost (incremental, adjusted for small agency)
 */
function calculateFeaturesCost(formData: QuoteFormData): number {
    let total = 0;

    // Adjusted feature pricing (more accessible)
    if (formData.features.forms.length > 0) total += formData.features.forms.length * 150;
    if (formData.features.auth.length > 0) total += formData.features.auth.length * 400;
    if (formData.features.ecommerce.length > 0) total += formData.features.ecommerce.length * 600;
    if (formData.features.content.length > 0) total += formData.features.content.length * 300;
    if (formData.features.integrations.length > 0) total += formData.features.integrations.length * 500;

    return total;
}

/**
 * Calculate options cost (adjusted for affordability)
 */
function calculateOptionsCost(formData: QuoteFormData): number {
    let total = 0;

    // Multilingue
    if (formData.multiLanguage && formData.languages.length > 1) {
        total += OPTIONS.multilingue * (formData.languages.length - 1);
    }

    // Maintenance annuelle
    if (formData.maintenance) {
        total += OPTIONS.maintenance;
    }

    // SEO Priority
    if (formData.seoPriority) {
        total += OPTIONS.seo;
    }

    // Performance critique
    if (formData.performanceCritical) {
        total += OPTIONS.performance;
    }

    // Accessibilité
    if (formData.accessibility) {
        total += OPTIONS.accessibility;
    }

    return total;
}

/**
 * Calculate confidence based on data completeness
 */
function calculateConfidence(formData: QuoteFormData): 'low' | 'medium' | 'high' {
    let completedFields = 0;
    const totalFields = 10;

    if (formData.serviceType) completedFields++;
    if (formData.pagesCount > 0) completedFields++;
    if (formData.urgency) completedFields++;
    if (formData.designStyle) completedFields++;
    if (formData.budgetRange) completedFields++;
    if (formData.standardPages?.length > 0) completedFields++;
    if (Object.values(formData.features).some((f: any) => f.length > 0)) completedFields++;
    if (formData.hasLogo !== undefined) completedFields++;
    if (formData.hasCharte !== undefined) completedFields++;
    if (formData.launchDate) completedFields++;

    const completeness = completedFields / totalFields;

    if (completeness >= 0.7) return 'high';
    if (completeness >= 0.4) return 'medium';
    return 'low';
}

/**
 * Calculate e-commerce-specific pricing based on catalog size, features, and payment methods
 */
function calculateEcommercePrice(formData: QuoteFormData): { baseMin: number; baseMax: number; baseRecommended: number } {
    const productCount = formData.ecommerceProductCount || 50;
    const catalogType = formData.ecommerceCatalogType || 'standard';
    const paymentMethods = formData.ecommercePaymentMethods || [];
    const features = formData.ecommerceFeatures || [];
    const multiCurrency = formData.ecommerceMultiCurrency || false;

    // Base pricing by product count tiers
    let base = 1500;
    if (productCount <= 50) {
        base = 2000; // Small catalog
    } else if (productCount <= 200) {
        base = 3500; // Medium catalog
    } else if (productCount <= 500) {
        base = 5500; // Large catalog
    } else {
        base = 7000; // Extra large catalog
    }

    // Catalog type multiplier
    const catalogMultipliers = {
        simple: 1.0,
        standard: 1.2,
        advanced: 1.4
    };
    base = Math.round(base * catalogMultipliers[catalogType]);

    // Payment integration costs
    let paymentCost = 0;
    if (paymentMethods.includes('stripe') || paymentMethods.includes('paypal')) {
        paymentCost += 700; // Advanced payment integration
    } else if (paymentMethods.includes('card')) {
        paymentCost += 500; // Basic card payment
    }

    // Multi-currency
    if (multiCurrency) {
        paymentCost += 500;
    }

    // Feature costs
    const featureCosts: Record<string, number> = {
        'inventory': 400,
        'variants': 300,
        'shipping-calc': 300,
        'shipping-tracking': 400,
        'orders': 300,
        'analytics': 500,
        'customer-account': 400,
        'wishlist': 200,
        'reviews': 300,
        'promo-codes': 350
    };

    let featureCost = 0;
    features.forEach(feature => {
        featureCost += featureCosts[feature] || 200;
    });

    // Calculate totals
    const subtotal = base + paymentCost + featureCost;

    return {
        baseMin: Math.round(subtotal * 0.85),
        baseMax: Math.round(subtotal * 1.15),
        baseRecommended: subtotal
    };
}

/**
 * Calculate mobile-specific pricing based on platforms, features, design, and backend
 */
function calculateMobilePrice(formData: QuoteFormData): { baseMin: number; baseMax: number; baseRecommended: number } {
    const platforms = formData.mobilePlatforms || [];
    const features = formData.mobileFeatures || [];
    const designType = formData.mobileDesignType || 'native';
    const backend = formData.mobileBackend || 'none';

    // Base pricing by platform count
    let base = 4000; // Single platform
    if (platforms.length >= 2) {
        base += 2000 * (platforms.length - 1); // +2k per additional platform
    }

    // Features cost (categorized by complexity)
    const advancedFeatures = ['ar', 'biometric', 'bluetooth', 'nfc', 'in-app-purchase', 'subscription'];
    const mediumFeatures = ['push-notif', 'payment', 'social-login', 'messaging'];
    const basicFeatures = ['offline', 'camera', 'gps', 'share'];

    let featureCost = 0;
    features.forEach(feature => {
        if (advancedFeatures.includes(feature)) {
            featureCost += 500;
        } else if (mediumFeatures.includes(feature)) {
            featureCost += 300;
        } else if (basicFeatures.includes(feature)) {
            featureCost += 200;
        }
    });

    // Custom design multiplier
    let designMultiplier = designType === 'custom' ? 1.2 : 1.0;

    // Backend cost
    let backendCost = 0;
    if (backend === 'new') {
        backendCost = 3000; // New backend
    }

    // Calculate totals
    const subtotal = Math.round((base + featureCost) * designMultiplier + backendCost);

    return {
        baseMin: Math.round(subtotal * 0.85),
        baseMax: Math.round(subtotal * 1.15),
        baseRecommended: subtotal
    };
}

/**
 * Calculate identity-specific pricing based on selected package
 */
function calculateIdentityPrice(formData: QuoteFormData): { baseMin: number; baseMax: number; baseRecommended: number } {
    const pkg = formData.identityPackage || 'logo';

    // Base pricing by package
    const packagePricing = {
        logo: { min: 400, recommended: 500, max: 600 },
        charte: { min: 800, recommended: 1000, max: 1200 },
        complete: { min: 1500, recommended: 1750, max: 2000 }
    };

    const base = packagePricing[pkg];

    // Style modifiers
    let multiplier = 1.0;
    const premiumStyles = ['luxury', 'creative'];
    if (formData.identityStyle && premiumStyles.includes(formData.identityStyle)) {
        multiplier = 1.15; // +15% for luxury/creative styles
    }

    // Complex industry modifier
    const complexIndustries = ['tech', 'technologie', 'healthcare', 'finance'];
    if (formData.identityIndustry && complexIndustries.some(ind => formData.identityIndustry?.toLowerCase().includes(ind))) {
        multiplier *= 1.1; // +10% for complex industries
    }

    return {
        baseMin: Math.round(base.min * multiplier),
        baseMax: Math.round(base.max * multiplier),
        baseRecommended: Math.round(base.recommended * multiplier)
    };
}

/**
 * Main pricing calculation engine
 */
export function calculateQuotePrice(formData: QuoteFormData): QuoteEstimate {
    // AUTOMATION PRICING
    if (formData.serviceType === 'automatisation') {
        const workflows = formData.automationWorkflows || 1;
        let base = workflows === 1 ? 800 : workflows <= 3 ? 1500 : 2500;

        const complexity = formData.automationComplexity || 'simple';
        const multipliers = { simple: 1.0, medium: 1.3, complex: 1.6 };
        base = Math.round(base * multipliers[complexity]);

        const integrations = formData.automationIntegrations || [];
        const complexIntegrations = ['stripe', 'hubspot', 'supabase', 'mysql'];
        const intCost = integrations.reduce((sum, int) =>
            sum + (complexIntegrations.includes(int) ? 200 : 100), 0);

        const support = formData.automationSupport ? 250 : 0;
        const subtotal = base + intCost + support;

        const urgencyMult = URGENCY_MULTIPLIERS[formData.urgency as keyof typeof URGENCY_MULTIPLIERS] || 1.0;

        return {
            min: Math.round(subtotal * 0.85 * urgencyMult),
            recommended: Math.round(subtotal * urgencyMult),
            max: Math.round(subtotal * 1.15 * urgencyMult),
            breakdown: {
                packBase: base,
                packName: `${workflows} workflow${workflows > 1 ? 's' : ''} (${complexity})`,
                extraPages: 0,
                features: intCost,
                options: support,
                urgencyMultiplier: urgencyMult,
            },
            confidence: 'high',
            packLevel: complexity === 'simple' ? 'essentiel' : complexity === 'medium' ? 'standard' : 'premium',
        };
    }

    // SITES/WEBAPP PRICING
    const packLevel = determinePackLevel(formData);
    const pages = formData.pagesCount || 5;

    let packBase = 0;
    let packName = "";
    let packMin = 0;
    let packMax = 0;
    let extraPagesCount = 0;
    let extraPagesCost = 0;

    // Special service types
    if (formData.serviceType === 'mobile') {
        const mobilePricing = calculateMobilePrice(formData);
        packBase = mobilePricing.baseRecommended;
        packMin = mobilePricing.baseMin;
        packMax = mobilePricing.baseMax;
        packName = `Application Mobile - ${formData.mobilePlatforms?.length || 1} plateforme(s)`;
    } else if (formData.serviceType === 'ecommerce') {
        const ecommercePricing = calculateEcommercePrice(formData);
        packBase = ecommercePricing.baseRecommended;
        packMin = ecommercePricing.baseMin;
        packMax = ecommercePricing.baseMax;
        packName = `E-commerce - ${formData.ecommerceProductCount || 50} produits`;
    } else if (formData.serviceType === 'identite') {
        const identityPricing = calculateIdentityPrice(formData);
        packBase = identityPricing.baseRecommended;
        packMin = identityPricing.baseMin;
        packMax = identityPricing.baseMax;
        packName = `Identité Visuelle - ${formData.identityPackage || 'logo'}`;
    } else if (formData.serviceType === 'automatisation') {
        const pricing = SERVICE_PRICING.automatisation;
        packBase = pricing.baseRecommended;
        packMin = pricing.baseMin;
        packMax = pricing.baseMax;
        packName = pricing.name;
    } else {
        // Site vitrine / webapp - pack-based
        if (packLevel === 'essentiel') {
            packBase = PACK_ESSENTIEL.baseRecommended;
            packMin = PACK_ESSENTIEL.baseMin;
            packMax = PACK_ESSENTIEL.baseMax;
            packName = PACK_ESSENTIEL.name;
            if (pages > PACK_ESSENTIEL.maxPages) {
                extraPagesCount = pages - PACK_ESSENTIEL.maxPages;
            }
        } else if (packLevel === 'standard') {
            packBase = PACK_STANDARD.baseRecommended;
            packMin = PACK_STANDARD.baseMin;
            packMax = PACK_STANDARD.baseMax;
            packName = PACK_STANDARD.name;
            if (pages > PACK_STANDARD.maxPages) {
                extraPagesCount = pages - PACK_STANDARD.maxPages;
            }
        } else if (packLevel === 'premium') {
            packBase = PACK_PREMIUM.baseRecommended;
            packMin = PACK_PREMIUM.baseMin;
            packMax = PACK_PREMIUM.baseMax;
            packName = PACK_PREMIUM.name;
            if (pages > PACK_PREMIUM.maxPages) {
                extraPagesCount = pages - PACK_PREMIUM.maxPages;
            }
        } else {
            // Enterprise/WebApp
            packBase = PACK_ENTERPRISE.baseRecommended;
            packMin = PACK_ENTERPRISE.baseMin;
            packMax = PACK_ENTERPRISE.baseMax;
            packName = PACK_ENTERPRISE.name;
        }

        extraPagesCost = extraPagesCount * OPTIONS.extraPage;
    }

    // Features cost
    const featuresCost = calculateFeaturesCost(formData);

    // Options cost
    const optionsCost = calculateOptionsCost(formData);

    // Subtotal
    const subtotal = packBase + extraPagesCost + featuresCost + optionsCost;

    // Apply urgency multiplier
    const urgencyMultiplier = URGENCY_MULTIPLIERS[formData.urgency as keyof typeof URGENCY_MULTIPLIERS] || 1.0;

    // Final calculations
    const recommended = Math.round(subtotal * urgencyMultiplier);
    const min = Math.round((packMin + extraPagesCost + featuresCost * 0.7 + optionsCost) * urgencyMultiplier);
    const max = Math.round((packMax + extraPagesCost + featuresCost * 1.3 + optionsCost) * urgencyMultiplier);

    const breakdown: PriceBreakdown = {
        packBase: packBase,
        packName: packName,
        extraPages: extraPagesCost,
        features: featuresCost,
        options: optionsCost,
        urgencyMultiplier: urgencyMultiplier,
    };

    const confidence = calculateConfidence(formData);

    return {
        min,
        max,
        recommended,
        breakdown,
        confidence,
        packLevel,
    };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function getConfidenceLabel(confidence: 'low' | 'medium' | 'high'): string {
    const labels = {
        low: 'Estimation approximative',
        medium: 'Estimation indicative',
        high: 'Estimation fiable',
    };
    return labels[confidence];
}
