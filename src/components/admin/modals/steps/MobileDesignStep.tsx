import { useState } from 'react';
import { Palette, Server } from 'lucide-react';

interface MobileDesignStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const MobileDesignStep = ({ formData, updateFormData }: MobileDesignStepProps) => {
    const [designType, setDesignType] = useState(formData.mobileDesignType || 'native');
    const [backend, setBackend] = useState(formData.mobileBackend || 'none');

    const handleDesignChange = (value: 'native' | 'custom') => {
        setDesignType(value);
        updateFormData({ mobileDesignType: value });
    };

    const handleBackendChange = (value: 'existing' | 'new' | 'none') => {
        setBackend(value);
        updateFormData({ mobileBackend: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Design & Backend</h3>
                <p className="text-slate-400 text-sm">
                    Définissez le type de design et l'architecture backend de l'application.
                </p>
            </div>

            {/* Design Type */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Type de Design <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                    <button
                        onClick={() => handleDesignChange('native')}
                        className={`
                            w-full p-5 rounded-lg border-2 transition-all text-left
                            ${designType === 'native'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <Palette className={`w-6 h-6 mt-1 ${designType === 'native' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-semibold text-white">Native UI</h4>
                                    {designType === 'native' && (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 mt-1">
                                    Utilise les composants natifs de chaque plateforme (look iOS sur iPhone, Android sur Android)
                                </p>
                                <p className="text-xs text-green-400 mt-2">
                                    ✓ Moins coûteux • Développement plus rapide
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleDesignChange('custom')}
                        className={`
                            w-full p-5 rounded-lg border-2 transition-all text-left
                            ${designType === 'custom'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <Palette className={`w-6 h-6 mt-1 ${designType === 'custom' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-semibold text-white">Custom Design</h4>
                                    {designType === 'custom' && (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 mt-1">
                                    Design unique et branded, identique sur toutes les plateformes
                                </p>
                                <p className="text-xs text-amber-400 mt-2">
                                    ⚡ Plus coûteux (+20%) • Design sur-mesure
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Backend Configuration */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Backend / API <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                    <button
                        onClick={() => handleBackendChange('existing')}
                        className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left
                            ${backend === 'existing'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Server className={`w-5 h-5 ${backend === 'existing' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-white">Backend Existant</span>
                                <p className="text-xs text-slate-400 mt-0.5">J'ai déjà une API/Base de données</p>
                            </div>
                            {backend === 'existing' && <span className="text-blue-400 text-sm">✓</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => handleBackendChange('new')}
                        className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left
                            ${backend === 'new'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Server className={`w-5 h-5 ${backend === 'new' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-white">Créer un Backend</span>
                                <p className="text-xs text-slate-400 mt-0.5">Besoin d'une API + Base de données (+2 000-4 000€)</p>
                            </div>
                            {backend === 'new' && <span className="text-blue-400 text-sm">✓</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => handleBackendChange('none')}
                        className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left
                            ${backend === 'none'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Server className={`w-5 h-5 ${backend === 'none' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-white">Aucun Backend</span>
                                <p className="text-xs text-slate-400 mt-0.5">Application locale (calculatrice, jeu simple, etc.)</p>
                            </div>
                            {backend === 'none' && <span className="text-blue-400 text-sm">✓</span>}
                        </div>
                    </button>
                </div>
            </div>

            {/* Tip */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-300">
                    💡 <b>Conseil:</b> Si vous avez besoin de synchroniser des données entre utilisateurs, de stocker du contenu en ligne, ou de gérer des comptes utilisateurs, un backend est nécessaire.
                </p>
            </div>
        </div>
    );
};
