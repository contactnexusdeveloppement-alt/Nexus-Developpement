import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, Eye, Calendar, Filter, Trash2, X, Loader2, Package, Euro, User, Link, Unlink, Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { downloadQuotePDF, openQuotePDF, generateQuotePDF } from '@/services/pdfGenerator';

export interface Quote {
    id: string;
    quote_number?: string;
    client_name: string;
    client_email: string;
    total_amount: number;
    status: string;
    created_at: string;
    // Extended fields for PDF generation
    amount?: number;
    content?: any;
    prospect?: {
        name: string;
        email?: string;
        business_type?: string;
    };
}

interface QuotesListProps {
    quotes: Quote[];
    isLoading?: boolean;
    onQuoteUpdate?: () => void;
    commissionRate?: number;
    showCommission?: boolean;
}

const QuotesList = ({ quotes, isLoading = false, onQuoteUpdate, commissionRate = 20, showCommission = false }: QuotesListProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
    const [quoteDetail, setQuoteDetail] = useState<any>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
    const [prospects, setProspects] = useState<any[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedProspectId, setSelectedProspectId] = useState<string>('');
    const [loadingAssignment, setLoadingAssignment] = useState(false);

    const getStatusBadge = (status: string) => {
        const configs: Record<string, { label: string; className: string }> = {
            draft: { label: 'Brouillon', className: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
            assigned: { label: 'Attribué', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            sent: { label: 'Envoyé', className: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
            finalized: { label: 'Finalisé', className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
            accepted: { label: 'Accepté', className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            paid: { label: 'Payé', className: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30' },
            rejected: { label: 'Refusé', className: 'bg-red-500/20 text-red-300 border-red-500/30' },
        };
        const config = configs[status] || { label: status, className: 'bg-slate-500/20' };
        return <Badge variant="outline" className={cn("capitalize shadow-sm", config.className)}>{config.label}</Badge>;
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    const filteredQuotes = quotes.filter(quote => {
        const matchesSearch = quote.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.client_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Handle delete
    const handleDeleteClick = (quote: Quote) => {
        setSelectedQuote(quote);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedQuote) return;
        setLoadingDelete(true);
        try {
            const { error } = await supabase
                .from('quotes')
                .delete()
                .eq('id', selectedQuote.id);

            if (error) throw error;

            toast.success('Devis supprimé avec succès');
            setDeleteDialogOpen(false);
            setSelectedQuote(null);
            onQuoteUpdate?.();
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        } finally {
            setLoadingDelete(false);
        }
    };

    // Fetch prospects for assignment
    const fetchProspects = async () => {
        try {
            const { data } = await supabase
                .from('prospects')
                .select('id, name, email, business_type')
                .order('name');
            setProspects(data || []);
        } catch (error) {
            console.error('Error fetching prospects:', error);
        }
    };

    // Handle assignment
    const handleAssignProspect = async () => {
        if (!quoteDetail || !selectedProspectId) return;
        setLoadingAssignment(true);
        try {
            const newStatus = quoteDetail.status === 'draft' ? 'assigned' : quoteDetail.status;

            const { data: updatedData, error } = await supabase
                .from('quotes')
                .update({
                    prospect_id: selectedProspectId,
                    status: newStatus
                })
                .eq('id', quoteDetail.id)
                .select(`
                    *,
                    prospects (id, name, email, business_type),
                    sales_partners (id, first_name, last_name, email)
                `)
                .single();

            if (error) throw error;

            toast.success('Prospect assigné avec succès');
            setQuoteDetail(updatedData);
            setIsAssigning(false);
            onQuoteUpdate?.(); // Refresh background list
        } catch (error) {
            console.error('Assignment error:', error);
            toast.error('Erreur lors de l\'assignation');
        } finally {
            setLoadingAssignment(false);
        }
    };

    const handleUnassignProspect = async () => {
        if (!quoteDetail) return;
        setLoadingAssignment(true);
        try {
            const newStatus = quoteDetail.status === 'assigned' ? 'draft' : quoteDetail.status;

            const { data: updatedData, error } = await supabase
                .from('quotes')
                .update({
                    prospect_id: null,
                    status: newStatus
                })
                .eq('id', quoteDetail.id)
                .select(`
                    *,
                    prospects (id, name, email, business_type),
                    sales_partners (id, first_name, last_name, email)
                `)
                .single();

            if (error) throw error;

            toast.success('Assignation retirée');
            setQuoteDetail(updatedData);

            onQuoteUpdate?.(); // Refresh background list
        } catch (error) {
            console.error('Unassignment error:', error);
            toast.error('Erreur lors du retrait de l\'assignation');
        } finally {
            setLoadingAssignment(false);
        }
    };

    // Handle view detail
    const handleViewDetail = async (quote: Quote) => {
        setSelectedQuote(quote);
        setDetailDialogOpen(true);
        setLoadingDetail(true);
        setIsAssigning(false); // Reset assignment mode
        fetchProspects(); // Load prospects in background

        try {
            const { data, error } = await supabase
                .from('quotes')
                .select(`
                    *,
                    prospects (id, name, email, business_type),
                    sales_partners (id, first_name, last_name, email)
                `)
                .eq('id', quote.id)
                .single();

            if (error) throw error;
            setQuoteDetail(data);
        } catch (error: any) {
            console.error('Fetch detail error:', error);
            toast.error('Erreur lors du chargement des détails');
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleSendEmail = async (quote: Quote) => {
        setLoadingDownload(quote.id);
        try {
            const { data, error } = await supabase
                .from('quotes')
                .select(`
                    *,
                    prospects (id, name, email, business_type, address, city, phone),
                    sales_partners (id, first_name, last_name, email)
                `)
                .eq('id', quote.id)
                .single();

            if (error) throw error;

            if (!data.prospects?.email) {
                toast.error("Le prospect n'a pas d'adresse email");
                return;
            }

            const pdfData = {
                id: data.id,
                quote_number: data.quote_number,
                amount: data.amount,
                status: data.status,
                created_at: data.created_at,
                content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
                prospect: data.prospects,
                sales_partner: data.sales_partners
            };

            // Generate PDF Blob
            const blob = await generateQuotePDF(pdfData);

            // Convert Blob to Base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result;

                // Call Edge Function
                const { data: fnData, error: fnError } = await supabase.functions.invoke('send-quote-pdf', {
                    body: {
                        email: data.prospects.email,
                        pdfBase64: base64data,
                        quoteNumber: pdfData.quote_number || `DEV-${data.id.slice(0, 8)}`,
                        clientName: data.prospects.name
                    }
                });

                if (fnError) {
                    console.error('Edge Function error:', fnError);
                    toast.error(`Erreur: ${fnError.message}`);
                    setLoadingDownload(null);
                    return;
                }

                // Check if the response contains an error from Resend
                if (fnData?.error) {
                    console.error('Resend API error:', fnData);
                    toast.error(`Erreur Resend: ${fnData.error}`);
                    setLoadingDownload(null);
                    return;
                }

                toast.success(`Devis envoyé à ${data.prospects.email} !`);

                // Auto-update status to 'sent' if currently 'draft' or 'assigned'
                if (quote.status === 'draft' || quote.status === 'assigned') {
                    await supabase.from('quotes').update({ status: 'sent' }).eq('id', quote.id);
                    onQuoteUpdate?.();
                }
                setLoadingDownload(null);
            };

        } catch (error: any) {
            console.error('Email error:', error);
            toast.error("Erreur lors de l'envoi de l'email");
            setLoadingDownload(null);
        }
    };

    // Handle download PDF
    const handleDownloadPDF = async (quote: Quote) => {
        setLoadingDownload(quote.id);
        try {
            // Fetch full quote data for PDF generation
            const { data, error } = await supabase
                .from('quotes')
                .select(`
                    *,
                    prospects (id, name, email, business_type, address, city, phone),
                    sales_partners (id, first_name, last_name, email)
                `)
                .eq('id', quote.id)
                .single();

            if (error) throw error;

            // Prepare data for PDF
            const pdfData = {
                id: data.id,
                amount: data.amount,
                status: data.status,
                created_at: data.created_at,
                content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
                prospect: data.prospects,
                sales_partner: data.sales_partners
            };

            await downloadQuotePDF(pdfData);
            toast.success('PDF téléchargé !');
        } catch (error: any) {
            console.error('Download error:', error);
            toast.error('Erreur lors du téléchargement du PDF');
        } finally {
            setLoadingDownload(null);
        }
    };

    const handlePreviewPDF = async (quote: Quote) => {
        setLoadingDownload(quote.id); // Re-use loading state for visual feedback
        try {
            const { data, error } = await supabase
                .from('quotes')
                .select(`
                    *,
                    prospects (id, name, email, business_type, address, city, phone),
                    sales_partners (id, first_name, last_name, email)
                `)
                .eq('id', quote.id)
                .single();

            if (error) throw error;

            const pdfData = {
                id: data.id,
                amount: data.amount,
                status: data.status,
                created_at: data.created_at,
                content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
                prospect: data.prospects,
                sales_partner: data.sales_partners
            };

            await openQuotePDF(pdfData);
        } catch (error: any) {
            console.error('Preview error:', error);
            toast.error('Erreur lors de la prévisualisation');
        } finally {
            setLoadingDownload(null);
        }
    };

    return (
        <>
            <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md shadow-xl">
                <CardContent className="p-6">
                    {/* Header & Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    placeholder="Rechercher un devis..."
                                    className="pl-9 bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-slate-950/50 border border-white/10 rounded-md px-3 text-slate-300 text-sm"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="draft">Brouillon</option>
                                <option value="assigned">Attribué</option>
                                <option value="sent">Envoyé</option>
                                <option value="accepted">Accepté</option>
                                <option value="rejected">Refusé</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-white/5 overflow-hidden bg-slate-950/30">
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-medium h-12 w-[120px]">Ref.</TableHead>
                                    <TableHead className="text-slate-400 font-medium h-12 text-nowrap">Client</TableHead>
                                    <TableHead className="text-slate-400 font-medium h-12">Montant</TableHead>
                                    {showCommission && <TableHead className="text-slate-400 font-medium h-12 text-right">Comm. (Est.)</TableHead>}
                                    <TableHead className="text-slate-400 font-medium h-12">Statut</TableHead>
                                    <TableHead className="text-slate-400 font-medium h-12">Date</TableHead>
                                    <TableHead className="text-slate-400 font-medium text-right h-12">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={showCommission ? 7 : 6} className="h-24 text-center text-slate-500">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredQuotes.length > 0 ? (
                                    filteredQuotes.map((quote) => (
                                        <TableRow key={quote.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="font-medium text-blue-400 text-xs text-nowrap whitespace-nowrap">
                                                {quote.quote_number || 'BROUILLON'}
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-200">
                                                <div className="flex flex-col">
                                                    <span>{quote.client_name}</span>
                                                    <span className="text-xs text-slate-500 font-normal">{quote.client_email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-300 font-semibold">{formatCurrency(quote.total_amount)}</TableCell>
                                            {showCommission && (
                                                <TableCell className="text-emerald-400/70 text-right font-mono text-xs">
                                                    {formatCurrency((quote.total_amount * commissionRate) / 100)}
                                                </TableCell>
                                            )}
                                            <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                            <TableCell className="text-slate-500 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 text-slate-500">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-blue-400 hover:bg-blue-500/10"
                                                        onClick={() => handleViewDetail(quote)}
                                                        title="Voir les détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-green-400 hover:bg-green-500/10"
                                                        onClick={() => handleDownloadPDF(quote)}
                                                        disabled={loadingDownload === quote.id}
                                                        title="Télécharger PDF"
                                                    >
                                                        {loadingDownload === quote.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Download className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-red-400 hover:bg-red-500/10"
                                                        onClick={() => handleDeleteClick(quote)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={showCommission ? 7 : 6} className="h-32 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileText className="w-8 h-8 opacity-20" />
                                                <p>Aucun devis trouvé</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedQuote && (
                        <div className="bg-slate-800 rounded-lg p-4 my-2">
                            <p className="text-slate-200 font-medium">{selectedQuote.client_name}</p>
                            <p className="text-slate-400 text-sm">{formatCurrency(selectedQuote.total_amount)}</p>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-slate-600">
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={loadingDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loadingDelete ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quote Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-blue-400 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Détails du Devis
                        </DialogTitle>
                    </DialogHeader>

                    {loadingDetail ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : quoteDetail ? (
                        <div className="space-y-6">
                            {/* Reference & Status */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Référence</p>
                                    <p className="text-white font-mono">{quoteDetail.quote_number || `DEV-${quoteDetail.id.slice(0, 8).toUpperCase()}`}</p>
                                </div>
                                {getStatusBadge(quoteDetail.status)}
                            </div>

                            {/* Client Info */}
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-slate-300 font-medium flex items-center gap-2">
                                        <User className="w-4 h-4" /> Client
                                    </h4>
                                    {quoteDetail.prospects && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleUnassignProspect}
                                            disabled={loadingAssignment}
                                            className="h-6 px-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 text-xs"
                                        >
                                            <Unlink className="w-3 h-3 mr-1" /> Détacher
                                        </Button>
                                    )}
                                </div>

                                {quoteDetail.prospects ? (
                                    <div>
                                        <p className="text-white font-medium">{quoteDetail.prospects.name}</p>
                                        <p className="text-slate-400 text-sm">{quoteDetail.prospects.email}</p>
                                        {quoteDetail.prospects.business_type && (
                                            <p className="text-slate-500 text-sm">{quoteDetail.prospects.business_type}</p>
                                        )}
                                    </div>
                                ) : isAssigning ? (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <Select value={selectedProspectId} onValueChange={setSelectedProspectId}>
                                            <SelectTrigger className="bg-slate-950 border-slate-700 text-white w-full">
                                                <SelectValue placeholder="Choisir un prospect..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-[200px]">
                                                {prospects.map((p) => (
                                                    <SelectItem key={p.id} value={p.id} className="focus:bg-slate-800 focus:text-white">
                                                        {p.name} {p.business_type ? `(${p.business_type})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsAssigning(false)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleAssignProspect}
                                                disabled={!selectedProspectId || loadingAssignment}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {loadingAssignment ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 mr-1" />}
                                                Valider
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start gap-3">
                                        <p className="text-slate-500 italic">Aucun client assigné</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsAssigning(true)}
                                            className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-800"
                                        >
                                            <Link className="w-3 h-3 mr-2" />
                                            Assigner un prospect
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Service Details */}
                            {quoteDetail.content && (
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-slate-300 font-medium flex items-center gap-2 mb-3">
                                        <Package className="w-4 h-4" /> Prestation
                                    </h4>
                                    <div className="space-y-2">
                                        {quoteDetail.content.category && (
                                            <p className="text-slate-400 text-sm">
                                                Catégorie: <span className="text-white">{quoteDetail.content.category.label}</span>
                                            </p>
                                        )}
                                        {quoteDetail.content.selected_pack && (
                                            <div className="bg-slate-700/50 rounded p-3 mt-2">
                                                <p className="text-white font-medium">{quoteDetail.content.selected_pack.name}</p>
                                                <p className="text-slate-400 text-sm">{quoteDetail.content.selected_pack.description}</p>
                                                <p className="text-blue-400 font-bold mt-1">{quoteDetail.content.selected_pack.price}€</p>
                                            </div>
                                        )}
                                        {quoteDetail.content.selected_options?.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-slate-400 text-sm mb-2">Options:</p>
                                                <div className="space-y-1">
                                                    {quoteDetail.content.selected_options.map((opt: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between text-sm">
                                                            <span className="text-slate-300">{opt.name}</span>
                                                            <span className="text-purple-400">+{opt.price}€</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
                                <span className="text-blue-300 font-medium flex items-center gap-2">
                                    <Euro className="w-4 h-4" /> Total HT
                                </span>
                                <span className="text-white text-2xl font-bold">{formatCurrency(quoteDetail.amount)}</span>
                            </div>

                            {/* Notes */}
                            {quoteDetail.content?.client_notes && (
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-slate-300 font-medium mb-2">Notes client</h4>
                                    <p className="text-slate-400 text-sm">{quoteDetail.content.client_notes}</p>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Créé le: {new Date(quoteDetail.created_at).toLocaleDateString('fr-FR')}</span>
                                {quoteDetail.content?.valid_until && (
                                    <span>Valide jusqu'au: {new Date(quoteDetail.content.valid_until).toLocaleDateString('fr-FR')}</span>
                                )}
                            </div>
                        </div>
                    ) : null}

                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDetailDialogOpen(false)} className="border-slate-600">
                            Fermer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (selectedQuote) handleSendEmail(selectedQuote);
                            }}
                            disabled={loadingDownload === selectedQuote?.id}
                            className="bg-blue-600/10 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white"
                        >
                            {loadingDownload === selectedQuote?.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Mail className="w-4 h-4 mr-2" />
                            )}
                            Envoyer par Email
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (selectedQuote) handlePreviewPDF(selectedQuote);
                            }}
                            className="border-slate-600 text-slate-300 hover:text-white"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Visualiser
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedQuote) handleDownloadPDF(selectedQuote);
                                setDetailDialogOpen(false);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default QuotesList;
