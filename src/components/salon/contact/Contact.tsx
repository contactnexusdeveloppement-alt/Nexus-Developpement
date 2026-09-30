import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-cream">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-rose-gold-600 font-medium tracking-wider uppercase">Nous trouver</span>
                    <h2 className="text-4xl font-serif font-bold text-charcoal mt-2">
                        Contact & <span className="italic">Accès</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-hidden rounded-3xl shadow-xl bg-white">
                    {/* Map showing Paris location */}
                    <div className="relative h-96 lg:h-auto min-h-[400px] bg-gray-200">
                        {/* Lien statique : une iframe Google Maps est bloquée par la CSP et déposerait des cookies tiers */}
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Paris"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center p-6 text-center text-charcoal underline hover:bg-gray-300 transition-colors"
                        >
                            Voir le plan d'accès sur Google Maps (nouvel onglet)
                        </a>
                    </div>

                    {/* Info */}
                    <div className="p-10 lg:p-16 flex flex-col justify-center">
                        <div className="space-y-8">
                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-rose-gold-100 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-rose-gold-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-serif font-bold text-charcoal mb-2">Adresse</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        12 Rue de la Mode<br />
                                        75001 Paris, France<br />
                                        <span className="text-sm text-gray-400 mt-1 block">Métro : Ligne 1 (Tuileries)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-rose-gold-100 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-rose-gold-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-serif font-bold text-charcoal mb-2">Téléphone</h4>
                                    <p className="text-gray-600">
                                        <a href="tel:0123456789" className="hover:text-rose-gold-600 transition-colors">01 23 45 67 89</a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-rose-gold-100 rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-rose-gold-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-serif font-bold text-charcoal mb-2">Email</h4>
                                    <p className="text-gray-600">
                                        <a href="mailto:contact@elegance-coiffure.fr" className="hover:text-rose-gold-600 transition-colors">contact@elegance-coiffure.fr</a>
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h4 className="text-lg font-serif font-bold text-charcoal mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-3 text-rose-gold-600" />
                                    Horaires d'ouverture
                                </h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex justify-between"><span>Lundi</span> <span className="text-gray-400">Fermé</span></li>
                                    <li className="flex justify-between"><span>Mardi - Vendredi</span> <span className="font-medium text-rose-gold-600">9h00 - 19h00</span></li>
                                    <li className="flex justify-between"><span>Samedi</span> <span className="font-medium text-rose-gold-600">9h00 - 18h00</span></li>
                                    <li className="flex justify-between"><span>Dimanche</span> <span className="text-gray-400">Fermé</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
