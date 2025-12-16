import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EnhanceableTextarea from "../EnhanceableTextarea";

interface CallNotes {
  call_status?: string;
  call_date?: string;
  call_notes?: string;
}

interface CallInfoTabProps {
  callNotes: CallNotes;
  updateCallNotes: (updates: Partial<CallNotes>) => void;
}

const CallInfoTab = ({ callNotes, updateCallNotes }: CallInfoTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="call_status" className="text-white">Statut de l'appel</Label>
          <Select
            value={callNotes.call_status || "not_called"}
            onValueChange={(value) => updateCallNotes({ call_status: value })}
          >
            <SelectTrigger className="bg-slate-800 border-blue-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_called">Non appelé</SelectItem>
              <SelectItem value="called">Appelé</SelectItem>
              <SelectItem value="no_answer">Pas de réponse</SelectItem>
              <SelectItem value="scheduled">Rappel planifié</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="call_date" className="text-white">Date et heure de l'appel</Label>
          <Input
            id="call_date"
            type="datetime-local"
            value={callNotes.call_date ? new Date(callNotes.call_date).toISOString().slice(0, 16) : ""}
            onChange={(e) => updateCallNotes({ call_date: e.target.value })}
            className="bg-slate-800 border-blue-500/30 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="call_notes" className="text-white">Notes générales</Label>
          <EnhanceableTextarea
            id="call_notes"
            value={callNotes.call_notes || ""}
            onChange={(value) => updateCallNotes({ call_notes: value })}
            placeholder="Notes prises pendant l'appel..."
            rows={6}
            fieldContext="notes_appel"
          />
        </div>
      </div>
    </div>
  );
};

export default CallInfoTab;
