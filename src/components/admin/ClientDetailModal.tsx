import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Calendar, FileText, PhoneCall, Clock, Euro, MessageSquare, UserPlus, Target, UserCheck, UserX, Save, Bot, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  services: string[];
  project_details: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
}

interface CallBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  duration: number;
  notes: string | null;
  status: string;
  created_at: string;
}

interface CallBookingNote {
  call_booking_id: string;
  call_outcome: string | null;
  call_summary: string | null;
}

interface Client {
  email: string;
  name: string;
  phone: string | null;
  quotes: QuoteRequest[];
  calls: CallBooking[];
  firstContact: Date;
  lastContact: Date;
  status?: string;
  statusNotes?: string | null;
}

interface ClientDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  callNotes: Record<string, CallBookingNote>;
  onQuoteClick: (quote: QuoteRequest) => void;
  onCallClick: (call: CallBooking) => void;
  onStatusUpdate?: () => void;
}

type TimelineItem = {
  type: "quote" | "call";
  date: Date;
  data: QuoteRequest | CallBooking;
};

const STATUS_CONFIG = {
  lead: { label: "Lead", color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: UserPlus },
  prospect: { label: "Prospect", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: Target },
  client: { label: "Client", color: "bg-green-500/20 text-green-300 border-green-500/50", icon: UserCheck },
  lost: { label: "Perdu", color: "bg-red-500/20 text-red-300 border-red-500/50", icon: UserX },
};

const ClientDetailModal = ({ 
  open, 
  onOpenChange, 
  client, 
  callNotes,
  onQuoteClick, 
  onCallClick,
  onStatusUpdate,
}: ClientDetailModalProps) => {
  const [status, setStatus] = useState(client.status || 'lead');
  const [notes, setNotes] = useState(client.statusNotes || '');
  const [saveIndicator, setSaveIndicator] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Get session token
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionToken(session?.access_token || null);
    };
    getSession();
  }, []);

  // Reset state when client changes
  useEffect(() => {
    setStatus(client.status || 'lead');
    setNotes(client.statusNotes || '');
    setAiSummary("");
  }, [client]);

  const generateAISummary = async () => {
    if (!sessionToken) {
      setAiSummary("❌ Session expirée, veuillez vous reconnecter.");
      return;
    }

    setIsGeneratingSummary(true);
    setAiSummary("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            type: "generate_client_summary",
            data: {
              client: {
                name: client.name,
                email: client.email,
                phone: client.phone,
                status: status,
                statusNotes: notes,
                firstContact: client.firstContact,
                lastContact: client.lastContact,
              },
              quotes: client.quotes,
              calls: client.calls,
              callNotes: callNotes,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du résumé");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                setAiSummary((prev) => prev + content);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setAiSummary("❌ Erreur lors de la génération du résumé. Veuillez réessayer.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const saveStatus = async (newStatus: string, newNotes: string) => {
    setSaveIndicator("Sauvegarde...");
    
    const { error } = await supabase
      .from('client_statuses')
      .upsert({
        client_email: client.email.toLowerCase(),
        status: newStatus,
        notes: newNotes || null,
      }, {
        onConflict: 'client_email'
      });

    if (!error) {
      setSaveIndicator(`Sauvegardé à ${format(new Date(), "HH:mm")}`);
      onStatusUpdate?.();
    } else {
      setSaveIndicator("Erreur de sauvegarde");
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    saveStatus(newStatus, notes);
  };

  const handleNotesBlur = () => {
    if (notes !== client.statusNotes) {
      saveStatus(status, notes);
    }
  };

  // Build timeline from quotes and calls
  const timeline: TimelineItem[] = [
    ...client.quotes.map(q => ({ 
      type: "quote" as const, 
      date: new Date(q.created_at), 
      data: q 
    })),
    ...client.calls.map(c => ({ 
      type: "call" as const, 
      date: new Date(c.created_at), 
      data: c 
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getStatusBadge = (status: string, type: "quote" | "call") => {
    if (type === "quote") {
      const variants: Record<string, "default" | "secondary" | "destructive"> = {
        pending: "secondary",
        in_progress: "default",
        completed: "default",
        rejected: "destructive",
      };
      const labels: Record<string, string> = {
        pending: "En attente",
        in_progress: "En cours",
        completed: "Terminé",
        rejected: "Rejeté",
      };
      return <Badge variant={variants[status] || "default"} className="text-xs">{labels[status] || status}</Badge>;
    } else {
      const variants: Record<string, "default" | "secondary" | "destructive"> = {
        pending: "secondary",
        confirmed: "default",
        completed: "default",
        cancelled: "destructive",
      };
      const labels: Record<string, string> = {
        pending: "En attente",
        confirmed: "Confirmé",
        completed: "Terminé",
        cancelled: "Annulé",
      };
      return <Badge variant={variants[status] || "default"} className="text-xs">{labels[status] || status}</Badge>;
    }
  };

  const getOutcomeLabel = (outcome: string | null) => {
    const labels: Record<string, string> = {
      interested: "📞 Intéressé",
      converted_to_quote: "✅ Converti",
      not_interested: "❌ Non intéressé",
      no_answer: "📵 Pas de réponse",
      callback_scheduled: "🔄 Rappel",
    };
    return outcome ? labels[outcome] || outcome : null;
  };

  const currentStatusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.lead;
  const StatusIcon = currentStatusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-900 border-blue-500/30 text-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              👤 {client.name}
            </DialogTitle>
            {saveIndicator && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Save className="h-3 w-3" />
                {saveIndicator}
              </span>
            )}
          </div>
          
          {/* Contact info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={`mailto:${client.email}`}
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {client.email}
            </a>
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {client.phone}
              </a>
            )}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-4">
            <Label className="text-gray-300">Statut :</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-blue-500/30 text-white">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    {currentStatusConfig.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-blue-500/30">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Client notes */}
          <div className="space-y-2">
            <Label className="text-gray-300">Notes client</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Notes générales sur ce client..."
              className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 min-h-[80px]"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <div className="bg-slate-800/50 px-3 py-2 rounded-lg flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">{client.quotes.length} devis</span>
            </div>
            <div className="bg-slate-800/50 px-3 py-2 rounded-lg flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-cyan-400" />
              <span className="text-gray-300">{client.calls.length} appels</span>
            </div>
            <div className="bg-slate-800/50 px-3 py-2 rounded-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">
                Premier contact: {format(client.firstContact, "d MMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* AI Summary Section */}
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              Résumé IA
            </h3>
            <Button
              onClick={generateAISummary}
              disabled={isGeneratingSummary}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGeneratingSummary ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Générer un résumé
                </>
              )}
            </Button>
          </div>
          
          {aiSummary && (
            <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4 prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{aiSummary}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Historique des interactions
          </h3>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={`${item.type}-${item.data.id}`}
                  className="relative pl-6 pb-4 border-l-2 border-slate-700 last:border-l-transparent cursor-pointer group"
                  onClick={() => {
                    if (item.type === "quote") {
                      onQuoteClick(item.data as QuoteRequest);
                    } else {
                      onCallClick(item.data as CallBooking);
                    }
                  }}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                    item.type === "quote" 
                      ? "bg-blue-500 border-blue-400" 
                      : "bg-cyan-500 border-cyan-400"
                  }`} />
                  
                  {/* Content card */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.type === "quote" ? (
                          <FileText className="h-4 w-4 text-blue-400" />
                        ) : (
                          <PhoneCall className="h-4 w-4 text-cyan-400" />
                        )}
                        <span className="font-medium text-white">
                          {item.type === "quote" ? "Demande de devis" : "Réservation d'appel"}
                        </span>
                        {getStatusBadge(item.data.status, item.type)}
                      </div>
                      <span className="text-xs text-gray-400">
                        {format(item.date, "d MMM yyyy à HH:mm", { locale: fr })}
                      </span>
                    </div>
                    
                    {item.type === "quote" ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {(item.data as QuoteRequest).services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-blue-400/50 text-blue-200">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        {(item.data as QuoteRequest).budget && (
                          <div className="flex items-center gap-1 text-gray-300">
                            <Euro className="h-3 w-3 text-green-400" />
                            Budget: {(item.data as QuoteRequest).budget}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="h-3 w-3" />
                          {format(new Date((item.data as CallBooking).booking_date), "EEEE d MMMM", { locale: fr })} à {(item.data as CallBooking).time_slot}
                        </div>
                        {callNotes[(item.data as CallBooking).id] && (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-3 w-3 text-green-400" />
                            <span className="text-green-300">
                              {getOutcomeLabel(callNotes[(item.data as CallBooking).id].call_outcome)}
                            </span>
                            {callNotes[(item.data as CallBooking).id].call_summary && (
                              <span className="text-gray-400 truncate max-w-[200px]">
                                - {callNotes[(item.data as CallBooking).id].call_summary}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {timeline.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Aucune interaction enregistrée
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;