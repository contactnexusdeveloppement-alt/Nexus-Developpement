import { useState } from 'react';
import { Search, MapPin, Euro, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'estimate'>('buy');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (activeTab === 'estimate') {
            alert("Fonctionnalité d'estimation à venir !");
            return;
        }

        const params = new URLSearchParams();
        if (location) params.append('city', location);
        if (activeTab === 'rent') params.append('type', 'rent');

        navigate(`/properties?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('buy')}
                    className={`flex-1 py-4 text-sm md:text-base font-serif font-bold transition-all ${activeTab === 'buy' ? 'bg-gold text-white' : 'hover:bg-gray-50 text-gray-500'
                        }`}
                >
                    ACHETER
                </button>
                <button
                    onClick={() => setActiveTab('rent')}
                    className={`flex-1 py-4 text-sm md:text-base font-serif font-bold transition-all ${activeTab === 'rent' ? 'bg-gold text-white' : 'hover:bg-gray-50 text-gray-500'
                        }`}
                >
                    LOUER
                </button>
                <button
                    onClick={() => setActiveTab('estimate')}
                    className={`flex-1 py-4 text-sm md:text-base font-serif font-bold transition-all ${activeTab === 'estimate' ? 'bg-gold text-white' : 'hover:bg-gray-50 text-gray-500'
                        }`}
                >
                    ESTIMER
                </button>
            </div>

            {/* Inputs */}
            <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
                {activeTab === 'estimate' ? (
                    <>
                        <div className="flex-1 w-full relative group">
                            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
                            <select
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all appearance-none bg-white cursor-pointer"
                                defaultValue=""
                            >
                                <option value="" disabled>Type de bien</option>
                                <option value="house">Maison</option>
                                <option value="apartment">Appartement</option>
                                <option value="land">Terrain</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full relative group">
                            <input
                                type="number"
                                placeholder="Surface (m²)"
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>
                        <div className="flex-1 w-full relative group">
                            <input
                                type="number"
                                placeholder="Pièces"
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>
                        <div className="flex-1 w-full relative group">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Ville / Adresse"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex-1 w-full relative group">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5 group-hover:scale-110 transition-transform" />
                            <input
                                type="text"
                                placeholder="Ville (ex: Gérardmer)"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>

                        <div className="flex-1 w-full relative group">
                            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5 group-hover:scale-110 transition-transform" />
                            <input
                                type="text"
                                placeholder="Budget Max"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>

                        <button className="p-3 border border-gray-200 rounded-md hover:border-gold hover:text-gold transition-all" title="Plus de filtres">
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </>
                )}

                <button
                    onClick={handleSearch}
                    className="w-full md:w-auto px-8 py-3 bg-black-rich text-white font-medium rounded-md hover:bg-gold transition-colors flex items-center justify-center gap-2"
                >
                    {activeTab === 'estimate' ? <span>ESTIMER</span> : (
                        <>
                            <Search className="w-4 h-4" />
                            <span>RECHERCHER</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
