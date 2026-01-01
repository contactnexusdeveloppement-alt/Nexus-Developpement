import { LucideIcon } from "lucide-react";

interface QuoteSummaryCardProps {
    title: string;
    icon: LucideIcon;
    data: Record<string, string | string[] | boolean>;
    colorClass?: string;
    onEdit?: () => void;
}

export const QuoteSummaryCard = ({
    title,
    icon: Icon,
    data,
    colorClass = "border-blue-500/30",
    onEdit
}: QuoteSummaryCardProps) => {
    // Filter out empty/false values
    const displayData = Object.entries(data).filter(([_, value]) => {
        if (typeof value === 'boolean') return value;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.length > 0;
        return false;
    });

    if (displayData.length === 0) {
        return null; // Don't render if no data
    }

    const formatValue = (value: string | string[] | boolean): string => {
        if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
        if (Array.isArray(value)) return value.join(', ');
        return value;
    };

    return (
        <div className={`bg-slate-900/30 border ${colorClass} rounded-lg p-4 group relative overflow-hidden`}>
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg border ${colorClass} bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">{title}</h4>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="text-xs text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        Modifier
                    </button>
                )}
            </div>

            {/* Data grid */}
            <div className="space-y-2">
                {displayData.map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                        <span className="text-xs text-slate-500 min-w-[100px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-xs text-slate-300 font-medium flex-1">{formatValue(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
