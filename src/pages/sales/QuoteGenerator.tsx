import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { packs, addons, PackOption, AddonOption } from '@/data/quotePricing';
import { Badge } from '@/components/ui/badge';
import { pdf } from '@react-pdf/renderer';
import { QuotePDF } from '@/components/sales/QuotePDF';

interface QuoteRequest {
    id: string;
    full_name: string;
    company_name: string | null;
    email: string;
}

const QuoteGenerator = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [prospects, setProspects] = useState<any[]>([]);
    const [salesPartnerId, setSalesPartnerId] = useState<string | null>(null);
    const [salesPartnerName, setSalesPartnerName] = useState<string>('');
    const [createdQuote, setCreatedQuote] = useState<any>(null);

    // Form state
    const [selectedProspectId, setSelectedProspectId] = useState<string>('');
    const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [clientNotes, setClientNotes] = useState('');
    const [internalNotes, setInternalNotes] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user's sales partner info
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: partnerData } = await supabase
                    .from('sales_partners')
                    .select(`
                        id,
                        profiles:profiles!sales_partners_profiles_fkey(full_name)
                    `)
                    .eq('id', user.id)
                    .single();

                if (!partnerData) return;

                const fullName = (partnerData as any).profiles?.full_name || '';
                setSalesPartnerId((partnerData as any).id);
                setSalesPartnerName(fullName);

                // Fetch quote_requests (prospects) for this sales partner
                const { data: prospectsData } = await supabase
                    .from('quote_requests')
                    .select('id, name as full_name, business_type as company_name, email')
                    .eq('sales_partner_id', (partnerData as any).id)
                    .order('name');

                setProspects(prospectsData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Erreur lors du chargement des données');
            }
        };

        fetchData();
    }, []);

    const calculateTotal = () => {
        const packAmount = selectedPack?.price || 0;
        const addonsAmount = selectedAddons.reduce((sum, addonId) => {
            const addon = addons.find(a => a.id === addonId);
            return sum + (addon?.price || 0);
        }, 0);
        return packAmount + addonsAmount;
    };

    const handleToggleAddon = (addonId: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const handleGenerateQuote = async () => {
        if (!selectedPack || !salesPartnerId) {
            toast.error('Veuillez sélectionner un pack');
            return;
        }

        try {
            setLoading(true);

            const total = calculateTotal();
            const packAmount = selectedPack.price;
            const optionsAmount = total - packAmount;

            // Prepare selected addons data
            const selectedAddonsData = addons
                .filter(addon => selectedAddons.includes(addon.id))
                .map(addon => ({
                    id: addon.id,
                    name: addon.name,
                    price: addon.price,
                    description: addon.description,
                }));

            // Insert quote into database
            // Status is 'draft' if no prospect, 'assigned' if prospect selected
            const quoteStatus = selectedProspectId ? 'assigned' : 'draft';

            const { data, error } = await supabase
                .from('quotes')
                .insert({
                    prospect_id: selectedProspectId || null,
                    sales_partner_id: salesPartnerId,
                    amount: total,
                    status: quoteStatus,
                    content: {
                        selected_pack: {
                            id: selectedPack.id,
                            name: selectedPack.name,
                            price: selectedPack.price,
                            description: selectedPack.description,
                            features: selectedPack.features,
                        },
                        selected_options: selectedAddonsData,
                        pack_amount: packAmount,
                        options_amount: optionsAmount,
                        total_amount: total,
                        client_notes: clientNotes || null,
                        internal_notes: internalNotes || null,
                        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    }
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('Devis créé avec succès !');

            // Store the created quote for PDF generation
            setCreatedQuote(data);

        } catch (error) {
            console.error('Error creating quote:', error);
            toast.error('Erreur lors de la création du devis');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="prospect" className="text-slate-200 text-lg">
                                Sélectionnez un prospect (optionnel)
                            </Label>
                            <p className="text-slate-400 text-sm">
                                Vous pouvez créer un brouillon sans prospect et l'attribuer plus tard.
                            </p>
                            <Select value={selectedProspectId} onValueChange={setSelectedProspectId}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                    <SelectValue placeholder="Choisir un prospect (optionnel)..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    {prospects.map((prospect) => (
                                        <SelectItem key={prospect.id} value={prospect.id} className="text-white hover:bg-slate-700">
                                            {prospect.full_name}
                                            {prospect.company_name && ` (${prospect.company_name})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedProspectId && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedProspectId('')}
                                    className="text-slate-400 hover:text-white"
                                >
                                    × Retirer le prospect
                                </Button>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Choisissez le pack de base *
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {packs.map((pack) => (
                                <Card
                                    key={pack.id}
                                    className={`cursor-pointer transition-all ${selectedPack?.id === pack.id
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-700 bg-slate-900 hover:border-blue-400'
                                        }`}
                                    onClick={() => setSelectedPack(pack)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-white">{pack.name}</CardTitle>
                                                <CardDescription className="text-slate-400 mt-1">
                                                    {pack.description}
                                                </CardDescription>
                                            </div>
                                            {pack.popular && (
                                                <Badge className="bg-orange-500">Populaire</Badge>
                                            )}
                                        </div>
                                        <div className="text-3xl font-bold text-blue-400 mt-2">
                                            {pack.price}€
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {pack.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">
                            Options additionnelles (optionnel)
                        </h3>

                        {(['technical', 'content', 'legal', 'seo'] as const).map((category) => {
                            const categoryAddons = addons.filter(a => a.category === category);
                            const categoryLabels = {
                                technical: 'Fonctionnalités Techniques',
                                content: 'Contenu & Media',
                                legal: 'Juridique & Conformité',
                                seo: 'Référencement',
                            };

                            return (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-lg font-medium text-blue-400">
                                        {categoryLabels[category]}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {categoryAddons.map((addon) => (
                                            <Card
                                                key={addon.id}
                                                className={`cursor-pointer transition-all ${selectedAddons.includes(addon.id)
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : 'border-slate-700 bg-slate-900 hover:border-purple-400'
                                                    }`}
                                                onClick={() => handleToggleAddon(addon.id)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox
                                                            checked={selectedAddons.includes(addon.id)}
                                                            onCheckedChange={() => handleToggleAddon(addon.id)}
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="font-medium text-white">{addon.name}</h5>
                                                                <span className="text-purple-400 font-semibold">+{addon.price}€</span>
                                                            </div>
                                                            <p className="text-sm text-slate-400 mt-1">{addon.description}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case 4:
                const total = calculateTotal();
                const selectedAddonData = addons.filter(a => selectedAddons.includes(a.id));
                const selectedProspect = prospects.find(p => p.id === selectedProspectId);

                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">
                            Récapitulatif et Notes
                        </h3>

                        {/* Summary */}
                        <Card className="bg-slate-900 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Résumé du Devis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-400">Client</p>
                                    <p className="text-white font-medium">
                                        {selectedProspect?.full_name}
                                        {selectedProspect?.company_name && ` - ${selectedProspect.company_name}`}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-400">Pack sélectionné</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-white font-medium">{selectedPack?.name}</p>
                                        <p className="text-blue-400 font-semibold">{selectedPack?.price}€</p>
                                    </div>
                                </div>

                                {selectedAddonData.length > 0 && (
                                    <div>
                                        <p className="text-sm text-slate-400 mb-2">Options ({selectedAddonData.length})</p>
                                        <div className="space-y-1">
                                            {selectedAddonData.map((addon) => (
                                                <div key={addon.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-300">{addon.name}</span>
                                                    <span className="text-purple-400">+{addon.price}€</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-slate-700 pt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-semibold text-white">Total</p>
                                        <p className="text-2xl font-bold text-green-400">{total}€</p>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-slate-300">
                                    <p className="font-medium text-blue-400 mb-1">Mention incluse :</p>
                                    <p className="italic">Dossier suivi par {salesPartnerName}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientNotes" className="text-slate-200">
                                    Notes pour le client (visibles sur le devis)
                                </Label>
                                <Textarea
                                    id="clientNotes"
                                    value={clientNotes}
                                    onChange={(e) => setClientNotes(e.target.value)}
                                    placeholder="Exemple: Conditions de paiement, délais, garanties..."
                                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="internalNotes" className="text-slate-200">
                                    Notes internes (non visibles par le client)
                                </Label>
                                <Textarea
                                    id="internalNotes"
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                    placeholder="Exemple: Remise accordée, points de négociation..."
                                    className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return true; // Prospect is now optional
            case 2:
                return selectedPack !== null;
            case 3:
                return true; // Addons are optional
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <FileText className="h-8 w-8 text-purple-500" />
                        Générateur de Devis
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Créez un devis personnalisé en quelques clics
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                    {['Client', 'Pack', 'Options', 'Validation'].map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = step === stepNumber;
                        const isCompleted = step > stepNumber;

                        return (
                            <div key={label} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isActive
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                                    </div>
                                    <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                        {label}
                                    </span>
                                </div>
                                {index < 3 && (
                                    <div
                                        className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step Content */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardContent className="p-6">
                        {renderStepContent()}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                        ← Précédent
                    </Button>

                    {step < 4 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            Suivant →
                        </Button>
                    ) : !createdQuote ? (
                        <Button
                            onClick={handleGenerateQuote}
                            disabled={loading || !canProceed()}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Créer le Devis
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                onClick={async () => {
                                    try {
                                        const selectedProspect = prospects.find(p => p.id === selectedProspectId);
                                        if (!selectedProspect || !selectedPack) return;

                                        const total = calculateTotal();
                                        const tva = total * 0.20;
                                        const totalTTC = total + tva;

                                        const selectedAddonsData = addons
                                            .filter(addon => selectedAddons.includes(addon.id))
                                            .map(addon => ({
                                                name: addon.name,
                                                price: addon.price,
                                                description: addon.description,
                                            }));

                                        const pdfDoc = <QuotePDF
                                            quoteNumber={createdQuote.quote_number}
                                            quoteDate={new Date(createdQuote.created_at).toLocaleDateString('fr-FR')}
                                            validUntil={new Date(createdQuote.valid_until).toLocaleDateString('fr-FR')}
                                            client={{
                                                name: selectedProspect.full_name,
                                                company: selectedProspect.company_name || undefined,
                                                email: selectedProspect.email,
                                            }}
                                            pack={{
                                                name: selectedPack.name,
                                                price: selectedPack.price,
                                                description: selectedPack.description,
                                            }}
                                            options={selectedAddonsData}
                                            packAmount={selectedPack.price}
                                            optionsAmount={total - selectedPack.price}
                                            totalHT={total}
                                            tva={tva}
                                            totalTTC={totalTTC}
                                            salesPartnerName={salesPartnerName}
                                            clientNotes={clientNotes}
                                        />;

                                        const blob = await pdf(pdfDoc).toBlob();
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `Devis_${createdQuote.quote_number}.pdf`;
                                        link.click();
                                        URL.revokeObjectURL(url);

                                        toast.success('PDF téléchargé avec succès !');
                                    } catch (error) {
                                        console.error('Error generating PDF:', error);
                                        toast.error('Erreur lors de la génération du PDF');
                                    }
                                }}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger le PDF
                            </Button>
                            <Button
                                onClick={() => {
                                    setCreatedQuote(null);
                                    setSelectedProspectId('');
                                    setSelectedPack(null);
                                    setSelectedAddons([]);
                                    setClientNotes('');
                                    setInternalNotes('');
                                    setStep(1);
                                }}
                                variant="outline"
                                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                            >
                                Nouveau Devis
                            </Button>
                        </div>
                    )}
                </div>

                {/* Price Summary (visible on all steps after pack selection) */}
                {selectedPack && (
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total estimé</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {selectedPack.name}
                                        {selectedAddons.length > 0 && ` + ${selectedAddons.length} option(s)`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-400">{calculateTotal()}€</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default QuoteGenerator;
