import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    color?: string; // e.g. "text-blue-400"
    delay?: number;
}

const StatsCard = ({
    label,
    value,
    subValue,
    icon: Icon,
    color = "text-slate-400",
    delay = 0
}: StatsCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
        >
            <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md relative overflow-hidden group hover:bg-slate-800/40 transition-all duration-300 hover:border-white/10 shadow-lg shadow-black/20">

                {/* Very subtle glow only on hover */}
                <div className={cn(
                    "absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 blur-3xl group-hover:opacity-5 transition-opacity duration-700",
                    color.replace("text-", "bg-")
                )} />

                <CardContent className="p-5 md:p-6">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">{label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</h3>
                            </div>
                            {subValue && (
                                <p className="text-xs text-slate-400 mt-1.5 font-medium">{subValue}</p>
                            )}
                        </div>

                        <div className={cn(
                            "p-2.5 md:p-3 rounded-lg bg-slate-800/50 border border-white/5 shadow-sm group-hover:bg-slate-800/80 transition-colors",
                        )}>
                            <Icon className={cn("w-5 h-5 md:w-6 md:h-6", color)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StatsCard;
