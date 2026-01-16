
import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, PhoneCall, Calendar, Search, Mail, Phone, LayoutGrid, CircleDot, TrendingUp, Briefcase, Archive, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ClientOverviewModal } from "./ClientOverviewModal";
import CallLiveModal from "./modals/CallLiveModal";
import QuoteWizardModal from "./modals/QuoteWizardModal";
import { AllQuotesModal } from "./AllQuotesModal";
import { AllCallsModal } from "./AllCallsModal";
import { toast } from "sonner";
import EmptyState from "./widgets/EmptyState";

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

interface ClientStatus {
  client_email: string;
  status: string;
  notes: string | null;
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
  salesPartnerName?: string | null;
}

interface ClientsTabProps {
  quotes: QuoteRequest[];
  callBookings: CallBooking[];
  onQuoteClick: (quote: QuoteRequest) => void;
  onCallClick: (call: CallBooking) => void;
  onRefresh?: () => void;
  initialEmail?: string | null;
  initialCallId?: string | null;
  initialQuoteId?: string | null;
}

const STATUS_CONFIG = {
  lead: { label: "Lead", color: "bg-blue-500/10 text-blue-300 border-blue-500/30", icon: CircleDot },
  prospect: { label: "Prospect", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30", icon: TrendingUp },
  client: { label: "Client", color: "bg-green-500/10 text-green-300 border-green-500/30", icon: Briefcase },
  lost: { label: "Perdu", color: "bg-red-500/10 text-red-300 border-red-500/30", icon: Archive },
};

const ClientsTab = ({ quotes, callBookings, onQuoteClick, onCallClick, onRefresh, initialEmail, initialCallId, initialQuoteId }: ClientsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [initialViewMode, setInitialViewMode] = useState<'quote' | 'call' | 'db'>('db');
  const [callNotes, setCallNotes] = useState<Record<string, CallBookingNote>>({});
  const [clientStatuses, setClientStatuses] = useState<Record<string, ClientStatus>>({});
  const [salesPartners, setSalesPartners] = useState<Record<string, { first_name: string; last_name: string }>>({});

  // Call Live Modal state
  const [callLiveModalOpen, setCallLiveModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallBooking | null>(null);
  const [relatedQuote, setRelatedQuote] = useState<QuoteRequest | undefined>(undefined);

  // Quote Wizard Modal state
  const [quoteWizardModalOpen, setQuoteWizardModalOpen] = useState(false);
  const [selectedQuoteForWizard, setSelectedQuoteForWizard] = useState<QuoteRequest | null>(null);

  // View All Modals state
  const [showAllQuotesModal, setShowAllQuotesModal] = useState(false);
  const [showAllCallsModal, setShowAllCallsModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", description: "", onConfirm: () => { } });

  // Load call notes and client statuses
  useEffect(() => {
    loadCallNotes();
    loadClientStatuses();
    loadSalesPartners();
  }, []);

  const loadCallNotes = async () => {
    const { data } = await supabase
      .from('call_booking_notes')
      .select('call_booking_id, call_outcome, call_summary');

    if (data) {
      const notesMap: Record<string, CallBookingNote> = {};
      data.forEach(note => {
        notesMap[note.call_booking_id] = note;
      });
      setCallNotes(notesMap);
    }
  };

  const loadClientStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('client_statuses')
        .select('client_email, status, notes');

      if (error) {
        // Log error but don't break the UI - client_statuses table might not exist yet
        console.warn('Could not load client statuses:', error.message);
        return;
      }

      if (data) {
        const statusMap: Record<string, ClientStatus> = {};
        data.forEach(status => {
          statusMap[status.client_email.toLowerCase()] = status;
        });
        setClientStatuses(statusMap);
      }
    } catch (err) {
      console.warn('Error loading client statuses:', err);
    }
  };

  const loadSalesPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_partners')
        .select(`
          id,
          profiles:profiles!sales_partners_profiles_fkey(full_name)
        `);

      if (error) {
        console.warn('Could not load sales partners:', error.message);
        return;
      }

      if (data) {
        const partnersMap: Record<string, { first_name: string; last_name: string }> = {};
        data.forEach((partner: any) => {
          const fullName = partner.profiles?.full_name || '';
          const nameParts = fullName.split(' ');
          partnersMap[partner.id] = {
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || ''
          };
        });
        setSalesPartners(partnersMap);
      }
    } catch (err) {
      console.warn('Error loading sales partners:', err);
    }
  };

  // Group by email to create clients
  const clients = useMemo(() => {
    const clientMap = new Map<string, Client>();

    // Process quotes
    quotes.forEach(quote => {
      const email = quote.email.toLowerCase();
      if (!clientMap.has(email)) {
        clientMap.set(email, {
          email: quote.email,
          name: quote.name,
          phone: quote.phone,
          quotes: [],
          calls: [],
          firstContact: new Date(quote.created_at),
          lastContact: new Date(quote.created_at),
        });
      }
      const client = clientMap.get(email)!;
      client.quotes.push(quote);

      const quoteDate = new Date(quote.created_at);
      if (quoteDate < client.firstContact) client.firstContact = quoteDate;
      if (quoteDate > client.lastContact) client.lastContact = quoteDate;
    });

    // Process call bookings
    callBookings.forEach(call => {
      const email = call.email.toLowerCase();
      if (!clientMap.has(email)) {
        clientMap.set(email, {
          email: call.email,
          name: call.name,
          phone: call.phone,
          quotes: [],
          calls: [],
          firstContact: new Date(call.created_at),
          lastContact: new Date(call.created_at),
        });
      }
      const client = clientMap.get(email)!;
      client.calls.push(call);

      // Update phone if not set
      if (!client.phone && call.phone) {
        client.phone = call.phone;
      }

      const callDate = new Date(call.created_at);
      if (callDate < client.firstContact) client.firstContact = callDate;
      if (callDate > client.lastContact) client.lastContact = callDate;
    });

    // Add statuses and sales partner info to clients
    const clientsArray = Array.from(clientMap.values());
    clientsArray.forEach(client => {
      const statusData = clientStatuses[client.email.toLowerCase()];
      client.status = statusData?.status || 'lead';
      client.statusNotes = statusData?.notes || null;

      // Find sales partner from quote_requests
      const quoteWithSalesPartner = client.quotes.find(q => (q as any).sales_partner_id);
      if (quoteWithSalesPartner) {
        const salesPartnerId = (quoteWithSalesPartner as any).sales_partner_id;
        const partner = salesPartners[salesPartnerId];
        if (partner) {
          client.salesPartnerName = `${partner.first_name} ${partner.last_name}`.trim();
        }
      }
    });

    return clientsArray.sort(
      (a, b) => b.lastContact.getTime() - a.lastContact.getTime()
    );
  }, [quotes, callBookings, clientStatuses, salesPartners]);

  // Filter clients
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term))
    );
  }, [clients, searchTerm]);

  // Stats by status
  const stats = useMemo(() => ({
    totalClients: clients.length,
    leads: clients.filter(c => c.status === 'lead').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
    clientsWon: clients.filter(c => c.status === 'client').length,
    lost: clients.filter(c => c.status === 'lost').length,
  }), [clients]);

  // Auto-open modal when deep linking from notification
  const deepLinkProcessedRef = useRef(false);

  useEffect(() => {
    if (initialEmail && clients.length > 0 && !deepLinkProcessedRef.current) {
      const client = clients.find(c => c.email.toLowerCase() === initialEmail.toLowerCase());

      if (client) {
        deepLinkProcessedRef.current = true;

        // Close all potentially open modals first to prevent stacking
        setQuoteWizardModalOpen(false);
        setCallLiveModalOpen(false);
        setIsSheetOpen(false);
        setShowAllQuotesModal(false);
        setShowAllCallsModal(false);

        // Small delay to ensure modals are closed before opening new one
        setTimeout(() => {
          if (initialCallId) {
            // Find the specific call
            const call = client.calls.find(c => c.id === initialCallId);
            if (call) {
              handleCallRowClick(call);
            }
          } else if (initialQuoteId) {
            // Find the specific quote
            const quote = client.quotes.find(q => q.id === initialQuoteId);
            if (quote) {
              handleQuoteRowClick(quote);
            }
          } else {
            // Just open the client overview if no specific ID
            handleClientClick(client);
          }
        }, 100);
      }
    }
  }, [initialEmail, initialCallId, initialQuoteId, clients]);


  const handleClientClick = (client: Client) => {
    setInitialViewMode('db');
    setSelectedClient(client);
    setIsSheetOpen(true);
  };

  const handleQuoteFromSheet = (quote: QuoteRequest) => {
    setIsSheetOpen(false);
    onQuoteClick(quote);
  };

  const handleCallFromSheet = (call: CallBooking) => {
    setIsSheetOpen(false);
    onCallClick(call);
  };

  const handleStatusUpdate = () => {
    loadClientStatuses();
  };

  const handleQuoteRowClick = (quote: QuoteRequest) => {
    const client = clients.find(c => c.email.toLowerCase() === quote.email.toLowerCase());
    if (client) {
      setSelectedQuoteForWizard(quote);
      setSelectedClient(client);
      setQuoteWizardModalOpen(true);
    }
  };

  const handleCallRowClick = (call: CallBooking) => {
    const client = clients.find(c => c.email.toLowerCase() === call.email.toLowerCase());
    if (client) {
      // Find related quote for context
      const quote = quotes.find(q => q.email.toLowerCase() === call.email.toLowerCase());

      setSelectedClient(client);
      setSelectedCall(call);
      setRelatedQuote(quote);
      setCallLiveModalOpen(true);
    }
  };

  const handleDeleteQuote = async (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setConfirmDialog({
      isOpen: true,
      title: "Supprimer le devis",
      description: "Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('quote_requests')
            .delete()
            .eq('id', quoteId);

          if (error) throw error;

          toast.success("Devis supprimé avec succès");

          // Refresh data after successful deletion
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error('Error deleting quote:', error);
          toast.error("Erreur lors de la suppression du devis");
        }
      },
    });
  };

  const handleDeleteCall = async (callId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setConfirmDialog({
      isOpen: true,
      title: "Supprimer l'appel",
      description: "Êtes-vous sûr de vouloir supprimer cet appel ? Cette action est irréversible.",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('call_bookings')
            .delete()
            .eq('id', callId);

          if (error) throw error;

          toast.success("Appel supprimé avec succès");

          // Refresh data after successful deletion
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error('Error deleting call:', error);
          toast.error("Erreur lors de la suppression de l'appel");
        }
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.lead;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {selectedClient && (
        <ClientOverviewModal
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          client={selectedClient}
          quotes={quotes}
          bookings={callBookings}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {selectedClient && selectedCall && (
        <CallLiveModal
          open={callLiveModalOpen}
          onOpenChange={setCallLiveModalOpen}
          call={selectedCall}
          client={selectedClient}
          relatedQuote={relatedQuote}
          onSuccess={() => {
            loadCallNotes();
          }}
        />
      )}

      {selectedClient && selectedQuoteForWizard && (
        <QuoteWizardModal
          open={quoteWizardModalOpen}
          onOpenChange={setQuoteWizardModalOpen}
          quote={selectedQuoteForWizard}
          client={selectedClient}
          onSuccess={() => {
            // Refresh quotes/clients if needed
          }}
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Devis en Attente */}
        {/* Devis en Attente */}
        <Card className="bg-slate-900 border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="h-4 w-4 text-yellow-500" />
                Devis en Attente ({quotes.filter(q => (q.status || 'pending').toLowerCase() === 'pending').length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllQuotesModal(true)}
                className="h-7 px-3 text-xs text-slate-400 hover:text-white"
              >
                Voir tout →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader className="bg-slate-950/50 sticky top-0 z-10">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Client</TableHead>
                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Projet</TableHead>
                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.filter(q => (q.status || 'pending').toLowerCase() === 'pending').slice(0, 5).length === 0 ? (
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableCell colSpan={3} className="py-12">
                        <EmptyState
                          icon="📋"
                          message="Aucun devis en attente"
                          description="Les nouvelles demandes de devis apparaîtront ici"
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotes.filter(q => (q.status || 'pending').toLowerCase() === 'pending').slice(0, 5).map((quote) => (
                      <TableRow
                        key={quote.id}
                        className="border-white/5 hover:bg-yellow-500/5 transition-colors group"
                      >
                        <TableCell className="py-2">
                          <div className="font-medium text-white text-sm">{quote.name}</div>
                          <div className="text-xs text-gray-500">{format(new Date(quote.created_at), "d MMM HH:mm", { locale: fr })}</div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {quote.services.slice(0, 1).map((s: string) => (
                              <Badge key={s} variant="outline" className="text-[10px] px-1 py-0 h-4 border-yellow-500/30 text-yellow-200 bg-yellow-950/30">
                                {s}
                              </Badge>
                            ))}
                            {quote.services.length > 1 && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-white/10 text-gray-400">
                                +{quote.services.length - 1}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuoteRowClick(quote);
                              }}
                              className="h-6 px-2 text-[10px] font-mono uppercase bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 border border-yellow-500/20"
                            >
                              Traiter
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteQuote(quote.id, e)}
                              className="h-6 px-2 text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Appels à Venir */}
        {/* Appels à Venir */}
        <Card className="bg-slate-900 border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-blue-500" />
                Appels en Attente ({callBookings.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCallsModal(true)}
                className="h-7 px-3 text-xs text-slate-400 hover:text-white"
              >
                Voir tout →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader className="bg-slate-950/50 sticky top-0 z-10">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Contact</TableHead>
                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Horaire</TableHead>
                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callBookings.slice(0, 5).length === 0 ? (
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableCell colSpan={3} className="py-12">
                        <EmptyState
                          icon="📞"
                          message="Aucun appel prévu"
                          description="Les appels à venir seront affichés ici"
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    callBookings
                      .slice(0, 5)
                      .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
                      .map((call) => (
                        <TableRow
                          key={call.id}
                          className="border-white/5 hover:bg-blue-500/5 transition-colors cursor-pointer group"
                          onClick={() => handleCallRowClick(call)}
                        >
                          <TableCell className="py-2">
                            <div className="font-medium text-white text-sm">{call.name}</div>
                            <div className="text-xs text-blue-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {call.phone}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="text-xs text-white bg-slate-800/50 px-2 py-1 rounded border border-white/5 inline-block">
                              {format(new Date(call.booking_date), "d MMM", { locale: fr })} • {call.time_slot}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 border border-blue-500/20"
                              >
                                Voir
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCall(call.id, e);
                                }}
                                className="h-6 px-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div >




      {/* DATABASE SECTION */}
      < div className="space-y-4 pt-4 border-t border-white/5" >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Archive className="h-4 w-4" /> Base de Données Clients
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-xs bg-slate-950/30 border-white/10 text-gray-300 placeholder:text-gray-700 focus:border-blue-500/30"
            />
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-sm">
          <CardContent className="p-0">
            {/* Original Table Content reused but simplified style */}
            <Table>
              <TableHeader className="bg-slate-950/30">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Client</TableHead>
                  <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Contact</TableHead>
                  <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Apporteur</TableHead>
                  <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Statut</TableHead>
                  <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Dossiers</TableHead>
                  <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8 text-right">Dernière maj</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow
                    key={client.email}
                    className="border-white/5 cursor-pointer hover:bg-white/5 transition-all duration-200 group"
                    onClick={() => handleClientClick(client)}
                  >
                    <TableCell className="py-2">
                      <div className="font-medium text-gray-300 text-sm group-hover:text-white transition-colors">
                        {client.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">{client.email}</div>
                    </TableCell>
                    <TableCell className="py-2">
                      {client.salesPartnerName ? (
                        <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-300 bg-blue-950/30">
                          👤 {client.salesPartnerName}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-gray-500/30 text-gray-400 bg-gray-950/30">
                          Direct
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      {getStatusBadge(client.status || 'lead')}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex gap-2">
                        {(client.quotes.length > 0 || client.calls.length > 0) ? (
                          <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400 bg-slate-900/50">
                            {client.quotes.length + client.calls.length} items
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-gray-700">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <div className="text-[10px] text-gray-600 font-mono">
                        {format(client.lastContact, "d MMM", { locale: fr })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div >

      {/* View All Modals */}
      < AllQuotesModal
        isOpen={showAllQuotesModal}
        onClose={() => setShowAllQuotesModal(false)}
        quotes={quotes.filter(q => (q.status || 'pending').toLowerCase() === 'pending')}
        onQuoteClick={(quote) => {
          setShowAllQuotesModal(false);
          handleQuoteRowClick(quote);
        }}
      />

      < AllCallsModal
        isOpen={showAllCallsModal}
        onClose={() => setShowAllCallsModal(false)}
        calls={callBookings}
        onCallClick={(call) => {
          setShowAllCallsModal(false);
          handleCallRowClick(call);
        }}
      />

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
    </div >
  );
};

export default ClientsTab;
