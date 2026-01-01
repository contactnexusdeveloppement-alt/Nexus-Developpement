import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
    FileText,
    Plus,
    Search,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    Eye,
    Download,
    CreditCard,
    Edit,
    Trash2,
} from "lucide-react";
import { Invoice } from "@/types/invoices";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import CreateInvoiceModal from "./modals/CreateInvoiceModal";
import InvoiceDetailModal from "./modals/InvoiceDetailModal";
import EmptyState from "./widgets/EmptyState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const InvoicesTab = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const handleRowClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setDetailModalOpen(true);
    };

    useEffect(() => {
        fetchInvoices();

        // Realtime subscription
        const channel = supabase
            .channel("invoices_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "invoices" },
                () => {
                    fetchInvoices();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("invoices")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Erreur lors du chargement des factures");
        } else {
            setInvoices((data as Invoice[]) || []);
        }
        setLoading(false);
    };

    // Debounce search term to reduce filtering operations
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

    const filteredInvoices = useMemo(() => {
        // Use debounced search term to avoid excessive filtering
        return invoices.filter((invoice) => {
            const matchesSearch =
                invoice.invoice_number.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                invoice.client_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                invoice.client_email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, debouncedSearchTerm, statusFilter]);

    const stats = useMemo(() => {
        const totalRevenue = invoices
            .filter((inv) => inv.status === "paid")
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount.toString()), 0);

        const outstanding = invoices
            .filter((inv) => inv.status === "sent" || inv.status === "overdue")
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount.toString()), 0);

        const overdue = invoices.filter((inv) => inv.status === "overdue").length;

        return {
            total: invoices.length,
            paid: invoices.filter((inv) => inv.status === "paid").length,
            outstanding: outstanding.toLocaleString("fr-FR"),
            totalRevenue: totalRevenue.toLocaleString("fr-FR"),
            overdue,
        };
    }, [invoices]);

    const getStatusBadge = (status: string) => {
        const config: any = {
            draft: { label: "Brouillon", color: "bg-gray-500/10 text-gray-300 border-gray-500/30" },
            sent: { label: "Envoyée", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
            paid: { label: "Payée", color: "bg-green-500/10 text-green-300 border-green-500/30" },
            overdue: { label: "En retard", color: "bg-red-500/10 text-red-300 border-red-500/30" },
            cancelled: { label: "Annulée", color: "bg-gray-500/10 text-gray-300 border-gray-500/30" },
        };

        const { label, color } = config[status] || config.draft;

        return (
            <Badge className={`${color} border`} variant="outline">
                {label}
            </Badge>
        );
    };

    const isOverdue = (invoice: Invoice) => {
        return invoice.status === "overdue" || (invoice.status === "sent" && new Date(invoice.due_date) < new Date());
    };

    const handleDeleteInvoice = async (invoiceId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm("Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', invoiceId);

            if (error) throw error;

            toast.success("Facture supprimée avec succès");
            fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error("Erreur lors de la suppression de la facture");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">CA Total</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.totalRevenue}€</p>
                            </div>
                            <DollarSign className="w-6 h-6 text-green-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Encours</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.outstanding}€</p>
                            </div>
                            <Clock className="w-6 h-6 text-orange-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Payées</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.paid}</p>
                            </div>
                            <CheckCircle2 className="w-6 h-6 text-green-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">En Retard</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.overdue}</p>
                            </div>
                            <AlertCircle className="w-6 h-6 text-red-400/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Gestion des Factures</CardTitle>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Facture
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher par numéro, client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-950/30 border-white/10 text-white placeholder:text-gray-700 h-8 text-xs"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48 bg-slate-950/30 border-white/10 text-white h-8 text-xs">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10">
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="draft">Brouillons</SelectItem>
                                <SelectItem value="sent">Envoyées</SelectItem>
                                <SelectItem value="paid">Payées</SelectItem>
                                <SelectItem value="overdue">En retard</SelectItem>
                                <SelectItem value="cancelled">Annulées</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Invoices Table */}
                    {loading ? (
                        <div className="text-center py-12 text-slate-400">Chargement...</div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="py-8">
                            <EmptyState
                                icon="💰"
                                message="Aucune facture trouvée"
                                description={searchTerm || statusFilter !== 'all'
                                    ? "Essayez de modifier les filtres"
                                    : "Créez votre première facture pour commencer"}
                            />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Numéro</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Client</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Date</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Échéance</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Montant</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Statut</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.map((invoice) => (
                                    <TableRow
                                        key={invoice.id}
                                        onClick={() => handleRowClick(invoice)}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                {isOverdue(invoice) && (
                                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                                )}
                                                {invoice.invoice_number}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{invoice.client_name}</TableCell>
                                        <TableCell className="text-slate-300">
                                            {format(new Date(invoice.issue_date), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {format(new Date(invoice.due_date), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell className="text-slate-300 font-semibold">
                                            {parseFloat(invoice.total_amount.toString()).toLocaleString("fr-FR")}€
                                        </TableCell>
                                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteInvoice(invoice.id, e);
                                                }}
                                                className="h-6 px-2 text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create Invoice Modal */}
            <CreateInvoiceModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={fetchInvoices}
            />

            {/* Invoice Detail Modal */}
            <InvoiceDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                invoice={selectedInvoice}
                onSuccess={fetchInvoices}
            />
        </div>
    );
};

export default InvoicesTab;
