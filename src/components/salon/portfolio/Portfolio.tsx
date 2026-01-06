import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ["Tous", "Femmes", "Hommes", "Colorations", "Coiffures"];

const portfolioItems = [
    { id: 1, category: "Femmes", image: "/salon/assets/portfolio-bob.webp", title: "Carré Plongeant" },
    { id: 2, category: "Hommes", image: "/salon/assets/portfolio-fade.webp", title: "Coupe Fade" },
    { id: 3, category: "Colorations", image: "/salon/assets/portfolio-balayage.jpg", title: "Balayage Miel" },
    { id: 4, category: "Coiffures", image: "/salon/assets/portfolio-bun.jpg", title: "Chignon Mariage" },
    { id: 5, category: "Femmes", image: "/salon/assets/portfolio-wavy.jpg", title: "Wavy Naturel" },
    { id: 6, category: "Colorations", image: "/salon/assets/portfolio-ombre.webp", title: "Ombré Hair" },
    { id: 7, category: "Hommes", image: "/salon/assets/portfolio-beard.jpg", title: "Barbe & Coupe" },
    { id: 8, category: "Coiffures", image: "/salon/assets/portfolio-braid.jpg", title: "Tresse Bohème" },
];

const Portfolio = () => {
    const [activeCategory, setActiveCategory] = useState("Tous");

    const filteredItems = activeCategory === "Tous"
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeCategory);

    return (
        <section id="portfolio" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Inspirations</span>
                    <h2 className="text-4xl font-serif font-bold text-charcoal mt-2">
                        Nos dernières <span className="italic">réalisations</span>
                    </h2>
                </div>

                {/* Filters */}
                <div className="flex flex-wrapjustify-center gap-4 mb-12 overflow-x-auto pb-4 md:pb-0 px-4 md:justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                                ? 'bg-charcoal text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-rose-gold-100 hover:text-rose-gold-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-rose-gold-400 text-xs font-medium uppercase tracking-wider mb-2">{item.category}</span>
                                    <h3 className="text-white text-xl font-serif font-bold">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Portfolio;
