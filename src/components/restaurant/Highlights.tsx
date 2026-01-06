import { motion } from 'framer-motion';
import styles from '../../styles/restaurant/Highlights.module.css';
import burgerImg from '../../assets/restaurant/images/burger.webp';
import ribsImg from '../../assets/restaurant/images/ribs.webp';
import steakImg from '../../assets/restaurant/images/steak.webp';

const dishes = [
    {
        id: 1,
        name: 'The Hudson Burger',
        desc: 'Double steak, cheddar affiné, bacon au sirop d\'érable, oignons caramélisés, sauce maison sur pain brioché.',
        price: '24€',
        image: burgerImg
    },
    {
        id: 2,
        name: 'T-Bone Steak',
        desc: 'T-Bone maturé 20oz, grillé à la perfection au charbon de bois. Servi avec beurre maître d\'hôtel.',
        price: '58€',
        image: steakImg
    },
    {
        id: 3,
        name: 'Travers de Porc BBQ',
        desc: 'Cuit lentement pendant 12 heures, laqué avec notre sauce secrète BBQ au bourbon fumé.',
        price: '32€',
        image: ribsImg
    }
];

export default function Highlights() {
    return (
        <section id="signature" className={styles.highlights}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.header}
                >
                    <h2 className="section-title">Nos Signatures</h2>
                </motion.div>

                <div className={styles.grid}>
                    {dishes.map((dish, i) => (
                        <motion.div
                            key={dish.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <div className={styles.imageWrapper}>
                                <img src={dish.image} alt={dish.name} className={styles.image} />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.topRow}>
                                    <h3 className={styles.dishName}>{dish.name}</h3>
                                    <span className={styles.price}>{dish.price}</span>
                                </div>
                                <p className={styles.dishDesc}>{dish.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
