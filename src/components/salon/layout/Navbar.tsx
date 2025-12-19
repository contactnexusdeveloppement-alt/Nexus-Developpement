import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'Réalisations', href: '#portfolio' },
        { name: 'Tarifs', href: '#pricing' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <a href="#" className="flex items-center space-x-2 text-2xl font-serif font-bold text-charcoal">
                        <Scissors className="w-6 h-6 text-rose-gold-600 transform -rotate-45" />
                        <span>Élégance<span className="text-rose-gold-600">.</span></span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-charcoal hover:text-rose-gold-600 transition-colors duration-300 font-medium text-sm tracking-wide uppercase"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#booking"
                            className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-rose-gold-600 transition-colors duration-300 text-sm tracking-wide uppercase"
                        >
                            Prendre RDV
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-charcoal focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-charcoal text-lg font-medium hover:text-rose-gold-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#booking"
                            className="bg-rose-gold-600 text-white text-center px-6 py-3 rounded-full font-medium hover:bg-rose-gold-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Prendre Rendez-vous
                        </a>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
