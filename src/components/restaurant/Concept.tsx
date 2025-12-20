import { motion } from 'framer-motion';
import styles from '../../styles/restaurant/Concept.module.css';

export default function Concept() {
    return (
        <section id="concept" className={styles.concept}>
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className={styles.subtitle}>Notre Histoire</span>
                    <h2 className={styles.title}>L'Âme Industrielle, L'Esprit New Yorkais</h2>
                    <div className={styles.divider}></div>
                    <p className={styles.text}>
                        Au cœur de la ville, The Hudson Loft vous apporte l'énergie brute et authentique de Brooklyn directement dans votre assiette.
                        Nous croyons en une cuisine honnête, cuisinée avec feu et passion.
                    </p>
                    <p className={styles.text}>
                        Nos murs sont de briques, nos lumières tamisées et nos viandes exceptionnelles.
                        Que vous soyez ici pour une entrecôte maturée 45 jours ou notre smash burger signature,
                        vous goûtez à une part de la tradition new-yorkaise.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
