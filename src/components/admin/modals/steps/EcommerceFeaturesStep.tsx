import { useState } from 'react';
import { Package, Truck, BarChart, Users, Gift } from 'lucide-react';

interface EcommerceFeaturesStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const EcommerceFeaturesStep = ({ formData, updateFormData }: EcommerceFeaturesStepProps) => {
    const [features, setFeatures] = useState<string[]>(formData.ecommerceFeatures || []);

    const featureCategories = [
        {
            name: '📦 Gestion Produits',
            features: [
                { value: 'inventory', label: 'Gestion Stock', icon: Package, description: 'Suivi automatique des stocks' },
                { value: 'variants', label: 'Variantes Produits', icon: Package, description: 'Tailles, couleurs, options' },
            ]
        },
        {
            name: '🚚 Livraison',
            features: [
                { value: 'shipping-calc', label: 'Calculateur de Frais', icon: Truck, description: 'Calcul automatique selon poids/zone' },
                { value: 'shipping-tracking', label: 'Suivi Colis', icon: Truck, description: 'Tracking en temps réel' },
            ]
        },
        {
            name: '📊 Gestion & Analytics',
            features: [
                { value: 'orders', label: 'Gestion Commandes', icon: BarChart, description: 'Dashboard de gestion des commandes' },
                { value: 'analytics', label: 'Analytics Ventes', icon: BarChart, description: 'Statistiques et rapports' },
            ]
        },
        {
            name: '👥 Client & Marketing',
            features: [
                { value: 'customer-account', label: 'Comptes Clients', icon: Users, description: 'Espace client personnalisé' },
                { value: 'wishlist', label: 'Liste de Souhaits', icon: Gift, description: 'Favoris et wishlist' },
                { value: 'reviews', label: 'Avis Clients', icon: Users, description: 'Notes et commentaires produits' },
                { value: 'promo-codes', label: 'Codes Promo', icon: Gift, description: 'Coupons et réductions' },
            ]
        },
    ];

    const toggleFeature = (featureValue: string) => {
        let newFeatures: string[];
        if (features.includes(featureValue)) {
            newFeatures = features.filter(f => f !== featureValue);
        } else {
            newFeatures = [...features, featureValue];
        }
        setFeatures(newFeatures);
        updateFormData({ ecommerceFeatures: newFeatures });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fonctionnalités E-commerce</h3>
                <p className="text-slate-400 text-sm">
                    Sélectionnez les fonctionnalités supplémentaires pour votre boutique en ligne.
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
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-white truncate">{feature.label}</span>
                                                {isSelected && (
                                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-xs">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
                                        </div>
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

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-300">
                    💡 <b>Conseil:</b> Les fonctionnalités de base (panier, paiement) sont incluses. Sélectionnez uniquement les fonctionnalités avancées dont vous avez besoin.
                </p>
            </div>
        </div>
    );
};
