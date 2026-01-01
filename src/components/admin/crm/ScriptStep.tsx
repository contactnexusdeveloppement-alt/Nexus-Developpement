
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, PlayCircle, Info } from "lucide-react";

export default function ScriptStep({ onNext, prospect }: { onNext: () => void, prospect: any }) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-bold text-white tracking-tight">Introduction</h1>
                <p className="text-slate-400">Cadrez l'appel dès les premières secondes.</p>
            </div>

            <Card className="bg-slate-900/50 border-blue-500/20 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                        <PlayCircle className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest font-bold">Script d'ouverture</span>
                    </div>

                    <div className="prose prose-invert max-w-none text-lg leading-relaxed text-slate-200">
                        <p>
                            "Bonjour <strong className="text-white bg-blue-500/20 px-1 rounded">{prospect?.name || "[Prénom]"}</strong>, c'est Adam de l'agence Nexus Développement.
                        </p>
                        <p>
                            Nous avons bien reçu votre demande concernant <strong className="text-white bg-blue-500/20 px-1 rounded">{prospect?.business_type || "votre projet"}</strong>, et je suis ravi d'échanger avec vous aujourd'hui.
                        </p>
                        <p>
                            L'objectif de cet appel est simple : prendre <span className="text-blue-400 font-bold">15-20 minutes</span> pour bien comprendre votre projet et vos enjeux actuels.
                        </p>
                        <p>
                            Si on voit qu'on peut vous apporter de la valeur, je vous expliquerai comment on fonctionne. Sinon, je vous orienterai au mieux.
                        </p>
                        <p className="font-semibold text-white">
                            Est-ce que cela vous convient ?"
                        </p>
                    </div>
                </div>
            </Card>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 text-yellow-200 text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <p>N'oubliez pas de désactiver vos notifications et de vous mettre dans un environnement calme avant de commencer.</p>
            </div>

            <div className="flex justify-center pt-8">
                <Button size="lg" onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-10 h-14 text-lg shadow-xl shadow-blue-900/30 transition-all hover:scale-105">
                    Démarrer la Découverte
                </Button>
            </div>
        </div>
    )
}
