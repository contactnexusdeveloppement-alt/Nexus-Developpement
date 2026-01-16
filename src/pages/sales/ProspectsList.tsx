import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Edit, Trash2, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Prospect {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    business_type: string | null;
    status: string;
    created_at: string;
}

interface ProspectQuote {
    id: string;
    quote_number: string;
    amount: number;
    status: string;
    created_at: string;
}

interface ProspectFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    business_type: string;
    status: string;
}

const ProspectsList = () => {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
    const [salesPartnerId, setSalesPartnerId] = useState<string | null>(null);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewingProspect, setViewingProspect] = useState<Prospect | null>(null);
    const [prospectQuotes, setProspectQuotes] = useState<ProspectQuote[]>([]);

    const [formData, setFormData] = useState<ProspectFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        business_type: '',
        status: 'new',
    });

    const fetchProspects = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: partnerData, error: partnerError } = await supabase
                .from('sales_partners')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (partnerError) {
                console.error('Error fetching partner:', partnerError);
            }

            let currentPartnerId = partnerData?.id;

            // Auto-create profile if missing
            if (!currentPartnerId) {
                console.log('Profile missing, auto-creating...');
                const { data: newProfile, error: createError } = await supabase
                    .from('sales_partners')
                    .insert({
                        user_id: user.id,
                        email: user.email,
                        first_name: user.user_metadata?.full_name?.split(' ')[0] || 'Nouveau',
                        last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'Commercial',
                        is_active: true
                    })
                    .select()
                    .maybeSingle();

                if (createError) {
                    console.error('Error creating profile:', createError);
                } else if (newProfile) {
                    currentPartnerId = newProfile.id;
                    toast.success('Profil commercial initialisé');
                }
            }

            setSalesPartnerId(currentPartnerId);

            let query = supabase
                .from('prospects')
                .select('*')
                .order('created_at', { ascending: false });

            // If we have a partner ID, only show their prospects. 
            // If not (admin or error), show all (RLS might still filter).
            if (currentPartnerId) {
                query = query.eq('sales_partner_id', currentPartnerId);
            }

            const { data, error } = await query;

            if (error) throw error;
            setProspects(data || []);
        } catch (error) {
            console.error('Error fetching prospects:', error);
            toast.error('Erreur lors du chargement des prospects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProspects();
    }, []);

    const handleOpenDialog = (prospect?: Prospect) => {
        if (prospect) {
            setEditingProspect(prospect);
            setFormData({
                name: prospect.name || '',
                email: prospect.email,
                phone: prospect.phone || '',
                address: prospect.address || '',
                city: prospect.city || '',
                postal_code: prospect.postal_code || '',
                business_type: prospect.business_type || '',
                status: prospect.status,
            });
        } else {
            setEditingProspect(null);
            // Optionally reset form here if desired, otherwise keep last draft
        }
        setDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
            business_type: '',
            status: 'new',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // We allow creating without salesPartnerId (it will be null) 
        // useful for admins or if the profile system is optional.

        try {
            if (editingProspect) {
                const { error } = await supabase
                    .from('prospects')
                    .update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone || null,
                        address: formData.address || null,
                        city: formData.city || null,
                        postal_code: formData.postal_code || null,
                        business_type: formData.business_type || null,
                        status: formData.status,
                    })
                    .eq('id', editingProspect.id);

                if (error) throw error;
                toast.success('Prospect mis à jour');
            } else {
                const { error } = await supabase
                    .from('prospects')
                    .insert({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone || null,
                        address: formData.address || null,
                        city: formData.city || null,
                        postal_code: formData.postal_code || null,
                        business_type: formData.business_type || null,
                        status: 'new',
                        sales_partner_id: salesPartnerId, // Can be null
                    });

                if (error) throw error;
                toast.success('Prospect ajouté');
            }

            resetForm();
            setDialogOpen(false);
            fetchProspects();
        } catch (error) {
            console.error('Error saving prospect:', error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [prospectToDelete, setProspectToDelete] = useState<Prospect | null>(null);

    const handleDeleteClick = (prospect: Prospect) => {
        setProspectToDelete(prospect);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!prospectToDelete) return;

        try {
            const { error } = await supabase.from('prospects').delete().eq('id', prospectToDelete.id);
            if (error) throw error;
            toast.success('Prospect supprimé');
            fetchProspects();
            setDeleteDialogOpen(false);
            setProspectToDelete(null);
        } catch (error) {
            console.error('Error deleting prospect:', error);
            toast.error('Erreur lors de la suppression (vérifiez les permissions)');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            new: { label: 'Nouveau', className: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
            contacted: { label: 'Contacté', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' },
            qualified: { label: 'Qualifié', className: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
            proposal_sent: { label: 'Devis envoyé', className: 'bg-orange-500/20 text-orange-300 border-orange-500/50' },
            negotiation: { label: 'Négociation', className: 'bg-pink-500/20 text-pink-300 border-pink-500/50' },
            closed_won: { label: 'Gagné ✓', className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
            closed_lost: { label: 'Perdu', className: 'bg-red-500/20 text-red-300 border-red-500/50' },
            draft: { label: 'Brouillon', className: 'bg-slate-500/20 text-slate-300' },
            sent: { label: 'Envoyé', className: 'bg-blue-500/20 text-blue-300' },
            accepted: { label: 'Accepté', className: 'bg-emerald-500/20 text-emerald-300' },
            rejected: { label: 'Refusé', className: 'bg-red-500/20 text-red-300' },
        };
        const config = statusConfig[status] || { label: status, className: 'bg-slate-500/20 text-slate-300' };
        return <Badge variant="outline" className={`${config.className} border shadow-sm`}>{config.label}</Badge>;
    };

    const handleViewDetail = async (prospect: Prospect) => {
        setViewingProspect(prospect);
        setProspectQuotes([]); // Reset first
        setViewDialogOpen(true);

        try {
            const { data, error } = await supabase
                .from('quotes')
                .select('id, quote_number, amount, status, created_at')
                .eq('prospect_id', prospect.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setProspectQuotes(data);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            toast.error('Impossible de charger l\'historique des devis');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Gestion des Prospects</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Suivez et convertissez vos opportunités
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Prospect
                </Button>
            </div>

            <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-medium text-white">Liste complète</CardTitle>
                            <CardDescription className="text-slate-400">
                                {prospects.length} prospects dans votre base
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {prospects.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-medium h-10 w-[250px]">Prospect</TableHead>
                                    <TableHead className="text-slate-400 font-medium h-10 hidden md:table-cell">Contact</TableHead>
                                    <TableHead className="text-slate-400 font-medium h-10">Statut</TableHead>
                                    <TableHead className="text-slate-400 font-medium text-right h-10">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prospects.map((prospect) => (
                                    <TableRow key={prospect.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                        <TableCell className="font-medium text-slate-200">
                                            <div className="flex flex-col">
                                                <span className="text-white font-semibold">{prospect.name || 'Sans nom'}</span>
                                                {prospect.business_type && (
                                                    <span className="text-xs text-slate-500">{prospect.business_type}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex flex-col text-sm text-slate-400">
                                                <span>{prospect.email}</span>
                                                <span className="text-xs">{prospect.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(prospect.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewDetail(prospect)} className="h-8 w-8 text-slate-500 hover:text-purple-400 hover:bg-purple-500/10">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(prospect)} className="h-8 w-8 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(prospect)} className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Users className="w-10 h-10 opacity-20" />
                                <p>Aucun prospect trouvé.</p>
                                <Button variant="link" onClick={() => handleOpenDialog()} className="text-blue-400">Ajouter votre premier prospect</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] bg-slate-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-3">
                            {viewingProspect?.name}
                            {viewingProspect && getStatusBadge(viewingProspect.status)}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Fiche détaillée du client
                        </DialogDescription>
                    </DialogHeader>

                    {viewingProspect && (
                        <div className="space-y-6 mt-4">
                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/50 rounded-lg border border-white/5">
                                <div>
                                    <Label className="text-xs text-slate-500 uppercase font-bold">Email</Label>
                                    <div className="text-slate-200">{viewingProspect.email}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500 uppercase font-bold">Téléphone</Label>
                                    <div className="text-slate-200">{viewingProspect.phone || '-'}</div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-xs text-slate-500 uppercase font-bold">Adresse</Label>
                                    <div className="text-slate-200">
                                        {viewingProspect.address}<br />
                                        {viewingProspect.postal_code} {viewingProspect.city}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500 uppercase font-bold">Type / Entreprise</Label>
                                    <div className="text-slate-200">{viewingProspect.business_type || '-'}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500 uppercase font-bold">Client depuis le</Label>
                                    <div className="text-slate-200">{new Date(viewingProspect.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {/* Quotes History */}
                            <div>
                                <h3 className="text-md font-semibold text-white mb-3">Historique des Devis</h3>
                                {prospectQuotes.length > 0 ? (
                                    <div className="border border-white/10 rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-950">
                                                <TableRow className="border-white/5">
                                                    <TableHead className="text-slate-400">Ref.</TableHead>
                                                    <TableHead className="text-slate-400">Date</TableHead>
                                                    <TableHead className="text-slate-400">Montant</TableHead>
                                                    <TableHead className="text-slate-400">Statut</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {prospectQuotes.map((quote) => (
                                                    <TableRow key={quote.id} className="border-white/5 hover:bg-white/5">
                                                        <TableCell className="text-blue-400 font-mono text-xs">
                                                            {quote.quote_number}
                                                        </TableCell>
                                                        <TableCell className="text-slate-300">
                                                            {new Date(quote.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-slate-300 font-medium">
                                                            {quote.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(quote.status)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-950/30 rounded-lg border border-white/5 border-dashed">
                                        <p className="text-slate-500 text-sm">Aucun devis associé à ce prospect.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[550px] bg-slate-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingProspect ? 'Modifier le Prospect' : 'Nouveau Prospect'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {editingProspect
                                ? 'Modifiez les informations du prospect'
                                : 'Ajoutez un nouveau prospect à votre pipeline'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-200">Nom complet *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Jean Dupont"
                                required
                                className="bg-slate-950/50 border-white/10 text-white focus:border-blue-500/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                    required
                                    className="bg-slate-950/50 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-200">Téléphone *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="06..."
                                    required
                                    className="bg-slate-950/50 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-slate-200">Adresse complète *</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 rue de la Paix"
                                required
                                className="bg-slate-950/50 border-white/10 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postal_code" className="text-slate-200">Code Postal *</Label>
                                <Input
                                    id="postal_code"
                                    value={formData.postal_code}
                                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                    placeholder="75000"
                                    required
                                    className="bg-slate-950/50 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-slate-200">Ville *</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Paris"
                                    required
                                    className="bg-slate-950/50 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="business_type" className="text-slate-200">Entreprise / Type</Label>
                            <Input
                                id="business_type"
                                value={formData.business_type}
                                onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                                placeholder="Nom de l'entreprise ou secteur"
                                className="bg-slate-950/50 border-white/10 text-white"
                            />
                        </div>

                        {editingProspect && (
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-200">Statut</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger className="bg-slate-950/50 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        <SelectItem value="new" className="text-white hover:bg-white/5">Nouveau</SelectItem>
                                        <SelectItem value="contacted" className="text-white hover:bg-white/5">Contacté</SelectItem>
                                        <SelectItem value="qualified" className="text-white hover:bg-white/5">Qualifié</SelectItem>
                                        <SelectItem value="proposal_sent" className="text-white hover:bg-white/5">Devis envoyé</SelectItem>
                                        <SelectItem value="negotiation" className="text-white hover:bg-white/5">Négociation</SelectItem>
                                        <SelectItem value="closed_won" className="text-white hover:bg-white/5">Gagné</SelectItem>
                                        <SelectItem value="closed_lost" className="text-white hover:bg-white/5">Perdu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">Annuler</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Confirmer la suppression</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Êtes-vous sûr de vouloir supprimer définitivement ce prospect ?
                        </DialogDescription>
                    </DialogHeader>
                    {prospectToDelete && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300">
                            <span className="font-semibold">{prospectToDelete.name}</span>
                            <br />
                            <span className="text-xs">Cela supprimera également tous les devis associés.</span>
                        </div>
                    )}
                    <DialogFooter className="mt-4 gap-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                            Annuler
                        </Button>
                        <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProspectsList;
