import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Edit, Save, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Project } from "@/types/projects";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onSuccess?: () => void;
}

const ProjectDetailModal = ({ open, onOpenChange, project, onSuccess }: ProjectDetailModalProps) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        client_email: "",
        description: "",
        status: "planned" as "planned" | "in_progress" | "review" | "delivered" | "closed",
        budget: "",
        start_date: new Date(),
        expected_end_date: new Date(),
    });

    useEffect(() => {
        if (project && open) {
            setFormData({
                name: project.name,
                client_email: project.client_email,
                description: project.description || "",
                status: project.status,
                budget: project.budget?.toString() || "",
                start_date: project.start_date ? new Date(project.start_date) : new Date(),
                expected_end_date: project.expected_end_date ? new Date(project.expected_end_date) : new Date(),
            });
            setIsEditing(false);
        }
    }, [project, open]);

    const handleSave = async () => {
        if (!project) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from("projects")
                .update({
                    name: formData.name,
                    client_email: formData.client_email,
                    description: formData.description || null,
                    status: formData.status,
                    budget: formData.budget ? parseFloat(formData.budget) : null,
                    start_date: formData.start_date.toISOString().split('T')[0],
                    expected_end_date: formData.expected_end_date.toISOString().split('T')[0],
                } as any)
                .eq("id", project.id);

            if (error) throw error;

            toast.success("Projet mis à jour avec succès !");
            setIsEditing(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error("Erreur lors de la mise à jour du projet");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStatusUpdate = async (newStatus: string) => {
        if (!project) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from("projects")
                .update({ status: newStatus })
                .eq("id", project.id);

            if (error) throw error;

            toast.success("Statut mis à jour !");
            setFormData({ ...formData, status: newStatus as any });
            onSuccess?.(); // Refresh liste
        } catch (error: any) {
            toast.error("Erreur mise à jour statut");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!project) return;

        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?\n\nCette action est irréversible.`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from("projects")
                .delete()
                .eq("id", project.id);

            if (error) throw error;

            toast.success("Projet supprimé avec succès !");
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error("Erreur lors de la suppression du projet");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            planned: { label: "Planifié", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
            in_progress: { label: "En cours", color: "bg-purple-500/10 text-purple-300 border-purple-500/30" },
            review: { label: "En revue", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30" },
            delivered: { label: "Livré", color: "bg-green-500/10 text-green-300 border-green-500/30" },
            closed: { label: "Clôturé", color: "bg-slate-500/10 text-slate-300 border-slate-500/30" },
        };

        const { label, color } = config[status] || config.planned;

        return (
            <Badge className={`${color} border`} variant="outline">
                {label}
            </Badge>
        );
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {project.name}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1">
                                {isEditing ? "Mode édition" : "Détails du projet"}
                            </DialogDescription>
                        </div>
                        {getStatusBadge(formData.status)}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informations générales */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Informations Générales</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">Nom du projet</Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                ) : (
                                    <p className="text-slate-300 py-2">{formData.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="client_email" className="text-white">Email client</Label>
                                {isEditing ? (
                                    <Input
                                        id="client_email"
                                        type="email"
                                        value={formData.client_email}
                                        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                ) : (
                                    <p className="text-slate-300 py-2">{formData.client_email}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white">Description</Label>
                            {isEditing ? (
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="bg-slate-800 border-white/10 text-white resize-none"
                                />
                            ) : (
                                <p className="text-slate-300 py-2">{formData.description || "Aucune description"}</p>
                            )}
                        </div>
                    </div>

                    {/* Statut, Budget et Dates */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Statut et Budget</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-white">Statut {!isEditing && <span className="text-xs text-slate-500">(Changement instantané)</span>}</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: any) => {
                                        if (isEditing) {
                                            setFormData({ ...formData, status: value });
                                        } else {
                                            handleQuickStatusUpdate(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/10">
                                        <SelectItem value="planned">Planifié</SelectItem>
                                        <SelectItem value="in_progress">En cours</SelectItem>
                                        <SelectItem value="review">En revue</SelectItem>
                                        <SelectItem value="delivered">Livré</SelectItem>
                                        <SelectItem value="closed">Clôturé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget" className="text-white">Budget (€)</Label>
                                {isEditing ? (
                                    <Input
                                        id="budget"
                                        type="number"
                                        step="0.01"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                ) : (
                                    <p className="text-slate-300 py-2">
                                        {formData.budget ? `${parseFloat(formData.budget).toLocaleString('fr-FR')}€` : "Non défini"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white">Date de début</Label>
                                {isEditing ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(formData.start_date, "PPP", { locale: fr })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                                            <Calendar
                                                mode="single"
                                                selected={formData.start_date}
                                                onSelect={(date) => date && setFormData({ ...formData, start_date: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <p className="text-slate-300 py-2">{format(formData.start_date, "PPP", { locale: fr })}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Date de fin prévue</Label>
                                {isEditing ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(formData.expected_end_date, "PPP", { locale: fr })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                                            <Calendar
                                                mode="single"
                                                selected={formData.expected_end_date}
                                                onSelect={(date) => date && setFormData({ ...formData, expected_end_date: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <p className="text-slate-300 py-2">{format(formData.expected_end_date, "PPP", { locale: fr })}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progression */}
                    {project.progress !== undefined && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-white">Progression</Label>
                                <span className="text-sm text-slate-400">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    if (project) {
                                        setFormData({
                                            name: project.name,
                                            client_email: project.client_email,
                                            description: project.description || "",
                                            status: project.status,
                                            budget: project.budget?.toString() || "",
                                            start_date: project.start_date ? new Date(project.start_date) : new Date(),
                                            expected_end_date: project.expected_end_date ? new Date(project.expected_end_date) : new Date(),
                                        });
                                    }
                                }}
                                className="bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Annuler
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                            >
                                Fermer
                            </Button>
                            <div className="flex-1" />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleDelete}
                                disabled={loading}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDetailModal;
