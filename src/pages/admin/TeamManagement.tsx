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
import { InviteUserDialog } from '@/components/admin/InviteUserDialog';
import { TeamMemberDetailDialog } from '@/components/admin/TeamMemberDetailDialog';
import { UserPlus, Shield, Users, MoreVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const TeamManagement = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);

            // Fetch all sales partners with their profile information  
            const { data: salesData, error: salesError } = await supabase
                .from('sales_partners')
                .select(`
                    id,
                    commission_rate,
                    is_active,
                    created_at,
                    profiles:profiles!sales_partners_profiles_fkey(id, email, full_name, role)
                `);

            if (salesError) throw salesError;

            // Transform the data
            const members: TeamMember[] = (salesData || []).map((sp: any) => ({
                id: sp.id,
                email: sp.profiles?.email || 'N/A',
                role: 'sales',
                created_at: sp.created_at,
                commission_rate: sp.commission_rate || 10,
                sales_partner: {
                    first_name: sp.profiles?.full_name?.split(' ')[0] || '',
                    last_name: sp.profiles?.full_name?.split(' ').slice(1).join(' ') || '',
                    phone: null, // Phone not in current schema
                    is_active: sp.is_active,
                },
            }));

            setTeamMembers(members);

        } catch (error) {
            console.error('Error fetching team members:', error);
            toast.error('Erreur lors du chargement de l\'équipe');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const handleToggleActive = async (member: TeamMember) => {
        if (!member.sales_partner) return;

        try {
            const { error } = await supabase
                .from('sales_partners')
                .update({ is_active: !member.sales_partner.is_active })
                .eq('user_id', member.id);

            if (error) throw error;

            toast.success(
                member.sales_partner.is_active
                    ? 'Commercial désactivé'
                    : 'Commercial réactivé'
            );
            fetchTeamMembers();
        } catch (error) {
            console.error('Error toggling active status:', error);
            toast.error('Erreur lors de la modification');
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-500 hover:bg-purple-600"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
            case 'sales':
                return <Badge className="bg-blue-500 hover:bg-blue-600"><Users className="h-3 w-3 mr-1" />Commercial</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        Gestion de l'Équipe
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Gérez les membres de votre équipe et leurs accès
                    </p>
                </div>
                <Button
                    onClick={() => setInviteDialogOpen(true)}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Inviter un membre
                </Button>
            </div>

            {/* Team Members Card */}
            <Card className="bg-slate-950/40 border-indigo-500/20 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                <CardHeader className="pb-3 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-500" />
                            Membres de l'équipe ({teamMembers.length})
                        </CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                        Liste de tous les membres avec leurs rôles et statuts
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-auto">
                        <Table>
                            <TableHeader className="bg-slate-950/50 sticky top-0 z-10">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Nom</TableHead>
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Email</TableHead>
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Téléphone</TableHead>
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Rôle</TableHead>
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Statut</TableHead>
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8">Membre depuis</TableHead>
                                    <TableHead className="text-gray-400 font-mono text-[10px] uppercase h-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembers.length === 0 ? (
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableCell colSpan={7} className="py-12">
                                            <div className="text-center">
                                                <Users className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                                                <p className="text-slate-400 font-medium">Aucun membre dans l'équipe</p>
                                                <p className="text-slate-500 text-sm mt-1">
                                                    Commencez par inviter des membres à rejoindre votre équipe
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    teamMembers.map((member) => (
                                        <TableRow
                                            key={member.id}
                                            className="border-white/5 hover:bg-indigo-500/5 transition-colors cursor-pointer"
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setDetailDialogOpen(true);
                                            }}
                                        >
                                            <TableCell className="py-3">
                                                <div className="font-medium text-white text-sm">
                                                    {member.sales_partner
                                                        ? `${member.sales_partner.first_name} ${member.sales_partner.last_name}`
                                                        : 'Admin User'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="text-xs text-slate-400">{member.email}</div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="text-xs text-slate-400">
                                                    {member.sales_partner?.phone || '—'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">{getRoleBadge(member.role)}</TableCell>
                                            <TableCell className="py-3">
                                                {member.sales_partner ? (
                                                    member.sales_partner.is_active ? (
                                                        <Badge variant="outline" className="border-green-500/30 text-green-300 bg-green-950/30 text-[10px]">
                                                            Actif
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-gray-500/30 text-gray-400 bg-gray-950/30 text-[10px]">
                                                            Inactif
                                                        </Badge>
                                                    )
                                                ) : (
                                                    <Badge variant="outline" className="border-green-500/30 text-green-300 bg-green-950/30 text-[10px]">
                                                        Actif
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="text-[10px] text-gray-600 font-mono">
                                                    {new Date(member.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setDetailDialogOpen(true);
                                                            }}
                                                            className="text-white hover:bg-slate-800 cursor-pointer"
                                                        >
                                                            Voir le profil
                                                        </DropdownMenuItem>
                                                        {member.sales_partner && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleToggleActive(member)}
                                                                className="text-white hover:bg-slate-800 cursor-pointer"
                                                            >
                                                                {member.sales_partner.is_active ? 'Désactiver' : 'Réactiver'}
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <InviteUserDialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
                onSuccess={fetchTeamMembers}
            />

            <TeamMemberDetailDialog
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
                member={selectedMember}
                onMemberDeleted={fetchTeamMembers}
            />
        </div>
    );
};

export default TeamManagement;
