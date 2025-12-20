import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import FeaturedProperties from '../components/home/FeaturedProperties';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';

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
