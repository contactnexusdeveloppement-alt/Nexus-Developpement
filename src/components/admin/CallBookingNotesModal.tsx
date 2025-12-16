import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Calendar as CalendarIcon, Clock, Loader2, Save, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import EnhanceableTextarea from "./EnhanceableTextarea";

interface CallBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  duration: number;
  notes: string | null;
  status: string;
}

interface CallBookingNotes {
  id?: string;
  call_booking_id: string;
  call_summary: string | null;
  follow_up_actions: string | null;
  call_outcome: string | null;
  callback_date: string | null;
  internal_notes: string | null;
}

interface CallBookingNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: CallBooking;
}

const OUTCOME_OPTIONS = [
  { value: "interested", label: "📞 Intéressé", color: "text-blue-400" },
  { value: "converted_to_quote", label: "✅ Converti en devis", color: "text-green-400" },
  { value: "not_interested", label: "❌ Non intéressé", color: "text-red-400" },
  { value: "no_answer", label: "📵 Pas de réponse", color: "text-gray-400" },
  { value: "callback_scheduled", label: "🔄 Rappel programmé", color: "text-orange-400" },
];

const CallBookingNotesModal = ({ open, onOpenChange, booking }: CallBookingNotesModalProps) => {
  const [notes, setNotes] = useState<CallBookingNotes>({
    call_booking_id: booking.id,
    call_summary: null,
    follow_up_actions: null,
    call_outcome: null,
    callback_date: null,
    internal_notes: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasExistingNotes, setHasExistingNotes] = useState(false);

  // Load existing notes
  useEffect(() => {
    if (open && booking.id) {
      loadNotes();
    }
  }, [open, booking.id]);

  const loadNotes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('call_booking_notes')
      .select('*')
      .eq('call_booking_id', booking.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading notes:", error);
    } else if (data) {
      setNotes(data);
      setHasExistingNotes(true);
    } else {
      setNotes({
        call_booking_id: booking.id,
        call_summary: null,
        follow_up_actions: null,
        call_outcome: null,
        callback_date: null,
        internal_notes: null,
      });
      setHasExistingNotes(false);
    }
    setIsLoading(false);
  };

  const saveNotes = useCallback(async (showToast = true) => {
    setIsSaving(true);
    
    const notesData = {
      call_booking_id: booking.id,
      call_summary: notes.call_summary,
      follow_up_actions: notes.follow_up_actions,
      call_outcome: notes.call_outcome,
      callback_date: notes.callback_date,
      internal_notes: notes.internal_notes,
    };

    let error;

    if (hasExistingNotes && notes.id) {
      const { error: updateError } = await supabase
        .from('call_booking_notes')
        .update(notesData)
        .eq('id', notes.id);
      error = updateError;
    } else {
      const { data, error: insertError } = await supabase
        .from('call_booking_notes')
        .insert(notesData)
        .select()
        .single();
      error = insertError;
      if (data) {
        setNotes(prev => ({ ...prev, id: data.id }));
        setHasExistingNotes(true);
      }
    }

    setIsSaving(false);

    if (error) {
      console.error("Error saving notes:", error);
      if (showToast) {
        toast.error("Erreur lors de la sauvegarde");
      }
    } else {
      setLastSaved(new Date());
      if (showToast) {
        toast.success("Notes sauvegardées");
      }
    }
  }, [booking.id, notes, hasExistingNotes]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!open || isLoading) return;

    const interval = setInterval(() => {
      saveNotes(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [open, isLoading, saveNotes]);

  const updateField = (field: keyof CallBookingNotes, value: string | null) => {
    setNotes(prev => ({ ...prev, [field]: value }));
  };

  const getDurationLabel = (duration: number) => {
    if (duration === 15) return "15 min";
    if (duration === 30) return "30 min";
    if (duration === 60) return "1 heure";
    return `${duration} min`;
  };

  const formattedDate = format(new Date(booking.booking_date), "EEEE d MMMM", { locale: fr });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-blue-500/30 text-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              📞 Notes d'appel - {booking.name}
            </DialogTitle>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Sauvegardé à {format(lastSaved, "HH:mm")}
                </>
              ) : null}
            </div>
          </div>
          
          {/* Booking info */}
          <div className="flex items-center gap-4 text-sm text-gray-300 bg-slate-800/50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-400" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              {booking.time_slot} ({getDurationLabel(booking.duration)})
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={`mailto:${booking.email}`}
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {booking.email}
            </a>
            <a
              href={`tel:${booking.phone}`}
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {booking.phone}
            </a>
          </div>

          {/* Client notes */}
          {booking.notes && (
            <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-gray-400 mb-1">Notes du client :</p>
              <p className="text-gray-300 text-sm">{booking.notes}</p>
            </div>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {/* Call Outcome */}
            <div className="space-y-2">
              <Label className="text-gray-200">Résultat de l'appel</Label>
              <Select
                value={notes.call_outcome || ""}
                onValueChange={(value) => updateField("call_outcome", value || null)}
              >
                <SelectTrigger className="bg-slate-800/50 border-blue-500/30 text-white">
                  <SelectValue placeholder="Sélectionner un résultat..." />
                </SelectTrigger>
                <SelectContent>
                  {OUTCOME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Callback date - only if outcome is callback_scheduled */}
            {notes.call_outcome === "callback_scheduled" && (
              <div className="space-y-2">
                <Label className="text-gray-200">Date de rappel</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-800/50 border-blue-500/30 text-white hover:bg-slate-700/50",
                        !notes.callback_date && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {notes.callback_date
                        ? format(new Date(notes.callback_date), "PPP", { locale: fr })
                        : "Sélectionner une date..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={notes.callback_date ? new Date(notes.callback_date) : undefined}
                      onSelect={(date) =>
                        updateField("callback_date", date ? date.toISOString() : null)
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Call Summary */}
            <div className="space-y-2">
              <Label className="text-gray-200">Résumé de l'appel</Label>
              <EnhanceableTextarea
                value={notes.call_summary || ""}
                onChange={(value) => updateField("call_summary", value || null)}
                placeholder="Décrivez ce qui a été discuté pendant l'appel..."
                rows={4}
                fieldContext="resume_appel"
              />
            </div>

            {/* Follow-up Actions */}
            <div className="space-y-2">
              <Label className="text-gray-200">Actions à suivre</Label>
              <EnhanceableTextarea
                value={notes.follow_up_actions || ""}
                onChange={(value) => updateField("follow_up_actions", value || null)}
                placeholder="Listez les prochaines étapes à effectuer..."
                rows={3}
                fieldContext="actions_suivre"
              />
            </div>

            {/* Internal Notes */}
            <div className="space-y-2">
              <Label className="text-gray-200">Notes internes</Label>
              <EnhanceableTextarea
                value={notes.internal_notes || ""}
                onChange={(value) => updateField("internal_notes", value || null)}
                placeholder="Notes additionnelles (budget estimé, remarques, etc.)..."
                rows={3}
                fieldContext="notes_internes"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                Fermer
              </Button>
              <Button
                onClick={() => saveNotes(true)}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallBookingNotesModal;
