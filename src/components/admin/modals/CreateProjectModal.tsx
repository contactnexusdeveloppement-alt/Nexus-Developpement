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

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const CreateProjectModal = ({ open, onOpenChange, onSuccess }: CreateProjectModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        client_email: "",
        description: "",
        status: "planned" as const,
        budget: "",
        start_date: new Date(),
        expected_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("projects").insert({
                name: formData.name,
                client_email: formData.client_email,
                description: formData.description || null,
                status: formData.status,
                budget: formData.budget ? parseFloat(formData.budget) : null,
                start_date: formData.start_date.toISOString().split('T')[0],
                expected_end_date: formData.expected_end_date.toISOString().split('T')[0],
            });

            if (error) throw error;

            toast.success("Projet créé avec succès !");
            onOpenChange(false);
            onSuccess?.();

            // Reset form
            setFormData({
                name: "",
                client_email: "",
                description: "",
                status: "planned",
                budget: "",
                start_date: new Date(),
                expected_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
        } catch (error: any) {
            toast.error("Erreur lors de la création du projet");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Nouveau Projet
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Créez un nouveau projet pour votre client
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">
                                Nom du projet <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Site E-commerce"
                                required
                                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                            />
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
                                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Développement d'un site e-commerce avec paiement en ligne..."
                            rows={3}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-white">
                                Statut
                            </Label>
                            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger className="bg-slate-800 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10">
                                    <SelectItem value="planned">Planifié</SelectItem>
                                    <SelectItem value="in_progress">En cours</SelectItem>
                                    <SelectItem value="on_hold">En pause</SelectItem>
                                    <SelectItem value="delivered">Livré</SelectItem>
                                    <SelectItem value="completed">Terminé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget" className="text-white">
                                Budget (€)
                            </Label>
                            <Input
                                id="budget"
                                type="number"
                                step="0.01"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                placeholder="15000"
                                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white">Date de début</Label>
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
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Date de fin prévue</Label>
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
                        </div>
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
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Créer le projet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectModal;
