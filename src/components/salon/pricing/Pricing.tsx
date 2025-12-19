import React from 'react';

const pricingData = {
    "Femme": [
        { name: "Shampoing + Coupe + Brushing", price: "45€" },
        { name: "Shampoing + Brushing", price: "25€" },
        { name: "Coupe Transformation", price: "55€" },
        { name: "Frange / Entretien", price: "10€" },
    ],
    "Homme": [
        { name: "Shampoing + Coupe + Coiffage", price: "28€" },
        { name: "Taille de Barbe", price: "15€" },
        { name: "Forfait Coupe + Barbe", price: "40€" },
        { name: "Coloration Homme (Cover)", price: "25€" },
    ],
    "Technique": [
        { name: "Coloration Racines", price: "35€" },
        { name: "Coloration Complète", price: "45€" },
        { name: "Balayage / Mèches", price: "60€" },
        { name: "Ombré Hair", price: "80€" },
        { name: "Patine / Gloss", price: "20€" },
    ],
    "Soins": [
        { name: "Masque Profond", price: "15€" },
        { name: "Botox Capillaire", price: "80€" },
        { name: "Lissage Brésilien", price: "150€" },
    ]
};

const Pricing = () => {
    return (
        <section id="pricing" className="py-20 bg-cream">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Tarifs</span>
                    <h2 className="text-4xl font-serif font-bold text-charcoal mt-2">
                        Carte des <span className="italic">prestations</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {Object.entries(pricingData).map(([category, items]) => (
                        <div key={category} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center">
                                <span className="w-8 h-px bg-rose-gold-600 mr-4"></span>
                                {category}
                            </h3>
                            <ul className="space-y-4">
                                {items.map((item, index) => (
                                    <li key={index} className="flex justify-between items-baseline group">
                                        <span className="text-gray-600 font-medium group-hover:text-charcoal transition-colors">{item.name}</span>
                                        <div className="flex-grow mx-4 border-b border-dotted border-gray-300 h-1"></div>
                                        <span className="text-rose-gold-600 font-bold">{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
