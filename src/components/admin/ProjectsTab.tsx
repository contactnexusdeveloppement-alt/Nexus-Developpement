import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Briefcase,
    Plus,
    Search,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Eye,
    FileText,
    Edit,
    Trash2,
} from "lucide-react";
import { Project } from "@/types/projects";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import CreateProjectModal from "./modals/CreateProjectModal";
import ProjectDetailModal from "./modals/ProjectDetailModal";
import EmptyState from "./widgets/EmptyState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const ProjectsTab = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleRowClick = (project: Project) => {
        setSelectedProject(project);
        setDetailModalOpen(true);
    };

    useEffect(() => {
        fetchProjects();

        // Realtime subscription
        const channel = supabase
            .channel("projects_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "projects" },
                () => {
                    fetchProjects();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
            toast.error("Erreur lors du chargement des projets");
        } else {
            setProjects((data as Project[]) || []);
        }
        setLoading(false);
    };

    // Debounce search term to reduce filtering operations
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                project.client_email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, debouncedSearchTerm, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: projects.length,
            active: projects.filter((p) => p.status === "in_progress" || p.status === "review").length,
            delivered: projects.filter((p) => p.status === "delivered").length,
            overdue: projects.filter(
                (p) =>
                    p.expected_end_date &&
                    new Date(p.expected_end_date) < new Date() &&
                    p.status !== "delivered" &&
                    p.status !== "closed"
            ).length,
        };
    }, [projects]);

    const getStatusBadge = (status: string) => {
        const config: any = {
            planned: { label: "Planifié", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
            in_progress: { label: "En cours", color: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
            review: { label: "En revue", color: "bg-purple-500/10 text-purple-300 border-purple-500/30" },
            delivered: { label: "Livré", color: "bg-green-500/10 text-green-300 border-green-500/30" },
            closed: { label: "Clôturé", color: "bg-gray-500/10 text-gray-300 border-gray-500/30" },
        };

        const { label, color } = config[status] || config.planned;

        return (
            <Badge className={`${color} border`} variant="outline">
                {label}
            </Badge>
        );
    };

    const getProgressPercentage = (project: Project) => {
        // Simplified progress calculation
        const statusProgress: any = {
            planned: 0,
            in_progress: 50,
            review: 75,
            delivered: 100,
            closed: 100,
        };
        return statusProgress[project.status] || 0;
    };

    const isOverdue = (project: Project) => {
        if (!project.expected_end_date || project.status === "delivered" || project.status === "closed") {
            return false;
        }
        return new Date(project.expected_end_date) < new Date();
    };

    const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click

        if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;

            toast.success("Projet supprimé avec succès");
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error("Erreur lors de la suppression du projet");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Total Projets</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.total}</p>
                            </div>
                            <Briefcase className="w-6 h-6 text-blue-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Projets Actifs</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.active}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-orange-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Livrés</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.delivered}</p>
                            </div>
                            <CheckCircle2 className="w-6 h-6 text-green-400/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">En Retard</p>
                                <p className="text-2xl font-bold font-mono text-white">{stats.overdue}</p>
                            </div>
                            <AlertCircle className="w-6 h-6 text-red-400/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Gestion des Projets</CardTitle>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Projet
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher par nom ou client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-950/30 border-white/10 text-white placeholder:text-gray-700 h-8 text-xs"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48 bg-slate-800/50 border-white/10 text-white">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10">
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="planned">Planifiés</SelectItem>
                                <SelectItem value="in_progress">En cours</SelectItem>
                                <SelectItem value="review">En revue</SelectItem>
                                <SelectItem value="delivered">Livrés</SelectItem>
                                <SelectItem value="closed">Clôturés</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Projects Table */}
                    {loading ? (
                        <div className="text-center py-12 text-slate-400">Chargement...</div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="py-8">
                            <EmptyState
                                icon="💼"
                                message="Aucun projet trouvé"
                                description={searchTerm || statusFilter !== 'all'
                                    ? "Essayez de modifier les filtres"
                                    : "Créez votre premier projet pour commencer"}
                            />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Projet</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Client</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Statut</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Progression</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Échéance</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8">Budget</TableHead>
                                    <TableHead className="text-gray-500 font-mono text-[10px] uppercase h-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project) => (
                                    <TableRow
                                        key={project.id}
                                        onClick={() => handleRowClick(project)}
                                        className="border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                {isOverdue(project) && (
                                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                                )}
                                                {project.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{project.client_email}</TableCell>
                                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress
                                                    value={getProgressPercentage(project)}
                                                    className="w-24 h-2"
                                                />
                                                <span className="text-xs text-slate-400">
                                                    {getProgressPercentage(project)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {project.expected_end_date ? (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(project.expected_end_date), "dd/MM/yyyy")}
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {project.budget ? (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {project.budget.toLocaleString("fr-FR")}€
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProject(project.id, e);
                                                }}
                                                className="h-6 px-2 text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create Project Modal */}
            <CreateProjectModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={fetchProjects}
            />

            {/* Project Detail Modal */}
            <ProjectDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                project={selectedProject}
                onSuccess={fetchProjects}
            />
        </div>
    );
};

export default ProjectsTab;
