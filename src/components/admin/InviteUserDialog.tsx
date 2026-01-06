import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { inviteUser, InviteUserData } from '@/utils/inviteUser';

interface InviteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const InviteUserDialog = ({ open, onOpenChange, onSuccess }: InviteUserDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<InviteUserData>({
        email: '',
        firstName: '',
        lastName: '',
        role: 'sales',
        phone: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await inviteUser(formData);

        setIsLoading(false);

        if (result.success) {
            // Reset form
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                role: 'sales',
                phone: '',
            });

            onOpenChange(false);
            onSuccess?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Inviter un membre de l'équipe</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Envoyez une invitation par email. L'utilisateur recevra un lien pour définir son mot de passe.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-slate-200">
                                Prénom *
                            </Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                disabled={isLoading}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-slate-200">
                                Nom *
                            </Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                disabled={isLoading}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">
                            Email *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={isLoading}
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="utilisateur@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-200">
                            Téléphone
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={isLoading}
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="+33 6 12 34 56 78"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-slate-200">
                            Rôle *
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'sales' })}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="sales" className="text-white hover:bg-slate-700">
                                    Commercial (Sales)
                                </SelectItem>
                                <SelectItem value="admin" className="text-white hover:bg-slate-700">
                                    Administrateur
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400">
                            {formData.role === 'sales'
                                ? 'Accès au dashboard commercial et CRM uniquement'
                                : 'Accès complet à tous les outils d\'administration'}
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                'Envoyer l\'invitation'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
