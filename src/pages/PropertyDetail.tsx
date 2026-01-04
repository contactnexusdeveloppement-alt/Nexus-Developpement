import { useParams, useNavigate } from 'react-router-dom';
import { properties } from '@/data/agence-immo/properties';
import Header from '@/components/agence-immo/layout/Header';
import Footer from '@/components/agence-immo/layout/Footer';
import ScrollToTop from '@/components/agence-immo/layout/ScrollToTop';
import { ArrowLeft, BedDouble, Maximize, MapPin, Home, Phone, Mail } from 'lucide-react';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const property = properties.find(p => p.id === id);

    if (!property) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-bold text-black-rich mb-4">Bien non trouvé</h1>
                    <button
                        onClick={() => navigate('/agence-immobiliere')}
                        className="px-6 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-white transition-colors"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <ScrollToTop />
            <Header />

            <main className="pt-20">
                {/* Back Button */}
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/agence-immobiliere')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gold transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Retour aux biens</span>
                    </button>
                </div>

                {/* Hero Image */}
                <div className="relative h-[60vh] overflow-hidden">
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Tags */}
                    {property.tags && property.tags.length > 0 && (
                        <div className="absolute top-8 left-8 flex gap-2">
                            {property.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-gold text-white text-sm font-bold uppercase tracking-wider shadow-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Price */}
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-5xl font-bold font-serif">{property.price.toLocaleString('fr-FR')} €</p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-black-rich mb-4">{property.title}</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gold" />
                                    <span className="text-lg">{property.location}</span>
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="grid grid-cols-3 gap-6 py-8 border-y border-gray-200">
                                <div className="text-center">
                                    <Home className="w-8 h-8 mx-auto mb-2 text-gold" />
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">Type</p>
                                    <p className="text-xl font-bold text-black-rich">{property.type}</p>
                                </div>
                                <div className="text-center">
                                    <BedDouble className="w-8 h-8 mx-auto mb-2 text-gold" />
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">Chambres</p>
                                    <p className="text-xl font-bold text-black-rich">{property.bedrooms > 0 ? property.bedrooms : '-'}</p>
                                </div>
                                <div className="text-center">
                                    <Maximize className="w-8 h-8 mx-auto mb-2 text-gold" />
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">Surface</p>
                                    <p className="text-xl font-bold text-black-rich">{property.surface} m²</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-serif font-bold text-black-rich">Description</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Découvrez ce magnifique bien situé à {property.location}, offrant {property.surface} m² de surface habitable.
                                    {property.bedrooms > 0 && ` Ce ${property.type.toLowerCase()} dispose de ${property.bedrooms} chambres spacieuses. `}
                                    Un bien d'exception dans un cadre privilégié des Hautes-Vosges.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Idéalement situé entre terre et mer, ce bien bénéficie d'un emplacement incomparable avec un accès privilégié
                                    aux commodités et aux activités de plein air que vous offre la région de Gérardmer.
                                </p>
                            </div>
                        </div>

                        {/* Contact Sidebar */}
                        <div>
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 sticky top-24">
                                <h3 className="text-xl font-serif font-bold text-black-rich mb-6">Intéressé par ce bien ?</h3>

                                <div className="space-y-4 mb-8">
                                    <a
                                        href="tel:+33123456789"
                                        className="flex items-center gap-3 text-gray-700 hover:text-gold transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>01 23 45 67 89</span>
                                    </a>
                                    <a
                                        href="mailto:contact@prestige-immobilier-vosges.fr"
                                        className="flex items-center gap-3 text-gray-700 hover:text-gold transition-colors break-all"
                                    >
                                        <Mail className="w-5 h-5 shrink-0" />
                                        <span>contact@prestige-immobilier-vosges.fr</span>
                                    </a>
                                </div>

                                <button className="w-full py-4 bg-gold text-white uppercase text-sm font-bold tracking-widest hover:bg-gold/90 transition-colors shadow-md">
                                    Demander une visite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PropertyDetail;
