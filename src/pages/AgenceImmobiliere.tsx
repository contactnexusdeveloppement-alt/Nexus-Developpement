import Hero from '@/components/agence-immo/home/Hero';
import AboutSection from '@/components/agence-immo/home/AboutSection';
import FeaturedProperties from '@/components/agence-immo/home/FeaturedProperties';
import ContactSection from '@/components/agence-immo/home/ContactSection';
import Header from '@/components/agence-immo/layout/Header';
import Footer from '@/components/agence-immo/layout/Footer';
import ScrollToTop from '@/components/agence-immo/layout/ScrollToTop';

const AgenceImmobiliere = () => {
    return (
        <div className="min-h-screen bg-white">
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
