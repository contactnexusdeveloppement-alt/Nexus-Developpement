import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CallNotes {
  has_domain?: boolean;
  domain_name?: string;
  has_hosting?: boolean;
  hosting_details?: string;
}

interface GeneralQuestionsTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

const GeneralQuestionsTab = ({ callNotes, updateCallNotes }: GeneralQuestionsTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-white">A déjà un nom de domaine ?</Label>
          <RadioGroup
            value={callNotes.has_domain === undefined ? "" : callNotes.has_domain ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ has_domain: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="domain-yes" />
              <Label htmlFor="domain-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="domain-no" />
              <Label htmlFor="domain-no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        {callNotes.has_domain && (
          <div className="space-y-2">
            <Label htmlFor="domain_name" className="text-white">Nom de domaine</Label>
            <Input
              id="domain_name"
              value={callNotes.domain_name || ""}
              onChange={(e) => updateCallNotes({ domain_name: e.target.value })}
              placeholder="exemple.com"
              className="bg-slate-800 border-blue-500/30 text-white"
            />
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-white">A déjà un hébergement ?</Label>
          <RadioGroup
            value={callNotes.has_hosting === undefined ? "" : callNotes.has_hosting ? "yes" : "no"}
            onValueChange={(value) => updateCallNotes({ has_hosting: value === "yes" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="hosting-yes" />
              <Label htmlFor="hosting-yes" className="text-gray-200 font-normal cursor-pointer">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="hosting-no" />
              <Label htmlFor="hosting-no" className="text-gray-200 font-normal cursor-pointer">Non</Label>
            </div>
          </RadioGroup>
        </div>

        {callNotes.has_hosting && (
          <div className="space-y-2">
            <Label htmlFor="hosting_details" className="text-white">Détails de l'hébergement</Label>
            <Textarea
              id="hosting_details"
              value={callNotes.hosting_details || ""}
              onChange={(e) => updateCallNotes({ hosting_details: e.target.value })}
              placeholder="Provider, type d'hébergement, accès..."
              rows={3}
              className="bg-slate-800 border-blue-500/30 text-white placeholder:text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralQuestionsTab;