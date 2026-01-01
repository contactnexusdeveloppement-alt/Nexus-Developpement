import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    onExport?: () => void;
    onFullscreen?: () => void;
    loading?: boolean;
}

const ChartCard = ({ title, description, children, onExport, onFullscreen, loading = false }: ChartCardProps) => {
    return (
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
                        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
                    </div>
                    <div className="flex gap-2">
                        {onExport && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onExport}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        )}
                        {onFullscreen && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onFullscreen}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-64 bg-slate-800/30 rounded-lg animate-pulse flex items-center justify-center">
                        <p className="text-slate-500">Chargement...</p>
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
};

export default ChartCard;
