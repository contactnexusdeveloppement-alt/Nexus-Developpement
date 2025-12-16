import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Users, FileText, PhoneCall, Calendar, Search, Mail, Phone, UserCheck, UserX, UserPlus, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ClientDetailModal from "./ClientDetailModal";

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
}

interface ClientsTabProps {
  quotes: QuoteRequest[];
  callBookings: CallBooking[];
  onQuoteClick: (quote: QuoteRequest) => void;
  onCallClick: (call: CallBooking) => void;
}

const STATUS_CONFIG = {
  lead: { label: "Lead", color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: UserPlus },
  prospect: { label: "Prospect", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: Target },
  client: { label: "Client", color: "bg-green-500/20 text-green-300 border-green-500/50", icon: UserCheck },
  lost: { label: "Perdu", color: "bg-red-500/20 text-red-300 border-red-500/50", icon: UserX },
};

const ClientsTab = ({ quotes, callBookings, onQuoteClick, onCallClick }: ClientsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callNotes, setCallNotes] = useState<Record<string, CallBookingNote>>({});
  const [clientStatuses, setClientStatuses] = useState<Record<string, ClientStatus>>({});

  // Load call notes and client statuses
  useEffect(() => {
    loadCallNotes();
    loadClientStatuses();
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
    const { data } = await supabase
      .from('client_statuses')
      .select('client_email, status, notes');
    
    if (data) {
      const statusMap: Record<string, ClientStatus> = {};
      data.forEach(status => {
        statusMap[status.client_email.toLowerCase()] = status;
      });
      setClientStatuses(statusMap);
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

    // Add statuses to clients
    const clientsArray = Array.from(clientMap.values());
    clientsArray.forEach(client => {
      const statusData = clientStatuses[client.email.toLowerCase()];
      client.status = statusData?.status || 'lead';
      client.statusNotes = statusData?.notes || null;
    });

    return clientsArray.sort(
      (a, b) => b.lastContact.getTime() - a.lastContact.getTime()
    );
  }, [quotes, callBookings, clientStatuses]);

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

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleQuoteFromModal = (quote: QuoteRequest) => {
    setIsModalOpen(false);
    onQuoteClick(quote);
  };

  const handleCallFromModal = (call: CallBooking) => {
    setIsModalOpen(false);
    onCallClick(call);
  };

  const handleStatusUpdate = () => {
    loadClientStatuses();
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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-400" />
              {stats.totalClients}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-1">
              <UserPlus className="h-4 w-4 text-blue-400" /> Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{stats.leads}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-1">
              <Target className="h-4 w-4 text-yellow-400" /> Prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{stats.prospects}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-1">
              <UserCheck className="h-4 w-4 text-green-400" /> Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.clientsWon}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-1">
              <UserX className="h-4 w-4 text-red-400" /> Perdus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{stats.lost}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-slate-900/80 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white">Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="bg-slate-900/80 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white">Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Contact</TableHead>
                <TableHead className="text-gray-300">Statut</TableHead>
                <TableHead className="text-gray-300">Interactions</TableHead>
                <TableHead className="text-gray-300">Dernier contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.email}
                  className="border-slate-700 cursor-pointer hover:bg-blue-500/5 transition-colors"
                  onClick={() => handleClientClick(client)}
                >
                  <TableCell>
                    <div className="font-medium text-white text-base">{client.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-200">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-200">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(client.status || 'lead')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {client.quotes.length > 0 && (
                        <Badge variant="outline" className="border-blue-400 text-blue-200 bg-blue-950/50">
                          <FileText className="h-3 w-3 mr-1" />
                          {client.quotes.length} devis
                        </Badge>
                      )}
                      {client.calls.length > 0 && (
                        <Badge variant="outline" className="border-cyan-400 text-cyan-200 bg-cyan-950/50">
                          <PhoneCall className="h-3 w-3 mr-1" />
                          {client.calls.length} appels
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      {format(client.lastContact, "d MMM yyyy", { locale: fr })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          client={selectedClient}
          callNotes={callNotes}
          onQuoteClick={handleQuoteFromModal}
          onCallClick={handleCallFromModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default ClientsTab;