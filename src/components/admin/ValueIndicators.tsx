import { Euro, TrendingUp, Target, Calendar } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface ValueIndicatorsProps {
    quotes: any[];
    projects?: any[];
}

export const ValueIndicators = ({ quotes, projects = [] }: ValueIndicatorsProps) => {
    // Calculate metrics
    const qualifiedQuotes = quotes.filter(q => q.qualification_data);
    const totalEstimatedValue = qualifiedQuotes.reduce((sum, q) => {
        // Simplified price calculation - you can enhance this
        const basePrice = q.service_type === 'webapp' ? 5000 :
            q.service_type === 'mobile' ? 8000 :
                q.service_type === 'ecommerce' ? 10000 :
                    q.service_type === 'vitrine' ? 2000 :
                        q.service_type === 'automation' ? 3000 :
                            q.service_type === 'identity' ? 1500 : 3000;
        return sum + basePrice;
    }, 0);

    const conversionRate = quotes.length > 0
        ? Math.round((qualifiedQuotes.length / quotes.length) * 100)
        : 0;

    const averageQuoteValue = qualifiedQuotes.length > 0
        ? totalEstimatedValue / qualifiedQuotes.length
        : 0;

    const activeProjects = projects.filter(p => p.status === 'active').length;

    const indicators = [
        {
            label: 'Valeur Totale Estimée',
            value: formatPrice(totalEstimatedValue),
            icon: Euro,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30'
        },
        {
            label: 'Taux de Qualification',
            value: `${conversionRate}%`,
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            subtitle: `${qualifiedQuotes.length}/${quotes.length} devis`
        },
        {
            label: 'Valeur Moyenne Devis',
            value: formatPrice(averageQuoteValue),
            icon: TrendingUp,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/30'
        },
        {
            label: 'Projets Actifs',
            value: activeProjects.toString(),
            icon: Calendar,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {indicators.map((indicator, idx) => {
                const Icon = indicator.icon;
                return (
                    <div
                        key={idx}
                        className={`border ${indicator.borderColor} ${indicator.bgColor} rounded-lg p-4 hover:scale-105 transition-transform`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                {indicator.label}
                            </span>
                            <Icon className={`w-5 h-5 ${indicator.color}`} />
                        </div>
                        <div className={`text-2xl font-bold ${indicator.color} mb-1`}>
                            {indicator.value}
                        </div>
                        {indicator.subtitle && (
                            <div className="text-xs text-slate-500">
                                {indicator.subtitle}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
