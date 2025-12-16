import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import EnhanceableTextarea from "../EnhanceableTextarea";

interface CallNotes {
  target_audience?: string;
  project_objectives?: string;
  competitors?: string;
  social_media_presence?: string;
}

interface BusinessTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

export const BusinessTab = ({ callNotes, updateCallNotes }: BusinessTabProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="target_audience" className="text-white">Qui est votre public cible / clientèle ?</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Identifiez précisément le profil type : âge, profession, secteur d'activité, taille d'entreprise</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <EnhanceableTextarea
            id="target_audience"
            value={callNotes.target_audience || ""}
            onChange={(value) => updateCallNotes({ target_audience: value })}
            placeholder="Ex: Particuliers 25-45 ans, PME du secteur BTP..."
            fieldContext="public_cible"
            className="placeholder:text-blue-200/50"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="project_objectives" className="text-white">Quels sont vos objectifs avec ce projet ?</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-blue-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Objectifs mesurables : augmentation du CA, génération de leads, gain de temps, amélioration de l'image</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <EnhanceableTextarea
            id="project_objectives"
            value={callNotes.project_objectives || ""}
            onChange={(value) => updateCallNotes({ project_objectives: value })}
            placeholder="Ex: Augmenter les ventes, améliorer la notoriété, automatiser des tâches..."
            fieldContext="objectifs_projet"
            className="placeholder:text-blue-200/50"
          />
        </div>

        <div>
          <Label htmlFor="competitors" className="text-white">Avez-vous des concurrents ou sites de référence ?</Label>
          <div className="mt-2">
            <EnhanceableTextarea
              id="competitors"
              value={callNotes.competitors || ""}
              onChange={(value) => updateCallNotes({ competitors: value })}
              placeholder="Listez les sites web ou entreprises concurrentes"
              fieldContext="concurrents"
              className="placeholder:text-blue-200/50"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="social_media_presence" className="text-white">Présence sur les réseaux sociaux ?</Label>
          <Input
            id="social_media_presence"
            value={callNotes.social_media_presence || ""}
            onChange={(e) => updateCallNotes({ social_media_presence: e.target.value })}
            placeholder="Ex: Facebook, Instagram, LinkedIn..."
            className="mt-2 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-200/50"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
