import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { LogOut, Loader2, Mail, Phone, Calendar, Euro, Clock, FileText, PhoneCall, MessageSquare, Users, Trash2, Bot, Search, Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ClientContactModal from "@/components/admin/ClientContactModal";
import CallBookingNotesModal from "@/components/admin/CallBookingNotesModal";
import ClientsTab from "@/components/admin/ClientsTab";
import AIAssistantPanel from "@/components/admin/AIAssistantPanel";
import { exportToCSV } from "@/lib/exportCsv";

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

const AdminDashboard = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteRequest[]>([]);
  const [callBookings, setCallBookings] = useState<CallBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<CallBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CallBooking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingNotesMap, setBookingNotesMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("quotes");
  const [deleteQuoteId, setDeleteQuoteId] = useState<{id: string, email: string} | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<CallBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clientStatuses, setClientStatuses] = useState<{client_email: string; status: string; notes: string | null; updated_at: string | null}[]>([]);
  const [quoteSearchTerm, setQuoteSearchTerm] = useState("");
  const [bookingSearchTerm, setBookingSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadQuotes();
    loadCallBookings();
    loadClientStatuses();

    // Subscribe to realtime updates for quotes
    const quotesChannel = supabase
      .channel('quote_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests'
        },
        () => {
          loadQuotes();
        }
      )
      .subscribe();

    // Subscribe to realtime updates for call bookings
    const bookingsChannel = supabase
      .channel('call_bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_bookings'
        },
        () => {
          loadCallBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [quotes, statusFilter, quoteSearchTerm]);

  useEffect(() => {
    filterBookings();
  }, [callBookings, bookingStatusFilter, bookingSearchTerm]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast.error("Accès non autorisé");
      await supabase.auth.signOut();
      navigate('/');
      return;
    }

    setIsAdmin(true);
  };

  const loadQuotes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des demandes");
      console.error(error);
    } else {
      setQuotes(data || []);
    }
    setIsLoading(false);
  };

  const loadCallBookings = async () => {
    const { data, error } = await supabase
      .from('call_bookings')
      .select('*')
      .order('booking_date', { ascending: true });

    if (error) {
      toast.error("Erreur lors du chargement des réservations");
      console.error(error);
    } else {
      setCallBookings(data || []);
      
      // Load which bookings have notes
      const { data: notesData } = await supabase
        .from('call_booking_notes')
        .select('call_booking_id');
      
      if (notesData) {
        const notesMap: Record<string, boolean> = {};
        notesData.forEach(note => {
          notesMap[note.call_booking_id] = true;
        });
        setBookingNotesMap(notesMap);
      }
    }
  };

  const loadClientStatuses = async () => {
    const { data, error } = await supabase
      .from('client_statuses')
      .select('client_email, status, notes, updated_at');

    if (error) {
      console.error(error);
    } else {
      setClientStatuses(data || []);
    }
  };

  const filterQuotes = () => {
    let filtered = quotes;
    if (statusFilter !== "all") {
      filtered = filtered.filter(q => q.status === statusFilter);
    }
    if (quoteSearchTerm) {
      const term = quoteSearchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.name.toLowerCase().includes(term) ||
        q.email.toLowerCase().includes(term) ||
        q.phone?.toLowerCase().includes(term) ||
        q.business_type?.toLowerCase().includes(term)
      );
    }
    setFilteredQuotes(filtered);
  };

  const filterBookings = () => {
    let filtered = callBookings;
    if (bookingStatusFilter !== "all") {
      filtered = filtered.filter(b => b.status === bookingStatusFilter);
    }
    if (bookingSearchTerm) {
      const term = bookingSearchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.phone.toLowerCase().includes(term)
      );
    }
    setFilteredBookings(filtered);
  };

  const exportQuotesToCSV = () => {
    exportToCSV(filteredQuotes, 'devis', [
      { key: 'created_at', label: 'Date' },
      { key: 'name', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'business_type', label: 'Activité' },
      { key: 'services', label: 'Services' },
      { key: 'budget', label: 'Budget' },
      { key: 'timeline', label: 'Délai' },
      { key: 'status', label: 'Statut' },
      { key: 'project_details', label: 'Détails' },
    ]);
    toast.success(`${filteredQuotes.length} devis exportés`);
  };

  const exportBookingsToCSV = () => {
    exportToCSV(filteredBookings, 'reservations', [
      { key: 'booking_date', label: 'Date RDV' },
      { key: 'time_slot', label: 'Heure' },
      { key: 'duration', label: 'Durée (min)' },
      { key: 'name', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'status', label: 'Statut' },
      { key: 'notes', label: 'Notes' },
    ]);
    toast.success(`${filteredBookings.length} réservations exportées`);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('quote_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } else {
      toast.success("Statut mis à jour");
      loadQuotes();
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('call_bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } else {
      toast.success("Statut mis à jour");
      loadCallBookings();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Cleanup orphaned client (remove from client_statuses if no more interactions)
  const cleanupOrphanedClient = async (email: string) => {
    const { count: quotesCount } = await supabase
      .from('quote_requests')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    const { count: callsCount } = await supabase
      .from('call_bookings')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    if ((quotesCount || 0) === 0 && (callsCount || 0) === 0) {
      await supabase
        .from('client_statuses')
        .delete()
        .eq('client_email', email);
    }
  };

  const deleteQuote = async (id: string, email: string) => {
    setIsDeleting(true);
    
    // First delete associated client_call_notes
    await supabase
      .from('client_call_notes')
      .delete()
      .eq('quote_request_id', id);

    // Then delete the quote
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    } else {
      toast.success("Devis supprimé");
      await cleanupOrphanedClient(email);
      loadQuotes();
    }
    
    setIsDeleting(false);
    setDeleteQuoteId(null);
  };

  const deleteBooking = async (booking: CallBooking) => {
    setIsDeleting(true);
    
    try {
      // Send cancellation emails first
      const { error: emailError } = await supabase.functions.invoke('cancel-call-booking', {
        body: {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          booking_date: booking.booking_date,
          time_slot: booking.time_slot,
          duration: booking.duration
        }
      });
      
      if (emailError) {
        console.error("Email error:", emailError);
        // Continue with deletion even if email fails
      }
      
      // Delete associated notes
      await supabase
        .from('call_booking_notes')
        .delete()
        .eq('call_booking_id', booking.id);

      // Delete the booking
      const { error } = await supabase
        .from('call_bookings')
        .delete()
        .eq('id', booking.id);

      if (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      } else {
        toast.success("Réservation annulée et emails envoyés");
        await cleanupOrphanedClient(booking.email);
        loadCallBookings();
      }
    } catch (error) {
      console.error("Error during booking deletion:", error);
      toast.error("Erreur lors de l'annulation");
    }
    
    setIsDeleting(false);
    setDeleteBookingId(null);
  };

  const getStatusBadge = (status: string) => {
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

    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  const getBookingStatusBadge = (status: string) => {
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

    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  const getQuoteStats = () => {
    return {
      total: quotes.length,
      pending: quotes.filter(q => q.status === 'pending').length,
      in_progress: quotes.filter(q => q.status === 'in_progress').length,
      completed: quotes.filter(q => q.status === 'completed').length,
    };
  };

  const getBookingStats = () => {
    return {
      total: callBookings.length,
      pending: callBookings.filter(b => b.status === 'pending').length,
      confirmed: callBookings.filter(b => b.status === 'confirmed').length,
      completed: callBookings.filter(b => b.status === 'completed').length,
    };
  };

  const getDurationLabel = (duration: number) => {
    if (duration === 15) return "15 min";
    if (duration === 30) return "30 min";
    if (duration === 60) return "1 heure";
    return `${duration} min`;
  };

  const quoteStats = getQuoteStats();
  const bookingStats = getBookingStats();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white border-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-slate-800/50 border border-blue-500/30">
            <TabsTrigger value="quotes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">
              <FileText className="mr-2 h-4 w-4" />
              Devis
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">
              <PhoneCall className="mr-2 h-4 w-4" />
              Appels
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">
              <Users className="mr-2 h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">
              <Bot className="mr-2 h-4 w-4" />
              Assistant IA
            </TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            {/* Quote Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Total devis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{quoteStats.total}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">{quoteStats.pending}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">En cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{quoteStats.in_progress}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Terminés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{quoteStats.completed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quote Filters */}
            <Card className="bg-slate-900/80 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher (nom, email, téléphone, activité)..."
                      value={quoteSearchTerm}
                      onChange={(e) => setQuoteSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px] bg-slate-800/50 border-blue-500/30 text-white">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={exportQuotesToCSV}
                    variant="outline"
                    className="bg-slate-800/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quotes Table */}
            <Card className="bg-slate-900/80 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Demandes de devis ({filteredQuotes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Client</TableHead>
                        <TableHead className="text-gray-300">Services</TableHead>
                        <TableHead className="text-gray-300">Budget</TableHead>
                        <TableHead className="text-gray-300">Délai</TableHead>
                        <TableHead className="text-gray-300">Statut</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuotes.map((quote) => (
                        <TableRow 
                          key={quote.id} 
                          className="border-slate-700 cursor-pointer hover:bg-blue-500/5 transition-colors"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setIsModalOpen(true);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2 text-white">
                              <Calendar className="h-4 w-4 text-blue-400" />
                              {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-white text-base">{quote.name}</div>
                              <div className="flex items-center gap-1 text-sm text-gray-200">
                                <Mail className="h-3 w-3" />
                                {quote.email}
                              </div>
                              {quote.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-200">
                                  <Phone className="h-3 w-3" />
                                  {quote.phone}
                                </div>
                              )}
                              {quote.business_type && (
                                <div className="text-sm text-blue-300">
                                  {quote.business_type}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {quote.services.map((service, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-blue-400 text-blue-200 bg-blue-950/50">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {quote.budget && (
                              <div className="flex items-center gap-1 text-white font-medium">
                                <Euro className="h-4 w-4 text-green-400" />
                                {quote.budget}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {quote.timeline && (
                              <div className="flex items-center gap-1 text-white font-medium">
                                <Clock className="h-4 w-4 text-orange-400" />
                                {quote.timeline}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <Select
                                value={quote.status}
                                onValueChange={(value) => updateStatus(quote.id, value)}
                              >
                                <SelectTrigger className="w-[130px] bg-slate-800/50 border-blue-500/30 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="in_progress">En cours</SelectItem>
                                  <SelectItem value="completed">Terminé</SelectItem>
                                  <SelectItem value="rejected">Rejeté</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => setDeleteQuoteId({ id: quote.id, email: quote.email })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Booking Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Total appels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{bookingStats.total}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">{bookingStats.pending}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Confirmés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{bookingStats.confirmed}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/80 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">Terminés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{bookingStats.completed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Filters */}
            <Card className="bg-slate-900/80 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher (nom, email, téléphone)..."
                      value={bookingSearchTerm}
                      onChange={(e) => setBookingSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
                    <SelectTrigger className="w-[200px] bg-slate-800/50 border-blue-500/30 text-white">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={exportBookingsToCSV}
                    variant="outline"
                    className="bg-slate-800/50 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card className="bg-slate-900/80 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Réservations d'appels ({filteredBookings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">Date RDV</TableHead>
                      <TableHead className="text-gray-300">Heure</TableHead>
                      <TableHead className="text-gray-300">Durée</TableHead>
                      <TableHead className="text-gray-300">Client</TableHead>
                      <TableHead className="text-gray-300">Notes</TableHead>
                      <TableHead className="text-gray-300">Statut</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow 
                        key={booking.id} 
                        className="border-slate-700 cursor-pointer hover:bg-blue-500/5 transition-colors"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsBookingModalOpen(true);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2 text-white">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            {new Date(booking.booking_date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-white font-medium">
                            <Clock className="h-4 w-4 text-cyan-400" />
                            {booking.time_slot}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-400 text-blue-200 bg-blue-950/50">
                            {getDurationLabel(booking.duration)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-white flex items-center gap-2">
                              {booking.name}
                              {bookingNotesMap[booking.id] && (
                                <MessageSquare className="h-4 w-4 text-green-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-200">
                              <Mail className="h-3 w-3" />
                              {booking.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-200">
                              <Phone className="h-3 w-3" />
                              {booking.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] text-sm text-gray-300 truncate">
                            {booking.notes || "-"}
                          </div>
                        </TableCell>
                        <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Select
                              value={booking.status}
                              onValueChange={(value) => updateBookingStatus(booking.id, value)}
                            >
                              <SelectTrigger className="w-[130px] bg-slate-800/50 border-blue-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="confirmed">Confirmé</SelectItem>
                                <SelectItem value="completed">Terminé</SelectItem>
                                <SelectItem value="cancelled">Annulé</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => setDeleteBookingId(booking)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <ClientsTab
              quotes={quotes}
              callBookings={callBookings}
              onQuoteClick={(quote) => {
                setSelectedQuote(quote);
                setIsModalOpen(true);
              }}
              onCallClick={(call) => {
                setSelectedBooking(call);
                setIsBookingModalOpen(true);
              }}
            />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="space-y-6">
            <AIAssistantPanel
              quotes={quotes}
              callBookings={callBookings}
              clientStatuses={clientStatuses}
            />
          </TabsContent>
        </Tabs>

        {selectedQuote && (
          <ClientContactModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            quoteRequest={selectedQuote}
          />
        )}

        {selectedBooking && (
          <CallBookingNotesModal
            open={isBookingModalOpen}
            onOpenChange={(open) => {
              setIsBookingModalOpen(open);
              if (!open) {
                loadCallBookings(); // Refresh to update notes indicator
              }
            }}
            booking={selectedBooking}
          />
        )}

        {/* Delete Quote Confirmation */}
        <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
          <AlertDialogContent className="bg-slate-900 border-blue-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Supprimer ce devis ?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Cette action est irréversible. Le devis et toutes les notes associées seront supprimés.
                {deleteQuoteId && " Si c'est la dernière interaction du client, il sera également retiré de la liste des clients."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteQuoteId && deleteQuote(deleteQuoteId.id, deleteQuoteId.email)}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Booking Confirmation */}
        <AlertDialog open={!!deleteBookingId} onOpenChange={() => setDeleteBookingId(null)}>
          <AlertDialogContent className="bg-slate-900 border-blue-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Supprimer cette réservation ?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Cette action est irréversible. La réservation et toutes les notes associées seront supprimées.
                {deleteBookingId && " Si c'est la dernière interaction du client, il sera également retiré de la liste des clients."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteBookingId && deleteBooking(deleteBookingId)}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminDashboard;