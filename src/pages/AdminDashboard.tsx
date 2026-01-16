import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Menu, Bell, Search, Plus, Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportCsv";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { TabLoadingFallback } from "@/components/admin/widgets/TabLoadingFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
const TeamManagement = lazy(() => import("@/pages/admin/TeamManagement"));


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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        .limit(100);

      if (quotesError) {
        console.error("Quotes Error:", quotesError);
        toast.error(`Erreur devis: ${quotesError.message} (${quotesError.code})`);
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("call_bookings")
        .select("id, name, email, phone, booking_date, time_slot, duration, notes, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (bookingsError) {
        console.error("Bookings Error:", bookingsError);
      }

      const { data: statusData } = await supabase
        .from("client_statuses")
        .select("client_email, status, notes, updated_at")
        .limit(200);

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
        fetchData();
        if (payload.eventType === 'INSERT') {
          toast.info("Nouvelle demande de devis reçue !");
        }
      })
      .subscribe();

    const bookingsSubscription = supabase
      .channel('public:call_bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'call_bookings' }, (payload) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-slate-950">
        <AnimatedBackground />
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 relative z-10" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <AnimatedBackground />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userId={userId}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 h-16 flex items-center justify-between">
        <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Nexus Admin</span>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-slate-950 border-r-slate-800 w-72">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              userId={userId}
              onLogout={handleLogout}
              className="border-none"
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-72 relative z-10 h-screen overflow-y-auto pt-16 md:pt-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 px-8 py-6 flex items-center justify-between bg-slate-950/50 backdrop-blur-sm border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeTab === 'clients' && 'Gestion Clients'}
              {activeTab === 'projects' && 'Suivi de Projets'}
              {activeTab === 'invoices' && 'Facturation'}
              {activeTab === 'opportunities' && 'Opportunités (CRM)'}
              {activeTab === 'tasks' && 'Tâches & Organisation'}
              {activeTab === 'ai' && 'Assistant IA Nexus'}
              {activeTab === 'analytics' && 'Analytics & Rapports'}
              {activeTab === 'templates' && 'Templates Emails'}
              {activeTab === 'team' && 'Gestion d\'Équipe'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Panneau d'administration principal.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 rounded-xl border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-all" onClick={handleExport} title="Exporter les données">
              <Download className="w-4 h-4" />
              <span className="ml-2 font-medium">Exporter</span>
            </Button>
            {/* Redundant Bell button removed */}
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
          <Tabs value={activeTab} className="space-y-6">
            {/* TabsList is removed, controlled by Sidebar */}

            <TabsContent value="clients" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <ClientsTab
                    quotes={quotes}
                    callBookings={callBookings}
                    onQuoteClick={() => { }}
                    onCallClick={() => { }}
                    onRefresh={fetchData}
                    initialEmail={emailParam}
                    initialCallId={callIdParam}
                    initialQuoteId={quoteIdParam}
                  />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 animate-in fade-in duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <ProjectsTab />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6 animate-in fade-in duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <InvoicesTab />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-6 animate-in fade-in duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <OpportunitiesTab />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6 animate-in fade-in duration-500 h-[650px] outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <TasksBoard />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6 animate-in fade-in duration-500 outline-none">
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

            <TabsContent value="analytics" className="space-y-6 animate-in fade-in duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <QuoteAnalyticsDashboard />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6 animate-in fade-in duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <EmailTemplatesManager />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="team" className="space-y-6 animate-in fade-in duration-500 outline-none">
              <ErrorBoundary>
                <Suspense fallback={<TabLoadingFallback />}>
                  <TeamManagement />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
