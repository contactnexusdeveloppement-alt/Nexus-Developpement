import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Plus,
    FolderKanban,
    Euro,
    Calendar,
    Loader2,
    ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, formatDate, getProjectStatusColor, getProjectStatusLabel } from '@/utils/formatters';
import { toast } from 'sonner';
import EmptyState from './widgets/EmptyState';

interface ProjectsSectionProps {
    clientEmail: string;
}

interface Project {
    id: string;
    client_email: string;
    project_name: string;
    project_type: string | null;
    status: string;
    progress: number;
    start_date: string | null;
    end_date: string | null;
    estimated_value: number | null;
    description: string | null;
    created_at: string;
}

export const ProjectsSection = ({ clientEmail }: ProjectsSectionProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
        loadProjects();
    }, [clientEmail]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('client_projects')
                .select('*')
                .eq('client_email', clientEmail)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error: any) {
            console.error('Error loading projects:', error);
            toast.error('Erreur chargement projets');
        } finally {
            setLoading(false);
        }
    };

    const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled');
    const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'cancelled');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Projets</h3>
                    <p className="text-sm text-slate-400">
                        {activeProjects.length} actifs • {completedProjects.length} terminés
                    </p>
                </div>
                <Button
                    onClick={() => toast.info('Fonctionnalité à venir')}
                    className="bg-purple-600 hover:bg-purple-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Projet
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-400" />
                </div>
            ) : projects.length === 0 ? (
                <div className="py-8">
                    <EmptyState
                        icon="📁"
                        message="Aucun projet pour ce client"
                        description="Créez le premier projet pour commencer le suivi"
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Active Projects */}
                    {activeProjects.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
                                Projets Actifs
                            </h4>
                            <div className="space-y-3">
                                {activeProjects.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Projects (Collapsible) */}
                    {completedProjects.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowCompleted(!showCompleted)}
                                className="flex items-center gap-2 text-sm font-medium text-slate-400 uppercase tracking-wide mb-3 hover:text-white transition-colors"
                            >
                                <ChevronRight className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-90' : ''}`} />
                                Projets Terminés ({completedProjects.length})
                            </button>
                            {showCompleted && (
                                <div className="space-y-3">
                                    {completedProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Project Card Component
const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-purple-500/30 transition-all group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">
                            {project.project_name}
                        </h4>
                        <Badge className={getProjectStatusColor(project.status)}>
                            {getProjectStatusLabel(project.status)}
                        </Badge>
                    </div>
                    {project.project_type && (
                        <p className="text-sm text-slate-400">{project.project_type}</p>
                    )}
                </div>
                {project.estimated_value && (
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Valeur estimée</p>
                        <p className="text-xl font-bold text-green-400">
                            {formatPrice(project.estimated_value)}
                        </p>
                    </div>
                )}
            </div>

            {/* Description */}
            {project.description && (
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {project.description}
                </p>
            )}

            {/* Progress */}
            {project.status !== 'completed' && project.status !== 'cancelled' && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                    </div>
                    <Progress
                        value={project.progress}
                        className="h-2"
                        indicatorClassName={
                            project.progress >= 75 ? 'bg-green-500' :
                                project.progress >= 50 ? 'bg-blue-500' :
                                    project.progress >= 25 ? 'bg-amber-500' :
                                        'bg-slate-500'
                        }
                    />
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
                {project.start_date || project.end_date ? (
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {project.start_date && formatDate(project.start_date)}
                        {project.start_date && project.end_date && ' → '}
                        {project.end_date && formatDate(project.end_date)}
                    </div>
                ) : (
                    <div className="text-slate-500">Dates non définies</div>
                )}
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-purple-400 hover:text-purple-300"
                    onClick={() => toast.info('Détails projet à venir')}
                >
                    Voir détails
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};
