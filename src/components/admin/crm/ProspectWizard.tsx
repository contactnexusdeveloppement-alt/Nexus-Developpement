
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    ChevronRight,
    ChevronLeft,
    PhoneCall,
    User,
    Building2,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Save,
    Mic
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ScriptStep from "./ScriptStep";
import DiscoveryStep from "./DiscoveryStep";
import QualificationStep from "./QualificationStep";
import PitchStep from "./PitchStep";
import ClosingStep from "./ClosingStep";

interface ProspectWizardProps {
    prospect: any; // Using any for now to facilitate dev, will use strong type later
    onClose: () => void;
}

export type WizardStep = 'intro' | 'discovery' | 'qualification' | 'pitch' | 'closing';

const STEPS: { id: WizardStep; label: string }[] = [
    { id: 'intro', label: 'Intro' },
    { id: 'discovery', label: 'Découverte' },
    { id: 'qualification', label: 'Qualification' },
    { id: 'pitch', label: 'Pitch' },
    { id: 'closing', label: 'Closing' },
];

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ProspectWizard({ prospect, onClose }: ProspectWizardProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({
        // Store all qualification data here
        prospectId: prospect?.id,
        notes: "",
        ...prospect // Pre-fill with existing prospect data if available
    });

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentStepIndex + 1].id);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(STEPS[currentStepIndex - 1].id);
        }
    };

    const updateFormData = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSaveCall = async () => {
        setIsSaving(true);
        try {
            // 1. Create or Update Prospect
            // We use email as key if available, otherwise just insert new
            let prospectId = formData.prospectId;

            const prospectPayload = {
                email: formData.email || prospect?.email || `unknown-${Date.now()}@example.com`, // Fallback
                full_name: formData.name || prospect?.name,
                phone: formData.phone || prospect?.phone,
                company_name: formData.company_name,
                status: 'qualified', // Default after call
                lead_score: 0 // Will updated by trigger or manual logic
            };

            const { data: prospectData, error: prospectError } = await supabase
                .from('prospects')
                .upsert(prospectPayload, { onConflict: 'email' })
                .select()
                .single();

            if (prospectError) throw prospectError;
            prospectId = prospectData.id;

            // 2. Save Qualification Data
            const qualificationPayload = {
                prospect_id: prospectId,
                business_activity: formData.business_activity,
                current_challenges: formData.current_challenges,
                goals: formData.goals,
                budget_range: formData.budget_range,
                timeline: formData.timeline,
                decision_maker: formData.decision_maker,
                tech_stack: formData.tech_stack,
                competitors: formData.competitors
            };

            const { error: qualError } = await supabase
                .from('qualification_data')
                .upsert(qualificationPayload, { onConflict: 'prospect_id' });

            if (qualError) throw qualError;

            // 3. Log Interaction
            const interactionPayload = {
                prospect_id: prospectId,
                type: 'discovery_call',
                summary: `Notes: ${formData.notes} \n\n Score: ${formData.score || 'N/A'}`,
                date: new Date().toISOString()
            };

            const { error: interactError } = await supabase
                .from('interactions')
                .insert(interactionPayload);

            if (interactError) throw interactError;

            toast.success("Appel enregistré avec succès !");
            onClose();

        } catch (error: any) {
            console.error("Save error:", error);
            toast.error("Erreur lors de la sauvegarde: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white font-sans selection:bg-blue-500/30">

            {/* HEADER FIXED */}
            <div className="h-20 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl shrink-0 flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg">
                        <User className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            {prospect?.name || prospect?.full_name || "Nouveau Prospect"}
                            {prospect?.company_name && <Badge variant="outline" className="text-xs bg-slate-800 text-slate-400 border-white/10">{prospect.company_name}</Badge>}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> {prospect?.phone || "Info manquante"}</span>
                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {prospect?.source || "Source inconnue"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Progression Appel</span>
                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-950/50 hover:text-red-300">
                        <Mic className="w-4 h-4 mr-2" />
                        REC
                    </Button>

                    <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10">
                        Fermer
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: WIZARD */}
                <div className="flex-1 flex flex-col relative">

                    {/* STEPPER */}
                    <div className="px-12 py-6 border-b border-white/5 bg-slate-900/30">
                        <div className="flex justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -z-10 -translate-y-1/2" />

                            {STEPS.map((step, idx) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = idx < currentStepIndex;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setCurrentStep(step.id)}>
                                        <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-slate-950 transition-all duration-300
                                ${isActive ? 'bg-blue-600 text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.5)]' :
                                                isCompleted ? 'bg-slate-800 text-blue-400 border border-blue-500/30' : 'bg-slate-900 border border-white/10 text-slate-600'}
                            `}>
                                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 ${isActive ? 'text-blue-400' : isCompleted ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* STEP CONTENT CONTAINER */}
                    <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-b from-slate-950 to-slate-900/50">
                        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {currentStep === 'intro' && <ScriptStep onNext={handleNext} prospect={prospect} />}
                            {currentStep === 'discovery' && <DiscoveryStep data={formData} updateData={updateFormData} />}
                            {currentStep === 'qualification' && <QualificationStep data={formData} updateData={updateFormData} />}
                            {currentStep === 'pitch' && <PitchStep data={formData} />}
                            {currentStep === 'closing' && <ClosingStep data={formData} onSave={handleSaveCall} isSaving={isSaving} />}
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="h-20 border-t border-white/10 bg-slate-900/80 backdrop-blur shrink-0 flex items-center justify-between px-12">
                        <Button variant="ghost" onClick={handlePrev} disabled={currentStepIndex === 0} className="text-slate-400 hover:text-white">
                            <ChevronLeft className="w-4 h-4 mr-2" /> Retour
                        </Button>

                        <Button size="lg" onClick={handleNext} disabled={currentStepIndex === STEPS.length - 1} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 px-8">
                            Suivant <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                </div>

                {/* RIGHT: NOTES SIDEBAR */}
                <div className="w-[350px] border-l border-white/10 bg-slate-950 flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-slate-900/20">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Prise de notes
                        </h3>
                    </div>
                    <div className="flex-1 p-4">
                        <textarea
                            className="w-full h-full bg-transparent border-0 resize-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-700 leading-relaxed"
                            placeholder="Tapez vos notes en vrac ici..."
                            value={formData.notes}
                            onChange={(e) => updateFormData('notes', e.target.value)}
                        />
                    </div>
                    <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
                        <span>Sauvegarde auto...</span>
                        <Save className="w-3 h-3 opacity-50" />
                    </div>
                </div>

            </div>
        </div>
    );
}
