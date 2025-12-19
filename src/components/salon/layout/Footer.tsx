import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-charcoal text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-6">Élégance<span className="text-rose-gold-400">.</span></h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Votre destination beauté pour des coupes modernes et des soins d'exception. Révélez le meilleur de vous-même.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-gold-600 transition-colors duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-gold-600 transition-colors duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold mb-6">Liens Rapides</h4>
                        <ul className="space-y-3">
                            <li><a href="#services" className="text-gray-400 hover:text-rose-gold-400 transition-colors">Nos Services</a></li>
                            <li><a href="#portfolio" className="text-gray-400 hover:text-rose-gold-400 transition-colors">Réalisations</a></li>
                            <li><a href="#pricing" className="text-gray-400 hover:text-rose-gold-400 transition-colors">Tarifs</a></li>
                            <li><a href="#booking" className="text-gray-400 hover:text-rose-gold-400 transition-colors">Prendre RDV</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-rose-gold-400 shrink-0 mt-1" />
                                <span>12 Rue de la Mode,<br />75001 Paris, France</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 text-rose-gold-400 shrink-0" />
                                <span>01 23 45 67 89</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 text-rose-gold-400 shrink-0" />
                                <span>contact@elegance-coiffure.fr</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="text-lg font-serif font-semibold mb-6">Horaires</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex justify-between">
                                <span>Lundi</span>
                                <span>Fermé</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Mardi - Vendredi</span>
                                <span>9h00 - 19h00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Samedi</span>
                                <span>9h00 - 18h00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Dimanche</span>
                                <span>Fermé</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Élégance Coiffure. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
