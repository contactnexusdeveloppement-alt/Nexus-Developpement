import Hero from '@/components/agence-immo/home/Hero';
import AboutSection from '@/components/agence-immo/home/AboutSection';
import FeaturedProperties from '@/components/agence-immo/home/FeaturedProperties';
import ContactSection from '@/components/agence-immo/home/ContactSection';
import Header from '@/components/agence-immo/layout/Header';
import Footer from '@/components/agence-immo/layout/Footer';
import ScrollToTop from '@/components/agence-immo/layout/ScrollToTop';
import SEO from '@/components/SEO';
import { breadcrumbSchema, serviceSchema } from '@/lib/schemas';

const AgenceImmobiliere = () => {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Démo : Site Web pour Agence Immobilière | Nexus Développement"
                description="Découvrez une démo de site web professionnel pour agence immobilière : catalogue de biens, fiches détaillées, recherche avancée, formulaires de contact. Création sur-mesure par Nexus Développement Élancourt."
                type="website"
                canonical="/agence-immobiliere"
                schemas={[
                    serviceSchema({
                        name: "Création de site web pour agence immobilière",
                        description: "Site vitrine sur-mesure pour agence immobilière : catalogue de biens avec filtres, fiches propriétés, formulaires d'estimation, intégration de cartes. Design moderne, responsive, optimisé SEO local.",
                        url: "/agence-immobiliere",
                        serviceType: "Web Development for Real Estate",
                        areaServed: ["Yvelines", "Île-de-France", "France"],
                    }),
                    breadcrumbSchema([
                        { name: "Accueil", url: "/" },
                        { name: "Démos clients", url: "/catalogue" },
                        { name: "Agence immobilière", url: "/agence-immobiliere" },
                    ]),
                ]}
            />
            <ScrollToTop />
            <Header />
            <main>
                <Hero />
                <FeaturedProperties />
                <AboutSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

export default AgenceImmobiliere;
