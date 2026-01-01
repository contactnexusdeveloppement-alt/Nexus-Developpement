import { useState } from 'react';
import { Bell, Camera, MapPin, Wifi, Share2, ShoppingCart, Fingerprint, Layers } from 'lucide-react';

interface MobileFeaturesStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const MobileFeaturesStep = ({ formData, updateFormData }: MobileFeaturesStepProps) => {
    const [features, setFeatures] = useState<string[]>(formData.mobileFeatures || []);

    const featureCategories = [
        {
            name: '🔔 Fonctionnalités Core',
            features: [
                { value: 'push-notif', label: 'Push Notifications', icon: Bell },
                { value: 'offline', label: 'Mode Hors-ligne', icon: Wifi },
                { value: 'camera', label: 'Accès Caméra', icon: Camera },
                { value: 'gps', label: 'GPS / Localisation', icon: MapPin },
            ]
        },
        {
            name: '👥 Social & Partage',
            features: [
                { value: 'social-login', label: 'Connexion Sociale (Google, Facebook)', icon: Share2 },
                { value: 'share', label: 'Partage de contenu', icon: Share2 },
                { value: 'messaging', label: 'Messagerie in-app', icon: Layers },
            ]
        },
        {
            name: '💰 Commerce & Monétisation',
            features: [
                { value: 'in-app-purchase', label: 'Achats in-app', icon: ShoppingCart },
                { value: 'payment', label: 'Intégration Paiement', icon: ShoppingCart },
                { value: 'subscription', label: 'Gestion Abonnements', icon: ShoppingCart },
            ]
        },
        {
            name: '🚀 Avancé',
            features: [
                { value: 'biometric', label: 'Auth Biométrique (Face ID, Fingerprint)', icon: Fingerprint },
                { value: 'ar', label: 'Réalité Augmentée (AR)', icon: Layers },
                { value: 'bluetooth', label: 'Bluetooth', icon: Layers },
                { value: 'nfc', label: 'NFC', icon: Layers },
            ]
        }
    ];

    const toggleFeature = (featureValue: string) => {
        let newFeatures: string[];
        if (features.includes(featureValue)) {
            newFeatures = features.filter(f => f !== featureValue);
        } else {
            newFeatures = [...features, featureValue];
        }
        setFeatures(newFeatures);
        updateFormData({ mobileFeatures: newFeatures });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fonctionnalités Mobiles</h3>
                <p className="text-slate-400 text-sm">
                    Sélectionnez les fonctionnalités dont votre application aura besoin.
                </p>
            </div>

            {featureCategories.map((category, catIndex) => (
                <div key={catIndex} className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                        {category.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {category.features.map((feature) => {
                            const Icon = feature.icon;
                            const isSelected = features.includes(feature.value);

                            return (
                                <button
                                    key={feature.value}
                                    onClick={() => toggleFeature(feature.value)}
                                    className={`
                                        p-4 rounded-lg border-2 transition-all text-left
                                        ${isSelected
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white truncate">{feature.label}</div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Selected Count */}
            {features.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-xs text-green-300">
                        ✓ <b>{features.length} fonctionnalité(s) sélectionnée(s)</b>
                    </p>
                </div>
            )}
        </div>
    );
};
