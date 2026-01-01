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
import { Opportunity } from "@/types/opportunities";
import { Badge } from "@/components/ui/badge";

interface OpportunityDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    opportunity: Opportunity | null;
    onSuccess?: () => void;
}

const OpportunityDetailModal = ({ open, onOpenChange, opportunity, onSuccess }: OpportunityDetailModalProps) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        client_email: "",
        client_name: "",
        description: "",
        stage: "prospecting" as "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost",
        amount: "",
        expected_close_date: new Date(),
        source: "website" as "website" | "instagram" | "facebook" | "linkedin" | "word_of_mouth" | "referral" | "cold_call" | "event" | "other",
        priority: "medium" as "low" | "medium" | "high" | "urgent",
    });

    useEffect(() => {
        if (opportunity && open) {
            setFormData({
                name: opportunity.name,
                client_email: opportunity.client_email,
                client_name: opportunity.client_name,
                description: opportunity.description || "",
                stage: opportunity.stage,
                amount: opportunity.amount?.toString() || "",
                expected_close_date: opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : new Date(),
                source: opportunity.source || "website",
                priority: opportunity.priority || "medium",
            });
            setIsEditing(false);
        }
    }, [opportunity, open]);

    const handleSave = async () => {
        if (!opportunity) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from("opportunities")
                .update({
                    name: formData.name,
                    client_email: formData.client_email,
                    client_name: formData.client_name,
                    description: formData.description || null,
                    stage: formData.stage,
                    amount: formData.amount ? parseFloat(formData.amount) : null,
                    expected_close_date: formData.expected_close_date.toISOString().split('T')[0],
                    source: formData.source,
                    priority: formData.priority,
                } as any)
                .eq("id", opportunity.id);

            if (error) throw error;

            toast.success("Opportunité mise à jour avec succès !");
            setIsEditing(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error("Erreur lors de la mise à jour de l'opportunité");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStageUpdate = async (newStage: string) => {
        if (!opportunity) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from("opportunities")
                .update({ stage: newStage })
                .eq("id", opportunity.id);

            if (error) throw error;

            toast.success("Étape mise à jour !");
            setFormData({ ...formData, stage: newStage as any });
            onSuccess?.(); // Refresh liste
        } catch (error: any) {
            toast.error("Erreur mise à jour étape");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!opportunity) return;

        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir supprimer l'opportunité "${opportunity.name}" ?\n\nCette action est irréversible.`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const { error } = await supabase
                .from("opportunities")
                .delete()
                .eq("id", opportunity.id);

            if (error) throw error;

            toast.success("Opportunité supprimée avec succès !");
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error("Erreur lors de la suppression de l'opportunité");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStageBadge = (stage: string) => {
        const config: any = {
            prospecting: { label: "Prospection", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
            qualification: { label: "Qualification", color: "bg-purple-500/10 text-purple-300 border-purple-500/30" },
            proposal: { label: "Proposition", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30" },
            negotiation: { label: "Négociation", color: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
            closed_won: { label: "Gagné", color: "bg-green-500/10 text-green-300 border-green-500/30" },
            closed_lost: { label: "Perdu", color: "bg-red-500/10 text-red-300 border-red-500/30" },
        };

        const { label, color } = config[stage] || config.prospecting;

        return (
            <Badge className={`${color} border`} variant="outline">
                {label}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const config: any = {
            low: { label: "Basse", color: "bg-slate-500/10 text-slate-300 border-slate-500/30" },
            medium: { label: "Moyenne", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
            high: { label: "Haute", color: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
            urgent: { label: "Urgente", color: "bg-red-500/10 text-red-300 border-red-500/30" },
        };

        const { label, color } = config[priority] || config.medium;

        return (
            <Badge className={`${color} border`} variant="outline">
                {label}
            </Badge>
        );
    };

    if (!opportunity) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {opportunity.name}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1">
                                {isEditing ? "Mode édition" : "Détails de l'opportunité"}
                            </DialogDescription>
                        </div>
                        {getStageBadge(formData.stage)}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informations générales */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Informations Générales</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">Nom de l'opportunité</Label>
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
                                <Label htmlFor="client_name" className="text-white">Nom du client</Label>
                                {isEditing ? (
                                    <Input
                                        id="client_name"
                                        value={formData.client_name}
                                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                ) : (
                                    <p className="text-slate-300 py-2">{formData.client_name}</p>
                                )}
                            </div>
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

                    {/* Détails commerciaux */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Détails Commerciaux</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stage" className="text-white">Étape du pipeline {!isEditing && <span className="text-xs text-slate-500">(Changement instantané)</span>}</Label>
                                <Select
                                    value={formData.stage}
                                    onValueChange={(value: any) => {
                                        if (isEditing) {
                                            setFormData({ ...formData, stage: value });
                                        } else {
                                            handleQuickStageUpdate(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/10">
                                        <SelectItem value="prospecting">Prospection</SelectItem>
                                        <SelectItem value="qualification">Qualification</SelectItem>
                                        <SelectItem value="proposal">Proposition</SelectItem>
                                        <SelectItem value="negotiation">Négociation</SelectItem>
                                        <SelectItem value="closed_won">Gagné</SelectItem>
                                        <SelectItem value="closed_lost">Perdu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-white">Montant estimé (€)</Label>
                                {isEditing ? (
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                ) : (
                                    <p className="text-slate-300 py-2">
                                        {formData.amount ? `${parseFloat(formData.amount).toLocaleString('fr-FR')}€` : "Non défini"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="source" className="text-white">Source</Label>
                                {isEditing ? (
                                    <Select value={formData.source} onValueChange={(value: any) => setFormData({ ...formData, source: value })}>
                                        <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/10">
                                            <SelectItem value="website">Site web</SelectItem>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                                            <SelectItem value="word_of_mouth">Bouche-à-oreille</SelectItem>
                                            <SelectItem value="referral">Recommandation</SelectItem>
                                            <SelectItem value="cold_call">Appel à froid</SelectItem>
                                            <SelectItem value="event">Événement</SelectItem>
                                            <SelectItem value="other">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-slate-300 py-2 capitalize">{formData.source.replace('_', ' ')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-white">Priorité</Label>
                                {isEditing ? (
                                    <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                                        <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/10">
                                            <SelectItem value="low">Basse</SelectItem>
                                            <SelectItem value="medium">Moyenne</SelectItem>
                                            <SelectItem value="high">Haute</SelectItem>
                                            <SelectItem value="urgent">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="py-2">{getPriorityBadge(formData.priority)}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Probabilité</Label>
                                <p className="text-slate-300 py-2">{opportunity.probability}%</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Date de clôture prévue</Label>
                            {isEditing ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(formData.expected_close_date, "PPP", { locale: fr })}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                                        <Calendar
                                            mode="single"
                                            selected={formData.expected_close_date}
                                            onSelect={(date) => date && setFormData({ ...formData, expected_close_date: date })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <p className="text-slate-300 py-2">{format(formData.expected_close_date, "PPP", { locale: fr })}</p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    if (opportunity) {
                                        setFormData({
                                            name: opportunity.name,
                                            client_email: opportunity.client_email,
                                            client_name: opportunity.client_name,
                                            description: opportunity.description || "",
                                            stage: opportunity.stage,
                                            amount: opportunity.amount?.toString() || "",
                                            expected_close_date: opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : new Date(),
                                            source: opportunity.source || "website",
                                            priority: opportunity.priority || "medium",
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
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
        </Dialog >
    );
};

export default OpportunityDetailModal;
