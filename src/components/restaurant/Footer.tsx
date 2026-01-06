import { Facebook, Instagram, Twitter } from 'lucide-react';
import styles from '../../styles/restaurant/Footer.module.css';
import mapImg from '../../assets/restaurant/images/map.webp';

export default function Footer() {
    return (
        <footer id="contact" className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.column}>
                        <div className={styles.logo}>THE HUDSON LOFT</div>
                        <p className={styles.address}>
                            123 Broadway,<br />
                            New York, NY 10012
                        </p>
                        <div className={styles.contactInfo}>
                            <p>+33 1 23 45 67 89</p>
                            <p>info@hudsonloft.com</p>
                        </div>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialLink}><Facebook size={18} /></a>
                            <a href="#" className={styles.socialLink}><Instagram size={18} /></a>
                            <a href="#" className={styles.socialLink}><Twitter size={18} /></a>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3>Horaires</h3>
                        <p>Lun - Jeu : 17h - 23h</p>
                        <p>Ven - Sam : 17h - 01h</p>
                        <p>Dimanche : 16h - 22h</p>
                        <p>Happy Hour : 17h - 19h</p>
                    </div>

                    <div className={styles.column}>
                        <h3>Localisation</h3>
                        <div className={styles.map}>
                            <img src={mapImg} alt="Plan accès 123 Broadway" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; 2024 The Hudson Loft. Site Concept.</p>
                </div>
            </div>
        </footer>
    );
}
