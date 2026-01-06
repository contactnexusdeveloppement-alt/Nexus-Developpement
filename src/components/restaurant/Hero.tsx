import { motion } from 'framer-motion';
import styles from '../../styles/restaurant/Hero.module.css';
import heroImage from '../../assets/restaurant/images/hero.webp';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div
                className={styles.backgroundImage}
                style={{ backgroundImage: `url(${heroImage})` }}
            ></div>

            <div className={styles.content}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={styles.subheading}>New York • Authentique • Steakhouse</h2>
                    <h1 className={styles.heading}>The Hudson Loft</h1>
                    <p className={styles.tagline}>
                        L'âme industrielle de Brooklyn rencontre l'excellence des viandes d'exception.
                    </p>

                    <div className={styles.buttons}>
                        <a href="#reservation" className="btn-primary">Réserver</a>
                        <a href="#menu" className="btn-outline">Voir le Menu</a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
