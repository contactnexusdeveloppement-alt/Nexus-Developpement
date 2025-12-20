import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PropertyCard from '../components/shared/PropertyCard';
import { properties } from '../data/properties';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function PropertiesPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter states
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
    const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
    const [priceRange, setPriceRange] = useState(1000000); // Default max price

    const [filteredProperties, setFilteredProperties] = useState(properties);

    // Update filters when URL params change
    useEffect(() => {
        const type = searchParams.get('type') || '';
        const city = searchParams.get('city') || '';
        setTypeFilter(type);
        setCityFilter(city);
    }, [searchParams]);

    // Filter logic
    useEffect(() => {
        let results = properties;

        if (typeFilter) {
            // Mapping English param to approximate French type if needed, or exact match
            // Here 'rent' and 'buy' might filter by transaction type ideally, checking both logic
            if (typeFilter === 'rent') {
                // Assuming we had a field, but for now let's just use it as logic placeholder or exact type
            }
        }

        if (cityFilter) {
            results = results.filter(p => p.location.toLowerCase().includes(cityFilter.toLowerCase()));
        }

        // Price Filter
        results = results.filter(p => p.price <= priceRange);

        setFilteredProperties(results);
    }, [typeFilter, cityFilter, priceRange]);

    const handleFilterUpdate = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header forceSolid={true} />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4">

                    {/* Page Title */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-black-rich mb-2">
                            Nos Biens
                        </h1>
                        <p className="text-gray-500">Trouvez le bien de vos rêves parmi notre sélection exclusive.</p>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-12 sticky top-24 z-30 transition-all">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                            {/* Desktop/Tablet Filters */}
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div className="relative group min-w-[200px]">
                                    <input
                                        type="text"
                                        placeholder="Ville (ex: Gérardmer)"
                                        value={cityFilter}
                                        onChange={(e) => handleFilterUpdate('city', e.target.value)}
                                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => handleFilterUpdate('type', e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white cursor-pointer"
                                >
                                    <option value="">Tous types</option>
                                    <option value="buy">Acheter</option>
                                    <option value="rent">Louer (Indisponible)</option>
                                </select>

                                {/* Price Range (Simple implementation) */}
                                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md">
                                    <span className="text-sm text-gray-500">Max: {priceRange.toLocaleString()}€</span>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="2000000"
                                        step="50000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-32 accent-gold cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setSearchParams({});
                                    setPriceRange(1000000);
                                }}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Réinitialiser
                            </button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {filteredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProperties.map(property => (
                                <div key={property.id} className="flex justify-center">
                                    <PropertyCard property={property} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-xl text-gray-400 font-serif">Aucun bien ne correspond à vos critères.</p>
                            <button
                                className="mt-4 text-gold hover:underline"
                                onClick={() => {
                                    setSearchParams({});
                                    setPriceRange(1000000);
                                }}
                            >
                                Effacer les filtres
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
