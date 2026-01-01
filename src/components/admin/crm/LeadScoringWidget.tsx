import { LeadScore } from "@/types/leads";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Users, Zap } from "lucide-react";

interface LeadScoringWidgetProps {
    score: LeadScore;
    compact?: boolean;
}

const LeadScoringWidget = ({ score, compact = false }: LeadScoringWidgetProps) => {
    const getQualityConfig = (quality: LeadScore['quality']) => {
        const configs = {
            qualified: {
                label: "Qualifié",
                color: "bg-green-500/10 text-green-300 border-green-500/30",
                icon: Zap,
                gradient: "from-green-600 to-emerald-600"
            },
            hot: {
                label: "Chaud",
                color: "bg-orange-500/10 text-orange-300 border-orange-500/30",
                icon: TrendingUp,
                gradient: "from-orange-600 to-amber-600"
            },
            warm: {
                label: "Tiède",
                color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
                icon: Target,
                gradient: "from-yellow-600 to-orange-500"
            },
            cold: {
                label: "Froid",
                color: "bg-blue-500/10 text-blue-300 border-blue-500/30",
                icon: Clock,
                gradient: "from-blue-600 to-indigo-600"
            }
        };
        return configs[quality];
    };

    const config = getQualityConfig(score.quality);
    const Icon = config.icon;

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <Badge className={`${config.color} border`} variant="outline">
                    <Icon className="w-3 h-3 mr-1" />
                    {config.label}
                </Badge>
                <span className="text-sm font-semibold text-white">{score.score}/100</span>
            </div>
        );
    }

    return (
        <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Score Lead</p>
                            <p className="text-2xl font-bold text-white">{score.score}/100</p>
                        </div>
                    </div>
                    <Badge className={`${config.color} border`} variant="outline">
                        {config.label}
                    </Badge>
                </div>

                <div className="space-y-3">
                    {/* Budget Score */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400">💰 Budget</span>
                            </div>
                            <span className="text-xs font-medium text-white">{score.budget_score}/30</span>
                        </div>
                        <Progress
                            value={(score.budget_score / 30) * 100}
                            className="h-1.5 bg-slate-800"
                        />
                    </div>

                    {/* Timeline Score */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400">⏱️ Timeline</span>
                            </div>
                            <span className="text-xs font-medium text-white">{score.timeline_score}/20</span>
                        </div>
                        <Progress
                            value={(score.timeline_score / 20) * 100}
                            className="h-1.5 bg-slate-800"
                        />
                    </div>

                    {/* Engagement Score */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400">📞 Engagement</span>
                            </div>
                            <span className="text-xs font-medium text-white">{score.engagement_score}/25</span>
                        </div>
                        <Progress
                            value={(score.engagement_score / 25) * 100}
                            className="h-1.5 bg-slate-800"
                        />
                    </div>

                    {/* Fit Score */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400">🎯 Fit Produit</span>
                            </div>
                            <span className="text-xs font-medium text-white">{score.fit_score}/25</span>
                        </div>
                        <Progress
                            value={(score.fit_score / 25) * 100}
                            className="h-1.5 bg-slate-800"
                        />
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-500">
                        Calculé le {new Date(score.calculated_at).toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeadScoringWidget;
