
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Rocket, Zap, Crown } from "lucide-react";

export default function PitchStep({ data }: { data: any }) {

    // Simple logic to recommend offer
    const isBudgetHigh = data.budget_range === '5k-10k' || data.budget_range === '10k+';
    const isBudgetLow = data.budget_range === '<2k';

    // Default recommendation
    let recommendedOffer = 'standard';
    if (isBudgetHigh) recommendedOffer = 'premium';
    if (isBudgetLow) recommendedOffer = 'starter';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-white">Recommandation & Pitch</h2>
                <p className="text-slate-400">Présentez l'offre adaptée au profil qualifié.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* STARTER */}
                <Card className={`p-6 bg-slate-900 border transition-all ${recommendedOffer === 'starter' ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-105 z-10' : 'border-white/5 opacity-50 hover:opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400">Starter</Badge>
                        <Rocket className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Landing Pack</h3>
                    <p className="text-slate-400 text-xs mb-6 h-10">Pour lancer une activité et capter les premiers leads rapidement.</p>
                    <ul className="space-y-2 text-sm text-slate-300 mb-6">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Landing Page High-co</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Setup Google Ads</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Tracking Basique</li>
                    </ul>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <span className="font-bold text-blue-200">~1,500 €</span>
                    </div>
                </Card>

                {/* STANDARD */}
                <Card className={`p-6 bg-slate-900 border transition-all ${recommendedOffer === 'standard' ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)] scale-105 z-10' : 'border-white/5 opacity-50 hover:opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">Standard</Badge>
                        <Zap className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Site Vitrine Pro</h3>
                    <p className="text-slate-400 text-xs mb-6 h-10">L'essentiel pour crédibiliser une PME installée.</p>
                    <ul className="space-y-2 text-sm text-slate-300 mb-6">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Site 5-7 pages</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> CMS Administrable</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> SEO Technique</li>
                    </ul>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <span className="font-bold text-purple-200">~3,500 €</span>
                    </div>
                </Card>

                {/* PREMIUM */}
                <Card className={`p-6 bg-slate-900 border transition-all ${recommendedOffer === 'premium' ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)] scale-105 z-10' : 'border-white/5 opacity-50 hover:opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Premium</Badge>
                        <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Expérience Brand</h3>
                    <p className="text-slate-400 text-xs mb-6 h-10">Refonte totale, identité visuelle et développement sur-mesure.</p>
                    <ul className="space-y-2 text-sm text-slate-300 mb-6">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Branding complet</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Webflow / Next.js</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Automations CRM</li>
                    </ul>
                    <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <span className="font-bold text-yellow-200">Sur mesure (5k+)</span>
                    </div>
                </Card>

            </div>

            <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Arguments Clés</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                    <p>• "Notre différence ? On ne fait pas juste du 'joli', on connecte votre site à vos outils (CRM, Calendrier)."</p>
                    <p>• "Le délai de 30 jours, c'est notre garantie. On travaille en sprints."</p>
                    <p>• "Vous serez propriétaire de tout à 100% à la livraison."</p>
                    <p>• "On gère la maintenance, vous n'avez pas touche au technique."</p>
                </div>
            </div>
        </div>
    )
}
