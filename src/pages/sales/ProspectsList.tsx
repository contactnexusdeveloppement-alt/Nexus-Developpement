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
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
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
    full_name: string;
    email: string;
    phone: string | null;
    company_name: string | null;
    status: string;
    lead_score: number;
    created_at: string;
}

interface ProspectFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
    role: string;
    status: string;
}

const ProspectsList = () => {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
    const [salesPartnerId, setSalesPartnerId] = useState<string | null>(null);

    // Form data persists even when dialog closes (not reset on close)
    const [formData, setFormData] = useState<ProspectFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        role: '',
        status: 'new',
    });

    const fetchProspects = async () => {
        try {
            setLoading(true);

            // Get current user's sales partner ID
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: partnerData } = await supabase
                .from('sales_partners')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!partnerData) return;

            setSalesPartnerId(partnerData.id);

            // Fetch prospects for this sales partner
            const { data, error } = await supabase
                .from('prospects')
                .select('*')
                .eq('sales_partner_id', partnerData.id)
                .order('created_at', { ascending: false });

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
            // Editing: populate with existing data
            const nameParts = (prospect.full_name || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setEditingProspect(prospect);
            setFormData({
                first_name: firstName,
                last_name: lastName,
                email: prospect.email,
                phone: prospect.phone || '',
                company_name: prospect.company_name || '',
                role: '',
                status: prospect.status,
            });
        } else {
            // New: keep existing form data (don't reset) - only clear if submitting was successful
            setEditingProspect(null);
        }
        setDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            company_name: '',
            role: '',
            status: 'new',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!salesPartnerId) {
            toast.error('Erreur: ID commercial non trouvé');
            return;
        }

        const fullName = `${formData.first_name} ${formData.last_name}`.trim();

        try {
            if (editingProspect) {
                // Update existing prospect
                const { error } = await supabase
                    .from('prospects')
                    .update({
                        full_name: fullName,
                        email: formData.email,
                        phone: formData.phone || null,
                        company_name: formData.company_name || null,
                        role: formData.role || null,
                        status: formData.status,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', editingProspect.id);

                if (error) throw error;
                toast.success('Prospect mis à jour');
            } else {
                // Create new prospect - status is always 'new'
                const { error } = await supabase
                    .from('prospects')
                    .insert({
                        full_name: fullName,
                        email: formData.email,
                        phone: formData.phone || null,
                        company_name: formData.company_name || null,
                        role: formData.role || null,
                        status: 'new',
                        sales_partner_id: salesPartnerId,
                        source: 'sales_partner',
                    });

                if (error) throw error;
                toast.success('Prospect ajouté');
            }

            // Only reset form and close after successful submission
            resetForm();
            setDialogOpen(false);
            fetchProspects();
        } catch (error) {
            console.error('Error saving prospect:', error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) return;

        try {
            const { error } = await supabase
                .from('prospects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Prospect supprimé');
            fetchProspects();
        } catch (error) {
            console.error('Error deleting prospect:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            new: { label: 'Nouveau', className: 'bg-blue-500' },
            contacted: { label: 'Contacté', className: 'bg-yellow-500' },
            qualified: { label: 'Qualifié', className: 'bg-purple-500' },
            proposal_sent: { label: 'Devis envoyé', className: 'bg-orange-500' },
            negotiation: { label: 'Négociation', className: 'bg-pink-500' },
            closed_won: { label: 'Gagné ✓', className: 'bg-green-500' },
            closed_lost: { label: 'Perdu', className: 'bg-red-500' },
        };

        const config = statusConfig[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Mes Prospects</h1>
                        <p className="text-slate-400 mt-1">
                            Gérez votre pipeline commercial
                        </p>
                    </div>
                    <Button
                        onClick={() => handleOpenDialog()}
                        className="bg-blue-600 hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Prospect
                    </Button>
                </div>

                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Liste des Prospects ({prospects.length})</CardTitle>
                        <CardDescription className="text-slate-400">
                            Tous vos prospects et leur statut actuel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {prospects.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Nom</TableHead>
                                        <TableHead className="text-slate-300">Entreprise</TableHead>
                                        <TableHead className="text-slate-300">Email</TableHead>
                                        <TableHead className="text-slate-300">Téléphone</TableHead>
                                        <TableHead className="text-slate-300">Statut</TableHead>
                                        <TableHead className="text-slate-300">Score</TableHead>
                                        <TableHead className="text-slate-300">Ajouté le</TableHead>
                                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prospects.map((prospect) => (
                                        <TableRow key={prospect.id} className="border-slate-700 hover:bg-slate-800">
                                            <TableCell className="font-medium text-white">
                                                {prospect.full_name || '—'}
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {prospect.company_name || '—'}
                                            </TableCell>
                                            <TableCell className="text-slate-300">{prospect.email}</TableCell>
                                            <TableCell className="text-slate-300">{prospect.phone || '—'}</TableCell>
                                            <TableCell>{getStatusBadge(prospect.status)}</TableCell>
                                            <TableCell className="text-slate-300">{prospect.lead_score}</TableCell>
                                            <TableCell className="text-slate-300">
                                                {new Date(prospect.created_at).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(prospect)}
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(prospect.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                Aucun prospect pour le moment. Cliquez sur "Nouveau Prospect" pour commencer.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Prospect Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-700">
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-slate-200">Prénom *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    placeholder="Jean"
                                    required
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-slate-200">Nom *</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    placeholder="Dupont"
                                    required
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jean.dupont@entreprise.fr"
                                    required
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-200">Téléphone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="06 12 34 56 78"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company_name" className="text-slate-200">Entreprise</Label>
                                <Input
                                    id="company_name"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder="Nom de l'entreprise"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-slate-200">Fonction</Label>
                                <Input
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="Directeur, Gérant..."
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>

                        {/* Only show status selector when editing */}
                        {editingProspect && (
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-200">Statut</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="new" className="text-white hover:bg-slate-700">Nouveau</SelectItem>
                                        <SelectItem value="contacted" className="text-white hover:bg-slate-700">Contacté</SelectItem>
                                        <SelectItem value="qualified" className="text-white hover:bg-slate-700">Qualifié</SelectItem>
                                        <SelectItem value="proposal_sent" className="text-white hover:bg-slate-700">Devis envoyé</SelectItem>
                                        <SelectItem value="negotiation" className="text-white hover:bg-slate-700">Négociation</SelectItem>
                                        <SelectItem value="closed_won" className="text-white hover:bg-slate-700">Gagné</SelectItem>
                                        <SelectItem value="closed_lost" className="text-white hover:bg-slate-700">Perdu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500"
                            >
                                {editingProspect ? 'Mettre à jour' : 'Ajouter'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProspectsList;
