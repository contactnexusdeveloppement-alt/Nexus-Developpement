import { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';

interface EcommercePaymentStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const EcommercePaymentStep = ({ formData, updateFormData }: EcommercePaymentStepProps) => {
    const [paymentMethods, setPaymentMethods] = useState<string[]>(formData.ecommercePaymentMethods || []);
    const [currency, setCurrency] = useState(formData.ecommerceCurrency || 'EUR');
    const [multiCurrency, setMultiCurrency] = useState(formData.ecommerceMultiCurrency || false);

    const paymentOptions = [
        { value: 'card', label: 'Carte Bancaire', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
        { value: 'paypal', label: 'PayPal', icon: Banknote, description: 'Paiement via compte PayPal' },
        { value: 'stripe', label: 'Stripe', icon: CreditCard, description: 'Solution de paiement complète' },
        { value: 'bank-transfer', label: 'Virement Bancaire', icon: Banknote, description: 'Paiement par virement' },
        { value: 'cash-on-delivery', label: 'Paiement à la livraison', icon: Banknote, description: 'Paiement en espèces' },
    ];

    const togglePaymentMethod = (method: string) => {
        let newMethods: string[];
        if (paymentMethods.includes(method)) {
            newMethods = paymentMethods.filter(m => m !== method);
        } else {
            newMethods = [...paymentMethods, method];
        }
        setPaymentMethods(newMethods);
        updateFormData({ ecommercePaymentMethods: newMethods });
    };

    const handleCurrencyChange = (curr: string) => {
        setCurrency(curr);
        updateFormData({ ecommerceCurrency: curr });
    };

    const handleMultiCurrencyChange = (enabled: boolean) => {
        setMultiCurrency(enabled);
        updateFormData({ ecommerceMultiCurrency: enabled });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Paiement & Facturation</h3>
                <p className="text-slate-400 text-sm">
                    Configurez les méthodes de paiement et options de facturation.
                </p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Méthodes de Paiement <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = paymentMethods.includes(option.value);

                        return (
                            <button
                                key={option.value}
                                onClick={() => togglePaymentMethod(option.value)}
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
                                            <span className="text-sm font-medium text-white truncate">{option.label}</span>
                                            {isSelected && (
                                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{option.description}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Currency Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Devise Principale <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {['EUR', 'USD', 'GBP'].map((curr) => (
                        <button
                            key={curr}
                            onClick={() => handleCurrencyChange(curr)}
                            className={`
                                px-4 py-3 rounded-lg border-2 transition-all font-medium
                                ${currency === curr
                                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                                }
                            `}
                        >
                            {curr}
                        </button>
                    ))}
                </div>
            </div>

            {/* Multi-Currency Option */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Options Avancées
                </label>
                <button
                    onClick={() => handleMultiCurrencyChange(!multiCurrency)}
                    className={`
                        w-full p-4 rounded-lg border-2 transition-all text-left
                        ${multiCurrency
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }
                    `}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium text-white">Multi-devises</span>
                            <p className="text-xs text-slate-400 mt-1">
                                Permettre aux clients de payer dans plusieurs devises (+500€)
                            </p>
                        </div>
                        <div className={`
                            w-12 h-6 rounded-full transition-all
                            ${multiCurrency ? 'bg-blue-500' : 'bg-slate-600'}
                        `}>
                            <div className={`
                                w-5 h-5 bg-white rounded-full transition-transform mt-0.5
                                ${multiCurrency ? 'translate-x-6' : 'translate-x-0.5'}
                            `} />
                        </div>
                    </div>
                </button>
            </div>

            {/* Selected Count */}
            {paymentMethods.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-xs text-green-300">
                        ✓ <b>{paymentMethods.length} méthode(s) de paiement sélectionnée(s)</b>
                    </p>
                </div>
            )}

            {paymentMethods.length === 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-xs text-amber-300">
                        ⚠️ <b>Attention:</b> Veuillez sélectionner au moins une méthode de paiement.
                    </p>
                </div>
            )}
        </div>
    );
};
