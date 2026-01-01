import { useState } from 'react';
import { Check } from 'lucide-react';
import { IDENTITY_PACKAGES } from '@/utils/wizard/wizardConfig';

interface IdentityPackageStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const IdentityPackageStep = ({ formData, updateFormData }: IdentityPackageStepProps) => {
    const [selected, setSelected] = useState(formData.identityPackage || '');

    const handleSelect = (packageValue: string) => {
        setSelected(packageValue);
        updateFormData({ identityPackage: packageValue });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Package Identité Visuelle</h3>
                <p className="text-slate-400 text-sm">
                    Choisissez le package qui correspond le mieux à vos besoins.
                </p>
            </div>

            <div className="grid gap-4">
                {IDENTITY_PACKAGES.map((pkg) => (
                    <button
                        key={pkg.value}
                        onClick={() => handleSelect(pkg.value)}
                        className={`
                            relative p-6 rounded-lg border-2 transition-all text-left
                            ${selected === pkg.value
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        {/* Selection Indicator */}
                        {selected === pkg.value && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}

                        {/* Package Info */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-lg font-semibold text-white">{pkg.label}</h4>
                                <p className="text-sm text-blue-400 mt-1">{pkg.priceRange}</p>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-2">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </button>
                ))}
            </div>

            {/* Additional Notes */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400">
                    💡 <b>Astuce:</b> Si vous n'êtes pas sûr du package à choisir, commencez par le Logo Essentiel.
                    Vous pourrez toujours évoluer vers un package plus complet par la suite.
                </p>
            </div>
        </div>
    );
};
