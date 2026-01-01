import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Info, Zap, Code2, Rocket } from "lucide-react";

interface AutomationComplexityStepProps {
    formData: {
        automationWorkflows?: number;
        automationComplexity?: 'simple' | 'medium' | 'complex';
        automationTraining?: boolean;
        automationSupport?: boolean;
    };
    onChange: (field: string, value: any) => void;
}

export const AutomationComplexityStep = ({ formData, onChange }: AutomationComplexityStepProps) => {
    const workflows = formData.automationWorkflows || 1;
    const complexity = formData.automationComplexity || 'simple';

    const complexityOptions = [
        {
            value: 'simple',
            label: 'Simple',
            description: 'Conditions if/then basiques, 1-2 outils',
            icon: Zap,
            example: 'Ex: Nouveau formulaire → Email automatique',
            multiplier: '×1.0',
        },
        {
            value: 'medium',
            label: 'Moyenne',
            description: 'Conditions multiples, branchements, 3-5 outils',
            icon: Code2,
            example: 'Ex: Devis accepté → Facture + Email + CRM + Compta',
            multiplier: '×1.3',
        },
        {
            value: 'complex',
            label: 'Complexe',
            description: 'Logique avancée, multiples APIs, conditions imbriquées',
            icon: Rocket,
            example: 'Ex: Lead scoring + nurturing multi-canal + sync 5+ outils',
            multiplier: '×1.6',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                    Complexité et volume
                </h3>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Définissez le scope de votre automatisation
                </p>
            </div>

            {/* Nombre de workflows */}
            <div className="space-y-3">
                <Label htmlFor="workflows" className="text-sm font-medium text-slate-300">
                    Nombre de workflows souhaités
                </Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="workflows"
                        type="number"
                        min="1"
                        max="10"
                        value={workflows}
                        onChange={(e) => onChange('automationWorkflows', parseInt(e.target.value) || 1)}
                        className="bg-slate-900/50 border-white/10 text-white w-24"
                    />
                    <p className="text-xs text-slate-500">
                        Un workflow = une automatisation complète de A à Z
                    </p>
                </div>
            </div>

            {/* Complexité */}
            <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-300">
                    Complexité des conditions
                </Label>
                <RadioGroup
                    value={complexity}
                    onValueChange={(value) => onChange('automationComplexity', value)}
                    className="space-y-3"
                >
                    {complexityOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = complexity === option.value;

                        return (
                            <div
                                key={option.value}
                                className={`
                  relative flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${isSelected
                                        ? 'bg-blue-500/10 border-blue-500'
                                        : 'bg-slate-900/30 border-white/10 hover:bg-white/5 hover:border-white/20'
                                    }
                `}
                                onClick={() => onChange('automationComplexity', option.value)}
                            >
                                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                                        <Label
                                            htmlFor={option.value}
                                            className="text-sm font-semibold text-white cursor-pointer"
                                        >
                                            {option.label}
                                        </Label>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {option.multiplier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">
                                        {option.description}
                                    </p>
                                    <p className="text-xs text-slate-500 italic">
                                        {option.example}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </RadioGroup>
            </div>

            {/* Options */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-slate-300">Options incluses</h4>

                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div className="flex-1">
                        <Label htmlFor="training" className="text-sm font-medium text-white cursor-pointer">
                            Formation à l'utilisation (1h)
                        </Label>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Session d'explication et prise en main des workflows
                        </p>
                    </div>
                    <Switch
                        id="training"
                        checked={formData.automationTraining ?? true}
                        onCheckedChange={(checked) => onChange('automationTraining', checked)}
                    />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-green-500/20">
                    <div className="flex-1">
                        <Label htmlFor="support" className="text-sm font-medium text-white cursor-pointer">
                            Support technique (3 mois) <span className="text-green-400">+250€</span>
                        </Label>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Assistance prioritaire, ajustements, corrections
                        </p>
                    </div>
                    <Switch
                        id="support"
                        checked={formData.automationSupport ?? false}
                        onCheckedChange={(checked) => onChange('automationSupport', checked)}
                    />
                </div>
            </div>

            {/* Estimation preview */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-300 mb-1">
                    📊 Estimation basée sur vos sélections
                </p>
                <p className="text-xs text-slate-400">
                    {workflows} workflow{workflows > 1 ? 's' : ''} • Complexité {complexity} •
                    {formData.automationSupport ? ' + Support 3 mois' : ''}
                </p>
            </div>
        </div>
    );
};
