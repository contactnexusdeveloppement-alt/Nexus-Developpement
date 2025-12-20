import { BadgeCheck } from 'lucide-react';

export default function AboutSection() {
    return (
        <section id="agency" className="py-20 bg-black-rich text-white-creamy relative overflow-hidden">
            {/* Decorative Gold Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16 relative z-10">

                {/* Image Composition */}
                <div className="w-full md:w-1/2 relative group">
                    <div className="relative z-10 overflow-hidden rounded-sm shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2788&auto=format&fit=crop"
                            alt="Nature des Vosges"
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    {/* Gold Frame Border */}
                    <div className="absolute top-6 -left-6 w-full h-full border-2 border-gold z-0 hidden md:block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-gold uppercase tracking-widest font-medium text-sm">Notre Philosophie</h2>
                        <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">
                            L'Harmonie <br />
                            <span className="italic text-gray-400">Entre Terre et Mer</span>
                        </h3>
                    </div>

                    <div className="space-y-6 text-gray-300 font-light text-lg leading-relaxed">
                        <p>
                            Ancrée au cœur de la Perle des Vosges, notre agence vous propose une approche unique de l'immobilier, alliant l'authenticité de notre terroir à l'exigence du luxe contemporain.
                        </p>
                        <p>
                            Que vous cherchiez un chalet intimiste en lisière de forêt ou un appartement avec vue imprenable sur le lac de Gérardmer, nous sélectionnons pour vous des biens qui racontent une histoire.
                        </p>
                    </div>

                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <BadgeCheck className="w-8 h-8 text-gold shrink-0" />
                            <div>
                                <h4 className="font-serif font-bold text-white mb-1">Expertise Locale</h4>
                                <p className="text-sm text-gray-400">Une connaissance parfaite du marché de Gérardmer et ses environs.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <BadgeCheck className="w-8 h-8 text-gold shrink-0" />
                            <div>
                                <h4 className="font-serif font-bold text-white mb-1">Accompagnement Premium</h4>
                                <p className="text-sm text-gray-400">Un service sur-mesure pour chaque étape de votre projet.</p>
                            </div>
                        </div>
                    </div>

                    <button className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black-rich transition-colors font-medium">
                        DÉCOUVRIR L'AGENCE
                    </button>
                </div>
            </div>
        </section>
    );
}
