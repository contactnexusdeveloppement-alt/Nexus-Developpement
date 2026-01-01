import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Mail,
    Phone,
    FileText,
    PhoneCall,
    FolderKanban,
    FileStack,
    LayoutDashboard,
    CircleDot,
    TrendingUp,
    Briefcase,
    Archive,
    ChevronRight,
    Plus,
    MoreVertical,
    Download,
    Euro,
    Clock,
    Filter,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Flame
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuoteDetailModal } from "./QuoteDetailModal";
import { CallDetailModal } from "./CallDetailModal";
import { Textarea } from "@/components/ui/textarea";
import { DocumentsSection } from "./DocumentsSection";
import { ProjectsSection } from "./ProjectsSection";
import { ValueIndicators } from "./ValueIndicators";
import { formatPrice, daysSince, getOutcomeBadgeColor } from "@/utils/formatters";
import { emailTemplates, sendEmail } from "@/utils/emailTemplates";
import EmptyState from "./widgets/EmptyState";

interface ClientOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: { name: string; email: string; phone?: string; status?: string } | null;
    quotes: any[];
    bookings: any[];
    onStatusUpdate?: () => void;
}

const STATUS_CONFIG = {
    lead: { label: "Lead", color: "bg-blue-500/10 text-blue-300 border-blue-500/30", icon: CircleDot },
    prospect: { label: "Prospect", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30", icon: TrendingUp },
    client: { label: "Client", color: "bg-green-500/10 text-green-300 border-green-500/30", icon: Briefcase },
    lost: { label: "Perdu", color: "bg-red-500/10 text-red-300 border-red-500/30", icon: Archive },
};

export const ClientOverviewModal = ({
    isOpen,
    onClose,
    client,
    quotes,
    bookings,
    onStatusUpdate,
}: ClientOverviewModalProps) => {
    if (!client) return null;

    const clientQuotes = quotes.filter(q => q.email?.toLowerCase() === client.email.toLowerCase());
    const clientBookings = bookings.filter(b => b.email === client.email);
    const currentStatusKey = (client as any).status || 'lead';
    const currentConfig = STATUS_CONFIG[currentStatusKey as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.lead;

    const [leadScore, setLeadScore] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");

    // Nested modal states
    const [selectedQuote, setSelectedQuote] = useState<any>(null);
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [quoteDetailOpen, setQuoteDetailOpen] = useState(false);
    const [callDetailOpen, setCallDetailOpen] = useState(false);

    // Internal notes state
    const [internalNotes, setInternalNotes] = useState("");
    const [notesSaving, setNotesSaving] = useState(false);
    const [notesLastSaved, setNotesLastSaved] = useState<Date | null>(null);
    const notesTimeoutRef = useRef<NodeJS.Timeout>();

    // Quote filter state
    const [quoteFilter, setQuoteFilter] = useState<'all' | 'pending' | 'qualified'>('all');

    // Call notes for enhanced cards
    const [callNotes, setCallNotes] = useState<Map<string, any>>(new Map());

    // Calculate Lead Score
    useEffect(() => {
        let score = 20; // Base score
        if (clientQuotes.length > 0) score += 20;
        if (clientBookings.length > 0) score += 15;
        if (client.phone) score += 10;
        if (currentStatusKey === 'prospect') score += 15;
        if (currentStatusKey === 'client') score = 100;

        setLeadScore(Math.min(score, 100));
    }, [clientQuotes.length, clientBookings.length, client.phone, currentStatusKey]);

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

    const handleQuoteClick = (quote: any) => {
        setSelectedQuote(quote);
        setQuoteDetailOpen(true);
    };

    const handleCallClick = (call: any) => {
        setSelectedCall(call);
        setCallDetailOpen(true);
    };
    // Load internal notes on mount
    useEffect(() => {
        const loadNotes = async () => {
            const { data } = await supabase
                .from('client_statuses')
                .select('notes, updated_at')
                .eq('client_email', client.email)
                .single();

            if (data) {
                setInternalNotes(data.notes || "");
                if (data.updated_at) {
                    setNotesLastSaved(new Date(data.updated_at));
                }
            }
        };
        if (isOpen) {
            loadNotes();
        }
    }, [isOpen, client.email]);
    // Fetch call notes for enhanced cards
    useEffect(() => {
        const fetchCallNotes = async () => {
            if (clientBookings.length === 0) return;

            const { data } = await supabase
                .from('call_booking_notes')
                .select('*')
                .in('call_booking_id', clientBookings.map(b => b.id));

            const notesMap = new Map();
            data?.forEach(note => notesMap.set(note.call_booking_id, note));
            setCallNotes(notesMap);
        };
        fetchCallNotes();
    }, [clientBookings]);


    // Debounced auto-save for notes
    const handleNotesChange = (value: string) => {
        setInternalNotes(value);

        if (notesTimeoutRef.current) {
            clearTimeout(notesTimeoutRef.current);
        }

        notesTimeoutRef.current = setTimeout(async () => {
            setNotesSaving(true);
            try {
                const { error } = await supabase
                    .from('client_statuses')
                    .upsert({
                        client_email: client.email,
                        status: currentStatusKey,
                        notes: value,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'client_email' });

                if (error) throw error;
                setNotesLastSaved(new Date());
                toast.success("Notes sauvegardées", { duration: 1500 });
            } catch (e: any) {
                toast.error("Erreur: " + e.message);
            } finally {
                setNotesSaving(false);
            }
        }, 1500);
    };

    // Filter quotes
    const filteredQuotes = clientQuotes.filter(q => {
        if (quoteFilter === 'all') return true;
        const isQualified = !!q.qualification_data;
        if (quoteFilter === 'qualified') return isQualified;
        if (quoteFilter === 'pending') return !isQualified;
        return true;
    });

    // Calculate quote stats
    const quotesStats = {
        all: clientQuotes.length,
        pending: clientQuotes.filter(q => !q.qualification_data).length,
        qualified: clientQuotes.filter(q => !!q.qualification_data).length,
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] bg-slate-950 border border-white/10 text-white p-0 overflow-hidden flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0 bg-slate-900/30">
                    <div className="flex items-center gap-6">
                        <div>
                            <DialogTitle className="text-2xl font-light text-white mb-2">
                                {client.name}
                            </DialogTitle>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Mail className="w-4 h-4" />
                                    {client.email}
                                </div>
                                {client.phone && (
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Phone className="w-4 h-4" />
                                        {client.phone}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className={`${currentConfig.color} cursor-pointer hover:bg-white/5 transition-colors text-xs font-normal px-3 py-1.5`}
                                >
                                    <currentConfig.icon className="w-3.5 h-3.5 mr-1.5" />
                                    {currentConfig.label}
                                </Badge>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-900 border-white/10 text-white">
                                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                    <DropdownMenuItem
                                        key={key}
                                        onClick={() => handleStatusChange(key)}
                                        className="hover:bg-slate-800 cursor-pointer gap-2"
                                    >
                                        <config.icon className="w-4 h-4" /> {config.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Lead Score */}
                    <div className="w-64">
                        <div className="flex justify-between text-xs uppercase font-medium text-slate-500 tracking-wide mb-2">
                            <span>Lead Score</span>
                            <span className={leadScore > 70 ? "text-green-400" : leadScore > 40 ? "text-amber-400" : "text-slate-400"}>
                                {leadScore}%
                            </span>
                        </div>
                        <Progress
                            value={leadScore}
                            className="h-2 w-full bg-slate-800"
                            indicatorClassName={leadScore > 70 ? "bg-green-500" : leadScore > 40 ? "bg-amber-500" : "bg-slate-500"}
                        />
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="border-b border-slate-800 bg-slate-900/20 shrink-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start h-14 bg-transparent p-0 gap-1 px-8">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 px-6 gap-2 transition-all"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Vue d'ensemble
                            </TabsTrigger>
                            <TabsTrigger
                                value="quotes"
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 px-6 gap-2 transition-all"
                            >
                                <FileText className="w-4 h-4" />
                                Devis
                                {clientQuotes.length > 0 && (
                                    <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-300 text-xs">
                                        {clientQuotes.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="calls"
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 px-6 gap-2 transition-all"
                            >
                                <PhoneCall className="w-4 h-4" />
                                Appels
                                {clientBookings.length > 0 && (
                                    <Badge variant="secondary" className="ml-1 bg-green-500/20 text-green-300 text-xs">
                                        {clientBookings.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="projects"
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 px-6 gap-2 transition-all"
                            >
                                <FolderKanban className="w-4 h-4" />
                                Projets
                            </TabsTrigger>
                            <TabsTrigger
                                value="documents"
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 px-6 gap-2 transition-all"
                            >
                                <FileStack className="w-4 h-4" />
                                Documents
                            </TabsTrigger>
                        </TabsList>

                        {/* TAB CONTENT */}
                        <ScrollArea className="flex-1 h-[calc(90vh-200px)]">

                            {/* OVERVIEW TAB */}
                            <TabsContent value="overview" className="mt-0 p-8">
                                <div className="max-w-6xl mx-auto space-y-8">

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                            <div className="text-3xl font-bold text-amber-400">{clientQuotes.length}</div>
                                            <div className="text-sm text-slate-400 mt-1">Devis</div>
                                        </div>
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                            <div className="text-3xl font-bold text-green-400">{clientBookings.length}</div>
                                            <div className="text-sm text-slate-400 mt-1">Appels</div>
                                        </div>
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                            <div className="text-3xl font-bold text-purple-400">0</div>
                                            <div className="text-sm text-slate-400 mt-1">Projets</div>
                                        </div>
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                            <div className="text-3xl font-bold text-blue-400">{leadScore}%</div>
                                            <div className="text-sm text-slate-400 mt-1">Score</div>
                                        </div>
                                    </div>


                                    {/* Internal Notes */}
                                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Notes Internes</h3>
                                            {notesSaving && (
                                                <div className="flex items-center gap-2 text-xs text-blue-400">
                                                    <Clock className="w-3 h-3 animate-spin" />
                                                    Sauvegarde...
                                                </div>
                                            )}
                                            {!notesSaving && notesLastSaved && (
                                                <div className="text-xs text-slate-500">
                                                    Modifié: {notesLastSaved.toLocaleTimeString('fr-FR')}
                                                </div>
                                            )}
                                        </div>
                                        <Textarea
                                            placeholder="Notes stratégiques sur le client, points importants, historique des échanges..."
                                            value={internalNotes}
                                            onChange={(e) => handleNotesChange(e.target.value)}
                                            className="bg-slate-950 border-slate-700 text-white min-h-[120px] resize-none"
                                        />
                                    </div>

                                    {/* Unified Timeline */}
                                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-5 h-5 text-blue-400" />
                                            Historique
                                        </h3>
                                        <div className="space-y-4 relative ml-2">
                                            <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/5" />

                                            {/* Combine quotes and bookings */}
                                            {[...clientQuotes.map(q => ({ ...q, type: 'quote', date: new Date(q.created_at) })),
                                            ...clientBookings.map(b => ({ ...b, type: 'call', date: new Date(b.booking_date) }))]
                                                .sort((a, b) => b.date.getTime() - a.date.getTime())
                                                .map((item, idx) => (
                                                    <div key={idx} className="relative pl-6">
                                                        <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 z-10 ${item.type === 'quote' ? 'bg-amber-500 border-amber-500' : 'bg-green-500 border-green-500'
                                                            }`} />
                                                        <div className="text-xs text-slate-500 mb-1">
                                                            {item.date.toLocaleDateString()}
                                                        </div>
                                                        <div className={`p-4 rounded-lg border ${item.type === 'quote'
                                                            ? 'bg-amber-500/5 border-amber-500/20'
                                                            : 'bg-green-500/5 border-green-500/20'
                                                            }`}>
                                                            <p className="text-sm font-medium text-white">
                                                                {item.type === 'quote' ? '📄 Demande de devis' : '📞 Appel découverte'}
                                                            </p>
                                                            {item.type === 'quote' && item.services && (
                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    {item.services.join(', ')}
                                                                </p>
                                                            )}
                                                            {item.type === 'call' && (
                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    {item.time_slot} • {item.duration} min
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* QUOTES TAB */}
                            <TabsContent value="quotes" className="mt-0 p-8">
                                <div className="max-w-4xl mx-auto">
                                    <h3 className="text-xl font-semibold text-white mb-6">Tous les Devis</h3>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Filter className="w-4 h-4 text-slate-500" />
                                        <Button
                                            size="sm"
                                            variant={quoteFilter === 'all' ? 'default' : 'outline'}
                                            onClick={() => setQuoteFilter('all')}
                                            className="text-xs"
                                        >
                                            Tous ({quotesStats.all})
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={quoteFilter === 'pending' ? 'default' : 'outline'}
                                            onClick={() => setQuoteFilter('pending')}
                                            className="text-xs bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30"
                                        >
                                            En attente ({quotesStats.pending})
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={quoteFilter === 'qualified' ? 'default' : 'outline'}
                                            onClick={() => setQuoteFilter('qualified')}
                                            className="text-xs bg-green-500/10 hover:bg-green-500/20 border-green-500/30"
                                        >
                                            Qualifiés ({quotesStats.qualified})
                                        </Button>
                                    </div>

                                    {filteredQuotes.length > 0 ? (
                                        <div className="space-y-4">
                                            {filteredQuotes.map((quote, idx) => (
                                                <div
                                                    key={quote.id}
                                                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-amber-500/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                                                                    Devis #{idx + 1}
                                                                </h4>
                                                                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                                                                    En attente
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                                                                <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                                                                <span>•</span>
                                                                <span>{quote.service_type || 'Non spécifié'}</span>
                                                            </div>
                                                            {quote.services && quote.services.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {quote.services.map((s: string) => (
                                                                        <Badge key={s} variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                                                                            {s}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleQuoteClick(quote)}
                                                            className="border-slate-700 hover:bg-amber-500/10 hover:border-amber-500/30"
                                                        >
                                                            Voir détails
                                                            <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <EmptyState
                                                icon="📋"
                                                message="Aucun devis pour ce client"
                                                description="Les demandes de devis apparaîtront ici"
                                            />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* CALLS TAB */}
                            <TabsContent value="calls" className="mt-0 p-8">
                                <div className="max-w-4xl mx-auto">
                                    <h3 className="text-xl font-semibold text-white mb-6">Historique des Appels</h3>
                                    {clientBookings.length > 0 ? (
                                        <div className="space-y-4">
                                            {clientBookings.map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-green-500/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors mb-2">
                                                                Appel Découverte
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                                <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                                                <span>•</span>
                                                                <span>{booking.time_slot}</span>
                                                                <span>•</span>
                                                                <span>{booking.duration} min</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleCallClick(booking)}
                                                            className="border-slate-700 hover:bg-green-500/10 hover:border-green-500/30"
                                                        >
                                                            Voir notes
                                                            <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <EmptyState
                                                icon="📞"
                                                message="Aucun appel enregistré"
                                                description="L'historique des appels apparaîtra ici"
                                            />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* PROJECTS TAB */}
                            <TabsContent value="projects" className="mt-0 p-8">
                                <div className="max-w-4xl mx-auto">
                                    <ProjectsSection clientEmail={client.email} />
                                </div>
                            </TabsContent>

                            {/* DOCUMENTS TAB */}
                            <TabsContent value="documents" className="mt-0 p-8">
                                <div className="max-w-4xl mx-auto">
                                    <DocumentsSection clientEmail={client.email} />
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>

            {/* NESTED MODALS */}
            {selectedQuote && (
                <QuoteDetailModal
                    isOpen={quoteDetailOpen}
                    onClose={() => setQuoteDetailOpen(false)}
                    quote={selectedQuote}
                    client={client}
                />
            )}

            {selectedCall && (
                <CallDetailModal
                    isOpen={callDetailOpen}
                    onClose={() => setCallDetailOpen(false)}
                    call={selectedCall}
                    client={client}
                />
            )}
        </Dialog>
    );
};

