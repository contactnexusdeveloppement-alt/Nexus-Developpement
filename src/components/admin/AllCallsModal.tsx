import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Calendar, Clock, Phone, Trash2 } from 'lucide-react';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import EmptyState from './widgets/EmptyState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AllCallsModalProps {
    isOpen: boolean;
    onClose: () => void;
    calls: any[];
    onCallClick: (call: any) => void;
    onRefresh?: () => void;
}

export const AllCallsModal = ({ isOpen, onClose, calls, onCallClick, onRefresh }: AllCallsModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('all');

    // Filter calls
    const filteredCalls = useMemo(() => {
        return calls.filter(call => {
            const matchesSearch =
                call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                call.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                call.phone?.includes(searchQuery);

            if (!matchesSearch) return false;

            const callDate = new Date(`${call.booking_date} ${call.time_slot}`);

            switch (dateFilter) {
                case 'today':
                    return isToday(callDate);
                case 'week':
                    return isThisWeek(callDate, { weekStartsOn: 1 });
                case 'month':
                    return isThisMonth(callDate);
                default:
                    return true;
            }
        });
    }, [calls, searchQuery, dateFilter]);

    const getStatusBadge = (call: any) => {
        const status = call.status || 'pending';
        const colors = {
            confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
            pending: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
            completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };

        return (
            <Badge className={colors[status as keyof typeof colors] || colors.pending}>
                {status === 'confirmed' ? 'Confirmé' :
                    status === 'pending' ? 'En attente' :
                        status === 'cancelled' ? 'Annulé' :
                            status === 'completed' ? 'Terminé' : status}
            </Badge>
        );
    };

    const handleDeleteCall = async (callId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm("Êtes-vous sûr de vouloir supprimer cet appel ? Cette action est irréversible.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('call_bookings')
                .delete()
                .eq('id', callId);

            if (error) throw error;

            toast.success("Appel supprimé avec succès");

            // Refresh data after successful deletion
            if (onRefresh) onRefresh();

            onClose(); // Close modal after delete to refresh data
        } catch (error) {
            console.error('Error deleting call:', error);
            toast.error("Erreur lors de la suppression de l'appel");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-slate-950 border border-white/10 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Tous les appels à venir</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {filteredCalls.length} appel{filteredCalls.length > 1 ? 's' : ''} • Cliquez pour voir le client
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-white/10 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, email ou téléphone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-900 border-slate-700"
                            />
                        </div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                        >
                            <option value="all">Toutes les dates</option>
                            <option value="today">Aujourd'hui</option>
                            <option value="week">Cette semaine</option>
                            <option value="month">Ce mois</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto p-6">
                    {filteredCalls.length === 0 ? (
                        <div className="py-8">
                            <EmptyState
                                icon="📞"
                                message="Aucun appel trouvé"
                                description="Essayez de modifier les filtres de recherche"
                            />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="text-left border-b border-white/10">
                                <tr>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Date & Heure</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Client</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Email</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Téléphone</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Durée</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Statut</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCalls.map((call) => (
                                    <tr
                                        key={call.id}
                                        onClick={() => onCallClick(call)}
                                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <td className="py-4 text-sm text-white">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <div>
                                                    <div className="font-medium">
                                                        {format(new Date(call.booking_date), 'dd MMM yyyy', { locale: fr })}
                                                    </div>
                                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {call.time_slot}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-white font-medium">
                                            {call.name}
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">
                                            {call.email}
                                        </td>
                                        <td className="py-4 text-sm text-white">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-green-400" />
                                                {call.phone}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-white">
                                            {call.duration || 30} min
                                        </td>
                                        <td className="py-4 text-sm">
                                            {getStatusBadge(call)}
                                        </td>
                                        <td className="py-4 text-sm text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCall(call.id, e);
                                                }}
                                                className="h-6 px-2 text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Fermer
                    </Button>
                </div>
            </div>
        </div>
    );
};
