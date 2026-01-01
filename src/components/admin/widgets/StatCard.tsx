import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: number;
        label: string;
    };
    color?: string;
    loading?: boolean;
    subtitle?: string;
    tooltip?: string;
    actionButton?: {
        label: string;
        onClick: () => void;
    };
}

const StatCard = ({ title, value, trend, color = "blue", loading = false, subtitle, tooltip, actionButton }: StatCardProps) => {
    // Classe de couleur pour la barre latérale uniquement
    const borderColorClasses = {
        blue: "border-l-blue-500",
        green: "border-l-green-500",
        orange: "border-l-orange-500",
        purple: "border-l-purple-500",
        red: "border-l-red-500",
        teal: "border-l-teal-500",
    };

    // Classe de couleur pour le texte de la valeur
    const textColorClasses = {
        blue: "text-blue-400",
        green: "text-green-400",
        orange: "text-orange-400",
        purple: "text-purple-400",
        red: "text-red-400",
        teal: "text-teal-400",
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend.value > 0) return <TrendingUp className="w-4 h-4" />;
        if (trend.value < 0) return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (!trend) return "";
        if (trend.value > 0) return "text-green-400";
        if (trend.value < 0) return "text-red-400";
        return "text-gray-400";
    };

    return (
        <Card
            className={`bg-slate-950/40 border-white/5 border-l-4 ${borderColorClasses[color as keyof typeof borderColorClasses] || borderColorClasses.blue
                } backdrop-blur-sm transition-all duration-300 hover:bg-slate-950/60`}
        >
            <CardContent className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{title}</p>
                        {tooltip && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-3 h-3 text-slate-600 hover:text-slate-400 cursor-help transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-800 border-white/10 text-slate-200 max-w-xs">
                                        <p className="text-xs">{tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    {/* Value */}
                    {loading ? (
                        <div className="h-10 w-32 bg-slate-700/50 rounded animate-pulse" />
                    ) : (
                        <div className="space-y-1">
                            <p
                                className={`text-3xl font-bold font-mono ${textColorClasses[color as keyof typeof textColorClasses] || textColorClasses.blue
                                    }`}
                            >
                                {value}
                            </p>
                            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                        </div>
                    )}

                    {/* Trend */}
                    {trend && !loading && (
                        <div className={`flex items-center gap-1.5 text-xs ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span className="font-semibold">{Math.abs(trend.value).toFixed(1)}%</span>
                            <span className="text-slate-500">{trend.label}</span>
                        </div>
                    )}

                    {/* Action Button */}
                    {actionButton && !loading && (
                        <button
                            onClick={actionButton.onClick}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1 hover:underline"
                        >
                            {actionButton.label} →
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
