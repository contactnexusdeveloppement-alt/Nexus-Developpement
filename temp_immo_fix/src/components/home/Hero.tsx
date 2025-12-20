import SearchBar from './SearchBar';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Lac de Gérardmer"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center gap-12 mt-20">
                <div className="text-center space-y-6 animate-fade-in">
                    <h2 className="text-gold tracking-[0.2em] font-medium text-sm md:text-base uppercase">Agence Immobilière de Prestige</h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight">
                        L'excellence immobilière<br />
                        <span className="italic font-light">entre terre et mer</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">
                        Votre partenaire de confiance pour des biens d'exception au bord du lac de Gérardmer et dans les Hautes-Vosges.
                    </p>
                </div>

                <div className="w-full">
                    <SearchBar />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white">
                <ChevronDown className="w-8 h-8" />
            </div>
        </section>
    );
}
