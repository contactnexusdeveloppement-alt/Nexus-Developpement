import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, Clock, CheckCircle2, Pause, PhoneOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CallLiveModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    call: any;
    client: any;
    relatedQuote?: any;
    onSuccess?: () => void;
}

interface Question {
    id: number;
    text: string;
    checked: boolean;
    notes: string;
}

const QUESTION_TEMPLATES = {
    discovery: [
        { id: 1, text: "Quel est votre objectif principal avec ce projet ?", checked: false, notes: "" },
        { id: 2, text: "Avez-vous des contraintes de délai spécifiques ?", checked: false, notes: "" },
        { id: 3, text: "Budget envisagé pour ce projet ?", checked: false, notes: "" },
        { id: 4, text: "Avez-vous déjà un design ou des maquettes ?", checked: false, notes: "" },
        { id: 5, text: "Fonctionnalités critiques à intégrer ?", checked: false, notes: "" },
    ],
    followUp: [
        { id: 1, text: "Avez-vous eu le temps de consulter le devis ?", checked: false, notes: "" },
        { id: 2, text: "Des questions sur notre proposition ?", checked: false, notes: "" },
        { id: 3, text: "Souhaitez-vous des ajustements ou modifications ?", checked: false, notes: "" },
        { id: 4, text: "Quelle est votre décision à ce stade ?", checked: false, notes: "" },
    ],
    technical: [
        { id: 1, text: "Systèmes existants à intégrer ?", checked: false, notes: "" },
        { id: 2, text: "Volume utilisateurs / trafic attendu ?", checked: false, notes: "" },
        { id: 3, text: "Contraintes techniques particulières ?", checked: false, notes: "" },
        { id: 4, text: "Hébergement prévu ou à définir ?", checked: false, notes: "" },
    ],
};

const CallLiveModal = ({ open, onOpenChange, call, client, relatedQuote, onSuccess }: CallLiveModalProps) => {
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false); // View saved notes
    const [loading, setLoading] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStartTime, setCallStartTime] = useState<Date | null>(null);
    const [introChecked, setIntroChecked] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [generalNotes, setGeneralNotes] = useState("");
    const [callOutcome, setCallOutcome] = useState<"interested" | "converted_to_quote" | "not_interested" | null>(null);
    const [savedNotes, setSavedNotes] = useState<any>(null);

    // Load existing notes if call is completed
    const loadExistingNotes = async () => {
        if (!call || call.status !== 'completed') return;

        try {
            const { data, error } = await supabase
                .from('call_booking_notes')
                .select('*')
                .eq('call_booking_id', call.id)
                .single();

            if (error) throw error;

            if (data) {
                setSavedNotes(data);
                setCallOutcome(data.call_outcome as any);
                setGeneralNotes(data.call_summary || '');

                // Parse internal_notes to reconstruct questions if possible
                if (data.internal_notes) {
                    // Try to parse questions from internal_notes
                    const noteLines = data.internal_notes.split('\n\n');
                    const parsedQuestions: Question[] = [];

                    noteLines.forEach((line, idx) => {
                        if (line.startsWith('Q: ')) {
                            const parts = line.split('\nR: ');
                            if (parts.length === 2) {
                                parsedQuestions.push({
                                    id: idx + 1,
                                    text: parts[0].replace('Q: ', ''),
                                    checked: true,
                                    notes: parts[1].replace('(pas de notes)', ''),
                                });
                            }
                        }
                    });

                    if (parsedQuestions.length > 0) {
                        setQuestions(parsedQuestions);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading call notes:', error);
        }
    };

    // Determine call type and load appropriate questions OR existing notes
    useEffect(() => {
        if (open && call) {
            // Check if call is completed
            if (call.status === 'completed') {
                setIsViewMode(true);
                loadExistingNotes();
            } else {
                // New/upcoming call - setup for new entry
                setIsViewMode(false);
                const callType = relatedQuote ? "followUp" : "discovery";
                setQuestions(QUESTION_TEMPLATES[callType].map(q => ({ ...q })));
            }

            // Reset state when opening
            setIsLiveMode(false);
            setIntroChecked(false);
            setCallDuration(0);
            setCallStartTime(null);
            if (call.status !== 'completed') {
                setGeneralNotes("");
                setCallOutcome(null);
            }
        }
    }, [open, call, relatedQuote]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLiveMode && callStartTime) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - callStartTime.getTime()) / 1000);
                setCallDuration(elapsed);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLiveMode, callStartTime]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartCall = () => {
        setIsLiveMode(true);
        setCallStartTime(new Date());
    };

    const handleQuestionToggle = (id: number) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, checked: !q.checked } : q
        ));
    };

    const handleQuestionNotes = (id: number, notes: string) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, notes } : q
        ));
    };

    const handleEndCall = async () => {
        if (!callOutcome) {
            toast.error("Veuillez sélectionner le résultat de l'appel");
            return;
        }

        setLoading(true);
        try {
            // Prepare questions summary for internal_notes
            const questionsSummary = questions
                .filter(q => q.checked)
                .map(q => `Q: ${q.text}\nR: ${q.notes || '(pas de notes)'}`)
                .join('\n\n');

            const fullInternalNotes = [
                questionsSummary,
                generalNotes && `\nNotes supplémentaires:\n${generalNotes}`
            ].filter(Boolean).join('\n');

            // Save call notes with correct schema
            const callNote = {
                call_booking_id: call.id,
                call_outcome: callOutcome, // 'interested', 'converted_to_quote', 'not_interested'
                call_summary: generalNotes || null,
                internal_notes: fullInternalNotes || null,
                follow_up_actions: null, // Can be added later if needed
            };

            const { error: noteError } = await supabase
                .from("call_booking_notes")
                .insert(callNote);

            if (noteError) throw noteError;

            // Update call status
            const { error: callError } = await supabase
                .from("call_bookings")
                .update({ status: "completed" })
                .eq("id", call.id);

            if (callError) throw callError;

            toast.success("Notes d'appel sauvegardées avec succès !");
            onSuccess?.();
            onOpenChange(false);
        } catch (error: any) {
            toast.error("Erreur lors de la sauvegarde des notes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getIntroScript = () => {
        const projectType = relatedQuote?.services?.[0] || "votre projet";
        return `Bonjour ${client.name}, c'est Adam de Nexus Développement. Je vous appelle suite à ${relatedQuote
            ? `votre demande de devis pour ${projectType}`
            : "votre prise de contact"
            }. Avez-vous quelques minutes pour en discuter ?`;
    };

    if (!call || !client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {isLiveMode ? "Appel en Cours" : "Préparation Appel"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1">
                                {client.name} • {format(new Date(call.booking_date), "d MMMM yyyy", { locale: fr })} à {call.time_slot}
                            </DialogDescription>
                        </div>
                        {isLiveMode && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <Clock className="w-4 h-4 text-red-400" />
                                <span className="font-mono text-red-400 font-bold">{formatDuration(callDuration)}</span>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {!isLiveMode && !isViewMode ? (
                        // MODE RÉCAPITULATIF (Upcoming call)
                        <div className="space-y-4">
                            <Card className="bg-slate-800/30 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">📋 Récapitulatif</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-slate-400 text-xs">Client</Label>
                                            <p className="text-white font-medium">{client.name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-400 text-xs">Email</Label>
                                            <p className="text-white text-sm">{client.email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-400 text-xs">Téléphone</Label>
                                            <p className="text-white font-mono">{call.phone}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-400 text-xs">Durée prévue</Label>
                                            <p className="text-white">{call.duration} min</p>
                                        </div>
                                    </div>

                                    {relatedQuote && (
                                        <div className="pt-3 border-t border-white/10">
                                            <Label className="text-slate-400 text-xs">Devis lié</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                                    {relatedQuote.services?.[0]}
                                                </Badge>
                                                <span className="text-slate-400 text-sm">
                                                    Budget: {relatedQuote.budget}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {call.notes && (
                                        <div className="pt-3 border-t border-white/10">
                                            <Label className="text-slate-400 text-xs">Notes préalables</Label>
                                            <p className="text-slate-300 text-sm mt-1">{call.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Button
                                onClick={handleStartCall}
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-14 text-lg"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Démarrer l'Appel
                            </Button>
                        </div>
                    ) : isViewMode ? (
                        // MODE VIEW (Completed call - show saved notes)
                        <div className="space-y-6">
                            <Card className="bg-green-900/20 border-green-500/30">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <p className="text-green-300 font-medium">Appel terminé</p>
                                        {savedNotes?.created_at && (
                                            <span className="text-sm text-slate-400">
                                                • {format(new Date(savedNotes.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Outcome */}
                            {callOutcome && (
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Résultat</Label>
                                    <div className="flex items-center gap-2">
                                        {callOutcome === 'interested' && (
                                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Intéressé
                                            </Badge>
                                        )}
                                        {callOutcome === 'converted_to_quote' && (
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Devis envoyé
                                            </Badge>
                                        )}
                                        {callOutcome === 'not_interested' && (
                                            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                                <PhoneOff className="w-3 h-3 mr-1" />
                                                Pas intéressé
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Questions & Answers */}
                            {questions.length > 0 && (
                                <Card className="bg-slate-800/30 border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-base text-white">Questions posées</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {questions.map((q) => (
                                            <div key={q.id} className="space-y-2 p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                                                    <p className="flex-1 text-sm text-slate-300">{q.text}</p>
                                                </div>
                                                {q.notes && (
                                                    <div className="ml-6 p-2 bg-slate-800 rounded border border-white/5">
                                                        <p className="text-sm text-slate-400">{q.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* General Notes */}
                            {generalNotes && (
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Notes générales</Label>
                                    <Card className="bg-slate-800/30 border-white/10">
                                        <CardContent className="p-4">
                                            <p className="text-slate-300 text-sm whitespace-pre-wrap">{generalNotes}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    ) : (
                        // MODE LIVE CALL
                        <div className="space-y-6">
                            {/* Introduction Script */}
                            <Card className="bg-blue-900/20 border-blue-500/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-blue-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Introduction
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-lg italic text-slate-200 leading-relaxed">
                                        "{getIntroScript()}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="intro"
                                            checked={introChecked}
                                            onCheckedChange={(checked) => setIntroChecked(checked as boolean)}
                                        />
                                        <Label htmlFor="intro" className="text-sm text-slate-300 cursor-pointer">
                                            ✓ Introduction faite
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Questions */}
                            <Card className="bg-slate-800/30 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-base text-white">❓ Questions Clés</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {questions.map((q) => (
                                        <div key={q.id} className="space-y-2 p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                            <div className="flex items-start gap-2">
                                                <Checkbox
                                                    id={`q-${q.id}`}
                                                    checked={q.checked}
                                                    onCheckedChange={() => handleQuestionToggle(q.id)}
                                                    className="mt-1"
                                                />
                                                <Label
                                                    htmlFor={`q-${q.id}`}
                                                    className={`flex-1 cursor-pointer ${q.checked ? "text-green-300" : "text-slate-300"
                                                        }`}
                                                >
                                                    {q.text}
                                                </Label>
                                            </div>
                                            {q.checked && (
                                                <Textarea
                                                    placeholder="Notes réponse..."
                                                    value={q.notes}
                                                    onChange={(e) => handleQuestionNotes(q.id, e.target.value)}
                                                    rows={2}
                                                    className="bg-slate-800 border-white/10 text-white text-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* General Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="general-notes" className="text-white">
                                    Notes supplémentaires
                                </Label>
                                <Textarea
                                    id="general-notes"
                                    value={generalNotes}
                                    onChange={(e) => setGeneralNotes(e.target.value)}
                                    placeholder="Autres points importants, remarques, prochaines étapes..."
                                    rows={4}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Résultat de l'appel</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="outline"
                                        className={`${callOutcome === "interested"
                                            ? "bg-green-500/20 border-green-500/50 text-green-300"
                                            : "border-white/10 text-slate-400"
                                            }`}
                                        onClick={() => setCallOutcome("interested")}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Intéressé
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`${callOutcome === "converted_to_quote"
                                            ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                                            : "border-white/10 text-slate-400"
                                            }`}
                                        onClick={() => setCallOutcome("converted_to_quote")}
                                    >
                                        <Clock className="w-4 h-4 mr-1" />
                                        Devis envoyé
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`${callOutcome === "not_interested"
                                            ? "bg-red-500/20 border-red-500/50 text-red-300"
                                            : "border-white/10 text-slate-400"
                                            }`}
                                        onClick={() => setCallOutcome("not_interested")}
                                    >
                                        <PhoneOff className="w-4 h-4 mr-1" />
                                        Pas intéressé
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {isLiveMode ? (
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                onClick={() => setIsLiveMode(false)}
                                className="flex-1 bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                            >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                            </Button>
                            <Button
                                onClick={handleEndCall}
                                disabled={loading || !callOutcome}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                            >
                                {loading ? "Sauvegarde..." : "Terminer Appel"}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                        >
                            Annuler
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CallLiveModal;
