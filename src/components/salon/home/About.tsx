import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const About = () => {
    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/salon/assets/salon-interior.webp"
                                alt="Salon Interior"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-rose-gold-100 rounded-2xl -z-0" />
                        <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-rose-gold-300 rounded-full -z-0" />

                        <div className="absolute bottom-10 left-10 transform translate-y-1/2 lg:translate-y-0 z-20 bg-white p-6 rounded-lg shadow-xl max-w-xs">
                            <div className="flex items-center space-x-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic text-sm">
                                "Le meilleur salon de Paris ! Une équipe à l'écoute et un résultat toujours parfait."
                            </p>
                            <p className="text-gray-900 font-semibold text-sm mt-3">- Sophie Martin</p>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Notre Histoire</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mt-4 mb-6">
                            L'excellence au service de <br />
                            <span className="text-rose-gold-600 italic">votre style</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Depuis 2015, Élégance incarne la passion de la coiffure haute couture dans une ambiance chaleureuse et décontractée. Notre mission est simple : sublimer votre personnalité à travers des coupes et des couleurs qui vous ressemblent.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Nos experts coiffeurs-visagistes sont formés aux dernières techniques internationales pour vous offrir un service sur-mesure, du balayage californien à la coupe structurée.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div>
                                <h4 className="text-3xl font-serif font-bold text-rose-gold-600">10+</h4>
                                <p className="text-gray-600">Années d'expérience</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-serif font-bold text-rose-gold-600">5k+</h4>
                                <p className="text-gray-600">Clients satisfaits</p>
                            </div>
                        </div>

                        <a href="#team" className="text-charcoal border-b-2 border-rose-gold-600 pb-1 hover:text-rose-gold-600 hover:border-charcoal transition-colors font-medium">
                            Rencontrer l'équipe &rarr;
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
