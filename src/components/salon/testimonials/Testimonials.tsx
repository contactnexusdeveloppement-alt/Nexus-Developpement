import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Julie R.",
        content: "Une expérience incroyable ! Je suis venue pour un balayage et le résultat dépasse mes attentes. L'équipe est adorable.",
        rating: 5
    },
    {
        name: "Marc D.",
        content: "Enfin un barbier qui comprend ce que je veux. Ambiance détendue et coupe impeccable. Je recommande vivement.",
        rating: 5
    },
    {
        name: "Sophie L.",
        content: "J'ai fait confiance à Sarah pour ma coiffure de mariage et c'était tout simplement parfait. Merci pour tout !",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-rose-gold-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Témoignages</span>
                    <h2 className="text-4xl font-serif font-bold text-charcoal mt-2">
                        Elles & Eux nous font <span className="italic">confiance</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testi, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg relative">
                            <Quote className="absolute top-6 right-6 w-10 h-10 text-rose-gold-100 fill-current" />
                            <div className="flex space-x-1 mb-4">
                                {[...Array(testi.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic relative z-10 leading-relaxed">
                                "{testi.content}"
                            </p>
                            <p className="font-bold text-charcoal text-lg font-serif">{testi.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
