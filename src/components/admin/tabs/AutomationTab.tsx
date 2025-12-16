import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import EnhanceableTextarea from "../EnhanceableTextarea";

interface CallNotes {
  current_tools?: string;
  tasks_to_automate?: string;
  estimated_volume?: string;
  recurring_budget?: string;
  automation_users?: string;
  execution_frequency?: string;
}

interface AutomationTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

export const AutomationTab = ({ callNotes, updateCallNotes }: AutomationTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current_tools" className="text-white">Outils actuellement utilisés</Label>
          <EnhanceableTextarea
            id="current_tools"
            value={callNotes.current_tools || ""}
            onChange={(value) => updateCallNotes({ current_tools: value })}
            placeholder="Excel, CRM, logiciels métier..."
            rows={3}
            fieldContext="default"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="tasks_to_automate" className="text-white">Tâches à automatiser</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Décrivez précisément les processus : saisie de données, envoi d'emails, création de factures, synchronisation...</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <EnhanceableTextarea
            id="tasks_to_automate"
            value={callNotes.tasks_to_automate || ""}
            onChange={(value) => updateCallNotes({ tasks_to_automate: value })}
            placeholder="Décrire les processus et tâches répétitives à automatiser..."
            rows={6}
            fieldContext="taches_automatiser"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_volume" className="text-white">Volume estimé</Label>
          <Input
            id="estimated_volume"
            value={callNotes.estimated_volume || ""}
            onChange={(e) => updateCallNotes({ estimated_volume: e.target.value })}
            placeholder="Ex: 50 opérations/jour, 200 emails/semaine..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recurring_budget" className="text-white">Budget récurrent envisagé (€/mois)</Label>
          <Input
            id="recurring_budget"
            value={callNotes.recurring_budget || ""}
            onChange={(e) => updateCallNotes({ recurring_budget: e.target.value })}
            placeholder="Ex: 50€/mois, 100€/mois..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="automation_users" className="text-white">Nombre d'utilisateurs de l'automatisation</Label>
          <Input
            id="automation_users"
            value={callNotes.automation_users || ""}
            onChange={(e) => updateCallNotes({ automation_users: e.target.value })}
            placeholder="Ex: 3 employés, toute l'équipe..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="execution_frequency" className="text-white">Fréquence d'exécution souhaitée</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">En temps réel, horaire, quotidien, hebdomadaire, mensuel, ou sur événement spécifique</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="execution_frequency"
            value={callNotes.execution_frequency || ""}
            onChange={(e) => updateCallNotes({ execution_frequency: e.target.value })}
            placeholder="Ex: Quotidienne, Hebdomadaire, En temps réel..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
};
