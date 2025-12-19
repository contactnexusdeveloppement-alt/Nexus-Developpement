import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Palette, Sparkles, ArrowRight } from 'lucide-react';

const services = [
    {
        icon: Scissors,
        title: "Coupes & Styling",
        description: "Des coupes sur-mesure adaptées à la forme de votre visage et à votre style de vie.",
        price: "À partir de 45€"
    },
    {
        icon: Palette,
        title: "Colorations",
        description: "Balayage, ombré, coloration sans ammoniaque... Sublimez vos cheveux avec nos techniques expertes.",
        price: "À partir de 60€"
    },
    {
        icon: Sparkles,
        title: "Soins & Traitements",
        description: "Botox capillaire, lissage brésilien et rituels de soins profonds pour une chevelure éclatante.",
        price: "À partir de 35€"
    }
];

const ServicesPreview = () => {
    return (
        <section id="services" className="py-20 bg-rose-gold-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Nos Prestations</span>
                    <h2 className="text-4xl font-serif font-bold text-charcoal mt-2">
                        Des services <span className="italic">d'exception</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                        >
                            <div className="w-16 h-16 bg-rose-gold-100 rounded-full flex items-center justify-center mb-6 text-rose-gold-600 group-hover:bg-rose-gold-600 group-hover:text-white transition-colors duration-300">
                                <service.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-rose-gold-600 font-medium">{service.price}</span>
                                <a href="#pricing" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-rose-gold-600 group-hover:text-rose-gold-600 transition-all">
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="#pricing"
                        className="inline-block border-2 border-charcoal text-charcoal px-8 py-3 rounded-full font-medium hover:bg-charcoal hover:text-white transition-colors uppercase text-sm tracking-wide"
                    >
                        Voir toute la carte
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ServicesPreview;
