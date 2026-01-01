import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "./widgets/StatCard";
import ChartCard from "./widgets/ChartCard";
import EmptyState from "./widgets/EmptyState";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [callBookings, setCallBookings] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [quotesData, callsData, projectsData, invoicesData] = await Promise.all([
                supabase.from("quote_requests").select("*"),
                supabase.from("call_bookings").select("*"),
                supabase.from("projects").select("*"),
                supabase.from("invoices").select("*"),
            ]);

            if (quotesData.data) setQuotes(quotesData.data);
            if (callsData.data) setCallBookings(callsData.data);
            if (projectsData.data) setProjects(projectsData.data);
            if (invoicesData.data) setInvoices(invoicesData.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ==================== KPIs COMMERCIAUX ====================
    const commercialKPIs = useMemo(() => {
        const now = new Date();
        const currentMonth = startOfMonth(now);
        const lastMonth = startOfMonth(subMonths(now, 1));

        // Leads du mois en cours
        const currentMonthLeads = quotes.filter(
            (q) => new Date(q.created_at) >= currentMonth
        ).length;

        const lastMonthLeads = quotes.filter(
            (q) =>
                new Date(q.created_at) >= lastMonth && new Date(q.created_at) < currentMonth
        ).length;

        const leadsTrend =
            lastMonthLeads > 0 ? ((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100 : 0;

        // Taux de conversion (devis acceptés / total devis)
        const acceptedQuotes = quotes.filter((q) => q.status === "accepted").length;
        const conversionRate = quotes.length > 0 ? (acceptedQuotes / quotes.length) * 100 : 0;

        // Valeur pipeline (devis en attente)
        const pipelineValue = quotes
            .filter((q) => q.status === "pending")
            .reduce((sum, q) => {
                // Estimer la valeur moyenne selon le budget
                const budgetMap: any = {
                    "< 5000€": 3000,
                    "5000€ - 10000€": 7500,
                    "10000€ - 20000€": 15000,
                    "20000€ - 50000€": 35000,
                    "> 50000€": 75000,
                };
                return sum + (budgetMap[q.budget] || 5000);
            }, 0);

        return {
            leads: currentMonthLeads,
            leadsTrend,
            conversionRate: conversionRate.toFixed(1),
            pipelineValue: pipelineValue.toLocaleString("fr-FR"),
        };
    }, [quotes]);

    // ==================== KPIs OPÉRATIONNELS ====================
    const operationalKPIs = useMemo(() => {
        const activeProjects = projects.filter(
            (p) => p.status === "in_progress" || p.status === "review"
        ).length;

        const deliveredProjects = projects.filter((p) => p.status === "delivered").length;

        return {
            activeProjects,
            deliveredProjects,
        };
    }, [projects]);

    // ==================== KPIs FINANCIERS ====================
    const financialKPIs = useMemo(() => {
        const now = new Date();
        const currentMonth = startOfMonth(now);
        const currentYear = now.getFullYear();

        // CA mensuel
        const monthlyRevenue = invoices
            .filter(
                (inv) =>
                    inv.status === "paid" &&
                    new Date(inv.issue_date) >= currentMonth
            )
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

        // CA annuel
        const yearlyRevenue = invoices
            .filter(
                (inv) =>
                    inv.status === "paid" &&
                    new Date(inv.issue_date).getFullYear() === currentYear
            )
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

        // Encours (factures non payées)
        const outstanding = invoices
            .filter((inv) => inv.status === "sent" || inv.status === "overdue")
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

        // DSO (Days Sales Outstanding) - simplifié
        const dso = 30; // À calculer réellement plus tard

        return {
            monthlyRevenue: monthlyRevenue.toLocaleString("fr-FR"),
            yearlyRevenue: yearlyRevenue.toLocaleString("fr-FR"),
            outstanding: outstanding.toLocaleString("fr-FR"),
            dso,
        };
    }, [invoices]);

    // ==================== GRAPHIQUE: ÉVOLUTION CA ====================
    const revenueChartData = useMemo(() => {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const month = subMonths(new Date(), i);
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            const revenue = invoices
                .filter((inv) => {
                    const date = new Date(inv.issue_date);
                    return inv.status === "paid" && date >= monthStart && date <= monthEnd;
                })
                .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

            months.push({
                month: format(month, "MMM", { locale: fr }),
                revenue: Math.round(revenue),
            });
        }
        return months;
    }, [invoices]);

    // ==================== GRAPHIQUE: PROJETS PAR STATUT ====================
    const projectsChartData = useMemo(() => {
        const statusMap: any = {
            planned: { label: "Planifiés", color: "#3b82f6" },
            in_progress: { label: "En cours", color: "#f59e0b" },
            review: { label: "En revue", color: "#8b5cf6" },
            delivered: { label: "Livrés", color: "#10b981" },
            closed: { label: "Clôturés", color: "#6b7280" },
        };

        return Object.entries(statusMap).map(([status, config]: [string, any]) => ({
            name: config.label,
            value: projects.filter((p) => p.status === status).length,
            color: config.color,
        }));
    }, [projects]);

    // ==================== GRAPHIQUE: PIPELINE COMMERCIAL ====================
    const pipelineChartData = useMemo(() => {
        const statusMap: any = {
            pending: { label: "En attente", color: "#f59e0b" },
            accepted: { label: "Acceptés", color: "#10b981" },
            rejected: { label: "Refusés", color: "#ef4444" },
        };

        return Object.entries(statusMap).map(([status, config]: [string, any]) => ({
            name: config.label,
            count: quotes.filter((q) => q.status === status).length,
            color: config.color,
        }));
    }, [quotes]);

    return (
        <div className="space-y-6">
            {/* Section: KPIs Commerciaux */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                    Indicateurs Commerciaux
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Leads ce mois"
                        value={commercialKPIs.leads}
                        trend={{
                            value: commercialKPIs.leadsTrend,
                            label: "vs mois dernier",
                        }}
                        color="blue"
                        loading={loading}
                    />
                    <StatCard
                        title="Taux de conversion"
                        value={`${commercialKPIs.conversionRate}%`}
                        color="green"
                        loading={loading}
                    />
                </div>
            </div>

            {/* Section: KPIs Opérationnels */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                    Indicateurs Opérationnels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Projets actifs"
                        value={operationalKPIs.activeProjects}
                        color="orange"
                        loading={loading}
                    />
                    <StatCard
                        title="Total projets"
                        value={projects.length}
                        color="teal"
                        loading={loading}
                    />
                    <StatCard
                        title="Projets livrés"
                        value={operationalKPIs.deliveredProjects}
                        color="green"
                        loading={loading}
                    />
                </div>
            </div>

            {/* Section: KPIs Financiers */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                    Indicateurs Financiers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="CA mensuel"
                        value={`${financialKPIs.monthlyRevenue}€`}
                        color="green"
                        loading={loading}
                        tooltip="Chiffre d'affaires du mois en cours. Comptabilise uniquement les factures avec statut 'Payée'. Brouillons et factures envoyées non inclus."
                    />
                    <StatCard
                        title="CA annuel"
                        value={`${financialKPIs.yearlyRevenue}€`}
                        color="blue"
                        loading={loading}
                        tooltip="Chiffre d'affaires de l'année en cours. Seules les factures payées sont comptabilisées."
                    />
                    <StatCard
                        title="Encours"
                        value={`${financialKPIs.outstanding}€`}
                        color="orange"
                        loading={loading}
                        tooltip="Montant des factures envoyées mais non encore payées. Correspond aux factures en statut 'Envoyée' ou 'En retard'."
                    />
                    <StatCard
                        title="DSO (jours)"
                        value={financialKPIs.dso}
                        color="purple"
                        loading={loading}
                    />
                </div>
            </div>

            {/* Section: Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Évolution CA */}
                <ChartCard title="Évolution du Chiffre d'Affaires" description="12 derniers mois" loading={loading}>
                    {revenueChartData.every(d => d.revenue === 0) ? (
                        <EmptyState
                            icon="💰"
                            message="Aucune donnée de CA disponible"
                            description="Les données apparaîtront dès que des factures seront payées"
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "#f1f5f9" }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="CA (€)"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: "#3b82f6" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Projets par statut */}
                <ChartCard title="Répartition des Projets" description="Par statut" loading={loading}>
                    {projectsChartData.every(d => d.value === 0) ? (
                        <EmptyState
                            icon="📁"
                            message="Aucun projet pour le moment"
                            description="Les projets apparaîtront ici une fois créés"
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={projectsChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {projectsChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "8px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Pipeline commercial */}
                <ChartCard title="Pipeline Commercial" description="Devis par statut" loading={loading}>
                    {pipelineChartData.every(d => d.count === 0) ? (
                        <EmptyState
                            icon="📋"
                            message="Aucun devis pour le moment"
                            description="Les demandes de devis apparaîtront ici"
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={pipelineChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #334155",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Bar dataKey="count" name="Nombre">
                                    {pipelineChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>
        </div>
    );
};

export default DashboardOverview;
