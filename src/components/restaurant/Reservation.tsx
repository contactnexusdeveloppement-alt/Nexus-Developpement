import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/restaurant/Reservation.module.css';

export default function Reservation() {
    const [formState, setFormState] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: '2'
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulation of API call
        setTimeout(() => {
            setSubmitted(false);
            setFormState({ name: '', phone: '', email: '', date: '', time: '', guests: '2' });
            alert('Reservation confirmed! (Simulation)');
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <section id="reservation" className={styles.reservation}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <motion.div
                        className={styles.info}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.title}>Réserver une Table</h2>
                        <p className={styles.desc}>
                            Vivez le meilleur de la cuisine new-yorkaise. Réservation recommandée pour le dîner.
                            Pour les groupes de plus de 8 personnes, merci de nous contacter directement.
                        </p>
                        <div className={styles.contactDetails}>
                            <p>+33 1 23 45 67 89</p>
                            <p>reservations@hudsonloft.com</p>
                        </div>
                    </motion.div>

                    <motion.form
                        className={styles.form}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {submitted ? (
                            <div className={styles.success}>
                                <h3>Merci !</h3>
                                <p>Votre demande a été reçue.</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.row}>
                                    <input
                                        type="text" name="name" placeholder="Nom" required
                                        value={formState.name} onChange={handleChange}
                                    />
                                    <input
                                        type="tel" name="phone" placeholder="Téléphone" required
                                        value={formState.phone} onChange={handleChange}
                                    />
                                </div>
                                <input
                                    type="email" name="email" placeholder="Email" required
                                    value={formState.email} onChange={handleChange}
                                />
                                <div className={styles.row}>
                                    <input
                                        type="date" name="date" required
                                        value={formState.date} onChange={handleChange}
                                    />
                                    <input
                                        type="time" name="time" required
                                        value={formState.time} onChange={handleChange}
                                    />
                                </div>
                                <select name="guests" value={formState.guests} onChange={handleChange}>
                                    <option value="1">1 Personne</option>
                                    <option value="2">2 Personnes</option>
                                    <option value="3">3 Personnes</option>
                                    <option value="4">4 Personnes</option>
                                    <option value="5">5 Personnes</option>
                                    <option value="6+">6+ Personnes</option>
                                </select>
                                <button type="submit" className="btn-primary">Confirmer la Réservation</button>
                            </>
                        )}
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
