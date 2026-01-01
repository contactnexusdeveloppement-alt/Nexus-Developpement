import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import EmptyState from './widgets/EmptyState';

interface AllQuotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotes: any[];
    onQuoteClick: (quote: any) => void;
}

export const AllQuotesModal = ({ isOpen, onClose, quotes, onQuoteClick }: AllQuotesModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [budgetFilter, setBudgetFilter] = useState<string>('all');

    // Filter quotes
    const filteredQuotes = useMemo(() => {
        return quotes.filter(quote => {
            const matchesSearch =
                quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.services?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesBudget = budgetFilter === 'all' || quote.budget === budgetFilter;

            return matchesSearch && matchesBudget;
        });
    }, [quotes, searchQuery, budgetFilter]);

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
                        <h2 className="text-2xl font-bold text-white">Tous les devis en attente</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {filteredQuotes.length} devis • Cliquez sur un devis pour voir le client
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
                                placeholder="Rechercher par nom, email ou service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-900 border-slate-700"
                            />
                        </div>
                        <select
                            value={budgetFilter}
                            onChange={(e) => setBudgetFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white"
                        >
                            <option value="all">Tous les budgets</option>
                            <option value="< 5000€">{"< 5000€"}</option>
                            <option value="5000€ - 10000€">5000€ - 10000€</option>
                            <option value="10000€ - 20000€">10000€ - 20000€</option>
                            <option value="20000€ - 50000€">20000€ - 50000€</option>
                            <option value="> 50000€">{"> 50000€"}</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto p-6">
                    {filteredQuotes.length === 0 ? (
                        <div className="py-8">
                            <EmptyState
                                icon="📋"
                                message="Aucun devis trouvé"
                                description="Essayez de modifier les filtres de recherche"
                            />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="text-left border-b border-white/10">
                                <tr>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Date</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Client</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Email</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Services</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Budget</th>
                                    <th className="pb-3 text-slate-400 font-medium text-sm">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotes.map((quote) => (
                                    <tr
                                        key={quote.id}
                                        onClick={() => onQuoteClick(quote)}
                                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <td className="py-4 text-sm text-white">
                                            {formatDate(quote.created_at)}
                                        </td>
                                        <td className="py-4 text-sm text-white font-medium">
                                            {quote.name}
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">
                                            {quote.email}
                                        </td>
                                        <td className="py-4 text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {quote.services?.slice(0, 2).map((service: string, idx: number) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {service}
                                                    </Badge>
                                                ))}
                                                {quote.services?.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{quote.services.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-white">
                                            {quote.budget || '—'}
                                        </td>
                                        <td className="py-4 text-sm">
                                            <Badge variant="outline" className="text-xs">
                                                {quote.business_type || 'Non spécifié'}
                                            </Badge>
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
