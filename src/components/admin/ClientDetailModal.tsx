import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
    Mail,
    Phone,
    FileText,
    MessageSquare,
    Bot,
    User,
    History,
    ChevronDown,
    CircleDot,
    TrendingUp,
    Briefcase,
    Archive,
    Loader2,
    Globe,
    Server,
    Palette,
    Target,
    Zap,
    LayoutTemplate,
    CreditCard,
    FileSignature,
    CheckSquare,
    Save,
    Play,
    Clock
} from "lucide-react";
import ProspectWizard from "./crm/ProspectWizard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: { name: string; email: string; phone?: string; status?: string } | null;
    quotes: any[];
    bookings: any[];
    callNotes?: any;
    onQuoteClick?: (quote: any) => void;
    onCallClick?: (booking: any) => void;
    onStatusUpdate?: () => void;
    initialViewMode?: 'quote' | 'call' | 'db';
}

const STATUS_CONFIG = {
    lead: { label: "Lead", color: "bg-blue-500/10 text-blue-300 border-blue-500/30", icon: CircleDot },
    prospect: { label: "Prospect", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30", icon: TrendingUp },
    client: { label: "Client", color: "bg-green-500/10 text-green-300 border-green-500/30", icon: Briefcase },
    lost: { label: "Perdu", color: "bg-red-500/10 text-red-300 border-red-500/30", icon: Archive },
};

const ClientDetailModal = ({
    isOpen,
    onClose,
    client,
    quotes,
    bookings,
    callNotes,
    onQuoteClick,
    onCallClick,
    onStatusUpdate,
    initialViewMode = 'db'
}: ClientDetailModalProps) => {
    if (!client) return null;

    const clientQuotes = quotes.filter(q => q.email.toLowerCase() === client.email.toLowerCase());
    const clientBookings = bookings.filter(b => b.email === client.email);
    const currentStatusKey = (client as any).status || 'lead';
    const currentConfig = STATUS_CONFIG[currentStatusKey as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.lead;

    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [leadScore, setLeadScore] = useState(20);

    // View Mode State
    const [viewMode, setViewMode] = useState<'quote' | 'call' | 'db'>(initialViewMode);
    const [isLiveCallMode, setIsLiveCallMode] = useState(initialViewMode === 'call');

    // Reset state when modal opens with new props
    useEffect(() => {
        if (isOpen) {
            setViewMode(initialViewMode);
            setIsLiveCallMode(initialViewMode === 'call');
        }
    }, [isOpen, initialViewMode]);

    // Internal "Call Type" for Tabs (derived from View Mode or toggled manually)
    // If viewMode is 'quote', forced to 'devis'. If 'call', forced to 'decouverte'.
    // If 'db', can toggle.
    const [callType, setCallType] = useState<'decouverte' | 'devis'>('devis');

    useEffect(() => {
        if (viewMode === 'quote') setCallType('devis');
        if (viewMode === 'call') setCallType('decouverte');
        if (viewMode === 'db') {
            // Heuristic for DB mode
            if (quotes.filter(q => q.email === client?.email).length > 0) {
                setCallType('devis');
            } else {
                setCallType('decouverte'); // Default or based on bookings
            }
        }
    }, [viewMode, client, quotes]);

    // --- FORM STATES ---

    // 1. Visuel (Branding)
    const [brandingData, setBrandingData] = useState({
        hasLogo: '', // 'oui', 'non'
        logoStyle: '',
        colors: '',
        fonts: '',
        slogan: '',
        examples: ''
    });

    // 2. Technique (Web)
    const [techData, setTechData] = useState({
        domain: '',
        hosting: '',
        cms: '', // WordPress, Shopify...
        integrations: '' // Stripe, Calendly...
    });

    // 3. Projet (Scope)
    const [projectData, setProjectData] = useState({
        goal: '',
        targetAudience: '',
        competitors: '',
        features: '', // Detailed functional needs
        contentReady: '' // 'oui', 'non', 'partiel'
    });

    // 4. Admin (Quote)
    const [adminData, setAdminData] = useState({
        price: '',
        deposit: '', // 'recu', 'attente'
        contract: '', // 'envoye', 'signe'
        nextStep: ''
    });

    // Calculate Lead Score on change
    useEffect(() => {
        let score = 20;
        if (clientQuotes.length > 0) score += 10;
        if (clientBookings.length > 0) score += 10;
        if (client.phone) score += 10;

        // Dynamic scoring based on call type
        if (callType === 'devis') {
            if (projectData.goal) score += 10;
            if (brandingData.hasLogo) score += 5;
            if (adminData.price) score += 10;
            if (adminData.contract === 'signe') score += 20;
        } else {
            // Discovery focus
            if (projectData.goal) score += 20; // Goal is main thing in discovery
        }

        if (currentStatusKey === 'prospect') score += 15;
        if (currentStatusKey === 'client') score = 100;
        setLeadScore(Math.min(score, 100));
    }, [clientQuotes, clientBookings, client, projectData, brandingData, adminData, currentStatusKey, callType]);


    // --- HELPERS ---

    const updateClientNotes = async (sectionTitle: string, dataObj: any) => {
        const timestamp = new Date().toLocaleDateString();
        let content = `**[${sectionTitle.toUpperCase()}] (${timestamp})**\n`;

        for (const [key, value] of Object.entries(dataObj)) {
            if (value) content += `- ${key}: ${value}\n`;
        }

        const { data, error: fetchError } = await supabase
            .from('client_statuses')
            .select('notes')
            .eq('client_email', client.email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        const currentNotes = data?.notes || "";
        const updatedNotes = currentNotes ? currentNotes + "\n\n" + content.trim() : content.trim();

        const { error } = await supabase
            .from('client_statuses')
            .upsert({
                client_email: client.email,
                notes: updatedNotes,
                updated_at: new Date().toISOString()
            }, { onConflict: 'client_email' });

        if (error) throw error;
        toast.success(`Section ${sectionTitle} sauvegardée !`);
    };

    const handleSaveBranding = () => updateClientNotes('Visuel', brandingData);
    const handleSaveTech = () => updateClientNotes('Technique', techData);
    const handleSaveProject = () => updateClientNotes('Projet', projectData);
    const handleSaveAdmin = () => updateClientNotes('Admin', adminData);

    const handleStatusChange = async (newStatus: string) => {
        try {
            const { error } = await supabase
                .from('client_statuses')
                .upsert({
                    client_email: client.email,
                    status: newStatus,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'client_email' });

            if (error) throw error;
            toast.success(`Statut mis à jour : ${newStatus}`);
            if (onStatusUpdate) onStatusUpdate();
        } catch (e: any) {
            toast.error("Erreur statut: " + e.message);
        }
    };

    const runAi = async (type: 'generate_client_summary' | 'draft_reply') => {
        setIsAiLoading(true);
        setAiResult("");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-assistant`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    data: {
                        client,
                        quotes,
                        calls: bookings,
                        callNotes,
                        fullProfile: { brandingData, techData, projectData, adminData },
                        context: "Assistant Admin CRM Nexus",
                        intent: "Analyse complète"
                    }
                })
            });

            if (!response.ok) throw new Error("Erreur API");
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    setAiResult(prev => (prev || "") + chunk);
                }
            }
        } catch (e: any) {
            toast.error("Erreur: " + e.message);
        } finally {
            setIsAiLoading(false);
        }
    };

    // HISTORY CLICK HANDLERS (Switch Context)
    const handleHistoryQuoteClick = (q: any) => {
        setViewMode('quote'); // Switch view mode to focus on Quote devis
        setCallType('devis');
        // Ideally we would load specific quote data here if we had detailed structure
    };

    const handleHistoryCallClick = (b: any) => {
        setViewMode('call');
        setCallType('decouverte');
        // Could auto-open live call mode if desired, but user might just want to see notes
        // For now, let's keep it in the "Call" context (Tab Projet/Focus)
    };


    if (isLiveCallMode) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsLiveCallMode(false);
                    // If we were in strict 'call' mode, maybe close modal entirely?
                    if (viewMode === 'call') onClose();
                }
            }}>
                <DialogContent className="max-w-[95vw] h-[95vh] bg-slate-950 border border-white/10 text-white p-0 overflow-hidden shadow-2xl">
                    <ProspectWizard prospect={client} onClose={() => {
                        setIsLiveCallMode(false);
                        if (viewMode === 'call') onClose();
                    }} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[80vh] bg-slate-950 border border-white/10 text-white p-0 overflow-hidden flex flex-col shadow-2xl shadow-blue-900/10">

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0">
                    <div>
                        <DialogTitle className="text-2xl font-light text-white mb-1">
                            {client.name}
                        </DialogTitle>
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-slate-400">{client.email}</p>
                            {viewMode === 'quote' && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-xs text-amber-500 uppercase tracking-wide">Quote Pending</span>
                                </div>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Badge variant="outline" className={`${currentConfig.color} cursor-pointer hover:bg-white/5 transition-colors text-xs font-normal`}>
                                        {currentConfig.label}
                                    </Badge>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-slate-900 border-white/10 text-white">
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <DropdownMenuItem key={key} onClick={() => handleStatusChange(key)} className="hover:bg-slate-800 cursor-pointer gap-2">
                                            <config.icon className="w-4 h-4" /> {config.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-48">
                            <div className="flex justify-between text-xs uppercase font-medium text-slate-500 tracking-wide mb-2">
                                <span>Lead Score</span>
                                <span className={leadScore > 70 ? "text-green-400" : leadScore > 40 ? "text-amber-400" : "text-slate-400"}>{leadScore}%</span>
                            </div>
                            <Progress value={leadScore} className="h-1.5 w-full bg-slate-800" indicatorClassName={leadScore > 70 ? "bg-green-500" : leadScore > 40 ? "bg-amber-500" : "bg-slate-500"} />

                            <div className="mt-3 flex bg-slate-800/50 p-0.5 rounded border border-slate-700">
                                {viewMode === 'db' ? (
                                    <>
                                        <button
                                            onClick={() => setCallType('decouverte')}
                                            className={`flex-1 px-2 py-1 text-[10px] uppercase font-medium rounded transition-all ${callType === 'decouverte' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Discovery
                                        </button>
                                        <button
                                            onClick={() => setCallType('devis')}
                                            className={`flex-1 px-2 py-1 text-[10px] uppercase font-medium rounded transition-all ${callType === 'devis' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Quote
                                        </button>
                                    </>
                                ) : (
                                    <Badge variant="outline" className="border-transparent bg-white/5 text-slate-400 text-[10px] uppercase tracking-wide">
                                        {viewMode === 'quote' ? 'Quote' : 'Call'} Mode
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {viewMode !== 'quote' && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                onClick={() => setIsLiveCallMode(true)}
                            >
                                <Play className="w-3 h-3 mr-2" /> Call Mode
                            </Button>
                        )}
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="flex flex-1 overflow-hidden">

                    {/* LEFT PANEL: TIMELINE & ACTIONS */}
                    <div className="w-[25%] min-w-[300px] border-r border-white/5 flex flex-col bg-slate-900/30">
                        <div className="p-4 border-b border-white/5 bg-slate-900/40">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <History className="w-3.5 h-3.5" /> Historique
                            </h3>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/5" />
                                {clientQuotes.map(q => (
                                    <div key={q.id} className="relative pl-6 group cursor-pointer hover:opacity-100 opacity-80 transition-opacity" onClick={() => handleHistoryQuoteClick(q)}>
                                        <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 ${viewMode === 'quote' ? 'border-yellow-500' : 'border-slate-600'} group-hover:border-yellow-500 z-10 transition-colors`} />
                                        <div className="text-xs text-slate-500 mb-1">{new Date(q.created_at).toLocaleDateString()}</div>
                                        <div className={`p-3 rounded-lg border transition-colors ${viewMode === 'quote' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-800/50 border-white/5 group-hover:border-yellow-500/30'}`}>
                                            <p className="text-sm font-medium text-slate-200 group-hover:text-yellow-200">Demande de devis</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {q.services.map((s: string) => <Badge key={s} variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">{s}</Badge>)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {clientBookings.map(b => (
                                    <div key={b.id} className="relative pl-6 group cursor-pointer hover:opacity-100 opacity-80 transition-opacity" onClick={() => handleHistoryCallClick(b)}>
                                        <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 ${viewMode === 'call' ? 'border-green-500' : 'border-slate-600'} group-hover:border-green-500 z-10 transition-colors`} />
                                        <div className="text-xs text-slate-500 mb-1">{new Date(b.booking_date).toLocaleDateString()}</div>
                                        <div className={`p-3 rounded-lg border transition-colors ${viewMode === 'call' ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800/50 border-white/5 group-hover:border-green-500/30'}`}>
                                            <p className="text-sm font-medium text-slate-200 group-hover:text-green-200">Appel Découverte</p>
                                            <p className="text-xs text-slate-400 mt-1">{b.time_slot} ({b.duration} min)</p>
                                            {callNotes?.[b.id]?.call_summary && (
                                                <p className="text-xs text-slate-500 italic mt-2 border-t border-white/5 pt-2">"{callNotes[b.id].call_summary}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Quick AI Action */}
                        <div className="p-4 border-t border-white/5 bg-slate-900/50">
                            <Button onClick={() => runAi('generate_client_summary')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 shadow-lg" disabled={isAiLoading}>
                                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4 mr-2 text-purple-400" />}
                                Analyse IA Rapide
                            </Button>
                        </div>
                    </div>


                    {/* RIGHT PANEL: DISCOVERY TABS */}
                    <div className="flex-1 flex flex-col bg-slate-950 relative">
                        <Tabs defaultValue="contact" className="flex-1 flex flex-col">

                            {/* Tab Navigation */}
                            <div className="px-6 pt-2 border-b border-white/5 bg-slate-900/20">
                                <TabsList className="bg-transparent w-full justify-start h-12 p-0 gap-8">

                                    <TabsTrigger value="contact" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:text-yellow-400 rounded-none h-full px-1 pb-0 transition-all hover:text-slate-200 gap-2">
                                        <User className="w-4 h-4" /> Contact
                                    </TabsTrigger>

                                    {callType === 'devis' && (
                                        <>
                                            <TabsTrigger value="visuel" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:text-pink-400 rounded-none h-full px-1 pb-0 transition-all hover:text-slate-200 gap-2">
                                                <Palette className="w-4 h-4" /> Visuel
                                            </TabsTrigger>
                                            <TabsTrigger value="technique" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none h-full px-1 pb-0 transition-all hover:text-slate-200 gap-2">
                                                <Globe className="w-4 h-4" /> Technique
                                            </TabsTrigger>
                                        </>
                                    )}

                                    <TabsTrigger value="projet" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-400 rounded-none h-full px-1 pb-0 transition-all hover:text-slate-200 gap-2">
                                        <Target className="w-4 h-4" /> Projet {callType === 'decouverte' && "(Focus)"}
                                    </TabsTrigger>

                                    {callType === 'devis' && (
                                        <TabsTrigger value="admin" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:text-green-400 rounded-none h-full px-1 pb-0 transition-all hover:text-slate-200 gap-2">
                                            <Briefcase className="w-4 h-4" /> Admin
                                        </TabsTrigger>
                                    )}

                                    <TabsTrigger value="ai_full" className="ml-auto bg-transparent border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-400 rounded-none h-full px-1 pb-0 transition-all hover:text-slate-200 gap-2">
                                        <Bot className="w-4 h-4" /> IA
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Tab Content Area */}
                            <ScrollArea className="flex-1 p-8 bg-slate-950">

                                {/* --- CONTACT TAB --- */}
                                <TabsContent value="contact" className="mt-0 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                    {/* Contact Information */}
                                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-base font-medium text-white mb-4">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-slate-500 text-xs uppercase tracking-wide block mb-1">Full Name</span>
                                                <div className="text-slate-200 font-medium">{client.name}</div>
                                            </div>
                                            <div></div>

                                            <div>
                                                <span className="text-slate-500 text-xs uppercase tracking-wide block mb-1">Email</span>
                                                <div className="text-slate-200 font-medium flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-500" /> <a href={`mailto:${client.email}`} className="hover:text-blue-400 transition-colors">{client.email}</a>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 text-xs uppercase tracking-wide block mb-1">Phone</span>
                                                <div className="text-slate-200 font-medium flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-slate-500" /> {client.phone ? <a href={`tel:${client.phone}`} className="hover:text-blue-400 transition-colors">{client.phone}</a> : "Not provided"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quote Requests */}
                                    {clientQuotes.length > 0 ? (
                                        <div className="space-y-6">
                                            {clientQuotes.map((quote, idx) => (
                                                <div key={quote.id} className="bg-slate-900/30 border border-amber-500/10 rounded-lg overflow-hidden">

                                                    {/* Quote Header */}
                                                    <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                            <h3 className="font-medium text-sm uppercase tracking-wide text-slate-300">Quote Request #{idx + 1}</h3>
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {new Date(quote.created_at).toLocaleDateString()} • {new Date(quote.created_at).toLocaleTimeString()}
                                                        </div>
                                                    </div>

                                                    <div className="p-6 grid gap-8">

                                                        {/* Section A: Contexte & Services */}
                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Secteur d'activité</span>
                                                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                                                                        {quote.business_type || 'Non spécifié'}
                                                                    </Badge>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500 text-xs uppercase tracking-wider block mb-2">Services Demandés</span>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {quote.services && quote.services.length > 0 ? (
                                                                            quote.services.map((s: string) => (
                                                                                <Badge key={s} className="bg-slate-800 text-white border-white/10">
                                                                                    {s}
                                                                                </Badge>
                                                                            ))
                                                                        ) : (
                                                                            <span className="text-slate-400 italic">Aucun service sélectionné</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                                                                        <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Budget</span>
                                                                        <span className="text-green-400 font-bold">{quote.budget || 'Non spécifié'}</span>
                                                                    </div>
                                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                                                                        <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Délai</span>
                                                                        <span className="text-orange-400 font-bold">{quote.timeline || 'Non spécifié'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Section B: Description du Projet (Gros Bloc) */}
                                                        <div>
                                                            <span className="text-slate-500 text-xs uppercase tracking-wider block mb-3">Détails du Projet (Message Client)</span>
                                                            <div className="bg-slate-950 p-5 rounded-xl border border-white/10 text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner min-h-[120px]">
                                                                {quote.project_details || quote.project_description || quote.message || <span className="italic text-slate-600">Aucune description fournie.</span>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                                            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                            <h3 className="text-slate-400 font-medium">No Quote Requests</h3>
                                            <p className="text-slate-600 text-sm mt-1">This contact hasn't submitted a quote form yet.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* --- 1. VISUEL --- */}
                                <TabsContent value="visuel" className="mt-0 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold text-white">Identité Visuelle</h2>
                                            <p className="text-sm text-slate-400">Définition de la charte graphique et du style.</p>
                                        </div>
                                        <Button size="sm" onClick={handleSaveBranding} className="bg-pink-600 hover:bg-pink-500"><Save className="w-4 h-4 mr-2" /> Sauvegarder</Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4 p-5 rounded-xl border border-white/5 bg-white/5">
                                            <Label className="text-pink-400 uppercase text-xs font-bold tracking-wider">Logo</Label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="hasLogo" className="accent-pink-500" checked={brandingData.hasLogo === 'oui'} onChange={() => setBrandingData({ ...brandingData, hasLogo: 'oui' })} />
                                                    <span className="text-sm">Existant</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="hasLogo" className="accent-pink-500" checked={brandingData.hasLogo === 'non'} onChange={() => setBrandingData({ ...brandingData, hasLogo: 'non' })} />
                                                    <span className="text-sm">À créer</span>
                                                </label>
                                            </div>
                                            {brandingData.hasLogo === 'oui' && (
                                                <Input placeholder="Lien vers le logo actuel..." className="bg-slate-900 border-white/10" value={brandingData.examples} onChange={e => setBrandingData({ ...brandingData, examples: e.target.value })} />
                                            )}
                                        </div>

                                        <div className="space-y-4 p-5 rounded-xl border border-white/5 bg-white/5">
                                            <Label className="text-pink-400 uppercase text-xs font-bold tracking-wider">Préférences</Label>
                                            <Input placeholder="Couleurs (ex: Bleu Marine, Doré)" className="bg-slate-900 border-white/10" value={brandingData.colors} onChange={e => setBrandingData({ ...brandingData, colors: e.target.value })} />
                                            <Input placeholder="Typographie (ex: Sans-Serif, Moderne)" className="bg-slate-900 border-white/10" value={brandingData.fonts} onChange={e => setBrandingData({ ...brandingData, fonts: e.target.value })} />
                                        </div>

                                        <div className="col-span-2 p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                            <Label className="text-pink-400 uppercase text-xs font-bold tracking-wider">Style Souhaité</Label>
                                            <Select onValueChange={(val) => setBrandingData({ ...brandingData, logoStyle: val })}>
                                                <SelectTrigger className="bg-slate-900 border-white/10">
                                                    <SelectValue placeholder="Sélectionner une ambiance..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="minimalist">Minimaliste & Épuré</SelectItem>
                                                    <SelectItem value="luxury">Luxe & Premium</SelectItem>
                                                    <SelectItem value="bold">Bold & Dynamique</SelectItem>
                                                    <SelectItem value="corporate">Corporate & Sérieux</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Textarea placeholder="Notes supplémentaires sur le design..." className="bg-slate-900 border-white/10 min-h-[100px]" value={brandingData.slogan} onChange={e => setBrandingData({ ...brandingData, slogan: e.target.value })} />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* --- 2. TECHNIQUE --- */}
                                <TabsContent value="technique" className="mt-0 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold text-white">Stack Technique</h2>
                                            <p className="text-sm text-slate-400">Infrastructure et intégrations nécessaires.</p>
                                        </div>
                                        <Button size="sm" onClick={handleSaveTech} className="bg-blue-600 hover:bg-blue-500"><Save className="w-4 h-4 mr-2" /> Sauvegarder</Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4 p-5 rounded-xl border border-white/5 bg-white/5">
                                            <Label className="text-blue-400 uppercase text-xs font-bold tracking-wider">Domaine & Hébergement</Label>
                                            <div className="space-y-3">
                                                <Input placeholder="Nom de domaine (ex: site.com)" className="bg-slate-900 border-white/10" value={techData.domain} onChange={e => setTechData({ ...techData, domain: e.target.value })} />
                                                <Input placeholder="Hébergeur (OVH, Vercel...)" className="bg-slate-900 border-white/10" value={techData.hosting} onChange={e => setTechData({ ...techData, hosting: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-5 rounded-xl border border-white/5 bg-white/5">
                                            <Label className="text-blue-400 uppercase text-xs font-bold tracking-wider">CMS & Outils</Label>
                                            <Select onValueChange={(val) => setTechData({ ...techData, cms: val })}>
                                                <SelectTrigger className="bg-slate-900 border-white/10">
                                                    <SelectValue placeholder="Choix de la technologie..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="react">React / Next.js (Custom)</SelectItem>
                                                    <SelectItem value="wordpress">WordPress</SelectItem>
                                                    <SelectItem value="shopify">Shopify</SelectItem>
                                                    <SelectItem value="webflow">Webflow</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-2 p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                            <Label className="text-blue-400 uppercase text-xs font-bold tracking-wider">Intégrations Tierces</Label>
                                            <Textarea placeholder="Stripe, Calendly, Mailchimp, CRM..." className="bg-slate-900 border-white/10 min-h-[100px]" value={techData.integrations} onChange={e => setTechData({ ...techData, integrations: e.target.value })} />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* --- 3. PROJET --- */}
                                <TabsContent value="projet" className="mt-0 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                    {/* Initial Quote Data */}
                                    {clientQuotes.length > 0 && (
                                        <div className="bg-slate-900/30 border border-amber-500/10 rounded-lg p-6 mb-6">
                                            <div className="flex items-center gap-2.5 mb-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                <h3 className="font-medium text-sm uppercase tracking-wide text-slate-300">Initial Quote Submission</h3>
                                            </div>
                                            <div className="grid gap-4 text-sm">
                                                {clientQuotes.map((quote, idx) => (
                                                    <div key={quote.id} className={`space-y-3 ${idx > 0 ? 'pt-4 border-t border-slate-800' : ''}`}>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-slate-500 text-xs block mb-1">Requested Service</span>
                                                                <span className="text-slate-200 font-medium">{quote.service_type || 'N/A'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500 text-xs block mb-1">Estimated Budget</span>
                                                                <span className="text-slate-200 font-medium">{quote.budget_range || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 text-xs block mb-1">Project Description</span>
                                                            <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800">
                                                                {quote.project_description || quote.message || 'No description provided.'}
                                                            </p>
                                                        </div>
                                                        <div className="text-xs text-slate-600 font-mono text-right">
                                                            {new Date(quote.created_at).toLocaleDateString()} • {new Date(quote.created_at).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-2">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold text-white">
                                                {callType === 'decouverte' ? "Découverte Projet" : "Périmètre Projet"}
                                            </h2>
                                            <p className="text-sm text-slate-400">
                                                {callType === 'decouverte'
                                                    ? "Discussion ouverte sur les besoins et la vision globale."
                                                    : "Objectifs, cible et fonctionnalités clés pour chiffrage."}
                                            </p>
                                        </div>
                                        <Button size="sm" onClick={handleSaveProject} className="bg-purple-600 hover:bg-purple-500"><Save className="w-4 h-4 mr-2" /> Sauvegarder</Button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                            <Label className="text-purple-400 uppercase text-xs font-bold tracking-wider">Objectif Principal</Label>
                                            <Textarea placeholder="Quel est le but n°1 du site ? (Vente, Lead Gen, Image...)" className="bg-slate-900 border-white/10 h-20" value={projectData.goal} onChange={e => setProjectData({ ...projectData, goal: e.target.value })} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                                <Label className="text-purple-400 uppercase text-xs font-bold tracking-wider">Cible (Persona)</Label>
                                                <Input placeholder="Qui visons-nous ?" className="bg-slate-900 border-white/10" value={projectData.targetAudience} onChange={e => setProjectData({ ...projectData, targetAudience: e.target.value })} />
                                            </div>
                                            <div className="p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                                <Label className="text-purple-400 uppercase text-xs font-bold tracking-wider">Concurrents</Label>
                                                <Input placeholder="Liens ou Noms..." className="bg-slate-900 border-white/10" value={projectData.competitors} onChange={e => setProjectData({ ...projectData, competitors: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
                                            <Label className="text-purple-400 uppercase text-xs font-bold tracking-wider">Fonctionnalités Spécifiques</Label>
                                            <Textarea placeholder="Espace membre, Blog, E-commerce, Calculateur..." className="bg-slate-900 border-white/10 h-32" value={projectData.features} onChange={e => setProjectData({ ...projectData, features: e.target.value })} />
                                        </div>
                                    </div>
                                </TabsContent>


                                {/* --- 4. ADMIN --- */}
                                <TabsContent value="admin" className="mt-0 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold text-white">Administration & Devis</h2>
                                            <p className="text-sm text-slate-400">Suivi commercial et contractuel.</p>
                                        </div>
                                        <Button size="sm" onClick={handleSaveAdmin} className="bg-green-600 hover:bg-green-500"><Save className="w-4 h-4 mr-2" /> Sauvegarder</Button>
                                    </div>

                                    <div className="bg-green-900/5 border border-green-500/20 rounded-xl p-6 grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-green-400 uppercase text-xs font-bold tracking-wider">Prix Proposé</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" placeholder="5000" className="bg-slate-900 border-white/10 text-lg font-mono" value={adminData.price} onChange={e => setAdminData({ ...adminData, price: e.target.value })} />
                                                <span className="text-xl font-bold text-slate-500">€</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-green-400 uppercase text-xs font-bold tracking-wider">Acompte (30%)</Label>
                                            <Select onValueChange={(val) => setAdminData({ ...adminData, deposit: val })}>
                                                <SelectTrigger className="bg-slate-900 border-white/10">
                                                    <SelectValue placeholder="Statut..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="attente">En attente</SelectItem>
                                                    <SelectItem value="recu">Reçu</SelectItem>
                                                    <SelectItem value="retard">En retard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-green-400 uppercase text-xs font-bold tracking-wider">Contrat</Label>
                                            <Select onValueChange={(val) => setAdminData({ ...adminData, contract: val })}>
                                                <SelectTrigger className="bg-slate-900 border-white/10">
                                                    <SelectValue placeholder="Statut..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="preparation">En préparation</SelectItem>
                                                    <SelectItem value="envoye">Envoyé</SelectItem>
                                                    <SelectItem value="signe">Signé</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-green-400 uppercase text-xs font-bold tracking-wider">Prochaine Étape</Label>
                                            <Input placeholder="ex: Relance J+3" className="bg-slate-900 border-white/10" value={adminData.nextStep} onChange={e => setAdminData({ ...adminData, nextStep: e.target.value })} />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* --- 5. AI FULL --- */}
                                <TabsContent value="ai_full" className="mt-0 max-w-3xl mx-auto space-y-6">
                                    <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-indigo-500/20 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Bot className="w-8 h-8 text-indigo-400" />
                                            <div>
                                                <h3 className="font-bold text-white text-lg">Assistant Stratégique</h3>
                                                <p className="text-sm text-indigo-300/60">Générez une proposition commerciale basée sur les onglets remplis.</p>
                                            </div>
                                        </div>

                                        <Button onClick={() => runAi('generate_client_summary')} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 mb-6" disabled={isAiLoading}>
                                            {isAiLoading ? "Génération..." : "Générer la Proposition / Synthèse"}
                                        </Button>

                                        {aiResult && (
                                            <div className="bg-slate-950 p-6 rounded-lg border border-white/10 font-mono text-sm leading-relaxed text-slate-300">
                                                {aiResult}
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>


                            </ScrollArea>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ClientDetailModal;
