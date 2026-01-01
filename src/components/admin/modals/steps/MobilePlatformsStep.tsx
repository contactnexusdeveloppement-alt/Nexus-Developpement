import { useState } from 'react';
import { Smartphone, Globe } from 'lucide-react';

interface MobilePlatformsStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const MobilePlatformsStep = ({ formData, updateFormData }: MobilePlatformsStepProps) => {
    const [platforms, setPlatforms] = useState<string[]>(formData.mobilePlatforms || []);

    const platformOptions = [
        { value: 'iOS', label: 'iOS (iPhone/iPad)', icon: '🍎', description: 'App Store - iPhone et iPad' },
        { value: 'Android', label: 'Android', icon: '🤖', description: 'Google Play Store' },
        { value: 'Web/PWA', label: 'Web/PWA', icon: '🌐', description: 'Progressive Web App - Multi-plateformes' }
    ];

    const togglePlatform = (platformValue: string) => {
        let newPlatforms: string[];
        if (platforms.includes(platformValue)) {
            newPlatforms = platforms.filter(p => p !== platformValue);
        } else {
            newPlatforms = [...platforms, platformValue];
        }
        setPlatforms(newPlatforms);
        updateFormData({ mobilePlatforms: newPlatforms });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Plateformes Cibles</h3>
                <p className="text-slate-400 text-sm">
                    Sélectionnez les plateformes sur lesquelles l'application sera disponible.
                </p>
            </div>

            <div className="space-y-3">
                {platformOptions.map((platform) => (
                    <button
                        key={platform.value}
                        onClick={() => togglePlatform(platform.value)}
                        className={`
                            w-full p-5 rounded-lg border-2 transition-all text-left
                            ${platforms.includes(platform.value)
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-start gap-4">
                            {/* Platform Icon */}
                            <div className="text-4xl">{platform.icon}</div>

                            {/* Platform Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-semibold text-white">{platform.label}</h4>
                                    {platforms.includes(platform.value) && (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{platform.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Info Box */}
            {platforms.length > 1 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-xs text-blue-300">
                        💡 <b>Multi-plateforme:</b> Développer pour plusieurs plateformes augmente la portée mais aussi le coût de développement et maintenance.
                    </p>
                </div>
            )}

            {platforms.length === 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-xs text-amber-300">
                        ⚠️ <b>Attention:</b> Veuillez sélectionner au moins une plateforme pour continuer.
                    </p>
                </div>
            )}
        </div>
    );
};
