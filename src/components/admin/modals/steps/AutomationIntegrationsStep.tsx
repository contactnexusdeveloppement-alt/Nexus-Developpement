import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INTEGRATION_OPTIONS } from "@/utils/wizard/wizardConfig";
import { Info } from "lucide-react";

interface AutomationIntegrationsStepProps {
    formData: {
        automationIntegrations?: string[];
        automationOther?: string;
    };
    onChange: (field: string, value: any) => void;
}

export const AutomationIntegrationsStep = ({ formData, onChange }: AutomationIntegrationsStepProps) => {
    const selectedIntegrations = formData.automationIntegrations || [];

    const toggleIntegration = (integration: string) => {
        const newIntegrations = selectedIntegrations.includes(integration)
            ? selectedIntegrations.filter(i => i !== integration)
            : [...selectedIntegrations, integration];
        onChange('automationIntegrations', newIntegrations);
    };

    // Group integrations by category
    const groupedIntegrations = INTEGRATION_OPTIONS.reduce((acc, option) => {
        if (!acc[option.category]) {
            acc[option.category] = [];
        }
        acc[option.category].push(option);
        return acc;
    }, {} as Record<string, typeof INTEGRATION_OPTIONS>);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                    Quelles intégrations sont nécessaires ?
                </h3>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Sélectionnez tous les outils à connecter
                </p>
            </div>

            {Object.entries(groupedIntegrations).map(([category, integrations]) => (
                <div key={category} className="space-y-3">
                    <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {integrations.map((integration) => (
                            <div
                                key={integration.value}
                                className={`
                  flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer
                  ${selectedIntegrations.includes(integration.value)
                                        ? 'bg-blue-500/10 border-blue-500/50'
                                        : 'bg-slate-900/30 border-white/10 hover:bg-white/5'
                                    }
                `}
                                onClick={() => toggleIntegration(integration.value)}
                            >
                                <Checkbox
                                    id={integration.value}
                                    checked={selectedIntegrations.includes(integration.value)}
                                    onCheckedChange={() => toggleIntegration(integration.value)}
                                />
                                <Label
                                    htmlFor={integration.value}
                                    className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer flex-1"
                                >
                                    <span>{integration.icon}</span>
                                    {integration.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Custom integrations */}
            <div className="space-y-2 pt-4 border-t border-white/10">
                <Label htmlFor="customIntegrations" className="text-sm text-slate-300">
                    Autres intégrations (API customs, ERPs, etc.)
                </Label>
                <Textarea
                    id="customIntegrations"
                    placeholder="Ex: API custom de votre CRM, ERP spécifique, système maison..."
                    value={formData.automationOther || ''}
                    onChange={(e) => onChange('automationOther', e.target.value)}
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600"
                />
            </div>

            {selectedIntegrations.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-sm text-green-300">
                        ✓ {selectedIntegrations.length} intégration{selectedIntegrations.length > 1 ? 's' : ''} sélectionnée{selectedIntegrations.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-green-400/70 mt-1">
                        Plus d'intégrations = coût additionnel estimé : +{selectedIntegrations.length * 100}€
                    </p>
                </div>
            )}
        </div>
    );
};
