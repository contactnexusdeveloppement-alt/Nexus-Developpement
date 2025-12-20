import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from '../../styles/restaurant/Navbar.module.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Concept', href: '#concept' },
        { name: 'Signature', href: '#signature' },
        { name: 'Menu', href: '#menu' },
        { name: 'Galerie', href: '#gallery' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    THE HUDSON LOFT
                </div>

                <div className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className={styles.navLink}>
                            {link.name}
                        </a>
                    ))}
                    <a href="#reservation" className={styles.reserveBtn}>
                        Réserver
                    </a>
                </div>

                <div className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={styles.mobileLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#reservation"
                        className={styles.mobileReserveBtn}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Book a Table
                    </a>
                </div>
            )}
        </nav>
    );
}
