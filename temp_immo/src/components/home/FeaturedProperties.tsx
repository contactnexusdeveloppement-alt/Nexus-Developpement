import { useRef } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../shared/PropertyCard';
import { properties } from '../../data/properties';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function FeaturedProperties() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-20 bg-white relative">
            <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-4">
                    <h2 className="text-gold uppercase tracking-widest font-medium text-sm">Notre Sélection</h2>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-black-rich">Biens à la Une</h3>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 border border-gray-200 rounded-full hover:border-gold hover:text-gold transition-colors"
                        aria-label="Previous"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 border border-gray-200 rounded-full hover:border-gold hover:text-gold transition-colors"
                        aria-label="Next"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-8 px-4 md:px-[max(1rem,calc((100vw-1280px)/2))] pb-12 snap-x hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {properties.map(property => (
                    <div key={property.id} className="snap-center">
                        <PropertyCard property={property} />
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <Link to="/properties" className="inline-block border-b-2 border-black-rich pb-1 text-black-rich font-bold hover:text-gold hover:border-gold transition-colors">
                    VOIR TOUS NOS BIENS
                </Link>
            </div>
        </section>
    );
}
