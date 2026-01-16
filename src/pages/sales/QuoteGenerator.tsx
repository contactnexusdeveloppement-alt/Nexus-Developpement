import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Check, FileText, ChevronRight, Euro } from 'lucide-react';
import { toast } from 'sonner';
import { addons } from '@/data/quotePricing';
import { pricingData, Category, PricingPlan } from '@/data/pricingData';
import { Badge } from '@/components/ui/badge';
import { downloadQuotePDF, openQuotePDF } from '@/services/pdfGenerator';

interface QuoteRequest {
    id: string;
    full_name: string;
    company_name: string | null;
    email: string;
}

const QuoteGenerator = ({ onQuoteCreated }: { onQuoteCreated?: () => void }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [prospects, setProspects] = useState<any[]>([]);
    const [salesPartnerId, setSalesPartnerId] = useState<string | null>(null);
    const [salesPartnerName, setSalesPartnerName] = useState<string>('');
    const [createdQuote, setCreatedQuote] = useState<any>(null);

    // Form state
    const [selectedProspectId, setSelectedProspectId] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [customPrice, setCustomPrice] = useState<number | null>(null);
    const [clientNotes, setClientNotes] = useState('');
    const [internalNotes, setInternalNotes] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user's sales partner info
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: partnerData, error: partnerError } = await supabase
                    .from('sales_partners')
                    .select('id, first_name, last_name')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (partnerError) {
                    console.error('Error fetching partner:', partnerError);
                }

                if (!partnerData) {
                    // Create sales partner if missing
                    const { data: newPartner, error: createError } = await supabase
                        .from('sales_partners')
                        .insert({ user_id: user.id, email: user.email })
                        .select('id, first_name, last_name')
                        .single();

                    if (createError) {
                        console.error('Error creating partner:', createError);
                        return;
                    }

                    setSalesPartnerId(newPartner.id);
                    setSalesPartnerName(`${newPartner.first_name || ''} ${newPartner.last_name || ''}`.trim() || user.email || '');

                    // No prospects yet for new partner
                    setProspects([]);
                    return;
                }

                const fullName = `${partnerData.first_name || ''} ${partnerData.last_name || ''}`.trim();
                setSalesPartnerId(partnerData.id);
                setSalesPartnerName(fullName || user.email || '');

                // Fetch prospects for this sales partner from the prospects table
                const { data: prospectsData, error: prospectsError } = await supabase
                    .from('prospects')
                    .select('id, name, business_type, email, address, city, postal_code, phone')
                    .eq('sales_partner_id', partnerData.id)
                    .order('name');

                if (prospectsError) {
                    console.error('Error fetching prospects:', prospectsError);
                }

                // Map to expected format
                const mappedProspects = (prospectsData || []).map(p => ({
                    id: p.id,
                    full_name: p.name,
                    name: p.name,
                    company_name: p.business_type,
                    email: p.email,
                    address: p.address,
                    city: p.city,
                    postal_code: p.postal_code,
                    phone: p.phone
                }));

                setProspects(mappedProspects);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Erreur lors du chargement des données');
            }
        };

        fetchData();
    }, []);

    // Helper to extract numeric price from string (e.g., "À partir de 950€" -> 950)
    const parsePrice = (priceStr: string): number => {
        const matches = priceStr.match(/(\d[\d\s]*)/);
        if (matches && matches[1]) {
            return parseInt(matches[1].replace(/\s/g, ''), 10);
        }
        return 0;
    };

    const calculateTotal = () => {
        if (customPrice !== null) return customPrice;

        const planBasePrice = selectedPlan ? parsePrice(selectedPlan.price) : 0;

        const addonsAmount = selectedAddons.reduce((sum, addonId) => {
            const addon = addons.find(a => a.id === addonId);
            return sum + (addon?.price || 0);
        }, 0);

        return planBasePrice + addonsAmount;
    };

    // When category changes, reset selected plan
    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setSelectedPlan(null);
        setCustomPrice(null);
        setSelectedAddons([]);
    };

    // When plan changes, reset custom price
    const handlePlanSelect = (plan: PricingPlan) => {
        setSelectedPlan(plan);
        setCustomPrice(parsePrice(plan.price));
    };

    const handleToggleAddon = (addonId: string) => {
        setSelectedAddons(prev => {
            const newAddons = prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId];

            // Recalculate custom price based on base price + new addons
            if (selectedPlan) {
                const basePrice = parsePrice(selectedPlan.price);
                const addonsSum = newAddons.reduce((sum, id) => {
                    const a = addons.find(opt => opt.id === id);
                    return sum + (a?.price || 0);
                }, 0);
                setCustomPrice(basePrice + addonsSum);
            }

            return newAddons;
        });
    };

    const handleGenerateQuote = async () => {
        if (!selectedPlan || !salesPartnerId || !selectedCategory) {
            toast.error('Veuillez compléter toutes les étapes');
            return;
        }

        try {
            setLoading(true);

            const total = customPrice !== null ? customPrice : calculateTotal();
            const basePrice = parsePrice(selectedPlan.price);

            // Prepare selected addons data
            const selectedAddonsData = addons
                .filter(addon => selectedAddons.includes(addon.id))
                .map(addon => ({
                    id: addon.id,
                    name: addon.name,
                    price: addon.price,
                    description: addon.description,
                }));

            // Validate prospect exists if one is selected
            if (selectedProspectId) {
                const { data: prospectCheck, error: prospectError } = await supabase
                    .from('prospects')
                    .select('id')
                    .eq('id', selectedProspectId)
                    .maybeSingle();

                if (prospectError || !prospectCheck) {
                    console.error('Prospect validation failed:', prospectError);
                    toast.error('Le prospect sélectionné n\'existe plus. Veuillez rafraîchir la page.');
                    setLoading(false);
                    return;
                }
            }

            // Insert quote into database
            const quoteStatus = selectedProspectId ? 'assigned' : 'draft';

            const { data, error } = await supabase
                .from('quotes')
                .insert({
                    prospect_id: selectedProspectId || null,
                    sales_partner_id: salesPartnerId,
                    amount: total,
                    status: quoteStatus,
                    content: {
                        category: {
                            id: selectedCategory.id,
                            label: selectedCategory.label
                        },
                        selected_pack: {
                            name: selectedPlan.name,
                            price: basePrice,
                            description: selectedPlan.description,
                            features: selectedPlan.features,
                        },
                        selected_options: selectedAddonsData,
                        base_amount: basePrice, // Store the theoretical base price
                        final_amount: total,    // Store the actual tailored price
                        is_custom_price: customPrice !== basePrice,
                        client_notes: clientNotes || null,
                        internal_notes: internalNotes || null,
                        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    }
                })
                .select()
                .single();

            if (error) {
                console.error('Supabase insert error:', error);
                // Check for foreign key violation
                if (error.message?.includes('foreign key') || error.code === '23503') {
                    throw new Error('Le prospect sélectionné n\'est plus valide. Veuillez rafraîchir la page.');
                }
                throw new Error(error.message || 'Erreur base de données');
            }

            // Enrich quote data with prospect info for PDF
            const enrichedQuote = {
                ...data,
                prospect: selectedProspectId
                    ? prospects.find(p => p.id === selectedProspectId)
                    : null
            };

            toast.success('Devis créé avec succès !');
            setCreatedQuote(enrichedQuote);
            if (onQuoteCreated) onQuoteCreated();

        } catch (error) {
            console.error('Error creating quote:', error);
            toast.error('Erreur lors de la création du devis');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: // CLIENT
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

            case 2: // SERVICE CATEGORY
                return (
                    <div className="space-y-4">
                        <Label className="text-slate-200 text-lg mb-4 block">
                            Quel type de service souhaitez-vous proposer ?
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pricingData.map((category) => (
                                <Card
                                    key={category.id}
                                    className={`cursor-pointer transition-all hover:border-blue-400 ${selectedCategory?.id === category.id
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-700 bg-slate-900'
                                        }`}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                        <span className="text-4xl mb-3 block">{category.icon}</span>
                                        <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 3: // PLAN (OFFRE)
                if (!selectedCategory) return null;
                return (
                    <div className="space-y-4">
                        <Label className="text-slate-200 text-lg mb-4 block">
                            Choisissez une formule pour {selectedCategory.label}
                        </Label>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {selectedCategory.plans.map((plan, index) => (
                                <Card
                                    key={index}
                                    className={`cursor-pointer transition-all relative overflow-hidden ${selectedPlan?.name === plan.name
                                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                        : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                                        }`}
                                    onClick={() => handlePlanSelect(plan)}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium z-10">
                                            Recommandé
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                                        <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${plan.priceColor} mt-2`}>
                                            {plan.price}
                                        </div>
                                        <CardDescription className="text-slate-400 mt-2 min-h-[40px]">
                                            {plan.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {plan.features.slice(0, 5).map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                            {plan.features.length > 5 && (
                                                <li className="text-xs text-slate-500 italic pl-6">
                                                    + {plan.features.length - 5} autres fonctionnalités...
                                                </li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 4: // PERSONNALISATION
                return (
                    <div className="space-y-8">
                        {/* Custom Price Section */}
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Euro className="h-5 w-5 text-blue-400" />
                                Ajustement Tarifaire
                            </h3>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1 space-y-2 w-full">
                                    <Label className="text-slate-400">Prix Final du Devis (HT)</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={customPrice || ''}
                                            onChange={(e) => setCustomPrice(Number(e.target.value))}
                                            className="bg-slate-800 border-slate-600 text-white text-lg font-bold pl-10 h-12" // Increased height & font
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Ce montant remplacera le prix de base indiqué sur le devis.
                                        Prix de base formule: {selectedPlan ? parsePrice(selectedPlan.price) : 0}€
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Addons Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">
                                Options additionnelles (affichées sur le devis)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {addons
                                    .filter(addon => addon.categories?.includes(selectedCategory?.id || ''))
                                    .map((addon) => (
                                        <Card
                                            key={addon.id}
                                            className={`cursor-pointer transition-all ${selectedAddons.includes(addon.id)
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-slate-700 bg-slate-900 hover:border-purple-400'
                                                }`}
                                            onClick={() => handleToggleAddon(addon.id)}
                                        >
                                            <CardContent className="p-4 flex items-start gap-3">
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
                                            </CardContent>
                                        </Card>
                                    ))}
                                {addons.filter(addon => addon.categories?.includes(selectedCategory?.id || '')).length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-slate-500 italic">
                                        Aucune option spécifique disponible pour cette catégorie.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 5: // VALIDATION
                const selectedProspect = prospects.find(p => p.id === selectedProspectId);
                const selectedAddonData = addons.filter(a => selectedAddons.includes(a.id));

                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white">Récapitulatif et Notes</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Summary Card */}
                            <Card className="bg-slate-900 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Résumé du Devis</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-400">Client</p>
                                        <p className="text-white font-medium">
                                            {selectedProspect?.full_name || 'Non assigné (Brouillon)'}
                                            {selectedProspect?.company_name && ` - ${selectedProspect.company_name}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">Service & Formule</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                                                {selectedCategory?.label}
                                            </Badge>
                                            <span className="text-white font-medium">{selectedPlan?.name}</span>
                                        </div>
                                    </div>

                                    {selectedAddonData.length > 0 && (
                                        <div>
                                            <p className="text-sm text-slate-400 mb-2">Options sélectionnées</p>
                                            <ul className="space-y-1 text-sm text-slate-300">
                                                {selectedAddonData.map(addon => (
                                                    <li key={addon.id} className="flex justify-between">
                                                        <span>• {addon.name}</span>
                                                        <span className="text-purple-400">+{addon.price}€</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-700 pt-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-semibold text-white">Prix Total (HT)</p>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-400">
                                                    {customPrice !== null ? customPrice : calculateTotal()}€
                                                </p>
                                                {customPrice !== calculateTotal() && (
                                                    <p className="text-xs text-orange-400">(Prix ajusté manuellement)</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notes Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clientNotes" className="text-slate-200">
                                        Message pour le client (visible)
                                    </Label>
                                    <Textarea
                                        id="clientNotes"
                                        value={clientNotes}
                                        onChange={(e) => setClientNotes(e.target.value)}
                                        placeholder="Conditions, délais, détails spécifiques..."
                                        className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="internalNotes" className="text-slate-200">
                                        Notes internes (invisibles)
                                    </Label>
                                    <Textarea
                                        id="internalNotes"
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder="Marge de négo, info partenaire..."
                                        className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                                    />
                                </div>
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
            case 1: return true; // Optional prospect
            case 2: return selectedCategory !== null;
            case 3: return selectedPlan !== null;
            case 4: return true; // Customization optional
            case 5: return true;
            default: return false;
        }
    };

    const steps = ['Client', 'Service', 'Offre', 'Personnalisation', 'Validation'];

    return (
        <div className="bg-slate-950 p-4 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Back button logic could go here */}

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = step === stepNumber;
                        const isCompleted = step > stepNumber;

                        return (
                            <div key={label} className="flex flex-col items-center relative z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110'
                                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                                        }`}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                                    {label}
                                </span>
                                {/* Connector Line logic - simplified for visibility */}
                                {index < steps.length - 1 && (
                                    <div className={`hidden md:block absolute top-5 left-10 w-[calc(100vw/5-40px)] max-w-[180px] h-[2px] -z-10 ${isCompleted ? 'bg-green-500' : 'bg-slate-800'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm min-h-[400px]">
                    <CardContent className="p-8">
                        {renderStepContent()}
                    </CardContent>
                </Card>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <Button
                        variant="outline"
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                    >
                        Précédent
                    </Button>

                    {step < 5 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                            Suivant <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : !createdQuote ? (
                        <Button
                            onClick={handleGenerateQuote}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 shadow-lg shadow-green-900/20"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Générer le Devis
                        </Button>
                    ) : (
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCreatedQuote(null);
                                    setStep(1);
                                    setSelectedProspectId('');
                                    setSelectedCategory(null);
                                    setSelectedPlan(null);
                                    setCustomPrice(null);
                                    setSelectedAddons([]);
                                }}
                                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
                            >
                                Nouveau Devis
                            </Button>
                            <Button
                                variant="outline"
                                className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                                onClick={async () => {
                                    try {
                                        await openQuotePDF(createdQuote);
                                        toast.success('PDF ouvert dans un nouvel onglet');
                                    } catch (err) {
                                        console.error('PDF preview error:', err);
                                        toast.error('Erreur lors de la prévisualisation');
                                    }
                                }}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Aperçu PDF
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={async () => {
                                    try {
                                        await downloadQuotePDF(createdQuote);
                                        toast.success('PDF téléchargé !');
                                    } catch (err) {
                                        console.error('PDF download error:', err);
                                        toast.error('Erreur lors du téléchargement');
                                    }
                                }}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Télécharger PDF
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuoteGenerator;
