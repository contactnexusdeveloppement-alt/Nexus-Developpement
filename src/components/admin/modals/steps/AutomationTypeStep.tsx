import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AUTOMATION_TYPES } from "@/utils/wizard/wizardConfig";
import { Info } from "lucide-react";

interface AutomationTypeStepProps {
    formData: {
        automationType?: string[];
        automationOther?: string;
    };
    onChange: (field: string, value: any) => void;
}

export const AutomationTypeStep = ({ formData, onChange }: AutomationTypeStepProps) => {
    const selectedTypes = formData.automationType || [];

    const toggleType = (type: string) => {
        const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        onChange('automationType', newTypes);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                    Quel type d'automatisation souhaitez-vous ?
                </h3>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Sélectionnez une ou plusieurs automatisations
                </p>
            </div>

            {Object.entries(AUTOMATION_TYPES).map(([categoryKey, category]) => (
                <div key={categoryKey} className="border-b border-white/10 pb-6 last:border-0">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">{category.label}</h4>
                    <div className="space-y-3">
                        {category.options.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => toggleType(option.value)}
                            >
                                <Checkbox
                                    id={option.value}
                                    checked={selectedTypes.includes(option.value)}
                                    onCheckedChange={() => toggleType(option.value)}
                                    className="mt-0.5"
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor={option.value}
                                        className="text-sm font-medium text-white cursor-pointer"
                                    >
                                        {option.label}
                                    </Label>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Autre / Précisions */}
            <div className="space-y-2">
                <Label htmlFor="automationOther" className="text-sm text-slate-300">
                    Autre automatisation ou précisions
                </Label>
                <Textarea
                    id="automationOther"
                    placeholder="Ex: Automatisation spécifique à votre métier, besoins particuliers..."
                    value={formData.automationOther || ''}
                    onChange={(e) => onChange('automationOther', e.target.value)}
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 min-h-[100px]"
                />
            </div>

            {selectedTypes.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                        ✓ {selectedTypes.length} automatisation{selectedTypes.length > 1 ? 's' : ''} sélectionnée{selectedTypes.length > 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};
