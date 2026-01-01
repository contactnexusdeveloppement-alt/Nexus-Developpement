import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ClosingStep({ data, onSave, isSaving }: { data: any; onSave?: () => void; isSaving?: boolean }) {
    const [score, setScore] = useState(0);

    useEffect(() => {
        let s = 0;
        // Scoring logic from design
        if (data.budget_range === '2k-5k') s += 20;
        if (data.budget_range === '5k-10k') s += 40;
        if (data.budget_range === '10k+') s += 50;

        if (data.timeline === 'urgent') s += 10;
        if (data.timeline === '1-3_months') s += 20; // Sweet spot
        if (data.timeline === '3-6_months') s += 10;

        if (data.decision_maker) s += 20;
        if (data.current_challenges?.length > 0) s += 10;

        setScore(Math.min(s, 100));
    }, [data]);

    const getVerdict = () => {
        if (score > 70) return { label: "CLIENT IDÉAL (GO)", color: "text-green-400", bg: "bg-green-500" };
        if (score > 30) return { label: "POTENTIEL (NURTURE)", color: "text-yellow-400", bg: "bg-yellow-500" };
        return { label: "NON QUALIFIÉ", color: "text-red-400", bg: "bg-red-500" };
    };

    const verdict = getVerdict();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 text-center max-w-xl mx-auto">

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Synthèse de l'Appel</h2>
                <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-full w-48 h-48 mx-auto border-4 border-slate-800 relative">
                    <span className={`text-4xl font-bold ${verdict.color}`}>{score}/100</span>
                    <span className="text-xs text-slate-500 uppercase tracking-widest mt-2">Nexus Score</span>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/20 animate-spin transition-all duration-1000" style={{ transform: `rotate(${score * 3.6}deg)` }}></div>
                </div>

                <div className={`inline-block px-4 py-2 rounded-lg bg-black/30 border border-white/5 font-bold tracking-widest ${verdict.color}`}>
                    {verdict.label}
                </div>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 text-left space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Prochaine étape recommandée</h3>
                {score > 70 ? (
                    <div className="flex items-center gap-4 text-green-300">
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Booker la restitution + Envoyer devis maintenant.</span>
                    </div>
                ) : score > 30 ? (
                    <div className="flex items-center gap-4 text-yellow-300">
                        <ArrowRight className="w-6 h-6" />
                        <span>Envoyer documentation + Relance J+7.</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 text-red-300">
                        <XCircle className="w-6 h-6" />
                        <span>Redirection vers offre starter ou fin de parcours polie.</span>
                    </div>
                )}
            </div>

            <Button
                className="w-full h-14 text-lg bg-white text-black hover:bg-slate-200 disabled:opacity-50"
                onClick={onSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Enregistrement...
                    </>
                ) : (
                    "Terminer & Enregistrer la fiche"
                )}
            </Button>
        </div>
    )
}
