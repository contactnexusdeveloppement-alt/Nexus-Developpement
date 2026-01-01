
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

const CHALLENGES = [
    "Manque de visibilité", "Design vieillissant", "Taux de conversion faible",
    "Site trop lent", "Difficile à mettre à jour", "Pas adapté mobile",
    "Lancement de produit", "Automatisation", "Outils déconnectés"
];

export default function DiscoveryStep({ data, updateData }: { data: any, updateData: (k: string, v: any) => void }) {

    const toggleChallenge = (c: string) => {
        const current = data.current_challenges || [];
        if (current.includes(c)) {
            updateData('current_challenges', current.filter((x: string) => x !== c));
        } else {
            updateData('current_challenges', [...current, c]);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-white">Compréhension & Situation</h2>
                <p className="text-slate-400">Identifions ensemble la douleur actuelle.</p>
            </div>

            <div className="space-y-6">

                {/* 1. ACTIVITE */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4">
                    <div className="flex justify-between">
                        <Label className="text-blue-400 uppercase text-xs font-bold tracking-wider">Activité & Pitch</Label>
                    </div>
                    <Textarea
                        placeholder="Pouvez-vous me pitcher votre activité en quelques phrases simples ?"
                        className="bg-slate-950 border-white/10 min-h-[100px] text-base"
                        value={data.business_activity || ''}
                        onChange={(e) => updateData('business_activity', e.target.value)}
                    />
                </div>

                {/* 2. DECLENCHEUR / CHALLENGES */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4">
                    <Label className="text-blue-400 uppercase text-xs font-bold tracking-wider">Pourquoi maintenant ? (Points de douleur)</Label>
                    <div className="flex flex-wrap gap-2">
                        {CHALLENGES.map(challenge => {
                            const isSelected = (data.current_challenges || []).includes(challenge);
                            return (
                                <Badge
                                    key={challenge}
                                    variant="outline"
                                    onClick={() => toggleChallenge(challenge)}
                                    className={`cursor-pointer px-3 py-1.5 transition-all text-sm border-white/10
                                        ${isSelected ? 'bg-red-500/20 text-red-200 border-red-500/50' : 'hover:bg-white/5 text-slate-400'}
                                    `}
                                >
                                    {challenge}
                                </Badge>
                            )
                        })}
                    </div>
                    <Input
                        placeholder="Autre challenge spécifique..."
                        className="bg-slate-950 border-white/10 mt-2"
                        value={data.other_challenge || ''}
                        onChange={(e) => updateData('other_challenge', e.target.value)}
                    />
                </div>

                {/* 3. OBJECTIFS */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4">
                    <Label className="text-blue-400 uppercase text-xs font-bold tracking-wider">Vision à 6 mois</Label>
                    <div className="relative">
                        <AlertCircle className="absolute top-3 left-3 w-4 h-4 text-slate-500" />
                        <Textarea
                            placeholder="Dans un monde idéal, quels résultats attendez-vous de ce projet ?"
                            className="bg-slate-950 border-white/10 min-h-[100px] pl-10"
                            value={data.goals || ''}
                            onChange={(e) => updateData('goals', e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
