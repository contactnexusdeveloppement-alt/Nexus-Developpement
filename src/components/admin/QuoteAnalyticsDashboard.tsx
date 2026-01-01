import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, DollarSign, Users, Clock, Target, Zap } from "lucide-react";

interface QuoteMetrics {
    total: number;
    pending: number;
    converted: number;
    avgValue: number;
    conversionRate: number;
    popularFeatures: { name: string; count: number }[];
    serviceTypeBreakdown: { type: string; count: number }[];
}

export const QuoteAnalyticsDashboard = () => {
    const [metrics, setMetrics] = useState<QuoteMetrics>({
        total: 0,
        pending: 0,
        converted: 0,
        avgValue: 0,
        conversionRate: 0,
        popularFeatures: [],
        serviceTypeBreakdown: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const { data: quotes, error } = await supabase
                .from('quote_requests')
                .select('*');

            if (error) throw error;

            // Calculate metrics
            const total = quotes?.length || 0;
            const pending = quotes?.filter(q => q.status === 'pending').length || 0;
            const converted = quotes?.filter(q => q.status === 'accepted' || q.status === 'converted').length || 0;
            const conversionRate = total > 0 ? (converted / total) * 100 : 0;

            // Feature popularity
            const featureCounts: Record<string, number> = {};
            quotes?.forEach(quote => {
                if (quote.qualification_data?.features) {
                    Object.values(quote.qualification_data.features).flat().forEach((feature: any) => {
                        if (feature) {
                            featureCounts[feature] = (featureCounts[feature] || 0) + 1;
                        }
                    });
                }
            });

            const popularFeatures = Object.entries(featureCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Service type breakdown
            const serviceTypeCounts: Record<string, number> = {};
            quotes?.forEach(quote => {
                if (quote.qualification_data?.serviceType) {
                    const type = quote.qualification_data.serviceType;
                    serviceTypeCounts[type] = (serviceTypeCounts[type] || 0) + 1;
                }
            });

            const serviceTypeBreakdown = Object.entries(serviceTypeCounts)
                .map(([type, count]) => ({ type, count }))
                .sort((a, b) => b.count - a.count);

            // Average quote value (dummy calculation - you'd integrate with pricing)
            const avgValue = 8500; // Placeholder

            setMetrics({
                total,
                pending,
                converted,
                avgValue,
                conversionRate,
                popularFeatures,
                serviceTypeBreakdown,
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Analytics Devis</h2>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Total Devis</span>
                        <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{metrics.total}</p>
                    <p className="text-xs text-slate-500 mt-1">{metrics.pending} en attente</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Taux Conversion</span>
                        <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{metrics.conversionRate.toFixed(1)}%</p>
                    <p className="text-xs text-slate-500 mt-1">{metrics.converted} convertis</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Valeur Moyenne</span>
                        <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{metrics.avgValue.toLocaleString()}€</p>
                    <p className="text-xs text-slate-500 mt-1">Par projet</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">En Attente</span>
                        <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{metrics.pending}</p>
                    <p className="text-xs text-slate-500 mt-1">À traiter</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Features */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Fonctionnalités Populaires</h3>
                    </div>
                    <div className="space-y-3">
                        {metrics.popularFeatures.length > 0 ? (
                            metrics.popularFeatures.map((feature, index) => (
                                <div key={feature.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-slate-400">#{index + 1}</span>
                                        <span className="text-sm text-white capitalize">{feature.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                style={{ width: `${(feature.count / metrics.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-slate-400 w-8 text-right">{feature.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">Aucune donnée disponible</p>
                        )}
                    </div>
                </div>

                {/* Service Type Breakdown */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Types de Services</h3>
                    </div>
                    <div className="space-y-3">
                        {metrics.serviceTypeBreakdown.length > 0 ? (
                            metrics.serviceTypeBreakdown.map((service) => (
                                <div key={service.type} className="flex items-center justify-between">
                                    <span className="text-sm text-white capitalize">{service.type}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                                style={{ width: `${(service.count / metrics.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-slate-400 w-12 text-right">
                                            {service.count} ({((service.count / metrics.total) * 100).toFixed(0)}%)
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">Aucune donnée disponible</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
