import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Briefcase, FileText, Target, ClipboardList, Bot, TrendingUp, Mail, Download, LogOut, } from "lucide-react";
import { exportToCSV } from "@/lib/exportCsv";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { TabLoadingFallback } from "@/components/admin/widgets/TabLoadingFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load all tabs for better performance
const ClientsTab = lazy(() => import("@/components/admin/ClientsTab"));
const KanbanBoard = lazy(() => import("@/components/admin/KanbanBoard"));
const TasksBoard = lazy(() => import("@/components/admin/TasksBoard"));
const AIAssistantPanel = lazy(() => import("@/components/admin/AIAssistantPanel"));
const ProjectsTab = lazy(() => import("@/components/admin/ProjectsTab"));
const InvoicesTab = lazy(() => import("@/components/admin/InvoicesTab"));
const OpportunitiesTab = lazy(() => import("@/components/admin/crm/OpportunitiesTab"));
const QuoteAnalyticsDashboard = lazy(() => import("@/components/admin/QuoteAnalyticsDashboard").then(m => ({ default: m.QuoteAnalyticsDashboard })));
const EmailTemplatesManager = lazy(() => import("@/components/admin/EmailTemplatesManager"));


// Types
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

interface ClientStatus {
  client_email: string;
  status: string;
  notes: string | null;
  updated_at: string | null;
}

const AdminDashboard = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [callBookings, setCallBookings] = useState<any[]>([]);
  const [clientStatuses, setClientStatuses] = useState<any[]>([]);
  const [callNotes, setCallNotes] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read URL parameters for deep linking
  const activeTabFromUrl = searchParams.get('tab');
  const emailParam = searchParams.get('email');
  const callIdParam = searchParams.get('callId');
  const quoteIdParam = searchParams.get('quoteId');

  // Control active tab
  const [activeTab, setActiveTab] = useState(activeTabFromUrl || 'clients');

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/nx-panel-8f4a');
    }
  };

  // Initial Data Fetch
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from("quote_requests")
        .select("id, name, email, phone, business_type, services, project_details, budget, timeline, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100); // Load first 100 quotes for better performance

      if (quotesError) {
        console.error("Quotes Error:", quotesError);
        toast.error(`Erreur devis: ${quotesError.message} (${quotesError.code})`);
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("call_bookings")
        .select("id, name, email, phone, booking_date, time_slot, duration, notes, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100); // Load first 100 bookings for better performance

      if (bookingsError) {
        console.error("Bookings Error:", bookingsError);
      }

      const { data: statusData } = await supabase
        .from("client_statuses")
        .select("client_email, status, notes, updated_at")
        .limit(200); // Status data is smaller, allow more entries

      const { data: notesData } = await supabase
        .from('call_booking_notes')
        .select('*');

      if (quotesData) setQuotes(quotesData);
      if (bookingsData) setCallBookings(bookingsData);
      if (statusData) setClientStatuses(statusData);
      if (notesData) {
        const notesMap: any = {};
        notesData.forEach((n: any) => notesMap[n.call_booking_id] = n);
        setCallNotes(notesMap);
      }

    } catch (e) {
      console.error("Load Error", e);
      toast.error("Erreur inattendue lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchData();

    // Realtime Subscriptions
    const quotesSubscription = supabase
      .channel('public:quote_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, (payload) => {
        console.log('Realtime quote update:', payload);
        fetchData(); // Simplest strategy: re-fetch to ensure consistency. Could be optimized later.
        if (payload.eventType === 'INSERT') {
          toast.info("Nouvelle demande de devis reçue !");
        }
      })
      .subscribe();

    const bookingsSubscription = supabase
      .channel('public:call_bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'call_bookings' }, (payload) => {
        console.log('Realtime booking update:', payload);
        fetchData();
        if (payload.eventType === 'INSERT') {
          toast.info("Nouvel appel réservé !");
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(quotesSubscription);
      supabase.removeChannel(bookingsSubscription);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleExport = () => {
    const columns = [
      { key: "created_at", label: "Date" },
      { key: "status", label: "Statut" },
      { key: "name", label: "Nom" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Téléphone" },
      { key: "business_type", label: "Activité" },
      { key: "services", label: "Services" },
      { key: "budget", label: "Budget" }
    ];
    exportToCSV(quotes, "export-quotes", columns);
    toast.success("Export téléchargé");
  };

  // Pre-calculate clients for Kanban to avoid prop drilling complex logic
  const clients = useMemo(() => {
    const clientMap = new Map<string, any>();

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

    // Process calls
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
      if (!client.phone && call.phone) client.phone = call.phone;
      const callDate = new Date(call.created_at);
      if (callDate < client.firstContact) client.firstContact = callDate;
      if (callDate > client.lastContact) client.lastContact = callDate;
    });

    // Add statuses
    const clientsArray = Array.from(clientMap.values());
    clientsArray.forEach(client => {
      const statusData = clientStatuses.find((s: any) => s.client_email.toLowerCase() === client.email.toLowerCase());
      client.status = statusData?.status || 'lead';
    });

    return clientsArray;
  }, [quotes, callBookings, clientStatuses]);


  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || "");
    });
  }, []);

  return (
    <div className="min-h-screen relative bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 filter drop-shadow-sm">
              Nexus Developpement
            </h1>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            <NotificationCenter />
            <button
              onClick={handleExport}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-full transition-colors border border-white/10 hover:border-white/20"
              aria-label="Exporter les données"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-full transition-colors border border-transparent hover:border-red-500/50"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Tableau de bord</h2>
            <TabsList className="bg-slate-900/50 border border-white/10 w-full md:w-auto flex-wrap">

              <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap">
                <Users className="w-4 h-4 mr-2" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-green-600 data-[state=active]:text-white whitespace-nowrap">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Projets</span>
                <span className="sm:hidden">Proj</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Factures</span>
                <span className="sm:hidden">Fact</span>
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white whitespace-nowrap">
                <Target className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Opportunités</span>
                <span className="lg:hidden">Opp</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white whitespace-nowrap">
                <ClipboardList className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Tâches</span>
                <span className="lg:hidden">Tâch</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white whitespace-nowrap">
                <Bot className="w-4 h-4 mr-2" />
                <span className="hidden xl:inline">Assistant IA</span>
                <span className="xl:hidden">IA</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white whitespace-nowrap">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="hidden xl:inline">Analytics</span>
                <span className="xl:hidden">Ana</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white whitespace-nowrap">
                <Mail className="w-4 h-4 mr-2" />
                <span className="hidden xl:inline">Templates</span>
                <span className="xl:hidden">Tpl</span>
              </TabsTrigger>
            </TabsList>
          </div>



          <TabsContent value="clients" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <ClientsTab
                  quotes={quotes}
                  callBookings={callBookings}
                  onQuoteClick={(q) => console.log("Quote clicked", q)}
                  onCallClick={(c) => console.log("Call clicked", c)}
                  onRefresh={fetchData}
                  initialEmail={emailParam}
                  initialCallId={callIdParam}
                  initialQuoteId={quoteIdParam}
                />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 animate-in fade-in duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <ProjectsTab />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6 animate-in fade-in duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <InvoicesTab />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6 animate-in fade-in duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <OpportunitiesTab />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 animate-in fade-in duration-500 h-[650px]">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <TasksBoard />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6 animate-in fade-in duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <AIAssistantPanel
                  quotes={quotes}
                  callBookings={callBookings}
                  clientStatuses={clientStatuses}
                />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-in fade-in duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <QuoteAnalyticsDashboard />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 animate-in fade-in duration-500">
            <ErrorBoundary>
              <Suspense fallback={<TabLoadingFallback />}>
                <EmailTemplatesManager />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default AdminDashboard;
