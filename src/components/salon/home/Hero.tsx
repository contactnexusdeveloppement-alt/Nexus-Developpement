import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{
                    backgroundImage: 'url("/salon/assets/hero-bg-3.webp")',
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="block text-rose-gold-400 text-lg md:text-xl font-medium tracking-widest uppercase mb-4">
                        Bienvenue chez Élégance
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
                        Révélez votre <br />
                        <span className="text-rose-gold-400 italic">beauté naturelle</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Un espace dédié à la coiffure et au bien-être, où chaque coupe est une création unique pensée pour vous.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                        <a
                            href="#booking"
                            className="px-8 py-4 bg-rose-gold-600 text-white rounded-full font-medium text-lg hover:bg-rose-gold-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Prendre Rendez-vous
                        </a>
                        <a
                            href="#services"
                            className="px-8 py-4 bg-transparent border border-white text-white rounded-full font-medium text-lg hover:bg-white hover:text-charcoal transition-all"
                        >
                            Découvrir nos services
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-2 bg-white rounded-full mt-2" />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
