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
import { CalendarIcon, Loader2, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Invoice } from "@/types/invoices";
import { Badge } from "@/components/ui/badge";

interface InvoiceDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: Invoice | null;
    onSuccess?: () => void;
}

interface InvoiceItem {
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
}

const InvoiceDetailModal = ({ open, onOpenChange, invoice, onSuccess }: InvoiceDetailModalProps) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        client_email: "",
        client_name: "",
        issue_date: new Date(),
        due_date: new Date(),
        tax_rate: "20",
        notes: "",
        status: "draft" as "draft" | "sent" | "paid" | "overdue" | "cancelled",
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        { description: "", quantity: 1, unit_price: 0 }
    ]);

    // Charger les données de la facture
    useEffect(() => {
        if (invoice && open) {
            setFormData({
                client_email: invoice.client_email,
                client_name: invoice.client_name,
                issue_date: new Date(invoice.issue_date),
                due_date: new Date(invoice.due_date),
                tax_rate: invoice.tax_rate.toString(),
                notes: invoice.notes || "",
                status: invoice.status,
            });

            loadInvoiceItems(invoice.id);
            setIsEditing(false); // Toujours commencer en mode lecture
        }
    }, [invoice, open]);

    const loadInvoiceItems = async (invoiceId: string) => {
        const { data, error } = await supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", invoiceId)
            .order("order_index");

        if (error) {
            console.error("Error loading invoice items:", error);
        } else if (data && data.length > 0) {
            setItems(data.map(item => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
            })));
        }
    };

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const calculateTotals = () => {
        const amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const taxRate = parseFloat(formData.tax_rate);
        const taxAmount = amount * (taxRate / 100);
        const totalAmount = amount + taxAmount;
        return { amount, taxAmount, totalAmount };
    };

    const handleSave = async () => {
        if (!invoice) return;

        setLoading(true);

        try {
            const { amount, taxAmount, totalAmount } = calculateTotals();

            // Mettre à jour la facture
            const { error: invoiceError } = await supabase
                .from("invoices")
                .update({
                    client_email: formData.client_email,
                    client_name: formData.client_name,
                    issue_date: formData.issue_date.toISOString().split('T')[0],
                    due_date: formData.due_date.toISOString().split('T')[0],
                    amount,
                    tax_rate: parseFloat(formData.tax_rate),
                    tax_amount: taxAmount,
                    total_amount: totalAmount,
                    notes: formData.notes || null,
                    status: formData.status,
                } as any)
                .eq("id", invoice.id);

            if (invoiceError) throw invoiceError;

            // Supprimer les anciennes lignes
            await supabase
                .from("invoice_items")
                .delete()
                .eq("invoice_id", invoice.id);

            // Créer les nouvelles lignes
            const itemsToInsert = items
                .filter(item => item.description && item.quantity > 0)
                .map((item, index) => ({
                    invoice_id: invoice.id,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total: item.quantity * item.unit_price,
                    order_index: index,
                }));

            if (itemsToInsert.length > 0) {
                const { error: itemsError } = await supabase
                    .from("invoice_items")
                    .insert(itemsToInsert);

                if (itemsError) throw itemsError;
            }

            toast.success("Facture mise à jour avec succès !");
            setIsEditing(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error("Erreur lors de la mise à jour de la facture");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStatusUpdate = async (newStatus: string) => {
        if (!invoice) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from("invoices")
                .update({ status: newStatus })
                .eq("id", invoice.id);

            if (error) throw error;

            toast.success("Statut facture mis à jour !");
            setFormData({ ...formData, status: newStatus as any });
            onSuccess?.(); // Refresh liste + KPIs
        } catch (error: any) {
            toast.error("Erreur mise à jour statut");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!invoice) return;

        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir supprimer la facture ${invoice.invoice_number} ?\n\nCette action est irréversible.`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            // Supprimer les lignes de facture (cascade devrait le faire automatiquement)
            await supabase
                .from("invoice_items")
                .delete()
                .eq("invoice_id", invoice.id);

            // Supprimer la facture
            const { error } = await supabase
                .from("invoices")
                .delete()
                .eq("id", invoice.id);

            if (error) throw error;

            toast.success("Facture supprimée avec succès !");
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error("Erreur lors de la suppression de la facture");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            draft: { label: "Brouillon", color: "bg-gray-500/10 text-gray-300 border-gray-500/30" },
            sent: { label: "Envoyée", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
            paid: { label: "Payée", color: "bg-green-500/10 text-green-300 border-green-500/30" },
            overdue: { label: "En retard", color: "bg-red-500/10 text-red-300 border-red-500/30" },
            cancelled: { label: "Annulée", color: "bg-slate-500/10 text-slate-300 border-slate-500/30" },
        };

        const { label, color } = config[status] || config.draft;

        return (
            <Badge className={`${color} border`} variant="outline">
                {label}
            </Badge>
        );
    };

    const { amount, taxAmount, totalAmount } = calculateTotals();

    if (!invoice) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Facture {invoice.invoice_number}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1">
                                {isEditing ? "Mode édition" : "Détails de la facture"}
                            </DialogDescription>
                        </div>
                        {getStatusBadge(formData.status)}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informations client */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Informations Client</h3>
                        <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Dates, TVA et Statut */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Dates et Paramètres</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white">Date d'émission</Label>
                                {isEditing ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(formData.issue_date, "dd/MM/yy", { locale: fr })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                                            <Calendar
                                                mode="single"
                                                selected={formData.issue_date}
                                                onSelect={(date) => date && setFormData({ ...formData, issue_date: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <p className="text-slate-300 py-2">{format(formData.issue_date, "dd/MM/yyyy", { locale: fr })}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Échéance</Label>
                                {isEditing ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal bg-slate-800 border-white/10 text-white hover:bg-slate-700"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(formData.due_date, "dd/MM/yy", { locale: fr })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                                            <Calendar
                                                mode="single"
                                                selected={formData.due_date}
                                                onSelect={(date) => date && setFormData({ ...formData, due_date: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <p className="text-slate-300 py-2">{format(formData.due_date, "dd/MM/yyyy", { locale: fr })}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tax_rate" className="text-white">TVA (%)</Label>
                                {isEditing ? (
                                    <Input
                                        id="tax_rate"
                                        type="number"
                                        step="0.01"
                                        value={formData.tax_rate}
                                        onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                ) : (
                                    <p className="text-slate-300 py-2">{formData.tax_rate}%</p>
                                )}
                            </div>

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
                                        <SelectItem value="draft">Brouillon</SelectItem>
                                        <SelectItem value="sent">Envoyée</SelectItem>
                                        <SelectItem value="paid">Payée</SelectItem>
                                        <SelectItem value="overdue">En retard</SelectItem>
                                        <SelectItem value="cancelled">Annulée</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Lignes de facture */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Lignes de facture</h3>
                            {isEditing && (
                                <Button
                                    type="button"
                                    onClick={addItem}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Ajouter
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    {isEditing ? (
                                        <>
                                            <Input
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                className="flex-1 bg-slate-800 border-white/10 text-white"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Qté"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                className="w-20 bg-slate-800 border-white/10 text-white"
                                            />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Prix"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                className="w-28 bg-slate-800 border-white/10 text-white"
                                            />
                                            <span className="w-28 text-right text-white py-2">
                                                {(item.quantity * item.unit_price).toFixed(2)}€
                                            </span>
                                            {items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex-1 flex justify-between items-center bg-slate-800/30 rounded p-3">
                                            <span className="text-white flex-1">{item.description}</span>
                                            <span className="text-slate-400 w-20 text-center">{item.quantity}</span>
                                            <span className="text-slate-400 w-28 text-right">{item.unit_price.toFixed(2)}€</span>
                                            <span className="text-white w-28 text-right font-semibold">
                                                {(item.quantity * item.unit_price).toFixed(2)}€
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totaux */}
                    <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-slate-300">
                            <span>Sous-total HT</span>
                            <span className="font-semibold">{amount.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                            <span>TVA ({formData.tax_rate}%)</span>
                            <span className="font-semibold">{taxAmount.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-white/10">
                            <span>Total TTC</span>
                            <span className="text-green-400">{totalAmount.toFixed(2)}€</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-white">Notes</Label>
                        {isEditing ? (
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Informations complémentaires..."
                                rows={2}
                                className="bg-slate-800 border-white/10 text-white resize-none"
                            />
                        ) : (
                            <p className="text-slate-300 py-2">{formData.notes || "Aucune note"}</p>
                        )}
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
                                    // Recharger les données originales
                                    if (invoice) {
                                        setFormData({
                                            client_email: invoice.client_email,
                                            client_name: invoice.client_name,
                                            issue_date: new Date(invoice.issue_date),
                                            due_date: new Date(invoice.due_date),
                                            tax_rate: invoice.tax_rate.toString(),
                                            notes: invoice.notes || "",
                                            status: invoice.status,
                                        });
                                        loadInvoiceItems(invoice.id);
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
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
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

export default InvoiceDetailModal;
