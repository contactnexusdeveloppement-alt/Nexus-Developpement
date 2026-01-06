import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users, FileText, CheckCircle, Loader2, LogOut,
    BookOpen, Plus, ArrowUpRight, Euro, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import AnimatedBackground from '@/components/AnimatedBackground';

// Lazy load the content components
const QuoteGeneratorContent = lazy(() => import('./QuoteGenerator'));
const ProspectsListContent = lazy(() => import('./ProspectsList'));
const TrainingResourcesContent = lazy(() => import('./TrainingResources'));

interface DashboardStats {
    prospectsCount: number;
    quotesCount: number;
    quotesAccepted: number;
    totalCommission: number;
}

interface RecentQuote {
    id: string;
    client_name: string;
    client_email: string;
    total_amount: number;
    status: string;
    created_at: string;
}

const ModalLoader = () => (
    <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    </div>
);

const SalesDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        prospectsCount: 0, quotesCount: 0, quotesAccepted: 0, totalCommission: 0,
    });
    const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [commissionRate, setCommissionRate] = useState(10);

    // Modal states
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [prospectsModalOpen, setProspectsModalOpen] = useState(false);
    const [trainingModalOpen, setTrainingModalOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate('/nx-panel-8f4a'); return; }

            const { data: profileData } = await supabase
                .from('profiles').select('full_name').eq('id', user.id).single();
            if (profileData?.full_name) setUserName(profileData.full_name);

            const { data: partnerData } = await supabase
                .from('sales_partners').select('id, commission_rate').eq('id', user.id).single();
            if (partnerData?.commission_rate) setCommissionRate(partnerData.commission_rate);

            const { data: quotesData } = await supabase
                .from('quotes').select('id, created_at, status, content')
                .eq('sales_partner_id', user.id).order('created_at', { ascending: false });

            const quotes = quotesData || [];
            const acceptedQuotes = quotes.filter(q => q.status === 'accepted' || q.status === 'signed');

            let totalSigned = 0;
            acceptedQuotes.forEach(q => {
                const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                totalSigned += content?.totalPrice || 0;
            });

            const { count: prospectsCount } = await supabase
                .from('quote_requests').select('*', { count: 'exact', head: true })
                .eq('sales_partner_id', user.id);

            setStats({
                prospectsCount: prospectsCount || 0,
                quotesCount: quotes.length,
                quotesAccepted: acceptedQuotes.length,
                totalCommission: (totalSigned * (partnerData?.commission_rate || 10)) / 100,
            });

            setRecentQuotes(quotes.slice(0, 5).map((q: any) => {
                const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                return {
                    id: q.id, client_name: content?.clientName || 'N/A',
                    client_email: content?.clientEmail || 'N/A',
                    total_amount: content?.totalPrice || 0,
                    status: q.status || 'draft', created_at: q.created_at,
                };
            }));
        } catch (error) {
            console.log('Dashboard fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    const getStatusBadge = (status: string) => {
        const configs: Record<string, { label: string; className: string }> = {
            draft: { label: 'Brouillon', className: 'bg-gray-500' },
            assigned: { label: 'Attribué', className: 'bg-blue-500' },
            sent: { label: 'Envoyé', className: 'bg-cyan-500' },
            finalized: { label: 'Finalisé', className: 'bg-purple-500' },
            accepted: { label: 'Accepté', className: 'bg-emerald-500' },
            paid: { label: 'Payé', className: 'bg-green-600' },
            rejected: { label: 'Refusé', className: 'bg-red-500' },
        };
        const config = configs[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <AnimatedBackground />
                <Loader2 className="h-8 w-8 animate-spin text-white/60 relative z-10" />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/20 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Espace Commercial</span>
                    <div className="flex items-center gap-4">
                        {userName && <span className="text-sm text-gray-300">{userName}</span>}
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Prospects', value: stats.prospectsCount, icon: Users, color: 'border-l-cyan-500', iconColor: 'text-cyan-400' },
                        { label: 'Devis créés', value: stats.quotesCount, icon: FileText, color: 'border-l-blue-500', iconColor: 'text-blue-400' },
                        { label: 'Devis signés', value: stats.quotesAccepted, icon: CheckCircle, color: 'border-l-emerald-500', iconColor: 'text-emerald-400' },
                        { label: 'Commissions', value: formatCurrency(stats.totalCommission), icon: Euro, sub: `${commissionRate}%`, color: 'border-l-amber-500', iconColor: 'text-amber-400' },
                    ].map((stat, i) => (
                        <Card key={i} className={`bg-slate-900/80 border-slate-700 border-l-4 ${stat.color} backdrop-blur-sm`}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-semibold text-white">{stat.value}</p>
                                        {stat.sub && <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>}
                                    </div>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                        onClick={() => setQuoteModalOpen(true)}
                        className="w-full justify-between bg-blue-600 text-white hover:bg-blue-500 h-12 font-medium"
                    >
                        <span className="flex items-center"><Plus className="w-4 h-4 mr-2" />Créer un devis</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => setProspectsModalOpen(true)}
                        variant="outline"
                        className="w-full justify-between border-slate-600 text-white hover:bg-slate-800 h-12"
                    >
                        <span className="flex items-center"><Users className="w-4 h-4 mr-2" />Mes prospects</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => setTrainingModalOpen(true)}
                        variant="outline"
                        className="w-full justify-between border-slate-600 text-white hover:bg-slate-800 h-12"
                    >
                        <span className="flex items-center"><BookOpen className="w-4 h-4 mr-2" />Formation</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Recent Quotes */}
                <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-medium text-white">Derniers devis</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {recentQuotes.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700">
                                        <TableHead className="text-gray-400 font-medium">Client</TableHead>
                                        <TableHead className="text-gray-400 font-medium">Montant</TableHead>
                                        <TableHead className="text-gray-400 font-medium">Statut</TableHead>
                                        <TableHead className="text-gray-400 font-medium text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentQuotes.map((quote) => (
                                        <TableRow key={quote.id} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell>
                                                <p className="text-white text-sm font-medium">{quote.client_name}</p>
                                                <p className="text-gray-500 text-xs">{quote.client_email}</p>
                                            </TableCell>
                                            <TableCell className="text-white text-sm font-medium">{formatCurrency(quote.total_amount)}</TableCell>
                                            <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                            <TableCell className="text-gray-400 text-sm text-right">
                                                {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                                <p className="text-gray-400 text-sm mb-4">Aucun devis pour le moment</p>
                                <Button
                                    size="sm"
                                    onClick={() => setQuoteModalOpen(true)}
                                    className="bg-blue-600 text-white hover:bg-blue-500"
                                >
                                    Créer un devis
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* Quote Generator Modal */}
            <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
                <DialogContent className="max-w-5xl h-auto bg-slate-950 border-slate-700 p-0 overflow-hidden">
                    <DialogHeader className="bg-slate-950 border-b border-cyan-500/30 p-4">
                        <DialogTitle className="text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-cyan-400" />
                            Générateur de Devis
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-0">
                        <Suspense fallback={<ModalLoader />}>
                            <QuoteGeneratorContent />
                        </Suspense>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Prospects Modal */}
            <Dialog open={prospectsModalOpen} onOpenChange={setProspectsModalOpen}>
                <DialogContent className="max-w-5xl h-auto bg-slate-950 border-slate-700 p-0 overflow-hidden">
                    <DialogHeader className="bg-slate-950 border-b border-cyan-500/30 p-4">
                        <DialogTitle className="text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-cyan-400" />
                            Mes Prospects
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-0">
                        <Suspense fallback={<ModalLoader />}>
                            <ProspectsListContent />
                        </Suspense>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Training Modal */}
            <Dialog open={trainingModalOpen} onOpenChange={setTrainingModalOpen}>
                <DialogContent className="max-w-5xl h-auto bg-slate-950 border-slate-700 p-0 overflow-hidden">
                    <DialogHeader className="bg-slate-950 border-b border-cyan-500/30 p-4">
                        <DialogTitle className="text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-cyan-400" />
                            Formation & Ressources
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-0">
                        <Suspense fallback={<ModalLoader />}>
                            <TrainingResourcesContent />
                        </Suspense>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalesDashboard;
