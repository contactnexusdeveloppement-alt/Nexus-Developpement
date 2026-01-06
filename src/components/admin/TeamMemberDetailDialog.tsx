import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    User,
    Mail,
    Calendar,
    Percent,
    FileText,
    Users,
    Trash2,
    Loader2,
    DollarSign,
    TrendingUp,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
    id: string;
    email: string;
    role: string;
    created_at: string;
    commission_rate?: number;
    sales_partner?: {
        first_name: string;
        last_name: string;
        phone: string | null;
        is_active: boolean;
    };
}

interface Client {
    id: string;
    email: string;
    name: string;
    created_at: string;
    status: string;
}

interface Quote {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    client_email: string;
    client_name: string;
}

interface TeamMemberDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: TeamMember | null;
    onMemberDeleted: () => void;
}

export function TeamMemberDetailDialog({
    open,
    onOpenChange,
    member,
    onMemberDeleted,
}: TeamMemberDetailDialogProps) {
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [stats, setStats] = useState({
        totalQuotes: 0,
        totalAmount: 0,
        totalCommission: 0,
        signedQuotes: 0,
    });

    useEffect(() => {
        if (open && member) {
            fetchMemberData();
        }
    }, [open, member]);

    const fetchMemberData = async () => {
        if (!member) return;

        setLoading(true);
        try {
            // Fetch quotes created by this sales partner
            const { data: quotesData, error: quotesError } = await supabase
                .from('quotes')
                .select('id, created_at, status, content')
                .eq('sales_partner_id', member.id);

            // Handle case where query fails (table may not have sales_partner_id column)
            if (quotesError) {
                // Silently handle - just show empty data
                console.log('Quotes query info:', quotesError.message);
                setQuotes([]);
            } else {
                // Transform quotes data
                const transformedQuotes: Quote[] = (quotesData || []).map((q: any) => {
                    const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                    return {
                        id: q.id,
                        created_at: q.created_at,
                        status: q.status || 'draft',
                        total_amount: content?.totalPrice || content?.total || 0,
                        client_email: content?.clientEmail || 'N/A',
                        client_name: content?.clientName || 'N/A',
                    };
                });
                setQuotes(transformedQuotes);
            }

            // Fetch quote requests (clients) created by this sales partner
            const { data: clientsData, error: clientsError } = await supabase
                .from('quote_requests')
                .select('id, email, name, created_at, status')
                .eq('sales_partner_id', member.id);

            // Handle case where query fails
            if (clientsError) {
                console.log('Clients query info:', clientsError.message);
                setClients([]);
            } else {
                const transformedClients: Client[] = (clientsData || []).map((c: any) => ({
                    id: c.id,
                    email: c.email || 'N/A',
                    name: c.name || 'N/A',
                    created_at: c.created_at,
                    status: c.status || 'new',
                }));
                setClients(transformedClients);
            }

            // Calculate statistics from whatever data we have
            const commissionRate = member.commission_rate || 10;
            const signedQuotesArr = quotes.filter(q => q.status === 'signed' || q.status === 'accepted');
            const totalAmount = quotes.reduce((sum, q) => sum + q.total_amount, 0);
            const signedAmount = signedQuotesArr.reduce((sum, q) => sum + q.total_amount, 0);
            const totalCommission = (signedAmount * commissionRate) / 100;

            setStats({
                totalQuotes: quotes.length,
                totalAmount,
                totalCommission,
                signedQuotes: signedQuotesArr.length,
            });

        } catch (error) {
            // Silent fail - just show empty data
            console.log('Member data fetch info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!member) return;

        setDeleting(true);
        try {
            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error('Session non trouvée');
            }

            // Call delete-user Edge Function
            const { data, error } = await supabase.functions.invoke('delete-user', {
                body: { userId: member.id },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (error) throw error;

            toast.success('Membre supprimé définitivement');
            setDeleteConfirmOpen(false);
            onOpenChange(false);
            onMemberDeleted();
        } catch (error: any) {
            console.error('Error deleting member:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        } finally {
            setDeleting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'signed':
            case 'accepted':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Signé</Badge>;
            case 'sent':
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Envoyé</Badge>;
            case 'draft':
                return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Brouillon</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (!member) return null;

    const memberName = member.sales_partner
        ? `${member.sales_partner.first_name} ${member.sales_partner.last_name}`
        : 'Membre';

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-indigo-500/20">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-500" />
                            {memberName}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Détails du membre et statistiques de performance
                        </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Member Info Card */}
                            <Card className="bg-slate-900/50 border-white/5">
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-slate-500" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Email</p>
                                                <p className="text-sm text-white">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-500" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Membre depuis</p>
                                                <p className="text-sm text-white">
                                                    {new Date(member.created_at).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Percent className="h-4 w-4 text-slate-500" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase">Commission</p>
                                                <p className="text-sm text-white">{member.commission_rate || 10}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {member.sales_partner?.is_active ? (
                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                    Actif
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                                    Inactif
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                <FileText className="h-4 w-4 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{stats.totalQuotes}</p>
                                                <p className="text-[10px] text-slate-400 uppercase">Devis créés</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <Users className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{clients.length}</p>
                                                <p className="text-[10px] text-slate-400 uppercase">Clients</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/20 rounded-lg">
                                                <TrendingUp className="h-4 w-4 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{stats.signedQuotes}</p>
                                                <p className="text-[10px] text-slate-400 uppercase">Devis signés</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                                <DollarSign className="h-4 w-4 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    {formatCurrency(stats.totalCommission)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase">Commissions</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs for Clients and Quotes */}
                            <Tabs defaultValue="clients" className="w-full">
                                <TabsList className="bg-slate-900/50 border border-white/5">
                                    <TabsTrigger value="clients" className="data-[state=active]:bg-indigo-500/20">
                                        <Users className="h-4 w-4 mr-2" />
                                        Clients ({clients.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="quotes" className="data-[state=active]:bg-indigo-500/20">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Devis ({quotes.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="clients" className="mt-4">
                                    <Card className="bg-slate-900/50 border-white/5">
                                        <CardContent className="p-0">
                                            {clients.length === 0 ? (
                                                <div className="text-center py-8 text-slate-500">
                                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p>Aucun client trouvé</p>
                                                </div>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-white/5">
                                                            <TableHead className="text-slate-400">Nom</TableHead>
                                                            <TableHead className="text-slate-400">Email</TableHead>
                                                            <TableHead className="text-slate-400">Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {clients.map((client) => (
                                                            <TableRow key={client.id} className="border-white/5">
                                                                <TableCell className="text-white">{client.name}</TableCell>
                                                                <TableCell className="text-slate-400">{client.email}</TableCell>
                                                                <TableCell className="text-slate-500 text-xs">
                                                                    {new Date(client.created_at).toLocaleDateString('fr-FR')}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="quotes" className="mt-4">
                                    <Card className="bg-slate-900/50 border-white/5">
                                        <CardContent className="p-0">
                                            {quotes.length === 0 ? (
                                                <div className="text-center py-8 text-slate-500">
                                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p>Aucun devis trouvé</p>
                                                </div>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-white/5">
                                                            <TableHead className="text-slate-400">Client</TableHead>
                                                            <TableHead className="text-slate-400">Montant</TableHead>
                                                            <TableHead className="text-slate-400">Statut</TableHead>
                                                            <TableHead className="text-slate-400">Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {quotes.map((quote) => (
                                                            <TableRow key={quote.id} className="border-white/5">
                                                                <TableCell>
                                                                    <div>
                                                                        <p className="text-white">{quote.client_name}</p>
                                                                        <p className="text-xs text-slate-500">{quote.client_email}</p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-white font-medium">
                                                                    {formatCurrency(quote.total_amount)}
                                                                </TableCell>
                                                                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                                                <TableCell className="text-slate-500 text-xs">
                                                                    {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* Delete Button */}
                            <div className="flex justify-end pt-4 border-t border-white/5">
                                <Button
                                    variant="destructive"
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer définitivement
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent className="bg-slate-950 border-red-500/20">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Êtes-vous sûr de vouloir supprimer définitivement <strong className="text-white">{memberName}</strong> ?
                            <br /><br />
                            Cette action est <strong className="text-red-400">irréversible</strong>. Toutes les données associées à ce membre
                            (profil, rôles, partenariat) seront supprimées. Les devis et clients resteront dans le système mais ne seront plus associés à ce membre.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer définitivement
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
