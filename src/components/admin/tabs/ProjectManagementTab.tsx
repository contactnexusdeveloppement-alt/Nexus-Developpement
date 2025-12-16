import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface CallNotes {
  main_contact_name?: string;
  main_contact_role?: string;
  validation_availability?: string;
  urgency_level?: string;
  urgent_deadline?: string;
  preferred_communication?: string;
  needs_training?: boolean;
  wants_maintenance_contract?: boolean;
}

interface ProjectManagementTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

export const ProjectManagementTab = ({ callNotes, updateCallNotes }: ProjectManagementTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
      <div>
        <Label htmlFor="main_contact_name" className="text-white">Nom du contact principal pour le projet</Label>
        <Input
          id="main_contact_name"
          value={callNotes.main_contact_name || ""}
          onChange={(e) => updateCallNotes({ main_contact_name: e.target.value })}
          placeholder="Nom et prénom"
          className="mt-2 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/50"
        />
      </div>

      <div>
        <Label htmlFor="main_contact_role" className="text-white">Rôle dans l'entreprise</Label>
        <Input
          id="main_contact_role"
          value={callNotes.main_contact_role || ""}
          onChange={(e) => updateCallNotes({ main_contact_role: e.target.value })}
          placeholder="Ex: Gérant, Responsable marketing..."
          className="mt-2 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/50"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="validation_availability" className="text-white">Disponibilité pour valider les étapes</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Temps de réponse moyen pour les validations intermédiaires et ajustements</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select
          value={callNotes.validation_availability}
          onValueChange={(value) => updateCallNotes({ validation_availability: value })}
        >
          <SelectTrigger className="mt-2 bg-slate-800/50 border-blue-500/30 text-white">
            <SelectValue placeholder="Sélectionnez" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Quotidienne</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
            <SelectItem value="biweekly">Toutes les 2 semaines</SelectItem>
            <SelectItem value="limited">Limitée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="urgency_level" className="text-white">Niveau d'urgence du projet</Label>
        <Select
          value={callNotes.urgency_level}
          onValueChange={(value) => updateCallNotes({ urgency_level: value })}
        >
          <SelectTrigger className="mt-2 bg-slate-800/50 border-blue-500/30 text-white">
            <SelectValue placeholder="Sélectionnez" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Pas urgent</SelectItem>
            <SelectItem value="medium">Modérée</SelectItem>
            <SelectItem value="high">Urgent</SelectItem>
            <SelectItem value="critical">Très urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(callNotes.urgency_level === "high" || callNotes.urgency_level === "critical") && (
        <div>
          <Label htmlFor="urgent_deadline" className="text-white">Date limite si urgence</Label>
          <Input
            id="urgent_deadline"
            value={callNotes.urgent_deadline || ""}
            onChange={(e) => updateCallNotes({ urgent_deadline: e.target.value })}
            placeholder="JJ/MM/AAAA"
            className="mt-2 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/50"
          />
        </div>
      )}

      <div>
        <Label htmlFor="preferred_communication" className="text-white">Mode de communication préféré</Label>
        <Select
          value={callNotes.preferred_communication}
          onValueChange={(value) => updateCallNotes({ preferred_communication: value })}
        >
          <SelectTrigger className="mt-2 bg-slate-800/50 border-blue-500/30 text-white">
            <SelectValue placeholder="Sélectionnez" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Téléphone</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="teams">Teams/Zoom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-white">Formation souhaitée pour utiliser le projet ?</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Formation à la gestion du contenu, administration, utilisation des fonctionnalités</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <RadioGroup
          value={callNotes.needs_training?.toString()}
          onValueChange={(value) => updateCallNotes({ needs_training: value === "true" })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="training_yes" />
            <Label htmlFor="training_yes" className="text-white">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="training_no" />
            <Label htmlFor="training_no" className="text-white">Non</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-white">Intéressé par un contrat de maintenance ?</Label>
        <RadioGroup
          value={callNotes.wants_maintenance_contract?.toString()}
          onValueChange={(value) => updateCallNotes({ wants_maintenance_contract: value === "true" })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="maintenance_yes" />
            <Label htmlFor="maintenance_yes" className="text-white">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="maintenance_no" />
            <Label htmlFor="maintenance_no" className="text-white">Non</Label>
          </div>
        </RadioGroup>
      </div>
      </div>
    </TooltipProvider>
  );
};