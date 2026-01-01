import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Opportunity, PipelineStats } from "@/types/opportunities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, TrendingUp, DollarSign, Target, Award } from "lucide-react";
import { toast } from "sonner";
import CreateOpportunityModal from "../modals/CreateOpportunityModal";
import OpportunityDetailModal from "../modals/OpportunityDetailModal";

const OpportunitiesTab = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

    const handleCardClick = (opportunity: Opportunity) => {
        setSelectedOpportunity(opportunity);
        setDetailModalOpen(true);
    };

    useEffect(() => {
        fetchOpportunities();
        fetchStats();

        // Real-time subscription
        const channel = supabase
            .channel('opportunities_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => {
                fetchOpportunities();
                fetchStats();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchOpportunities = async () => {
        try {
            const { data, error } = await supabase
                .from('opportunities')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOpportunities((data as Opportunity[]) || []);
        } catch (error: any) {
            toast.error("Erreur lors du chargement des opportunités");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase.rpc('get_pipeline_stats');
            if (error) throw error;
            if (data && data.length > 0) {
                setStats(data[0]);
            }
        } catch (error: any) {
            console.error("Erreur stats:", error);
        }
    };

    const getStageConfig = (stage: Opportunity['stage']) => {
        const configs = {
            prospecting: { label: "Prospection", color: "bg-blue-500/10 text-blue-300 border-blue-500/30", icon: Search },
            qualification: { label: "Qualification", color: "bg-purple-500/10 text-purple-300 border-purple-500/30", icon: Target },
            proposal: { label: "Proposition", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30", icon: TrendingUp },
            negotiation: { label: "Négociation", color: "bg-orange-500/10 text-orange-300 border-orange-500/30", icon: DollarSign },
            closed_won: { label: "Gagné", color: "bg-green-500/10 text-green-300 border-green-500/30", icon: Award },
            closed_lost: { label: "Perdu", color: "bg-red-500/10 text-red-300 border-red-500/30", icon: Award }
        };
        return configs[stage];
    };

    const filteredOpportunities = opportunities.filter(opp =>
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedByStage = filteredOpportunities.reduce((acc, opp) => {
        if (!acc[opp.stage]) acc[opp.stage] = [];
        acc[opp.stage].push(opp);
        return acc;
    }, {} as Record<string, Opportunity[]>);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Opportunités</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats?.total_opportunities || 0}</p>
                            </div>
                            <Target className="w-6 h-6 text-blue-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Valeur Pipeline</p>
                                <p className="text-2xl font-bold font-mono text-white">
                                    {stats?.total_value?.toLocaleString('fr-FR') || 0}€
                                </p>
                            </div>
                            <DollarSign className="w-6 h-6 text-green-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Taux Conversion</p>
                                <p className="text-2xl font-bold font-mono text-white">
                                    {stats?.conversion_rate?.toFixed(1) || 0}%
                                </p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-orange-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Deal Moyen</p>
                                <p className="text-2xl font-bold font-mono text-white">
                                    {stats?.avg_deal_size?.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) || 0}€
                                </p>
                            </div>
                            <Award className="w-6 h-6 text-purple-400/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher une opportunité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-950/30 border-white/10 text-white placeholder:text-gray-700 h-8 text-xs"
                    />
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Opportunité
                </Button>
            </div>

            {/* Pipeline Kanban */}
            <Tabs defaultValue="pipeline" className="w-full">
                <TabsList className="bg-slate-900/50 border-white/10">
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="list">Liste</TabsTrigger>
                </TabsList>

                <TabsContent value="pipeline" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].map((stage) => {
                            const config = getStageConfig(stage as Opportunity['stage']);
                            const stageOpps = groupedByStage[stage] || [];
                            const stageValue = stageOpps.reduce((sum, opp) => sum + (opp.amount || 0), 0);

                            return (
                                <Card key={stage} className="bg-slate-900/50 border-white/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center justify-between">
                                            <span className="text-slate-300">{config.label}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {stageOpps.length}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-xs text-slate-500">
                                            {stageValue.toLocaleString('fr-FR')}€
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {stageOpps.map((opp) => (
                                            <Card
                                                key={opp.id}
                                                className="bg-slate-800/50 border-white/5 hover:border-white/20 transition-all cursor-pointer p-3"
                                                onClick={() => handleCardClick(opp)}
                                            >
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {opp.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {opp.client_name}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-green-400">
                                                            {opp.amount?.toLocaleString('fr-FR')}€
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {opp.probability}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                    <Card className="bg-slate-900/50 border-white/10">
                        <CardContent className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Nom</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Client</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Montant</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Probabilité</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Étape</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Échéance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOpportunities.map((opp) => {
                                            const config = getStageConfig(opp.stage);
                                            return (
                                                <tr key={opp.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                                                    <td className="py-3 px-4 text-sm text-white">{opp.name}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-300">{opp.client_name}</td>
                                                    <td className="py-3 px-4 text-sm font-semibold text-green-400">
                                                        {opp.amount?.toLocaleString('fr-FR')}€
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-slate-300">{opp.probability}%</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={`${config.color} border`} variant="outline">
                                                            {config.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-slate-400">
                                                        {opp.expected_close_date ? new Date(opp.expected_close_date).toLocaleDateString('fr-FR') : '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Create Opportunity Modal */}
            <CreateOpportunityModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={fetchOpportunities}
            />

            {/* Opportunity Detail Modal */}
            <OpportunityDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                opportunity={selectedOpportunity}
                onSuccess={fetchOpportunities}
            />
        </div>
    );
};

export default OpportunitiesTab;
