import { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Euro, TrendingUp, Info, Palette, Globe, Target, LayoutTemplate, Sparkles, FileSpreadsheet, Loader2, X, FileText, Smartphone, Package, CreditCard, Zap } from "lucide-react";
import { toast } from "sonner";
import { calculateQuotePrice, formatPrice, getConfidenceLabel } from "@/utils/pricing/calculateQuotePrice";
import { QuoteSummaryCard } from "./QuoteSummaryCard";
import { exportQuoteToExcel } from "@/utils/export/exportToExcel";
import { getWizardConfig, getTotalSteps, ServiceType, AUTOMATION_TYPES, IDENTITY_PACKAGES, IDENTITY_STYLES } from "@/utils/wizard/wizardConfig";
import { AutomationTypeStep } from "./steps/AutomationTypeStep";
import { AutomationIntegrationsStep } from "./steps/AutomationIntegrationsStep";
import { AutomationComplexityStep } from "./steps/AutomationComplexityStep";
import { IdentityPackageStep } from "./steps/IdentityPackageStep";
import { IdentityStyleStep } from "./steps/IdentityStyleStep";
import { MobilePlatformsStep } from "./steps/MobilePlatformsStep";
import { MobileFeaturesStep } from "./steps/MobileFeaturesStep";
import { MobileDesignStep } from "./steps/MobileDesignStep";
import { EcommerceCatalogStep } from "./steps/EcommerceCatalogStep";
import { EcommercePaymentStep } from "./steps/EcommercePaymentStep";
import { EcommerceFeaturesStep } from "./steps/EcommerceFeaturesStep";


interface QuoteWizardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quote: any;
    client: { name: string; email: string };
    onSuccess?: () => void;
}

export interface QuoteFormData {
    // Common fields (all services)
    serviceType: string;
    isRefonte: boolean;
    existingUrl: string;
    urgency: string;

    // Sites/WebApp fields
    pagesCount: number;
    standardPages: string[];
    customPages: string;
    multiLanguage: boolean;
    languages: string[];
    features: {
        forms: string[];
        auth: string[];
        ecommerce: string[];
        content: string[];
        integrations: string[];
    };
    hasLogo: boolean;
    logoUrl: string;
    hasCharte: boolean;
    colors: string;
    references: string;
    designStyle: string;
    manageDomain: boolean;
    seoPriority: boolean;
    performanceCritical: boolean;
    accessibility: boolean;
    budgetRange: string;
    paymentTerms: string;
    maintenance: boolean;
    launchDate: string;

    // Automatisation fields
    automationType?: string[];
    automationIntegrations?: string[];
    automationWorkflows?: number;
    automationComplexity?: 'simple' | 'medium' | 'complex';
    automationTraining?: boolean;
    automationSupport?: boolean;
    automationOther?: string;

    // Identité fields
    identityPackage?: 'logo' | 'charte' | 'complete';
    identityStyle?: string; // Style visual (minimal, vintage, modern, etc.)
    identityColors?: string; // Couleurs préférées
    identityIndustry?: string; // Secteur d'activité
    identityValues?: string; // Valeurs de la marque


    // Mobile fields
    mobilePlatforms?: string[];
    mobileFeatures?: string[];
    mobileDesignType?: 'native' | 'custom';
    mobileBackend?: 'existing' | 'new' | 'none';

    // E-commerce fields
    ecommerceProductCount?: number; // Changed from string to number
    ecommerceCategoryCount?: number;
    ecommerceCatalogType?: 'simple' | 'standard' | 'advanced';
    ecommercePaymentMethods?: string[];
    ecommerceCurrency?: string;
    ecommerceMultiCurrency?: boolean;
    ecommerceFeatures?: string[];
}


const QuoteWizardModal = ({ open, onOpenChange, quote, client, onSuccess }: QuoteWizardModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Service Type
        serviceType: "",
        isRefonte: false,
        existingUrl: "",
        urgency: "",

        // Step 2: Pages & Structure
        pagesCount: 5,
        standardPages: [] as string[],
        customPages: "",
        multiLanguage: false,
        languages: [] as string[],

        // Step 3: Features
        features: {
            forms: [] as string[],
            auth: [] as string[],
            ecommerce: [] as string[],
            content: [] as string[],
            integrations: [] as string[],
        },

        // Step 4: Design
        hasLogo: false,
        logoUrl: "",
        hasCharte: false,
        colors: "",
        references: "",
        designStyle: "",

        // Step 5: Technical
        manageDomain: false,
        seoPriority: false,
        performanceCritical: false,
        accessibility: false,

        // Step 6: Budget
        budgetRange: "",
        paymentTerms: "",
        maintenance: false,
        launchDate: "",
    });

    // Get dynamic wizard steps based on service type
    const wizardSteps = useMemo(() => {
        const serviceType = (formData.serviceType || 'vitrine') as ServiceType;
        return getWizardConfig(serviceType);
    }, [formData.serviceType]);

    const totalSteps = wizardSteps.length;
    const progressPercentage = (currentStep / totalSteps) * 100;

    // Calculate price estimate in real-time
    const priceEstimate = useMemo(() => calculateQuotePrice(formData), [formData]);

    // Load quote data when modal opens or quote changes
    useEffect(() => {
        const loadFreshData = async () => {
            if (open && quote) {
                // Fetch FRESH data from database to avoid stale prop data
                const { data: freshQuote, error } = await supabase
                    .from('quote_requests')
                    .select('qualification_data')
                    .eq('id', quote.id)
                    .single();

                if (error) {
                    console.error('Error loading fresh quote data:', error);
                }

                // Load existing qualification data if available
                const qualificationData = freshQuote?.qualification_data || quote.qualification_data;
                if (qualificationData) {
                    setFormData(qualificationData);
                    // If data exists, jump directly to last step (summary & pricing)
                    // Calculate total steps based on loaded service type
                    const loadedType = (qualificationData.serviceType || 'vitrine') as ServiceType;
                    const loadedSteps = getWizardConfig(loadedType);
                    setCurrentStep(loadedSteps.length);
                } else {
                    // Reset with empty values and start at Step 1
                    setCurrentStep(1);
                    setFormData({
                        serviceType: "",
                        isRefonte: false,
                        existingUrl: "",
                        urgency: "",
                        pagesCount: 5,
                        standardPages: [],
                        customPages: "",
                        multiLanguage: false,
                        languages: [],
                        features: {
                            forms: [],
                            auth: [],
                            ecommerce: [],
                            content: [],
                            integrations: [],
                        },
                        hasLogo: false,
                        logoUrl: "",
                        hasCharte: false,
                        colors: "",
                        references: "",
                        designStyle: "",
                        manageDomain: false,
                        seoPriority: false,
                        performanceCritical: false,
                        accessibility: false,
                        budgetRange: "",
                        paymentTerms: "",
                        maintenance: false,
                        launchDate: "",
                    });
                }
            }
        };

        loadFreshData();
    }, [open, quote]);

    const handleNext = () => {
        if (currentStep < wizardSteps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = async () => {
        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('quote_requests')
                .update({ qualification_data: formData })
                .eq('id', quote.id);

            if (error) throw error;

            toast.success("Qualification du devis enregistrée !");
            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            console.error('❌ Error saving qualification:', error);
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportExcel = () => {
        exportQuoteToExcel({
            quote,
            client,
            formData,
            priceEstimate
        });
        toast.success("Export Excel téléchargé !");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] bg-slate-950 border border-slate-800 text-white p-0 overflow-hidden flex flex-col">
                <DialogHeader className="px-8 py-6 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-light text-white">
                                Qualification de Devis
                            </DialogTitle>
                            <p className="text-sm text-slate-400 mt-1">{client.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                Étape {currentStep} sur {totalSteps}
                            </p>
                            <p className="text-sm font-medium text-slate-300">
                                {wizardSteps[currentStep - 1]?.label || ''}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="px-8 py-4 bg-slate-900/30">
                    <Progress value={progressPercentage} className="h-2 bg-slate-800" indicatorClassName="bg-blue-500" />
                    <div className="flex justify-between mt-3">
                        {wizardSteps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${index + 1 < currentStep
                                    ? "bg-blue-500 text-white"
                                    : index + 1 === currentStep
                                        ? "bg-blue-500/20 text-blue-300 border-2 border-blue-500"
                                        : "bg-slate-800 text-slate-500"
                                    }`}>
                                    {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                                </div>
                                <p className={`text-[10px] mt-1 text-center max-w-[80px] ${index + 1 === currentStep ? "text-blue-300 font-medium" : "text-slate-500"
                                    }`}>
                                    {step.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Type de Service</h3>
                                <p className="text-sm text-slate-400 mb-6">Quel type de projet le client souhaite-t-il ?</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Type de Projet *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "vitrine", label: "Site Vitrine" },
                                        { value: "webapp", label: "Application Web" },
                                        { value: "mobile", label: "Application Mobile" },
                                        { value: "ecommerce", label: "E-commerce" },
                                        { value: "identite", label: "Identité Visuelle" },
                                        { value: "automatisation", label: "Automatisation" },
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, serviceType: type.value })}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${formData.serviceType === type.value
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-white">{type.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Refonte or Creation */}
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Contexte du Projet</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isRefonte: false })}
                                        className={`flex-1 p-3 rounded border transition-all ${!formData.isRefonte
                                            ? "border-blue-500 bg-blue-500/10 text-white"
                                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white"
                                            }`}
                                    >
                                        <p className="text-sm font-medium">Nouvelle Création</p>
                                        <p className="text-xs text-slate-500 mt-1">Partir de zéro</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isRefonte: true })}
                                        className={`flex-1 p-3 rounded border transition-all ${formData.isRefonte
                                            ? "border-blue-500 bg-blue-500/10 text-white"
                                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white"
                                            }`}
                                    >
                                        <p className="text-sm font-medium">Refonte</p>
                                        <p className="text-xs text-slate-500 mt-1">Mise à jour d'un site existant</p>
                                    </button>
                                </div>
                            </div>

                            {/* Existing URL if Refonte */}
                            {formData.isRefonte && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">URL du Site Actuel</label>
                                    <input
                                        type="url"
                                        value={formData.existingUrl}
                                        onChange={(e) => setFormData({ ...formData, existingUrl: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            )}

                            {/* Urgency */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Urgence du Projet</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: "normal", label: "Normal", desc: "2-3 mois" },
                                        { value: "urgent", label: "Urgent", desc: "< 1 mois" },
                                        { value: "flexible", label: "Flexible", desc: "Pas pressé" },
                                    ].map((urgency) => (
                                        <button
                                            key={urgency.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, urgency: urgency.value })}
                                            className={`p-3 rounded border transition-all text-center ${formData.urgency === urgency.value
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-white">{urgency.label}</p>
                                            <p className="text-xs text-slate-500 mt-1">{urgency.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AUTOMATION STEPS */}
                    {formData.serviceType === 'automatisation' && currentStep === 2 && (
                        <AutomationTypeStep
                            formData={formData}
                            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                        />
                    )}

                    {formData.serviceType === 'automatisation' && currentStep === 3 && (
                        <AutomationIntegrationsStep
                            formData={formData}
                            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                        />
                    )}

                    {formData.serviceType === 'automatisation' && currentStep === 4 && (
                        <AutomationComplexityStep
                            formData={formData}
                            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                        />
                    )}

                    {/* IDENTITY STEPS */}
                    {formData.serviceType === 'identite' && currentStep === 2 && (
                        <IdentityPackageStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}

                    {formData.serviceType === 'identite' && currentStep === 3 && (
                        <IdentityStyleStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}


                    {/* MOBILE STEPS */}
                    {formData.serviceType === 'mobile' && currentStep === 2 && (
                        <MobilePlatformsStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}

                    {formData.serviceType === 'mobile' && currentStep === 3 && (
                        <MobileFeaturesStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}

                    {formData.serviceType === 'mobile' && currentStep === 4 && (
                        <MobileDesignStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}


                    {/* E-COMMERCE STEPS */}
                    {formData.serviceType === 'ecommerce' && currentStep === 2 && (
                        <EcommerceCatalogStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}

                    {formData.serviceType === 'ecommerce' && currentStep === 3 && (
                        <EcommercePaymentStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}

                    {formData.serviceType === 'ecommerce' && currentStep === 4 && (
                        <EcommerceFeaturesStep
                            formData={formData}
                            updateFormData={(data) => setFormData({ ...formData, ...data })}
                        />
                    )}


                    {/* WEBSITE/WEBAPP STEPS */}
                    {(formData.serviceType === 'vitrine' || formData.serviceType === 'webapp') && currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Pages & Structure</h3>
                                <p className="text-sm text-slate-400 mb-6">Définir l'architecture exacte du site</p>
                            </div>

                            {/* Pages Count Slider */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Nombre de Pages</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={formData.pagesCount}
                                        onChange={(e) => setFormData({ ...formData, pagesCount: parseInt(e.target.value) })}
                                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-2xl font-bold text-blue-400 min-w-[60px] text-right">{formData.pagesCount}</span>
                                </div>
                            </div>

                            {/* Standard Pages */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Pages Standard</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "Accueil",
                                        "À Propos",
                                        "Services",
                                        "Portfolio",
                                        "Blog",
                                        "Contact",
                                        "Mentions Légales",
                                        "FAQ"
                                    ].map((page) => (
                                        <label
                                            key={page}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.standardPages.includes(page)
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.standardPages.includes(page)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, standardPages: [...formData.standardPages, page] });
                                                    } else {
                                                        setFormData({ ...formData, standardPages: formData.standardPages.filter(p => p !== page) });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-white">{page}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Pages */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Pages Personnalisées (Optionnel)</label>
                                <textarea
                                    value={formData.customPages}
                                    onChange={(e) => setFormData({ ...formData, customPages: e.target.value })}
                                    placeholder="Lister les pages supplémentaires, séparées par des virgules..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Multi-language */}
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Multi-Langue</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, multiLanguage: !formData.multiLanguage })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.multiLanguage ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.multiLanguage ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>
                                {formData.multiLanguage && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {["FR", "EN", "ES", "DE", "IT", "PT"].map((lang) => (
                                            <label
                                                key={lang}
                                                className={`flex items-center justify-center gap-2 p-2 rounded border cursor-pointer transition-all ${formData.languages.includes(lang)
                                                    ? "border-blue-500 bg-blue-500/10 text-white"
                                                    : "border-slate-700 bg-slate-900/50 text-slate-400"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.languages.includes(lang)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, languages: [...formData.languages, lang] });
                                                        } else {
                                                            setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
                                                        }
                                                    }}
                                                    className="w-3 h-3"
                                                />
                                                <span className="text-xs font-medium">{lang}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3 - Features (Sites/WebApp only) */}
                    {(formData.serviceType === 'vitrine' || formData.serviceType === 'webapp') && currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Fonctionnalités</h3>
                                <p className="text-sm text-slate-400 mb-6">Quelles fonctionnalités le projet nécessite-t-il ?</p>
                            </div>

                            {/* Forms */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Formulaires</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Formulaire Contact", "Demande de Devis", "Inscription Newsletter", "Réservation/Rendez-vous", "Upload Fichiers"].map((feature) => (
                                        <label
                                            key={feature}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.features.forms.includes(feature)
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.features.forms.includes(feature)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, features: { ...formData.features, forms: [...formData.features.forms, feature] } });
                                                    } else {
                                                        setFormData({ ...formData, features: { ...formData.features, forms: formData.features.forms.filter(f => f !== feature) } });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-white">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Authentication */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Authentification & Gestion Utilisateurs</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Connexion Utilisateur", "Tableau de Bord Client", "Rôles Multiples"].map((feature) => (
                                        <label
                                            key={feature}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.features.auth.includes(feature)
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.features.auth.includes(feature)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, features: { ...formData.features, auth: [...formData.features.auth, feature] } });
                                                    } else {
                                                        setFormData({ ...formData, features: { ...formData.features, auth: formData.features.auth.filter(f => f !== feature) } });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-white">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* E-commerce (conditional) */}
                            {formData.serviceType === "ecommerce" && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Fonctionnalités E-commerce</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Catalogue Produits", "Panier", "Paiement (Stripe/PayPal)", "Gestion Commandes", "Suivi Stock"].map((feature) => (
                                            <label
                                                key={feature}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.features.ecommerce.includes(feature)
                                                    ? "border-blue-500 bg-blue-500/10"
                                                    : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.features.ecommerce.includes(feature)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, features: { ...formData.features, ecommerce: [...formData.features.ecommerce, feature] } });
                                                        } else {
                                                            setFormData({ ...formData, features: { ...formData.features, ecommerce: formData.features.ecommerce.filter(f => f !== feature) } });
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-white">{feature}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Contenu Dynamique</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Blog/Actualités", "Recherche", "Filtres Avancés", "Avis/Notes"].map((feature) => (
                                        <label
                                            key={feature}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.features.content.includes(feature)
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.features.content.includes(feature)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, features: { ...formData.features, content: [...formData.features.content, feature] } });
                                                    } else {
                                                        setFormData({ ...formData, features: { ...formData.features, content: formData.features.content.filter(f => f !== feature) } });
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-white">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4 - Design (Sites/WebApp only) */}
                    {(formData.serviceType === 'vitrine' || formData.serviceType === 'webapp') && currentStep === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Design & Identité Visuelle</h3>
                                <p className="text-sm text-slate-400 mb-6">Identité visuelle et préférences de style</p>
                            </div>

                            {/* Logo */}
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Possède un Logo ?</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, hasLogo: !formData.hasLogo })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.hasLogo ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.hasLogo ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>
                                {formData.hasLogo && (
                                    <input
                                        type="url"
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        placeholder="URL du logo ou lien fichier"
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                    />
                                )}
                            </div>

                            {/* Brand Guidelines */}
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Possède une Charte Graphique ?</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, hasCharte: !formData.hasCharte })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.hasCharte ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.hasCharte ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Couleurs Préférées</label>
                                <input
                                    type="text"
                                    value={formData.colors}
                                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                    placeholder="Ex: Bleu, Blanc, Or..."
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* References */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Sites Références (Inspiration)</label>
                                <textarea
                                    value={formData.references}
                                    onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                                    placeholder="Lister 2-3 sites web que vous aimez (URLs)"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Design Style */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Style de Design</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Minimaliste", "Corporate", "Créatif", "Luxe"].map((style) => (
                                        <button
                                            key={style}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, designStyle: style })}
                                            className={`p-3 rounded border transition-all text-center ${formData.designStyle === style
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-white">{style}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Technical Requirements Step - only for web-based services */}
                    {currentStep === 5 && formData.serviceType !== 'automatisation' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Exigences Techniques</h3>
                                <p className="text-sm text-slate-400 mb-6">Spécifications techniques et priorités</p>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-4">
                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-white">Gestion Domaine & Hébergement</label>
                                        <p className="text-xs text-slate-500 mt-1">Aide pour l'enregistrement du domaine et la configuration de l'hébergement</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, manageDomain: !formData.manageDomain })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.manageDomain ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.manageDomain ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>

                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-white">Priorité SEO</label>
                                        <p className="text-xs text-slate-500 mt-1">L'optimisation pour les moteurs de recherche est critique</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, seoPriority: !formData.seoPriority })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.seoPriority ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.seoPriority ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>

                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-white">Performance Critique</label>
                                        <p className="text-xs text-slate-500 mt-1">Temps de chargement ciblé &lt; 3 secondes</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, performanceCritical: !formData.performanceCritical })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.performanceCritical ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.performanceCritical ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>

                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-white">Accessibilité (WCAG AA)</label>
                                        <p className="text-xs text-slate-500 mt-1">Répondre aux normes d'accessibilité</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, accessibility: !formData.accessibility })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.accessibility ? "bg-blue-500" : "bg-slate-700"
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.accessibility ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Step - shows when on the last step */}
                    {currentStep === totalSteps && (
                        <div className="space-y-6">
                            {/* Visual Summary Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-lg font-semibold text-white">Récapitulatif de Qualification</h3>
                                    <span className="text-xs text-slate-500">Vos réponses résumées</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Service Summary - Always shown */}
                                    <QuoteSummaryCard
                                        title="Service"
                                        icon={LayoutTemplate}
                                        colorClass="border-blue-500/30"
                                        data={{
                                            "Type": formData.serviceType || "Non défini",
                                            "Refonte": formData.isRefonte,
                                            "Urgence": formData.urgency || "Non défini",
                                            ...(formData.existingUrl && { "URL existante": formData.existingUrl })
                                        }}
                                        onEdit={() => setCurrentStep(1)}
                                    />

                                    {/* Automation-specific cards */}
                                    {formData.serviceType === 'automatisation' ? (
                                        <>
                                            {/* Automation Types */}
                                            {formData.automationType && formData.automationType.length > 0 && (
                                                <QuoteSummaryCard
                                                    title="Types d'automatisation"
                                                    icon={Target}
                                                    colorClass="border-green-500/30"
                                                    data={{
                                                        "Sélectionnés": formData.automationType
                                                            .map(value => {
                                                                // Find the label from AUTOMATION_TYPES config
                                                                for (const category of Object.values(AUTOMATION_TYPES)) {
                                                                    const option = category.options.find(opt => opt.value === value);
                                                                    if (option) return option.label;
                                                                }
                                                                return value;
                                                            })
                                                            .join(', '),
                                                        "Nombre": `${formData.automationType.length} type(s)`
                                                    }}
                                                    onEdit={() => setCurrentStep(2)}
                                                />
                                            )}

                                            {/* Integrations */}
                                            {formData.automationIntegrations && formData.automationIntegrations.length > 0 && (
                                                <QuoteSummaryCard
                                                    title="Intégrations"
                                                    icon={Globe}
                                                    colorClass="border-purple-500/30"
                                                    data={{
                                                        "Outils connectés": formData.automationIntegrations.join(', '),
                                                        "Nombre": `${formData.automationIntegrations.length} intégration(s)`
                                                    }}
                                                    onEdit={() => setCurrentStep(3)}
                                                />
                                            )}

                                            {/* Complexity */}
                                            <QuoteSummaryCard
                                                title="Complexité"
                                                icon={Palette}
                                                colorClass="border-pink-500/30"
                                                data={{
                                                    "Workflows": `${formData.automationWorkflows || 1} workflow(s)`,
                                                    "Complexité": formData.automationComplexity || "Non défini",
                                                    ...(formData.automationSupport && { "Support": "6 mois inclus" })
                                                }}
                                                onEdit={() => setCurrentStep(4)}
                                            />
                                        </>
                                    ) : formData.serviceType === 'identite' ? (
                                        <>
                                            {/* Identity-specific cards */}
                                            {/* Package Summary */}
                                            {formData.identityPackage && (
                                                <QuoteSummaryCard
                                                    title="Package"
                                                    icon={LayoutTemplate}
                                                    colorClass="border-green-500/30"
                                                    data={{
                                                        "Package": IDENTITY_PACKAGES.find(pkg => pkg.value === formData.identityPackage)?.label || formData.identityPackage,
                                                        "Fourchette": IDENTITY_PACKAGES.find(pkg => pkg.value === formData.identityPackage)?.priceRange || "Non défini"
                                                    }}
                                                    onEdit={() => setCurrentStep(2)}
                                                />
                                            )}

                                            {/* Style Summary */}
                                            {formData.identityStyle && (
                                                <QuoteSummaryCard
                                                    title="Style"
                                                    icon={Palette}
                                                    colorClass="border-purple-500/30"
                                                    data={{
                                                        "Style visuel": IDENTITY_STYLES.find(style => style.value === formData.identityStyle)?.label || formData.identityStyle,
                                                        ...(formData.identityColors && { "Couleurs": formData.identityColors })
                                                    }}
                                                    onEdit={() => setCurrentStep(3)}
                                                />
                                            )}

                                            {/* Details Summary */}
                                            {(formData.identityIndustry || formData.identityValues) && (
                                                <QuoteSummaryCard
                                                    title="Détails"
                                                    icon={Target}
                                                    colorClass="border-pink-500/30"
                                                    data={{
                                                        ...(formData.identityIndustry && { "Secteur": formData.identityIndustry }),
                                                        ...(formData.identityValues && { "Valeurs": formData.identityValues })
                                                    }}
                                                    onEdit={() => setCurrentStep(3)}
                                                />
                                            )}
                                        </>
                                    ) : formData.serviceType === 'mobile' ? (
                                        <>
                                            {/* Mobile-specific cards */}
                                            {/* Platforms Card */}
                                            {formData.mobilePlatforms && formData.mobilePlatforms.length > 0 && (
                                                <QuoteSummaryCard
                                                    title="Plateformes"
                                                    icon={Smartphone}
                                                    colorClass="border-green-500/30"
                                                    data={{
                                                        "Cibles": formData.mobilePlatforms.join(', '),
                                                        "Nombre": `${formData.mobilePlatforms.length} plateforme(s)`
                                                    }}
                                                    onEdit={() => setCurrentStep(2)}
                                                />
                                            )}

                                            {/* Features Card */}
                                            {formData.mobileFeatures && formData.mobileFeatures.length > 0 && (
                                                <QuoteSummaryCard
                                                    title="Fonctionnalités"
                                                    icon={Zap}
                                                    colorClass="border-purple-500/30"
                                                    data={{
                                                        "Sélectionnées": formData.mobileFeatures.slice(0, 4).join(', ') + (formData.mobileFeatures.length > 4 ? '...' : ''),
                                                        "Total": `${formData.mobileFeatures.length} fonctionnalité(s)`
                                                    }}
                                                    onEdit={() => setCurrentStep(3)}
                                                />
                                            )}

                                            {/* Design & Backend Card */}
                                            <QuoteSummaryCard
                                                title="Design & Backend"
                                                icon={Palette}
                                                colorClass="border-pink-500/30"
                                                data={{
                                                    "Type design": formData.mobileDesignType === 'native' ? 'Native UI' : 'Custom Design',
                                                    "Backend": formData.mobileBackend === 'existing' ? 'Existant' :
                                                        formData.mobileBackend === 'new' ? 'À créer' : 'Aucun'
                                                }}
                                                onEdit={() => setCurrentStep(4)}
                                            />
                                        </>
                                    ) : formData.serviceType === 'ecommerce' ? (
                                        <>
                                            {/* E-commerce-specific cards */}
                                            {/* Catalogue Card */}
                                            <QuoteSummaryCard
                                                title="Catalogue"
                                                icon={Package}
                                                colorClass="border-amber-500/30"
                                                data={{
                                                    "Produits": `${formData.ecommerceProductCount || 50} produits`,
                                                    "Catégories": `${formData.ecommerceCategoryCount || 5} catégories`,
                                                    "Type": formData.ecommerceCatalogType === 'simple' ? 'Simple' :
                                                        formData.ecommerceCatalogType === 'advanced' ? 'Avancé' : 'Standard'
                                                }}
                                                onEdit={() => setCurrentStep(2)}
                                            />

                                            {/* Payment Card */}
                                            {formData.ecommercePaymentMethods && formData.ecommercePaymentMethods.length > 0 && (
                                                <QuoteSummaryCard
                                                    title="Paiement"
                                                    icon={CreditCard}
                                                    colorClass="border-green-500/30"
                                                    data={{
                                                        "Méthodes": formData.ecommercePaymentMethods.join(', '),
                                                        "Devise": formData.ecommerceCurrency || 'EUR',
                                                        ...(formData.ecommerceMultiCurrency && { "Multi-devises": "Oui" })
                                                    }}
                                                    onEdit={() => setCurrentStep(3)}
                                                />
                                            )}

                                            {/* Features Card */}
                                            {formData.ecommerceFeatures && formData.ecommerceFeatures.length > 0 && (
                                                <QuoteSummaryCard
                                                    title="Fonctionnalités"
                                                    icon={Zap}
                                                    colorClass="border-purple-500/30"
                                                    data={{
                                                        "Sélectionnées": formData.ecommerceFeatures.slice(0, 4).join(', ') + (formData.ecommerceFeatures.length > 4 ? '...' : ''),
                                                        "Total": `${formData.ecommerceFeatures.length} fonctionnalité(s)`
                                                    }}
                                                    onEdit={() => setCurrentStep(4)}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {/* Web-specific cards (vitrine, webapp, etc.) */}
                                            {/* Pages Summary */}
                                            <QuoteSummaryCard
                                                title="Structure"
                                                icon={Globe}
                                                colorClass="border-green-500/30"
                                                data={{
                                                    "Nombre de pages": `${formData.pagesCount} pages`,
                                                    ...(formData.standardPages.length > 0 && { "Pages standards": formData.standardPages }),
                                                    ...(formData.multiLanguage && { "Multi-langue": formData.languages })
                                                }}
                                                onEdit={() => setCurrentStep(2)}
                                            />

                                            {/* Features Summary */}
                                            {Object.values(formData.features).some(f => f.length > 0) && (
                                                <QuoteSummaryCard
                                                    title="Fonctionnalités"
                                                    icon={Target}
                                                    colorClass="border-purple-500/30"
                                                    data={{
                                                        ...(formData.features.forms.length > 0 && { "Formulaires": formData.features.forms }),
                                                        ...(formData.features.auth.length > 0 && { "Auth": formData.features.auth }),
                                                        ...(formData.features.ecommerce.length > 0 && { "E-commerce": formData.features.ecommerce }),
                                                        ...(formData.features.content.length > 0 && { "Contenu": formData.features.content }),
                                                        ...(formData.features.integrations.length > 0 && { "Intégrations": formData.features.integrations })
                                                    }}
                                                    onEdit={() => setCurrentStep(3)}
                                                />
                                            )}

                                            {/* Design Summary */}
                                            <QuoteSummaryCard
                                                title="Design"
                                                icon={Palette}
                                                colorClass="border-pink-500/30"
                                                data={{
                                                    "Logo": formData.hasLogo ? "Existant" : "À créer",
                                                    "Charte graphique": formData.hasCharte ? "Existante" : "À créer",
                                                    ...(formData.designStyle && { "Style": formData.designStyle }),
                                                    ...(formData.colors && { "Couleurs": formData.colors })
                                                }}
                                                onEdit={() => setCurrentStep(4)}
                                            />

                                            {/* Technical Requirements Summary */}
                                            {(formData.manageDomain || formData.seoPriority || formData.performanceCritical || formData.accessibility) && (
                                                <QuoteSummaryCard
                                                    title="Exigences Techniques"
                                                    icon={Sparkles}
                                                    colorClass="border-yellow-500/30"
                                                    data={{
                                                        ...(formData.manageDomain && { "Hébergement": "Gestion incluse" }),
                                                        ...(formData.seoPriority && { "SEO": "Priorité élevée" }),
                                                        ...(formData.performanceCritical && { "Performance": "Optimisation avancée" }),
                                                        ...(formData.accessibility && { "Accessibilité": "Normes WCAG" })
                                                    }}
                                                    onEdit={() => setCurrentStep(5)}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Prix Estimation */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <Euro className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Estimation de Prix</h3>
                                            <p className="text-xs text-slate-400">{getConfidenceLabel(priceEstimate.confidence)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Info className="w-4 h-4" />
                                        <span>Basé sur vos réponses</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Minimum</p>
                                        <p className="text-xl font-bold text-slate-300">{formatPrice(priceEstimate.min)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-blue-500/50">
                                        <p className="text-xs text-blue-300 uppercase tracking-wide mb-1">Recommandé</p>
                                        <p className="text-2xl font-bold text-white">{formatPrice(priceEstimate.recommended)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Maximum</p>
                                        <p className="text-xl font-bold text-slate-300">{formatPrice(priceEstimate.max)}</p>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <details className="group">
                                    <summary className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Voir le détail du calcul</span>
                                    </summary>
                                    <div className="mt-4 space-y-2 pt-4 border-t border-slate-700">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">{priceEstimate.breakdown.packName}</span>
                                            <span className="text-white font-medium">{formatPrice(priceEstimate.breakdown.packBase)}</span>
                                        </div>
                                        {priceEstimate.breakdown.extraPages > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Pages supplémentaires</span>
                                                <span className="text-white font-medium">{formatPrice(priceEstimate.breakdown.extraPages)}</span>
                                            </div>
                                        )}
                                        {priceEstimate.breakdown.features > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Fonctionnalités</span>
                                                <span className="text-white font-medium">{formatPrice(priceEstimate.breakdown.features)}</span>
                                            </div>
                                        )}
                                        {priceEstimate.breakdown.options > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Options</span>
                                                <span className="text-white font-medium">{formatPrice(priceEstimate.breakdown.options)}</span>
                                            </div>
                                        )}
                                        {priceEstimate.breakdown.urgencyMultiplier !== 1.0 && (
                                            <div className="flex justify-between text-sm pt-2 border-t border-slate-700">
                                                <span className="text-slate-400">Multiplicateur Urgence</span>
                                                <span className="text-white font-medium">×{priceEstimate.breakdown.urgencyMultiplier}</span>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Budget & Délais</h3>
                                <p className="text-sm text-slate-400 mb-6">Détails financiers et planning</p>
                            </div>

                            {/* Budget Range */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Budget Estimé</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "<2k", label: "< 2 000€" },
                                        { value: "2k-5k", label: "2 000€ - 5 000€" },
                                        { value: "5k-10k", label: "5 000€ - 10 000€" },
                                        { value: "10k-20k", label: "10 000€ - 20 000€" },
                                        { value: "20k+", label: "> 20 000€" },
                                        { value: "flexible", label: "Flexible" },
                                    ].map((budget) => (
                                        <button
                                            key={budget.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, budgetRange: budget.value })}
                                            className={`p-3 rounded border transition-all text-center ${formData.budgetRange === budget.value
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-white">{budget.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Terms */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Modalités de Paiement</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: "100", label: "100% Acompte" },
                                        { value: "50-50", label: "50-50" },
                                        { value: "30-70", label: "30-70" },
                                    ].map((payment) => (
                                        <button
                                            key={payment.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentTerms: payment.value })}
                                            className={`p-3 rounded border transition-all text-center ${formData.paymentTerms === payment.value
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-white">{payment.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Maintenance */}
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-white">Maintenance Post-Lancement</label>
                                    <p className="text-xs text-slate-500 mt-1">Support mensuel et mises à jour après livraison</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, maintenance: !formData.maintenance })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.maintenance ? "bg-blue-500" : "bg-slate-700"
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.maintenance ? "translate-x-6" : "translate-x-1"
                                        }`} />
                                </button>
                            </div>

                            {/* Launch Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Date de Lancement Souhaitée</label>
                                <input
                                    type="date"
                                    value={formData.launchDate}
                                    onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-800 bg-slate-900/30 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Précédent
                    </Button>

                    {currentStep < wizardSteps.length ? (
                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleExportExcel}
                                variant="outline"
                                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            >
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Export Excel
                            </Button>
                            <Button
                                onClick={handleFinish}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                {isSaving ? "Enregistrement..." : "Terminer"}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuoteWizardModal;
