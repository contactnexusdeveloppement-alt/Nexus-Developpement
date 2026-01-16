import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users, FileText, CheckCircle, Loader2,
    BookOpen, Plus, ArrowUpRight, Euro, Menu, Bell, TrendingUp, Trash2, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

// New Components
import DashboardSidebar from '@/components/sales/DashboardSidebar';
import StatsCard from '@/components/sales/StatsCard';
import QuotesList from '@/components/sales/QuotesList';

// Lazy load the content components
const QuoteGeneratorContent = lazy(() => import('./QuoteGenerator'));
const ProspectsListContent = lazy(() => import('./ProspectsList'));
const TrainingResourcesContent = lazy(() => import('./TrainingResources'));

interface DashboardStats {
    prospectsCount: number;
    quotesCount: number;
    quotesAccepted: number;
    totalCommission: number;
    pendingCommission: number;
}

interface RecentQuote {
    id: string;
    quote_number: string;
    client_name: string;
    client_email: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface SignedQuote {
    id: string;
    client_name: string;
    total_amount: number;
    commission_earned: number;
    signed_at: string;
}

const LoadingSpinner = () => (
    <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
);

const TabContent = ({ children, id }: { children: React.ReactNode; id: string }) => (
    <motion.div
        key={id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-8"
        layout="position"
    >
        {children}
    </motion.div>
);

const SalesDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        prospectsCount: 0, quotesCount: 0, quotesAccepted: 0, totalCommission: 0, pendingCommission: 0
    });
    const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
    const [allQuotes, setAllQuotes] = useState<RecentQuote[]>([]);
    const [signedQuotesHistory, setSignedQuotesHistory] = useState<SignedQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [commissionRate, setCommissionRate] = useState(20);
    const [activeTab, setActiveTab] = useState('overview');

    // UI States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isQuoteGeneratorOpen, setIsQuoteGeneratorOpen] = useState(false);

    const fetchDashboardData = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate('/nx-panel-8f4a'); return; }

            const { data: profileData } = await supabase
                .from('profiles').select('full_name').eq('id', user.id).single();
            if (profileData?.full_name) setUserName(profileData.full_name);

            const { data: partnerData } = await supabase
                .from('sales_partners').select('id, commission_rate').eq('user_id', user.id).single();
            const currentRate = partnerData?.commission_rate || 20;
            if (partnerData?.commission_rate) setCommissionRate(partnerData.commission_rate);

            // Use the actual sales_partner ID for fetching quotes
            const salesPartnerId = partnerData?.id;

            const { data: quotesData } = await supabase
                .from('quotes').select('id, quote_number, created_at, status, content, amount, prospect_id, prospects(name, email)')
                .eq('sales_partner_id', salesPartnerId || user.id).order('created_at', { ascending: false });

            const quotes = quotesData || [];
            const acceptedQuotes = quotes.filter(q => q.status === 'accepted' || q.status === 'signed');
            const pendingQuotes = quotes.filter(q => q.status === 'sent' || q.status === 'assigned');

            let totalSigned = 0;
            acceptedQuotes.forEach(q => {
                const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                totalSigned += q.amount || content?.final_amount || content?.totalPrice || 0;
            });

            let totalPending = 0;
            pendingQuotes.forEach(q => {
                const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                totalPending += q.amount || content?.final_amount || content?.totalPrice || 0;
            });

            const { count: prospectsCount } = await supabase
                .from('prospects').select('*', { count: 'exact', head: true })
                .eq('sales_partner_id', salesPartnerId || user.id);

            setStats({
                prospectsCount: prospectsCount || 0,
                quotesCount: quotes.length,
                quotesAccepted: acceptedQuotes.length,
                totalCommission: (totalSigned * currentRate) / 100,
                pendingCommission: (totalPending * currentRate) / 100,
            });

            const formattedQuotes = quotes.map((q: any) => {
                const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                const clientName = q.prospects?.name || content?.clientName || content?.selected_pack?.name || 'Sans client';
                const clientEmail = q.prospects?.email || content?.clientEmail || '-';
                const totalAmount = q.amount || content?.final_amount || content?.totalPrice || 0;
                return {
                    id: q.id,
                    quote_number: q.quote_number || 'BROUILLON',
                    client_name: clientName,
                    client_email: clientEmail,
                    total_amount: totalAmount,
                    status: q.status || 'draft',
                    created_at: q.created_at,
                };
            });
            setAllQuotes(formattedQuotes);

            setRecentQuotes(formattedQuotes.slice(0, 5));

            setSignedQuotesHistory(acceptedQuotes.map((q: any) => {
                const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                const amount = content?.totalPrice || 0;
                return {
                    id: q.id,
                    client_name: content?.clientName || 'N/A',
                    total_amount: amount,
                    commission_earned: (amount * currentRate) / 100,
                    signed_at: q.created_at,
                };
            }));
        } catch (error) {
            console.log('Dashboard fetch:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    const handleDeleteQuote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.')) return;

        try {
            const { error } = await supabase.from('quotes').delete().eq('id', id);
            if (error) throw error;
            toast.success('Devis supprimé');
            fetchDashboardData(true);
        } catch (error) {
            console.error('Error deleting quote:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    const getStatusBadge = (status: string) => {
        const configs: Record<string, { label: string; className: string }> = {
            draft: { label: 'Brouillon', className: 'bg-gray-500/20 text-gray-300 border-gray-500/50' },
            assigned: { label: 'Attribué', className: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
            sent: { label: 'Envoyé', className: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' },
            finalized: { label: 'Finalisé', className: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
            accepted: { label: 'Accepté', className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
            paid: { label: 'Payé', className: 'bg-green-600/20 text-green-300 border-green-600/50' },
            rejected: { label: 'Refusé', className: 'bg-red-500/20 text-red-300 border-red-500/50' },
        };
        const config = configs[status] || { label: status, className: 'bg-gray-500' };
        return <Badge variant="outline" className={`${config.className} border`}>{config.label}</Badge>;
    };

    if (loading) {
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
                <DashboardSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userName={userName}
                    onLogout={handleLogout}
                />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 h-16 flex items-center justify-between">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Nexus</span>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-slate-950 border-r-slate-800 w-72">
                        <DashboardSidebar
                            activeTab={activeTab}
                            setActiveTab={(tab) => {
                                setActiveTab(tab);
                                setIsMobileMenuOpen(false);
                            }}
                            userName={userName}
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
                            {activeTab === 'overview' && `Bonjour, ${userName.split(' ')[0]} 👋`}
                            {activeTab === 'quotes' && 'Gestion des Devis'}
                            {activeTab === 'commissions' && 'Mes Commissions'}
                            {activeTab === 'formation' && 'Centre de Formation'}
                            {activeTab === 'prospects' && 'Mes Prospects'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {activeTab === 'overview' && 'Voici un aperçu de vos performances.'}
                            {activeTab === 'quotes' && 'Créez et suivez vos propositions commerciales.'}
                            {activeTab === 'commissions' && 'Suivez vos gains en temps réel.'}
                            {activeTab === 'formation' && 'Ressources et guides pour booster vos ventes.'}
                            {activeTab === 'prospects' && 'Gérez votre portefeuille client.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 rounded-xl"
                            onClick={() => setIsQuoteGeneratorOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Devis
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white">
                            <Bell className="w-4 h-4" />
                        </Button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <TabContent id="overview">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                    <StatsCard
                                        label="Prospects Actifs"
                                        value={stats.prospectsCount}
                                        icon={Users}
                                        color="text-blue-400"
                                        delay={0.1}
                                    />
                                    <StatsCard
                                        label="Devis Créés"
                                        value={stats.quotesCount}
                                        icon={FileText}
                                        color="text-indigo-400"
                                        delay={0.2}
                                    />
                                    <StatsCard
                                        label="Taux Signature"
                                        value={`${stats.quotesCount > 0 ? Math.round((stats.quotesAccepted / stats.quotesCount) * 100) : 0}%`}
                                        subValue={`${stats.quotesAccepted} signés`}
                                        icon={CheckCircle}
                                        color="text-emerald-400"
                                        delay={0.3}
                                    />
                                    <StatsCard
                                        label="Commissions"
                                        value={formatCurrency(stats.totalCommission)}
                                        subValue={`Taux: ${commissionRate}%`}
                                        icon={Euro}
                                        color="text-amber-400"
                                        delay={0.4}
                                    />
                                </div>

                                {/* Recent Activity Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Recent Quotes List (Takes 2/3 space) */}
                                    <Card className="lg:col-span-2 bg-slate-900/60 border-white/10 backdrop-blur-xl">
                                        <CardHeader className="border-b border-white/5 pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-medium text-white">Récents Devis</CardTitle>
                                                <Button variant="link" className="text-blue-400 p-0 h-auto font-normal text-xs" onClick={() => setActiveTab('quotes')}>
                                                    Voir tout
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {recentQuotes.length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-white/5 hover:bg-transparent">
                                                            <TableHead className="text-slate-500 font-medium h-10 w-[100px]">Ref.</TableHead>
                                                            <TableHead className="text-slate-500 font-medium h-10">Client</TableHead>
                                                            <TableHead className="text-slate-500 font-medium h-10 text-right">Montant</TableHead>
                                                            <TableHead className="text-slate-500 font-medium h-10 text-center">Statut</TableHead>
                                                            <TableHead className="text-slate-500 font-medium text-right h-10">Date</TableHead>
                                                            <TableHead className="w-[50px]"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {recentQuotes.map((quote) => (
                                                            <TableRow key={quote.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                                <TableCell className="font-medium text-blue-400 text-xs whitespace-nowrap">
                                                                    {quote.quote_number}
                                                                </TableCell>
                                                                <TableCell className="font-medium text-slate-200">
                                                                    {quote.client_name}
                                                                    <span className="block text-xs text-slate-500 font-normal">{quote.client_email}</span>
                                                                </TableCell>
                                                                <TableCell className="text-slate-300 text-right font-mono">{formatCurrency(quote.total_amount)}</TableCell>
                                                                <TableCell className="text-center">{getStatusBadge(quote.status)}</TableCell>
                                                                <TableCell className="text-right text-slate-500 text-sm">
                                                                    {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                                                        onClick={(e) => handleDeleteQuote(quote.id, e)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="p-8 text-center text-slate-500 text-sm">
                                                    Aucun devis récent.
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Quick Actions / Mini Stats (1/3 space) */}
                                    <div className="space-y-6">
                                        <Card
                                            className="group relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-cyan-500/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                                            onClick={() => setIsQuoteGeneratorOpen(true)}
                                        >
                                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl group-hover:bg-blue-500/30 transition-colors" />

                                            <CardContent className="relative z-10 flex flex-col items-start p-6">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 shadow-inner group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                                    <Plus className="h-6 w-6" />
                                                </div>
                                                <h3 className="mb-2 text-lg font-bold text-white">Nouveau Devis</h3>
                                                <p className="mb-6 text-sm text-slate-400">Générez une proposition commerciale professionnelle en quelques clics.</p>
                                                <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                                                    <span>Commencer</span>
                                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            className="group relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-pink-500/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                                            onClick={() => setActiveTab('formation')}
                                        >
                                            <div className="absolute inset-0 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-colors" />

                                            <CardContent className="relative z-10 flex flex-col items-start p-6">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 shadow-inner group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                                    <BookOpen className="h-6 w-6" />
                                                </div>
                                                <h3 className="mb-2 text-lg font-bold text-white">Formation</h3>
                                                <p className="mb-6 text-sm text-slate-400">Accédez aux guides et stratégies de vente Nexus.</p>
                                                <div className="flex items-center gap-2 text-sm font-medium text-purple-400 group-hover:text-purple-300">
                                                    <span>Consulter</span>
                                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabContent>
                        )}

                        {activeTab === 'quotes' && (
                            <TabContent id="quotes">
                                <QuotesList
                                    quotes={allQuotes}
                                    commissionRate={commissionRate}
                                    showCommission={false}
                                    onQuoteUpdate={() => fetchDashboardData(true)}
                                />
                            </TabContent>
                        )}

                        {activeTab === 'commissions' && (
                            <TabContent id="commissions">
                                <div className="space-y-6">
                                    {/* Commissions Summary Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                                        <StatsCard
                                            label="Commissions Validées"
                                            value={formatCurrency(signedQuotesHistory.reduce((acc, q) => acc + q.commission_earned, 0))}
                                            icon={Euro}
                                            color="text-amber-400"
                                            delay={0.1}
                                        />
                                        <StatsCard
                                            label="En Attente (Est.)"
                                            value={formatCurrency(stats.pendingCommission)}
                                            icon={Clock}
                                            color="text-blue-400"
                                            delay={0.15}
                                            subValue="Devis envoyés/attribués"
                                        />
                                        <StatsCard
                                            label="Volume des Ventes"
                                            value={formatCurrency(signedQuotesHistory.reduce((acc, q) => acc + q.total_amount, 0))}
                                            icon={TrendingUp}
                                            color="text-emerald-400"
                                            delay={0.2}
                                        />
                                        <StatsCard
                                            label="Affaires Signées"
                                            value={signedQuotesHistory.length}
                                            icon={CheckCircle}
                                            color="text-purple-400"
                                            delay={0.3}
                                        />
                                    </div>

                                    {/* Detailed Quotes List with Commissions */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white">Détail des Commissions</h3>
                                        <QuotesList
                                            quotes={allQuotes}
                                            commissionRate={commissionRate}
                                            showCommission={true}
                                            onQuoteUpdate={() => fetchDashboardData(true)}
                                        />
                                    </div>
                                </div>
                            </TabContent>
                        )}

                        {activeTab === 'formation' && (
                            <TabContent id="formation">
                                <Suspense fallback={<LoadingSpinner />}>
                                    <TrainingResourcesContent />
                                </Suspense>
                            </TabContent>
                        )}

                        {activeTab === 'prospects' && (
                            <TabContent id="prospects">
                                <Suspense fallback={<LoadingSpinner />}>
                                    <ProspectsListContent />
                                </Suspense>
                            </TabContent>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Quote Generator Overlay */}
            {isQuoteGeneratorOpen && (
                <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Nouveau Devis
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsQuoteGeneratorOpen(false)}>
                                <span className="sr-only">Fermer</span>
                                <Button variant="ghost" size="icon"><Plus className="w-6 h-6 rotate-45 text-slate-400" /></Button>
                            </Button>
                        </div>
                        <div className="overflow-y-auto p-0 flex-1">
                            <Suspense fallback={<LoadingSpinner />}>
                                <QuoteGeneratorContent onQuoteCreated={() => fetchDashboardData(true)} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SalesDashboard;
