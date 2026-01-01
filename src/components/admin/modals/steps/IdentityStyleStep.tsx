import { useState } from 'react';
import { Palette } from 'lucide-react';
import { IDENTITY_STYLES } from '@/utils/wizard/wizardConfig';

interface IdentityStyleStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const IdentityStyleStep = ({ formData, updateFormData }: IdentityStyleStepProps) => {
    const [style, setStyle] = useState(formData.identityStyle || '');
    const [colors, setColors] = useState(formData.identityColors || '');
    const [industry, setIndustry] = useState(formData.identityIndustry || '');
    const [values, setValues] = useState(formData.identityValues || '');

    const handleStyleChange = (styleValue: string) => {
        setStyle(styleValue);
        updateFormData({ identityStyle: styleValue });
    };

    const handleColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColors(e.target.value);
        updateFormData({ identityColors: e.target.value });
    };

    const handleIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIndustry(e.target.value);
        updateFormData({ identityIndustry: e.target.value });
    };

    const handleValuesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValues(e.target.value);
        updateFormData({ identityValues: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Style & Préférences</h3>
                <p className="text-slate-400 text-sm">
                    Donnez-nous une direction pour créer une identité qui vous ressemble.
                </p>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Style visuel souhaité <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {IDENTITY_STYLES.map((styleOption) => (
                        <button
                            key={styleOption.value}
                            onClick={() => handleStyleChange(styleOption.value)}
                            className={`
                                p-4 rounded-lg border-2 transition-all text-left
                                ${style === styleOption.value
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }
                            `}
                        >
                            <div className="flex items-start gap-2">
                                <Palette className={`w-5 h-5 mt-0.5 ${style === styleOption.value ? 'text-blue-400' : 'text-slate-400'}`} />
                                <div>
                                    <div className="font-medium text-white text-sm">{styleOption.label}</div>
                                    <div className="text-xs text-slate-400 mt-1">{styleOption.description}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Preferences */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Couleurs préférées (optionnel)
                </label>
                <input
                    type="text"
                    value={colors}
                    onChange={handleColorsChange}
                    placeholder="Ex: Bleu marine, Or, Blanc"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500">Indiquez les couleurs que vous aimeriez voir dans votre identité</p>
            </div>

            {/* Industry/Sector */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Secteur d'activité <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={industry}
                    onChange={handleIndustryChange}
                    placeholder="Ex: Technologie, Restauration, Santé..."
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500">Aide à adapter le style à votre domaine</p>
            </div>

            {/* Brand Values */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Valeurs de votre marque (optionnel)
                </label>
                <textarea
                    value={values}
                    onChange={handleValuesChange}
                    placeholder="Ex: Innovation, Confiance, Proximité, Excellence..."
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-slate-500">Les valeurs que vous souhaitez transmettre à travers votre identité</p>
            </div>

            {/* Tip Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-300">
                    💡 <b>Conseil:</b> Plus vous nous donnez de détails sur votre vision, style et valeurs,
                    plus nous pourrons créer une identité qui correspond parfaitement à votre image.
                </p>
            </div>
        </div>
    );
};
