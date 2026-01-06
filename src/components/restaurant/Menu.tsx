import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/restaurant/Menu.module.css';
import burgerImg from '../../assets/restaurant/images/burger.webp';
import steakImg from '../../assets/restaurant/images/steak.webp';
import startersImg from '../../assets/restaurant/images/starters.webp';
import drinksImg from '../../assets/restaurant/images/drinks.webp';

const menuData = [
    {
        title: "Entrées",
        items: [
            { name: 'Planche à Partager', desc: 'Mozzarella sticks, onion rings, ailes de poulet épicées, sauces maison', price: '18€' },
            { name: 'Carpaccio de Bœuf', desc: 'Parmesan, huile de truffe, roquette, câpres', price: '16€' },
            { name: 'Os à Moelle Rôti', desc: 'Fleur de sel, pain grillé à l\'ail', price: '14€' }
        ],
        image: startersImg
    },
    {
        title: "Burgers",
        items: [
            { name: 'Le Classique', desc: 'Bœuf Angus, cheddar, laitue, tomate, pickles, sauce secrète', price: '18€' },
            { name: 'Bacon Royale', desc: 'Double steak, bacon au sirop d\'érable, gouda fumé, oignons frits', price: '22€' },
            { name: 'Truffle Mushroom', desc: 'Champignons sauvages sautés, emmental, mayonnaise à la truffe', price: '24€' }
        ],
        image: burgerImg
    },
    {
        title: "Viandes",
        items: [
            { name: 'Entrecôte (350g)', desc: 'Persillage riche, saveur intense, grillée au charbon', price: '32€' },
            { name: 'Filet Mignon (250g)', desc: 'La coupe la plus tendre, maigre et succulente', price: '38€' },
            { name: 'Côte de Bœuf Maturée', desc: 'Maturée 45 jours, le meilleur des deux mondes (Pour 2)', price: '75€' }
        ],
        image: steakImg
    },
    {
        title: "Accompagnements & Desserts",
        items: [
            { name: 'Frites Maison', desc: 'Sel de mer, romarin', price: '6€' },
            { name: 'Mac & Cheese à la Truffe', desc: 'Mélange 3 fromages, huile de truffe', price: '10€' },
            { name: 'Cheesecake New-Yorkais', desc: 'Recette classique, coulis de fruits rouges', price: '11€' },
            { name: 'Moelleux Chocolat', desc: 'Glace vanille, sauce chocolat chaud', price: '12€' }
        ],
        image: null
    },
    {
        title: "Boissons",
        items: [
            { name: 'Signature Old Fashioned', desc: 'Bourbon, bitter, zeste d\'orange fumé', price: '14€' },
            { name: 'Brooklyn Lager', desc: 'Pression 50cl', price: '9€' },
            { name: 'Sélection de Vins Rouges', desc: 'Côtes du Rhône, Bordeaux, Californie (Verre)', price: '10€' },
            { name: 'Craft Cocktails', desc: 'Demandez notre carte des créations', price: '15€' }
        ],
        image: drinksImg
    }
];

export default function Menu() {
    const [page, setPage] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const totalPages = Math.ceil(menuData.length / 2) * 2;

    const nextPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (page + 2 < totalPages) {
            setPage(page + 2);
        } else {
            // Move to logic "End Page" which is essentially page == totalPages
            setPage(totalPages);
        }
    };

    const prevPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (page === 0) {
            setIsOpen(false); // Close book to Cover
        } else {
            setPage(page - 2);
        }
    };

    const toggleBook = () => {
        if (!isOpen) setIsOpen(true);
    };

    return (
        <section id="menu" className={styles.menuSection}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className={styles.header}
                >
                    <h2 className="section-title">Notre Carte</h2>
                    <p className={styles.instruction}>
                        {!isOpen ? "Cliquez sur la couverture pour ouvrir le menu" : "Feuilletez notre sélection"}
                    </p>
                </motion.div>

                <div className={styles.perspectiveWrapper}>
                    <motion.div
                        className={`${styles.book} ${isOpen ? styles.bookOpen : styles.bookClosed}`}
                        animate={{
                            rotateX: 0,
                            rotateY: 0,
                        }}
                        onClick={!isOpen ? toggleBook : undefined}
                    >
                        {/* COVER */}
                        {!isOpen && (
                            <div className={styles.cover}>
                                <div className={styles.coverContent}>
                                    <div className={styles.logo}>THE HUDSON LOFT</div>
                                    <div className={styles.est}>EST. 2024</div>
                                    <div className={styles.sub}>MENU</div>
                                </div>
                                <div className={styles.clickHint}>
                                    Cliquer pour ouvrir
                                </div>
                            </div>
                        )}

                        {/* OPEN BOOK CONTENT */}
                        {isOpen && (
                            <>
                                {/* Left Page */}
                                <div className={`${styles.page} ${styles.leftPage}`}>
                                    <div className={styles.pageContent}>
                                        {page < totalPages ? (
                                            // Normal Content Left
                                            menuData[page] ? (
                                                <>
                                                    <h3 className={styles.categoryTitle}>{menuData[page].title}</h3>
                                                    <div className={styles.itemsList}>
                                                        {menuData[page].items.map((item, idx) => (
                                                            <div key={idx} className={styles.item}>
                                                                <div className={styles.itemHeader}>
                                                                    <span className={styles.name}>{item.name}</span>
                                                                    <span className={styles.price}>{item.price}</span>
                                                                </div>
                                                                <p className={styles.desc}>{item.desc}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {menuData[page].image && (
                                                        <div className={styles.pageImage} style={{ backgroundImage: `url(${menuData[page].image})` }}></div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className={styles.emptyPage}></div>
                                            )
                                        ) : (
                                            // End Page Left (Inside Back Cover)
                                            <div className={styles.endPage}>
                                                <h3>Merci de votre visite</h3>
                                                <p>The Hudson Loft</p>
                                                <div className={styles.logoSmall}>HL</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Number Only */}
                                    {page < totalPages && <div className={styles.pageNumber}>{page + 1}</div>}
                                </div>

                                {/* Right Page */}
                                <div className={`${styles.page} ${styles.rightPage}`}>
                                    <div className={styles.pageContent}>
                                        {page < totalPages ? (
                                            // Normal Content Right
                                            menuData[page + 1] ? (
                                                <>
                                                    <h3 className={styles.categoryTitle}>{menuData[page + 1].title}</h3>
                                                    <div className={styles.itemsList}>
                                                        {menuData[page + 1].items.map((item, idx) => (
                                                            <div key={idx} className={styles.item}>
                                                                <div className={styles.itemHeader}>
                                                                    <span className={styles.name}>{item.name}</span>
                                                                    <span className={styles.price}>{item.price}</span>
                                                                </div>
                                                                <p className={styles.desc}>{item.desc}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {menuData[page + 1].image && (
                                                        <div className={styles.pageImage} style={{ backgroundImage: `url(${menuData[page + 1].image})` }}></div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className={styles.emptyPage}>
                                                    <h3>Suite...</h3>
                                                </div>
                                            )
                                        ) : (
                                            // End Page Right (Back Cover content)
                                            <div className={styles.emptyPage}>
                                                <p>N'hésitez pas à demander nos suggestions au chef.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Number Only */}
                                    {page < totalPages && <div className={styles.pageNumber}>{page + 2}</div>}
                                </div>

                                <div className={styles.spine}></div>

                                {/* GLOBAL CONTROLS - Positioned relative to the BOOK, not the page */}
                                <button className={styles.prevBtn} onClick={prevPage}>
                                    {page === 0 ? "Fermer" : "Précédent"}
                                </button>

                                {page < totalPages && (
                                    <button className={styles.nextBtn} onClick={nextPage}>
                                        {page + 2 >= totalPages ? "Fin" : "Suivant"}
                                    </button>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
