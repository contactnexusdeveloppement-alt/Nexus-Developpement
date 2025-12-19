import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        date: '',
        time: '',
        comments: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isSubmitted) {
        return (
            <section id="booking" className="py-20 bg-charcoal text-white text-center">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20"
                    >
                        <CheckCircle className="w-20 h-20 text-rose-gold-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-serif font-bold mb-4">Demande Envoyée !</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Merci {formData.name}, nous avons bien reçu votre demande de rendez-vous pour le {formData.date} à {formData.time}.
                            <br /><br />
                            Nous vous confirmerons votre créneau par SMS très rapidement.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-8 px-6 py-2 border border-rose-gold-400 text-rose-gold-400 rounded-full hover:bg-rose-gold-400 hover:text-white transition-colors"
                        >
                            Nouvelle demande
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="booking" className="py-20 bg-charcoal text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text Content */}
                    <div>
                        <span className="text-rose-gold-400 font-medium tracking-wider uppercase">Rendez-vous</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6 leading-tight">
                            Réservez votre moment de <span className="text-rose-gold-400 italic">détente</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Choisissez le créneau qui vous convient le mieux. Une question ? N'hésitez pas à nous appeler directement au <span className="text-white font-medium">01 23 45 67 89</span>.
                        </p>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-rose-gold-400" />
                                <span>Consultation personnalisée incluse</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-rose-gold-400" />
                                <span>Utilisation de produits premium</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-rose-gold-400" />
                                <span>Annulation gratuite jusqu'à 24h avant</span>
                            </li>
                        </ul>
                    </div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="bg-white text-charcoal p-8 md:p-10 rounded-2xl shadow-2xl"
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <User className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Votre Nom"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="Téléphone"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <Mail className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative">
                                <select
                                    name="service"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors appearance-none text-gray-600"
                                    onChange={handleChange}
                                >
                                    <option value="">Choisir un service...</option>
                                    <option value="coupe-femme">Coupe Femme</option>
                                    <option value="coupe-homme">Coupe Homme</option>
                                    <option value="coloration">Coloration / Balayage</option>
                                    <option value="soin">Soin Profond</option>
                                    <option value="coiffure">Coiffure Événementielle</option>
                                </select>
                                <div className="absolute top-4 right-4 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <Calendar className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <Clock className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <MessageSquare className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="comments"
                                    rows={3}
                                    placeholder="Commentaires ou demandes spéciales (optionnel)"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-gold-400 focus:ring-1 focus:ring-rose-gold-400 transition-colors resize-none"
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-rose-gold-600 text-white font-bold py-4 rounded-lg hover:bg-rose-gold-700 transition-all transform hover:-translate-y-1 shadow-lg"
                            >
                                Confirmer le rendez-vous
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
