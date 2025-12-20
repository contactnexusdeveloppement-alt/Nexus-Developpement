import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { properties } from '../data/properties';
import { MapPin, BedDouble, Maximize, ArrowLeft, CheckCircle } from 'lucide-react';


export default function PropertyDetails() {
    const { id } = useParams();
    const property = properties.find(p => p.id === id);

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Bien introuvable</h1>
                    <Link to="/" className="text-gold underline">Retour à l'accueil</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Header forceSolid={true} />

            <main className="pt-20">
                {/* Breadcrumb / Back */}
                <div className="bg-gray-50 py-4">
                    <div className="container mx-auto px-4">
                        <Link to="/properties" className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Retour aux biens
                        </Link>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <div className="container mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                                <div>
                                    <span className="bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 inline-block text-white">
                                        {property.type}
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-200">
                                        <MapPin className="w-5 h-5 text-gold" />
                                        <span className="text-lg">{property.location}</span>
                                    </div>
                                </div>
                                <div className="text-3xl md:text-4xl font-serif font-bold text-gold">
                                    {property.price.toLocaleString('fr-FR')} €
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Specs */}
                            <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8">
                                <div className="text-center border-r border-gray-100 last:border-0">
                                    <div className="flex flex-col items-center gap-2">
                                        <Maximize className="w-6 h-6 text-gold" />
                                        <span className="font-bold text-xl block">{property.surface} m²</span>
                                        <span className="text-sm text-gray-500">Surface</span>
                                    </div>
                                </div>
                                <div className="text-center border-r border-gray-100 last:border-0">
                                    <div className="flex flex-col items-center gap-2">
                                        <BedDouble className="w-6 h-6 text-gold" />
                                        <span className="font-bold text-xl block">{property.bedrooms}</span>
                                        <span className="text-sm text-gray-500">Chambres</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <CheckCircle className="w-6 h-6 text-gold" />
                                        <span className="font-bold text-xl block">Excel.</span>
                                        <span className="text-sm text-gray-500">État</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-black-rich">Description</h2>
                                <div className="prose prose-lg text-gray-600">
                                    <p>
                                        Découvrez ce bien d'exception situé à {property.location}. Offrant une surface généreuse de {property.surface} m²,
                                        ce bien de type {property.type} saura vous séduire par ses volumes et sa luminosité.
                                    </p>
                                    <p>
                                        Idéalement placé, il dispose de {property.bedrooms} chambres spacieuses, parfait pour accueillir votre famille
                                        ou vos invités dans le plus grand confort. Les finitions sont soignées et l'ambiance y est chaleureuse.
                                    </p>
                                    <p>
                                        Profitez d'un cadre de vie unique entre lac et montagne, caractéristique de notre belle région des Vosges.
                                        Une opportunité rare à saisir rapidement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Contact */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-black-rich text-white p-8 rounded-lg shadow-xl">
                                    <h3 className="text-2xl font-serif font-bold mb-2">Intéressé ?</h3>
                                    <p className="text-gray-400 mb-6">Contactez-nous pour organiser une visite privée.</p>

                                    <div className="space-y-4">
                                        <button className="w-full py-4 bg-gold text-white font-bold hover:bg-white hover:text-black-rich transition-colors uppercase tracking-widest">
                                            Demander une visite
                                        </button>
                                        <button className="w-full py-4 border border-white/20 hover:border-gold hover:text-gold transition-colors font-medium">
                                            +33 (0)3 29 00 00 00
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
