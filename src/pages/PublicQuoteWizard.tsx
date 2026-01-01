import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuoteFormData } from "@/components/admin/modals/QuoteWizardModal";

const STEPS = [
    { id: 1, name: "Votre Projet", key: "project" },
    { id: 2, name: "Fonctionnalités", key: "features" },
    { id: 3, name: "Design", key: "design" },
    { id: 4, name: "Vos Coordonnées", key: "contact" },
];

export default function PublicQuoteWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Partial<QuoteFormData> & { name: string; email: string; phone: string; company: string }>({
        // Project
        serviceType: "",
        isRefonte: false,
        existingUrl: "",
        urgency: "",
        pagesCount: 5,
        standardPages: [],

        // Features
        features: {
            forms: [],
            auth: [],
            ecommerce: [],
            content: [],
            integrations: [],
        },

        // Design
        hasLogo: false,
        hasCharte: false,
        designStyle: "",

        // Contact
        name: "",
        email: "",
        phone: "",
        company: "",
    });

    const progressPercentage = (currentStep / STEPS.length) * 100;

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name || !formData.email) {
            toast.error("Veuillez remplir vos coordonnées");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('quote_requests')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || null,
                    business_type: formData.company || null,
                    services: [formData.serviceType],
                    qualification_data: {
                        serviceType: formData.serviceType,
                        isRefonte: formData.isRefonte,
                        existingUrl: formData.existingUrl,
                        urgency: formData.urgency,
                        pagesCount: formData.pagesCount,
                        standardPages: formData.standardPages,
                        features: formData.features,
                        hasLogo: formData.hasLogo,
                        hasCharte: formData.hasCharte,
                        designStyle: formData.designStyle,
                    },
                    status: 'pending'
                });

            if (error) throw error;

            toast.success("✨ Demande envoyée ! Nous vous recontacterons rapidement.");

            // Reset form
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Error submitting quote:', error);
            toast.error("Erreur lors de l'envoi. Réessayez.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                        <h1 className="text-3xl font-bold text-white">Demande de Devis</h1>
                    </div>
                    <p className="text-blue-100">Décrivez votre projet en quelques étapes simples</p>
                </div>

                {/* Progress */}
                <div className="px-8 pt-6">
                    <div className="flex justify-between mb-2">
                        {STEPS.map((step) => (
                            <div key={step.id} className={`flex-1 text-center ${step.id <= currentStep ? 'text-blue-400' : 'text-slate-600'}`}>
                                <div className="text-xs font-medium uppercase tracking-wide">{step.name}</div>
                            </div>
                        ))}
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Step 1: Project */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white mb-6">Parlez-nous de votre projet</h2>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Type de projet *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "vitrine", label: "Site Vitrine" },
                                        { value: "webapp", label: "Application Web" },
                                        { value: "mobile", label: "App Mobile" },
                                        { value: "ecommerce", label: "E-commerce" },
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, serviceType: type.value })}
                                            className={`p-4 rounded-lg border transition-all ${formData.serviceType === type.value
                                                    ? "border-blue-500 bg-blue-500/10 text-white"
                                                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">C'est une refonte ?</label>
                                <div className="flex gap-3">
                                    {[
                                        { value: false, label: "Nouveau projet" },
                                        { value: true, label: "Refonte" },
                                    ].map((option) => (
                                        <button
                                            key={option.label}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isRefonte: option.value })}
                                            className={`flex-1 p-3 rounded-lg border transition-all ${formData.isRefonte === option.value
                                                    ? "border-blue-500 bg-blue-500/10 text-white"
                                                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.isRefonte && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">URL actuelle</label>
                                    <input
                                        type="url"
                                        value={formData.existingUrl}
                                        onChange={(e) => setFormData({ ...formData, existingUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Délai souhaité</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: "urgent", label: "Urgent" },
                                        { value: "normal", label: "Normal" },
                                        { value: "flexible", label: "Flexible" },
                                    ].map((urgency) => (
                                        <button
                                            key={urgency.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, urgency: urgency.value })}
                                            className={`p-3 rounded-lg border transition-all ${formData.urgency === urgency.value
                                                    ? "border-blue-500 bg-blue-500/10 text-white"
                                                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                                                }`}
                                        >
                                            {urgency.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Features (simplified) */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white mb-6">De quoi avez-vous besoin ?</h2>

                            <div className="space-y-4">
                                {[
                                    { key: "forms", label: "Formulaires de contact", icon: "📝" },
                                    { key: "auth", label: "Espace membre / Connexion", icon: "🔐" },
                                    { key: "ecommerce", label: "Vente en ligne", icon: "🛒" },
                                    { key: "content", label: "Blog / Actualités", icon: "📰" },
                                ].map((feature) => (
                                    <button
                                        key={feature.key}
                                        type="button"
                                        onClick={() => {
                                            const currentFeatures = formData.features[feature.key as keyof typeof formData.features];
                                            const newFeatures = currentFeatures.length > 0 ? [] : [feature.key];
                                            setFormData({
                                                ...formData,
                                                features: {
                                                    ...formData.features,
                                                    [feature.key]: newFeatures
                                                }
                                            });
                                        }}
                                        className={`w-full p-4 rounded-lg border transition-all text-left flex items-center gap-3 ${formData.features[feature.key as keyof typeof formData.features].length > 0
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                                            }`}
                                    >
                                        <span className="text-2xl">{feature.icon}</span>
                                        <span className="text-white font-medium">{feature.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Design */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white mb-6">Côté design...</h2>

                            <div className="space-y-4">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">Avez-vous un logo ?</p>
                                            <p className="text-sm text-slate-400">Nous pouvons en créer un si besoin</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hasLogo: !formData.hasLogo })}
                                            className={`px-6 py-2 rounded-lg border transition-all ${formData.hasLogo
                                                    ? "border-green-500 bg-green-500/10 text-green-400"
                                                    : "border-slate-600 bg-slate-700 text-slate-300"
                                                }`}
                                        >
                                            {formData.hasLogo ? "Oui" : "Non"}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">Charte graphique existante ?</p>
                                            <p className="text-sm text-slate-400">Couleurs, typographies définies</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, hasCharte: !formData.hasCharte })}
                                            className={`px-6 py-2 rounded-lg border transition-all ${formData.hasCharte
                                                    ? "border-green-500 bg-green-500/10 text-green-400"
                                                    : "border-slate-600 bg-slate-700 text-slate-300"
                                                }`}
                                        >
                                            {formData.hasCharte ? "Oui" : "Non"}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">Style préféré</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: "minimalist", label: "Minimaliste" },
                                            { value: "luxury", label: "Luxe" },
                                            { value: "bold", label: "Audacieux" },
                                            { value: "corporate", label: "Corporate" },
                                        ].map((style) => (
                                            <button
                                                key={style.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, designStyle: style.value })}
                                                className={`p-3 rounded-lg border transition-all ${formData.designStyle === style.value
                                                        ? "border-blue-500 bg-blue-500/10 text-white"
                                                        : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                                                    }`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Contact */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white mb-6">Vos coordonnées</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Nom complet *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Jean Dupont"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="jean@exemple.fr"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="06 12 34 56 78"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Entreprise</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Nom de votre entreprise"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Précédent
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
