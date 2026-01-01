
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro, Calendar, Users, Radio } from "lucide-react";

export default function QualificationStep({ data, updateData }: { data: any, updateData: (k: string, v: any) => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-white">Qualification (BANT)</h2>
                <p className="text-slate-400">Vérifions la faisabilité du projet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. BUDGET */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50" />
                    <Label className="text-green-400 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                        <Euro className="w-4 h-4" /> Budget
                    </Label>
                    <Select onValueChange={(val) => updateData('budget_range', val)} value={data.budget_range}>
                        <SelectTrigger className="bg-slate-950 border-white/10 h-12">
                            <SelectValue placeholder="Sélectionner une fourchette..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="<2k">Moins de 2k €</SelectItem>
                            <SelectItem value="2k-5k">2k - 5k €</SelectItem>
                            <SelectItem value="5k-10k">5k - 10k €</SelectItem>
                            <SelectItem value="10k+">Plus de 10k €</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-[10px] text-slate-500 italic">"Avez-vous une enveloppe allouée ?"</p>
                </div>

                {/* 2. TIMELINE */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                    <Label className="text-yellow-400 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Délais
                    </Label>
                    <Select onValueChange={(val) => updateData('timeline', val)} value={data.timeline}>
                        <SelectTrigger className="bg-slate-950 border-white/10 h-12">
                            <SelectValue placeholder="Urgence ?" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="urgent">Urgent (Moins d'un mois)</SelectItem>
                            <SelectItem value="1-3_months">Standard (1-3 mois)</SelectItem>
                            <SelectItem value="3-6_months">3-6 mois</SelectItem>
                            <SelectItem value="long_term">Long terme / Pas de date</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 3. DECISION */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4 relative overflow-hidden col-span-1 md:col-span-2">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
                    <Label className="text-purple-400 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4" /> Décisionnaire
                    </Label>

                    <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-white/5">
                        <span className="text-sm text-slate-300">Est-ce que je parle au seul décideur ?</span>
                        <div className="flex items-center gap-2">
                            <span className={!data.decision_maker ? "text-white" : "text-slate-500"}>Non</span>
                            <Switch
                                checked={data.decision_maker}
                                onCheckedChange={(checked) => updateData('decision_maker', checked)}
                            />
                            <span className={data.decision_maker ? "text-white" : "text-slate-500"}>Oui</span>
                        </div>
                    </div>

                    {!data.decision_maker && (
                        <Input
                            placeholder="Qui d'autre valide ? (DG, Associé...)"
                            className="bg-slate-950 border-white/10"
                            value={data.other_decision_makers || ''}
                            onChange={(e) => updateData('other_decision_makers', e.target.value)}
                        />
                    )}
                </div>

                {/* 4. TECH STACK */}
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl space-y-4 col-span-1 md:col-span-2">
                    <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                        <Radio className="w-4 h-4" /> Technique & Concurrents
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Site actuel / Outils utilisés..."
                            className="bg-slate-950 border-white/10"
                            value={data.tech_stack || ''}
                            onChange={(e) => updateData('tech_stack', e.target.value)}
                        />
                        <Input
                            placeholder="Concurrents cités..."
                            className="bg-slate-950 border-white/10"
                            value={data.competitors || ''}
                            onChange={(e) => updateData('competitors', e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
