import { motion } from 'framer-motion';
import styles from '../../styles/restaurant/Gallery.module.css';
import burgerImg from '../../assets/restaurant/images/burger.webp';
import steakImg from '../../assets/restaurant/images/steak.webp';
import ribsImg from '../../assets/restaurant/images/ribs.webp';
import barImg from '../../assets/restaurant/images/bar.webp';
import kitchenImg from '../../assets/restaurant/images/kitchen.webp';
import heroImg from '../../assets/restaurant/images/hero.webp';

const images = [
    { src: steakImg, alt: 'Steak Premium' },
    { src: barImg, alt: 'Ambiance Bar' },
    { src: burgerImg, alt: 'Burger Gourmet' },
    { src: kitchenImg, alt: 'Cuisine Ouverte' },
    { src: ribsImg, alt: 'Ribs BBQ' },
    { src: heroImg, alt: 'Salle Principale' }
];

export default function Gallery() {
    return (
        <section id="gallery" className={styles.gallery}>
            <div className={styles.container}>
                <h2 className="section-title">Galerie</h2>
                <div className={styles.grid}>
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className={styles.item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img src={img.src} alt={img.alt} className={styles.image} />
                            <div className={styles.overlay}>
                                <span className={styles.caption}>{img.alt}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
