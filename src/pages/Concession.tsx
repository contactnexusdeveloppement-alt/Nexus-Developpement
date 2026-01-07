import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/concession/style.css';
import { Helmet } from 'react-helmet-async';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock Data for Cars
const cars = [
    {
        id: 1,
        make: 'Peugeot',
        model: '3008 GT Line',
        year: 2021,
        km: '45,000 km',
        price: '24,900 €',
        type: 'SUV',
        image: '/concession/car-peugeot-3008.webp'
    },
    {
        id: 2,
        make: 'Volkswagen',
        model: 'Golf 8',
        year: 2022,
        km: '28,000 km',
        price: '21,500 €',
        type: 'Berline',
        image: '/concession/car-vw-golf-8.webp'
    },
    {
        id: 3,
        make: 'Renault',
        model: 'Clio IV',
        year: 2020,
        km: '55,000 km',
        price: '14,200 €',
        type: 'Citadine',
        image: '/concession/car-renault-clio-4.webp'
    },
    {
        id: 4,
        make: 'Mercedes',
        model: 'Classe A',
        year: 2021,
        km: '32,000 km',
        price: '29,500 €',
        type: 'Berline',
        image: '/concession/car-mercedes-a.webp'
    },
    {
        id: 5,
        make: 'Audi',
        model: 'Q5 S-Line',
        year: 2019,
        km: '68,000 km',
        price: '36,900 €',
        type: 'SUV',
        image: '/concession/car-audi-q5.webp'
    },
    {
        id: 6,
        make: 'BMW',
        model: 'M3 Competition',
        year: 2022,
        km: '15,000 km',
        price: '89,900 €',
        type: 'Berline',
        image: '/concession/bmw-m3-competition.webp'
    },
    {
        id: 7,
        make: 'Porsche',
        model: '911 Carrera S',
        year: 2021,
        km: '12,000 km',
        price: '145,000 €',
        type: 'Coupé',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000'
    },
    {
        id: 8,
        make: 'Tesla',
        model: 'Model 3 Performance',
        year: 2023,
        km: '5,000 km',
        price: '54,900 €',
        type: 'Berline',
        image: '/concession/tesla-model-3.webp'
    },
    {
        id: 9,
        make: 'Jeep',
        model: 'Wrangler Rubicon',
        year: 2020,
        km: '35,000 km',
        price: '42,500 €',
        type: 'SUV',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000'
    },
    {
        id: 10,
        make: 'Ford',
        model: 'Mustang GT',
        year: 2019,
        km: '48,000 km',
        price: '46,900 €',
        type: 'Coupé',
        image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2000'
    },
    {
        id: 12,
        make: 'Mercedes',
        model: 'Classe E Coupe',
        year: 2022,
        km: '18,000 km',
        price: '59,900 €',
        type: 'Coupé',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2000'
    },
    {
        id: 14,
        make: 'Toyota',
        model: 'RAV4 Hybrid',
        year: 2022,
        km: '15,000 km',
        price: '38,900 €',
        type: 'SUV',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2000'
    }
];

const Concession = () => {
    const [filter, setFilter] = useState('all');

    // Embla Carousel setup
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps'
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const filteredCars = filter === 'all'
        ? cars
        : cars.filter(car => car.type === filter);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit();
        }
    }, [filter, emblaApi]);

    return (
        <div className="concession-page">
            <Helmet>
                <title>HÉRITAGE AUTO | Garage Familial Sport & Prestige</title>
                <meta name="description" content="L'excellence automobile nouvelle génération. Sport, Prestige & Youngtimers. Entretien, Vente et Sourcing personnalisé." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet" />
            </Helmet>

            <header className="header">
                <div className="container header-content">
                    <a href="#" className="logo">HÉRITAGE<span className="highlight"> AUTO</span></a>
                    <nav className="nav">
                        <a href="#inventory">STOCK</a>
                        <a href="#services">ATELIER</a>
                        <a href="#about">L'ÉQUIPE</a>
                    </nav>
                    <div className="header-actions">
                        <a href="#contact" className="btn btn-primary contact-btn-header">CONTACT</a>
                    </div>
                </div>
            </header>

            <main>
                <section className="hero">
                    <video autoPlay muted loop playsInline className="hero-video">
                        <source src="/concession/background-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="overlay"></div>

                    <div className="container hero-content">
                        <h1>DRIVEN BY <span className="text-gradient">PASSION</span></h1>
                        <p>L'excellence automobile nouvelle génération. Sport, Prestige & Youngtimers.</p>
                        <div className="hero-actions">
                            <a href="#inventory" className="btn btn-primary">DÉCOUVRIR LE STOCK</a>
                            <a href="#contact" className="btn btn-outline">NOUS TROUVER</a>
                        </div>
                    </div>
                </section>

                <section id="inventory" className="section inventory">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">ARRIVAGES <span className="highlight">RÉCENTS</span></h2>
                            <p className="section-subtitle">Performances certifiées et historique limpide.</p>
                        </div>

                        <div className="inventory-controls">
                            <div className="filters">
                                {['all', 'Coupé', 'SUV', 'Berline', 'Citadine'].map(type => (
                                    <button
                                        key={type}
                                        className={`filter-btn ${filter === type ? 'active' : ''}`}
                                        onClick={() => setFilter(type)}
                                    >
                                        {type === 'all' ? 'TOUT' : type === 'Coupé' ? 'SPORT' : type === 'Berline' ? 'PREMIUM' : type === 'Citadine' ? 'VILLAGE' : type}
                                    </button>
                                ))}
                            </div>
                            <div className="slider-nav">
                                <button
                                    className="nav-prev"
                                    onClick={scrollPrev}
                                    aria-label="Précédent"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    className="nav-next"
                                    onClick={scrollNext}
                                    aria-label="Suivant"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Embla Carousel Viewport */}
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex -ml-8 touch-pan-y">
                                {/* -ml-8 depends on your gap strategy. In CSS .cars-grid had gap: 2rem (32px). 
                                    With Embla, we use padding-left on slides for gap. */}
                                {filteredCars.map(car => (
                                    <div key={car.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-8 min-w-0">
                                        <article className="car-card h-full">
                                            <img src={car.image} alt={`${car.make} ${car.model}`} className="car-image" />
                                            <div className="car-info">
                                                <h3 className="car-title">{car.make} {car.model}</h3>
                                                <div className="car-specs">
                                                    <span>{car.year}</span> • <span>{car.km}</span> • <span>{car.type}</span>
                                                </div>
                                                <div className="car-price">{car.price}</div>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services" className="section services">
                    <div className="container">
                        <h2 className="section-title">NOS SERVICES</h2>
                        <div className="services-grid">
                            <div className="service-row-main">
                                <div className="service-card">
                                    <h3>MÉCANIQUE DE PRÉCISION</h3>
                                    <p>Entretien constructeur et préparation moteur.</p>
                                </div>
                                <div className="service-image-container">
                                    <img src="/concession/service-mechanic-new.webp" alt="Mécanique" className="service-inline-image" />
                                </div>
                            </div>
                            <div className="service-row-main reverse">
                                <div className="service-card">
                                    <h3>DETAILING</h3>
                                    <p>Protection céramique et rénovation esthétique.</p>
                                </div>
                                <div className="service-image-container">
                                    <img src="/concession/service-detailing-new.webp" alt="Detailing" className="service-inline-image" />
                                </div>
                            </div>
                            <div className="service-row-main">
                                <div className="service-card">
                                    <h3>SOURCING</h3>
                                    <p>Recherche personnalisée de votre véhicule de rêve.</p>
                                </div>
                                <div className="service-image-container">
                                    <img src="/concession/service-sourcing.webp" alt="Sourcing de prestige" className="service-inline-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="section about">
                    {/* Cleaned up empty section which was in the original HTML */}
                </section>

                <section id="contact" className="contact">
                    <div className="contact-grid">
                        <div className="contact-box">
                            <h2 className="section-title">VENEZ NOUS <span className="highlight">VOIR</span></h2>
                            <div className="contact-info">
                                <p className="big-text">123 Avenue de la République</p>
                                <p>PARIS, 75000</p>
                                <div className="contact-extra">
                                    <p>Ouvert du Lundi au Samedi</p>
                                    <p>9h00 - 19h00 non-stop</p>
                                </div>
                                <a href="tel:0123456789" className="phone-link">01 23 45 67 89</a>
                            </div>
                        </div>
                        <div className="contact-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615674389!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1625060000000!5m2!1sfr!2sfr"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <p>&copy; 2025 HÉRITAGE AUTO. Tous droits réservés.</p>
                        <div className="socials">
                            <a href="#">INSTAGRAM</a>
                            <a href="#">TIKTOK</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Concession;
