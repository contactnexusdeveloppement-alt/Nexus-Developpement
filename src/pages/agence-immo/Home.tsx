import Header from '../../components/agence-immo/layout/Header';
import Footer from '../../components/agence-immo/layout/Footer';
import Hero from '../../components/agence-immo/home/Hero';
import FeaturedProperties from '../../components/agence-immo/home/FeaturedProperties';
import AboutSection from '../../components/agence-immo/home/AboutSection';
import ContactSection from '../../components/agence-immo/home/ContactSection';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                <Hero />

                <FeaturedProperties />

                {/* About Section */}
                <AboutSection />

                {/* Contact Section */}
                <ContactSection />
            </main>

            <Footer />
        </div>
    );
}
