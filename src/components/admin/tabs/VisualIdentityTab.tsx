import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhanceableTextarea from "../EnhanceableTextarea";

interface CallNotes {
  has_existing_logo?: boolean;
  logo_received_by_email?: boolean;
  existing_tagline?: string;
  existing_brand_guidelines?: boolean;
  preferred_colors?: string;
  preferred_fonts?: string;
  style_preferences?: string;
  inspirations?: string;
  elements_to_avoid?: string;
}

interface VisualIdentityTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

const VisualIdentityTab = ({ callNotes, updateCallNotes }: VisualIdentityTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-white">A déjà un logo ?</Label>
          <RadioGroup
            value={callNotes.has_existing_logo === undefined ? "" : callNotes.has_existing_logo ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ has_existing_logo: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="logo-yes" />
              <Label htmlFor="logo-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="logo-no" />
              <Label htmlFor="logo-no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        {callNotes.has_existing_logo && (
          <div className="space-y-3">
            <Label className="text-white">Logo reçu par email ?</Label>
            <RadioGroup
              value={callNotes.logo_received_by_email === undefined ? "" : callNotes.logo_received_by_email ? "yes" : "no"}
              onValueChange={(value) => updateCallNotes({ logo_received_by_email: value === "yes" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="logo-received-yes" />
                <Label htmlFor="logo-received-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="logo-received-no" />
                <Label htmlFor="logo-received-no" className="text-gray-200 font-normal cursor-pointer">Non, à demander</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="existing_tagline" className="text-white">Slogan/Baseline existant ?</Label>
          <Input
            id="existing_tagline"
            value={callNotes.existing_tagline || ""}
            onChange={(e) => updateCallNotes({ existing_tagline: e.target.value })}
            placeholder="Si vous avez déjà un slogan"
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-white">Avez-vous une charte graphique existante ?</Label>
          <RadioGroup
            value={callNotes.existing_brand_guidelines?.toString()}
            onValueChange={(value) => updateCallNotes({ existing_brand_guidelines: value === "true" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="guidelines_yes" />
              <Label htmlFor="guidelines_yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="guidelines_no" />
              <Label htmlFor="guidelines_no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_colors" className="text-white">Couleurs préférées</Label>
          <Input
            id="preferred_colors"
            value={callNotes.preferred_colors || ""}
            onChange={(e) => updateCallNotes({ preferred_colors: e.target.value })}
            placeholder="Bleu, blanc, rouge..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_fonts" className="text-white">Polices préférées (si applicable)</Label>
          <Input
            id="preferred_fonts"
            value={callNotes.preferred_fonts || ""}
            onChange={(e) => updateCallNotes({ preferred_fonts: e.target.value })}
            placeholder="Ex: Montserrat, Roboto..."
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="style_preferences" className="text-white">Style souhaité</Label>
          <Select
            value={callNotes.style_preferences || ""}
            onValueChange={(value) => updateCallNotes({ style_preferences: value })}
          >
            <SelectTrigger className="bg-slate-800 border-blue-500/30 text-white">
              <SelectValue placeholder="Sélectionner un style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moderne">Moderne</SelectItem>
              <SelectItem value="classique">Classique</SelectItem>
              <SelectItem value="minimaliste">Minimaliste</SelectItem>
              <SelectItem value="elegant">Élégant</SelectItem>
              <SelectItem value="ludique">Ludique</SelectItem>
              <SelectItem value="professionnel">Professionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspirations" className="text-white">Sites ou marques qui inspirent</Label>
          <EnhanceableTextarea
            id="inspirations"
            value={callNotes.inspirations || ""}
            onChange={(value) => updateCallNotes({ inspirations: value })}
            placeholder="URLs de sites, noms de marques..."
            rows={4}
            fieldContext="inspirations"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="elements_to_avoid" className="text-white">Éléments à éviter absolument</Label>
          <EnhanceableTextarea
            id="elements_to_avoid"
            value={callNotes.elements_to_avoid || ""}
            onChange={(value) => updateCallNotes({ elements_to_avoid: value })}
            placeholder="Couleurs, styles ou éléments que vous ne voulez pas"
            rows={3}
            fieldContext="elements_eviter"
          />
        </div>
      </div>
    </div>
  );
};

export default VisualIdentityTab;
