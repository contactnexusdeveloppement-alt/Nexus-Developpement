import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
    PhoneCall,
    Calendar,
    Clock,
    User,
    Mail,
    Phone as PhoneIcon,
    X,
    Save
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CallDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    call: any;
    client: { name: string; email: string };
}

export const CallDetailModal = ({
    isOpen,
    onClose,
    call,
    client,
}: CallDetailModalProps) => {
    if (!call) return null;

    const [notes, setNotes] = useState("");
    const [callSummary, setCallSummary] = useState("");
    const [callOutcome, setCallOutcome] = useState("");
    const [loading, setLoading] = useState(false);

    // Load existing notes when modal opens
    useEffect(() => {
        if (isOpen && call) {
            loadCallNotes();
        }
    }, [isOpen, call]);

    const loadCallNotes = async () => {
        const { data } = await supabase
            .from('call_booking_notes')
            .select('*')
            .eq('call_booking_id', call.id)
            .single();

        if (data) {
            setCallSummary(data.call_summary || "");
            setCallOutcome(data.call_outcome || "");
            setNotes(data.internal_notes || "");
        }
    };

    const handleSaveNotes = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('call_booking_notes')
                .upsert({
                    call_booking_id: call.id,
                    call_summary: callSummary,
                    call_outcome: callOutcome,
                    internal_notes: notes,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'call_booking_id' });

            if (error) throw error;
            toast.success("Notes sauvegardées !");
        } catch (e: any) {
            toast.error("Erreur: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[85vh] bg-slate-950 border border-white/10 text-white p-0 overflow-hidden flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0 bg-gradient-to-r from-green-900/20 to-slate-900/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <PhoneCall className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-light text-white mb-1">
                                Détails de l'Appel
                            </DialogTitle>
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-slate-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(call.booking_date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="text-sm text-slate-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {call.time_slot}
                                </div>
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                    {call.duration} min
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* CONTENT */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto space-y-6">

                        {/* Contact Info */}
                        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Informations Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <User className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block">Nom</span>
                                        <p className="text-white font-medium">{call.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block">Email</span>
                                        <p className="text-white font-medium">{call.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <PhoneIcon className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block">Téléphone</span>
                                        <p className="text-white font-medium">{call.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block">Statut</span>
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mt-1">
                                            {call.status || "Planifié"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call Notes from booking */}
                        {call.notes && (
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Notes de Réservation</h3>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {call.notes}
                                </p>
                            </div>
                        )}

                        {/* Call Outcome */}
                        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Résultat de l'Appel</h3>
                            <Textarea
                                placeholder="Qualifié | Non qualifié | Besoin de suivi | À rappeler..."
                                value={callOutcome}
                                onChange={(e) => setCallOutcome(e.target.value)}
                                className="bg-slate-950 border-slate-700 text-white min-h-[60px]"
                            />
                        </div>

                        {/* Call Summary */}
                        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Résumé de l'Appel</h3>
                            <Textarea
                                placeholder="Résumé de la conversation, points clés discutés..."
                                value={callSummary}
                                onChange={(e) => setCallSummary(e.target.value)}
                                className="bg-slate-950 border-slate-700 text-white min-h-[120px]"
                            />
                        </div>

                        {/* Detailed Notes */}
                        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Notes Détaillées</h3>
                            <Textarea
                                placeholder="Notes complètes, besoins spécifiques, prochaines étapes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="bg-slate-950 border-slate-700 text-white min-h-[200px]"
                            />
                        </div>
                    </div>
                </ScrollArea>

                {/* FOOTER */}
                <div className="flex items-center justify-between px-8 py-4 border-t border-slate-800 bg-slate-900/30 shrink-0">
                    <div className="text-xs text-slate-500">
                        ID: {call.id?.substring(0, 8)}...
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSaveNotes}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-500 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Sauvegarde..." : "Sauvegarder Notes"}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            onClick={onClose}
                        >
                            Fermer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
