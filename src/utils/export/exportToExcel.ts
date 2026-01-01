import * as XLSX from 'xlsx';
import { QuoteFormData } from '@/components/admin/modals/QuoteWizardModal';
import { formatPrice } from '../pricing/calculateQuotePrice';

interface ExportData {
    quote: any;
    client: { name: string; email: string };
    formData: QuoteFormData;
    priceEstimate?: {
        min: number;
        max: number;
        recommended: number;
    };
}

/**
 * Export quote qualification to Excel
 */
export function exportQuoteToExcel(data: ExportData): void {
    const { quote, client, formData, priceEstimate } = data;

    // Prepare data for Excel
    const excelData: any[] = [];

    // Header
    excelData.push({
        'Section': '=== DEVIS QUALIFICATION ===',
        'Information': '',
        'Détails': ''
    });
    excelData.push({});

    // Client Info
    excelData.push({
        'Section': 'CLIENT',
        'Information': 'Nom',
        'Détails': client.name
    });
    excelData.push({
        'Section': '',
        'Information': 'Email',
        'Détails': client.email
    });
    excelData.push({
        'Section': '',
        'Information': 'Date demande',
        'Détails': new Date(quote.created_at).toLocaleDateString('fr-FR')
    });
    excelData.push({});

    // Step 1: Service
    excelData.push({
        'Section': 'STEP 1 - SERVICE',
        'Information': 'Type de service',
        'Détails': formData.serviceType || 'Non défini'
    });
    excelData.push({
        'Section': '',
        'Information': 'Refonte',
        'Détails': formData.isRefonte ? 'Oui' : 'Nouvelle création'
    });
    if (formData.existingUrl) {
        excelData.push({
            'Section': '',
            'Information': 'URL existante',
            'Détails': formData.existingUrl
        });
    }
    excelData.push({
        'Section': '',
        'Information': 'Urgence',
        'Détails': formData.urgency || 'Non défini'
    });
    excelData.push({});

    // Service-specific sections
    if (formData.serviceType === 'automatisation') {
        // AUTOMATION STEPS
        excelData.push({
            'Section': 'STEP 2 - TYPES D\'AUTOMATISATION',
            'Information': 'Types sélectionnés',
            'Détails': formData.automationType?.join(', ') || 'Non défini'
        });
        excelData.push({});

        excelData.push({
            'Section': 'STEP 3 - INTÉGRATIONS',
            'Information': 'Plateformes',
            'Détails': formData.automationIntegrations?.join(', ') || 'Aucune'
        });
        excelData.push({});

        excelData.push({
            'Section': 'STEP 4 - COMPLEXITÉ',
            'Information': 'Nombre de workflows',
            'Détails': formData.automationWorkflows?.toString() || '1'
        });
        excelData.push({
            'Section': '',
            'Information': 'Complexité',
            'Détails': formData.automationComplexity || 'simple'
        });
        excelData.push({
            'Section': '',
            'Information': 'Formation',
            'Détails': formData.automationTraining ? 'Oui' : 'Non'
        });
        excelData.push({
            'Section': '',
            'Information': 'Support',
            'Détails': formData.automationSupport ? 'Oui' : 'Non'
        });
        excelData.push({});

    } else if (formData.serviceType === 'identite') {
        // IDENTITY STEPS
        excelData.push({
            'Section': 'STEP 2 - PACKAGE',
            'Information': 'Package',
            'Détails': formData.identityPackage === 'logo' ? 'Logo Essentiel' :
                formData.identityPackage === 'charte' ? 'Logo + Charte' : 'Identité Complète'
        });
        excelData.push({});

        excelData.push({
            'Section': 'STEP 3 - STYLE',
            'Information': 'Style visuel',
            'Détails': formData.identityStyle || 'Non défini'
        });
        if (formData.identityColors) {
            excelData.push({
                'Section': '',
                'Information': 'Couleurs',
                'Détails': formData.identityColors
            });
        }
        if (formData.identityIndustry) {
            excelData.push({
                'Section': '',
                'Information': 'Secteur',
                'Détails': formData.identityIndustry
            });
        }
        if (formData.identityValues) {
            excelData.push({
                'Section': '',
                'Information': 'Valeurs',
                'Détails': formData.identityValues
            });
        }
        excelData.push({});

    } else if (formData.serviceType === 'mobile') {
        // MOBILE STEPS
        excelData.push({
            'Section': 'STEP 2 - PLATEFORMES',
            'Information': 'Cibles',
            'Détails': formData.mobilePlatforms?.join(', ') || 'Non défini'
        });
        excelData.push({});

        if (formData.mobileFeatures && formData.mobileFeatures.length > 0) {
            excelData.push({
                'Section': 'STEP 3 - FONCTIONNALITÉS',
                'Information': 'Features sélectionnées',
                'Détails': formData.mobileFeatures.join(', ')
            });
            excelData.push({});
        }

        excelData.push({
            'Section': 'STEP 4 - DESIGN & BACKEND',
            'Information': 'Type design',
            'Détails': formData.mobileDesignType === 'native' ? 'Native UI' : 'Custom Design'
        });
        excelData.push({
            'Section': '',
            'Information': 'Backend',
            'Détails': formData.mobileBackend === 'existing' ? 'Existant' :
                formData.mobileBackend === 'new' ? 'À créer' : 'Aucun'
        });
        excelData.push({});

    } else if (formData.serviceType === 'ecommerce') {
        // E-COMMERCE STEPS
        excelData.push({
            'Section': 'STEP 2 - CATALOGUE',
            'Information': 'Nombre de produits',
            'Détails': formData.ecommerceProductCount?.toString() || '50'
        });
        excelData.push({
            'Section': '',
            'Information': 'Catégories',
            'Détails': formData.ecommerceCategoryCount?.toString() || '5'
        });
        excelData.push({
            'Section': '',
            'Information': 'Type catalogue',
            'Détails': formData.ecommerceCatalogType === 'simple' ? 'Simple' :
                formData.ecommerceCatalogType === 'advanced' ? 'Avancé' : 'Standard'
        });
        excelData.push({});

        if (formData.ecommercePaymentMethods && formData.ecommercePaymentMethods.length > 0) {
            excelData.push({
                'Section': 'STEP 3 - PAIEMENT',
                'Information': 'Méthodes',
                'Détails': formData.ecommercePaymentMethods.join(', ')
            });
            excelData.push({
                'Section': '',
                'Information': 'Devise',
                'Détails': formData.ecommerceCurrency || 'EUR'
            });
            if (formData.ecommerceMultiCurrency) {
                excelData.push({
                    'Section': '',
                    'Information': 'Multi-devises',
                    'Détails': 'Oui'
                });
            }
            excelData.push({});
        }

        if (formData.ecommerceFeatures && formData.ecommerceFeatures.length > 0) {
            excelData.push({
                'Section': 'STEP 4 - FONCTIONNALITÉS',
                'Information': 'Features sélectionnées',
                'Détails': formData.ecommerceFeatures.join(', ')
            });
            excelData.push({});
        }

    } else {
        // WEB/WEBAPP STEPS (vitrine, webapp)
        // Step 2: Pages & Structure
        excelData.push({
            'Section': 'STEP 2 - STRUCTURE',
            'Information': 'Nombre de pages',
            'Détails': formData.pagesCount.toString()
        });
        if (formData.standardPages.length > 0) {
            excelData.push({
                'Section': '',
                'Information': 'Pages standards',
                'Détails': formData.standardPages.join(', ')
            });
        }
        if (formData.customPages) {
            excelData.push({
                'Section': '',
                'Information': 'Pages personnalisées',
                'Détails': formData.customPages
            });
        }
        excelData.push({
            'Section': '',
            'Information': 'Multi-langue',
            'Détails': formData.multiLanguage ? 'Oui' : 'Non'
        });
        if (formData.multiLanguage && formData.languages.length > 0) {
            excelData.push({
                'Section': '',
                'Information': 'Langues',
                'Détails': formData.languages.join(', ')
            });
        }
        excelData.push({});

        // Step 3: Features
        const hasFeatures = Object.values(formData.features).some(f => f.length > 0);
        if (hasFeatures) {
            excelData.push({
                'Section': 'STEP 3 - FONCTIONNALITÉS',
                'Information': '',
                'Détails': ''
            });

            if (formData.features.forms.length > 0) {
                excelData.push({
                    'Section': '',
                    'Information': 'Formulaires',
                    'Détails': formData.features.forms.join(', ')
                });
            }
            if (formData.features.auth.length > 0) {
                excelData.push({
                    'Section': '',
                    'Information': 'Authentification',
                    'Détails': formData.features.auth.join(', ')
                });
            }
            if (formData.features.ecommerce.length > 0) {
                excelData.push({
                    'Section': '',
                    'Information': 'E-commerce',
                    'Détails': formData.features.ecommerce.join(', ')
                });
            }
            if (formData.features.content.length > 0) {
                excelData.push({
                    'Section': '',
                    'Information': 'Contenu',
                    'Détails': formData.features.content.join(', ')
                });
            }
            if (formData.features.integrations.length > 0) {
                excelData.push({
                    'Section': '',
                    'Information': 'Intégrations',
                    'Détails': formData.features.integrations.join(', ')
                });
            }
            excelData.push({});
        }

        // Step 4: Design
        excelData.push({
            'Section': 'STEP 4 - DESIGN',
            'Information': 'Logo',
            'Détails': formData.hasLogo ? 'Existant' : 'À créer'
        });
        if (formData.logoUrl) {
            excelData.push({
                'Section': '',
                'Information': 'URL Logo',
                'Détails': formData.logoUrl
            });
        }
        excelData.push({
            'Section': '',
            'Information': 'Charte graphique',
            'Détails': formData.hasCharte ? 'Existante' : 'À créer'
        });
        if (formData.designStyle) {
            excelData.push({
                'Section': '',
                'Information': 'Style',
                'Détails': formData.designStyle
            });
        }
        if (formData.colors) {
            excelData.push({
                'Section': '',
                'Information': 'Couleurs',
                'Détails': formData.colors
            });
        }
        if (formData.references) {
            excelData.push({
                'Section': '',
                'Information': 'Références',
                'Détails': formData.references
            });
        }
        excelData.push({});

        // Step 5: Technical
        excelData.push({
            'Section': 'STEP 5 - TECHNIQUE',
            'Information': 'Domaine/Hébergement',
            'Détails': formData.manageDomain ? 'À gérer' : 'Client gère'
        });
        excelData.push({
            'Section': '',
            'Information': 'Priorité SEO',
            'Détails': formData.seoPriority ? 'Oui' : 'Non'
        });
        excelData.push({
            'Section': '',
            'Information': 'Performance critique',
            'Détails': formData.performanceCritical ? 'Oui' : 'Non'
        });
        excelData.push({
            'Section': '',
            'Information': 'Accessibilité',
            'Détails': formData.accessibility ? 'Oui' : 'Non'
        });
        excelData.push({});
    }

    // Common final steps (Budget & Timeline) - for all service types except automation/identity
    if (!['automatisation', 'identite', 'mobile', 'ecommerce'].includes(formData.serviceType)) {
        excelData.push({
            'Section': 'STEP 6 - BUDGET & DÉLAIS',
            'Information': 'Budget estimé (range)',
            'Détails': formData.budgetRange || 'Non défini'
        });
        excelData.push({
            'Section': '',
            'Information': 'Modalités paiement',
            'Détails': formData.paymentTerms || 'Non défini'
        });
        excelData.push({
            'Section': '',
            'Information': 'Maintenance',
            'Détails': formData.maintenance ? 'Oui' : 'Non'
        });
        if (formData.launchDate) {
            excelData.push({
                'Section': '',
                'Information': 'Date lancement',
                'Détails': new Date(formData.launchDate).toLocaleDateString('fr-FR')
            });
        }
        excelData.push({});
    }


    // Pricing estimate if available
    if (priceEstimate) {
        excelData.push({
            'Section': 'ESTIMATION PRIX',
            'Information': 'Minimum',
            'Détails': formatPrice(priceEstimate.min)
        });
        excelData.push({
            'Section': '',
            'Information': 'Recommandé',
            'Détails': formatPrice(priceEstimate.recommended)
        });
        excelData.push({
            'Section': '',
            'Information': 'Maximum',
            'Détails': formatPrice(priceEstimate.max)
        });
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 25 }, // Section
        { wch: 30 }, // Information
        { wch: 50 }  // Détails
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Qualification');

    // Generate filename with sanitized client name
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedName = client.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Devis_${sanitizedName}_${timestamp}.xlsx`;

    // Download with proper format
    XLSX.writeFile(workbook, filename, { bookType: 'xlsx', type: 'binary' });
}
