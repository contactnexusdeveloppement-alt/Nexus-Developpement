import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-black-rich text-white-creamy pt-20 pb-10 border-t border-gold/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Brand & Description */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-serif font-bold">
                            <span className="text-white">ENTRE </span>
                            <span className="text-gold">TERRE</span>
                            <span className="text-white"> ET </span>
                            <span className="text-gold">MER</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            Votre agence immobilière de prestige à Gérardmer.
                            Entre lac et montagnes, nous vous accompagnons dans la réalisation de vos projets de vie.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-black-rich transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-black-rich transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-black-rich transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-serif text-gold">Nous Contacter</h4>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gold mt-1" />
                                <p>2 Boulevard du Lac<br />88400 Gérardmer, France</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gold" />
                                <p>+33 (0)3 29 00 00 00</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gold" />
                                <p>contact@entre-terre-et-mer.fr</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-serif text-gold">Navigation</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><Link to="/agence-immo/properties" className="hover:text-gold transition-colors">Nos Biens à la Vente</Link></li>
                            <li><Link to="/agence-immo/properties?type=rent" className="hover:text-gold transition-colors">Nos Locations</Link></li>
                            <li><a href="#" className="hover:text-gold transition-colors">Estimer mon Bien</a></li>
                            <li><Link to="/agence-immo" className="hover:text-gold transition-colors">L'Agence</Link></li>
                            <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
                    <p>&copy; 2025 Entre Terre et Mer. Tous droits réservés.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gold transition-colors">Mentions Légales</a>
                        <a href="#" className="hover:text-gold transition-colors">Politique de Confidentialité</a>
                        <a href="#" className="hover:text-gold transition-colors">Honoraires</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
