import { useState } from "react";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CreateOpportunityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const CreateOpportunityModal = ({ open, onOpenChange, onSuccess }: CreateOpportunityModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        client_email: "",
        client_name: "",
        description: "",
        stage: "prospecting" as const,
        amount: "",
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        source: "website" as const,
        priority: "medium" as const,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("opportunities").insert({
                name: formData.name,
                client_email: formData.client_email,
                client_name: formData.client_name,
                description: formData.description || null,
                stage: formData.stage,
                amount: formData.amount ? parseFloat(formData.amount) : null,
                expected_close_date: formData.expected_close_date.toISOString().split('T')[0],
                source: formData.source,
                priority: formData.priority,
            });

            if (error) throw error;

            toast.success("Opportunité créée avec succès !");
            onOpenChange(false);
            onSuccess?.();

            // Reset form
            setFormData({
                name: "",
                client_email: "",
                client_name: "",
                description: "",
                stage: "prospecting",
                amount: "",
                expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                source: "website",
                priority: "medium",
            });
        } catch (error: any) {
            toast.error("Erreur lors de la création de l'opportunité");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Nouvelle Opportunité
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Créez une nouvelle opportunité commerciale
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">
                                Nom de l'opportunité <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Refonte site web"
                                required
                                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client_name" className="text-white">
                                Nom du client <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="client_name"
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                placeholder="Entreprise SARL"
                                required
                                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="client_email" className="text-white">
                            Email client <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="client_email"
                            type="email"
                            value={formData.client_email}
                            onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                            placeholder="client@example.com"
                            required
                            className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Détails de l'opportunité..."
                            rows={3}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stage" className="text-white">
                                Étape du pipeline
                            </Label>
                            <Select value={formData.stage} onValueChange={(value: any) => setFormData({ ...formData, stage: value })}>
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
                            <Label htmlFor="amount" className="text-white">
                                Montant estimé (€)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="15000"
                                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="source" className="text-white">
                                Source
                            </Label>
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
                                    <SelectItem value="event">Événement</SelectItem>
                                    <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-white">
                                Priorité
                            </Label>
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
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Date de clôture prévue</Label>
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
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Créer l'opportunité
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOpportunityModal;
