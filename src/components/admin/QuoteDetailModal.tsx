import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    Calendar,
    Euro,
    Download,
    Edit,
    X
} from "lucide-react";
import { exportQuoteToExcel } from "@/utils/export/exportToExcel";
import { calculateQuotePrice, formatPrice } from "@/utils/pricing/calculateQuotePrice";

interface QuoteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: any;
    client: { name: string; email: string };
}

export const QuoteDetailModal = ({
    isOpen,
    onClose,
    quote,
    client,
}: QuoteDetailModalProps) => {
    if (!quote) return null;

    // Calculate pricing if quote has qualification_data
    const priceEstimate = quote.qualification_data
        ? calculateQuotePrice(quote.qualification_data)
        : null;

    const handleExport = () => {
        if (quote.qualification_data && priceEstimate) {
            exportQuoteToExcel({
                quote,
                client,
                formData: quote.qualification_data,
                priceEstimate,
            });
        }
    };

    const isQualified = !!quote.qualification_data;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[85vh] bg-slate-950 border border-white/10 text-white p-0 overflow-hidden flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 shrink-0 bg-gradient-to-r from-amber-900/20 to-slate-900/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <FileText className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-light text-white mb-1">
                                Détails du Devis
                            </DialogTitle>
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-slate-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(quote.created_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <Badge className={isQualified
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                }>
                                    {isQualified ? "✓ Qualifié" : "En attente"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* CONTENT */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Client Info */}
                        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Informations Client</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-500">Nom</span>
                                    <p className="text-white font-medium">{quote.name}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">Email</span>
                                    <p className="text-white font-medium">{quote.email}</p>
                                </div>
                                {quote.phone && (
                                    <div>
                                        <span className="text-xs text-slate-500">Téléphone</span>
                                        <p className="text-white font-medium">{quote.phone}</p>
                                    </div>
                                )}
                                {quote.business_type && (
                                    <div>
                                        <span className="text-xs text-slate-500">Secteur</span>
                                        <p className="text-white font-medium">{quote.business_type}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Services demandés */}
                        {quote.services && quote.services.length > 0 && (
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Services Demandés</h3>
                                <div className="flex flex-wrap gap-2">
                                    {quote.services.map((service: string) => (
                                        <Badge key={service} className="bg-slate-800 text-white border-white/10 px-3 py-1">
                                            {service}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Project Details */}
                        {quote.project_details && (
                            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Description du Projet</h3>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {quote.project_details}
                                </p>
                            </div>
                        )}

                        {/* Budget & Timeline */}
                        <div className="grid grid-cols-2 gap-4">
                            {quote.budget && (
                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">Budget Estimé</h3>
                                    <p className="text-2xl font-bold text-green-400">{quote.budget}</p>
                                </div>
                            )}
                            {quote.timeline && (
                                <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2">Délai Souhaité</h3>
                                    <p className="text-2xl font-bold text-orange-400">{quote.timeline}</p>
                                </div>
                            )}
                        </div>

                        {/* Pricing Estimate (if qualified) */}
                        {isQualified && priceEstimate && (
                            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Euro className="w-5 h-5 text-green-400" />
                                    <h3 className="text-sm font-medium text-green-400 uppercase tracking-wide">Estimation Prix</h3>
                                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 ml-auto">
                                        Confiance: {priceEstimate.confidence}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 mb-1">Minimum</p>
                                        <p className="text-xl font-bold text-white">{formatPrice(priceEstimate.min)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-green-400 mb-1">Recommandé</p>
                                        <p className="text-2xl font-bold text-green-400">{formatPrice(priceEstimate.recommended)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 mb-1">Maximum</p>
                                        <p className="text-xl font-bold text-white">{formatPrice(priceEstimate.max)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Not Qualified Notice */}
                        {!isQualified && (
                            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6 text-center">
                                <p className="text-amber-300 font-medium mb-2">Ce devis n'a pas encore été qualifié</p>
                                <p className="text-slate-400 text-sm">Utilisez le wizard de qualification pour établir une estimation précise</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* FOOTER */}
                <div className="flex items-center justify-between px-8 py-4 border-t border-slate-800 bg-slate-900/30 shrink-0">
                    <div className="text-xs text-slate-500">
                        ID: {quote.id?.substring(0, 8)}...
                    </div>
                    <div className="flex gap-3">
                        {isQualified && (
                            <Button
                                onClick={handleExport}
                                className="bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter Excel
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            onClick={onClose}
                        >
                            Fermer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
