import { useState } from 'react';
import { Package, Grid } from 'lucide-react';

interface EcommerceCatalogStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export const EcommerceCatalogStep = ({ formData, updateFormData }: EcommerceCatalogStepProps) => {
    const [productCount, setProductCount] = useState(formData.ecommerceProductCount || 50);
    const [categoryCount, setCategoryCount] = useState(formData.ecommerceCategoryCount || 5);
    const [catalogType, setCatalogType] = useState(formData.ecommerceCatalogType || 'standard');

    const handleProductCountChange = (value: number) => {
        setProductCount(value);
        updateFormData({ ecommerceProductCount: value });
    };

    const handleCategoryCountChange = (value: number) => {
        setCategoryCount(value);
        updateFormData({ ecommerceCategoryCount: value });
    };

    const handleCatalogTypeChange = (type: 'simple' | 'standard' | 'advanced') => {
        setCatalogType(type);
        updateFormData({ ecommerceCatalogType: type });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Catalogue Produits</h3>
                <p className="text-slate-400 text-sm">
                    Définissez la taille et la structure de votre catalogue e-commerce.
                </p>
            </div>

            {/* Product Count Slider */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Nombre de Produits <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="1"
                        max="1000"
                        value={productCount}
                        onChange={(e) => handleProductCountChange(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-2xl font-bold text-blue-400 min-w-[80px] text-right">{productCount}</span>
                </div>
                <p className="text-xs text-slate-500">Nombre estimé de produits à vendre sur la plateforme</p>
            </div>

            {/* Category Count */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Catégories de Produits
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={categoryCount}
                        onChange={(e) => handleCategoryCountChange(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xl font-bold text-green-400 min-w-[60px] text-right">{categoryCount}</span>
                </div>
                <p className="text-xs text-slate-500">Nombre de catégories pour organiser vos produits</p>
            </div>

            {/* Catalog Type */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                    Type de Catalogue <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                    <button
                        onClick={() => handleCatalogTypeChange('simple')}
                        className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left
                            ${catalogType === 'simple'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <Package className={`w-5 h-5 mt-0.5 ${catalogType === 'simple' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white">Simple</span>
                                    {catalogType === 'simple' && <span className="text-blue-400 text-sm">✓</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Produits simples avec photo, description, prix (ex: boutique artisanale)
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleCatalogTypeChange('standard')}
                        className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left
                            ${catalogType === 'standard'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <Grid className={`w-5 h-5 mt-0.5 ${catalogType === 'standard' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white">Standard</span>
                                    {catalogType === 'standard' && <span className="text-blue-400 text-sm">✓</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Produits avec variantes (taille, couleur), galerie photos, stock
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleCatalogTypeChange('advanced')}
                        className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left
                            ${catalogType === 'advanced'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <Grid className={`w-5 h-5 mt-0.5 ${catalogType === 'advanced' ? 'text-blue-400' : 'text-slate-400'}`} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white">Avancé</span>
                                    {catalogType === 'advanced' && <span className="text-blue-400 text-sm">✓</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Produits configurables, options avancées, promotions, bundles, cross-sell
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-300">
                    💡 <b>Conseil:</b> Le type de catalogue influence la complexité et le coût de développement. Commencez simple et ajoutez des fonctionnalités au fur et à mesure.
                </p>
            </div>
        </div>
    );
};
