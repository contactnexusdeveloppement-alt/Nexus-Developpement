import React from 'react';
import { motion } from 'framer-motion';

const team = [
    {
        name: "Sarah Dubreuil",
        role: "Directrice Artistique",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bio: "Spécialiste des colorations complexes et des coupes transformation."
    },
    {
        name: "Thomas Moreau",
        role: "Barbier Expert",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bio: "Maître dans l'art du rasage à l'ancienne et des coupes hommes modernes."
    },
    {
        name: "Léa Martin",
        role: "Coiffeuse Styliste",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bio: "Experte en chignons événementiels et coiffures de mariage."
    }
];

const Team = () => {
    return (
        <section id="team" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Notre Équipe</span>
                    <h2 className="text-4xl font-serif font-bold text-charcoal mt-2">
                        Des experts <span className="italic">passionnés</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group text-center"
                        >
                            <div className="relative overflow-hidden rounded-full w-48 h-48 mx-auto mb-6 shadow-xl border-4 border-rose-gold-100 group-hover:border-rose-gold-300 transition-colors">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">{member.name}</h3>
                            <p className="text-rose-gold-600 font-medium mb-3 uppercase tracking-wide text-sm">{member.role}</p>
                            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                                {member.bio}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
