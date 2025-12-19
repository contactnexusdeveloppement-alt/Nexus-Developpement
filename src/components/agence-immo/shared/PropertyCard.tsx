import { Heart, Maximize, BedDouble, MapPin, Video } from 'lucide-react';
import type { Property } from '@/data/agence-immo/properties';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <Link to={`/agence-immo/property/${property.id}`} className="block group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full md:w-[350px] shrink-0 cursor-pointer border border-gray-100">

            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlays */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {property.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gold text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                    <button className="p-2 bg-white rounded-full hover:bg-gold hover:text-white transition-colors shadow-md">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white rounded-full hover:bg-gold hover:text-white transition-colors shadow-md">
                        <Video className="w-5 h-5" />
                    </button>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-2xl font-bold font-serif">{property.price.toLocaleString('fr-FR')} €</p>
                </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-serif font-bold text-black-rich line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 text-gold" />
                        <span>{property.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-100 text-gray-600 text-sm">
                    <span className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4" />
                        {property.type}
                    </span>
                    <span className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4" />
                        {property.bedrooms > 0 ? `${property.bedrooms} ch.` : '-'}
                    </span>
                    <span className="flex items-center gap-2">
                        <Maximize className="w-4 h-4" />
                        {property.surface} m²
                    </span>
                </div>

                <button className="w-full py-3 border border-black-rich text-black-rich uppercase text-xs font-bold tracking-widest hover:bg-black-rich hover:text-gold transition-colors">
                    Voir le détail
                </button>
            </div>
        </Link>
    );
}

function HomeIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    )
}
