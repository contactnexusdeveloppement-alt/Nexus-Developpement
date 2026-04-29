import Navbar from "@/components/salon/layout/Navbar";
import Footer from "@/components/salon/layout/Footer";
import Hero from "@/components/salon/home/Hero";
import About from "@/components/salon/home/About";
import ServicesPreview from "@/components/salon/home/ServicesPreview";
import Portfolio from "@/components/salon/portfolio/Portfolio";
import Pricing from "@/components/salon/pricing/Pricing";
import Team from "@/components/salon/team/Team";
import Testimonials from "@/components/salon/testimonials/Testimonials";
import BookingForm from "@/components/salon/booking/BookingForm";
import Contact from "@/components/salon/contact/Contact";
import SEO from "@/components/SEO";
import { breadcrumbSchema, serviceSchema } from "@/lib/schemas";

const SalonCoiffure = () => {
    return (
        <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans antialiased">
            <SEO
                title="Démo : Site Web pour Salon de Coiffure | Nexus Développement"
                description="Découvrez une démo de site web professionnel pour salon de coiffure : prise de rendez-vous en ligne, portfolio, équipe, prestations. Création sur-mesure par Nexus Développement Élancourt."
                type="website"
                canonical="/salon-coiffure"
                schemas={[
                    serviceSchema({
                        name: "Création de site web pour salon de coiffure",
                        description: "Site vitrine sur-mesure pour salon de coiffure : prise de rendez-vous, gestion équipe, portfolio coupes, tarifs détaillés, avis clients. Design moderne, responsive, SEO local optimisé.",
                        url: "/salon-coiffure",
                        serviceType: "Web Development for Hair Salons",
                        areaServed: ["Yvelines", "Île-de-France", "France"],
                    }),
                    breadcrumbSchema([
                        { name: "Accueil", url: "/" },
                        { name: "Démos clients", url: "/catalogue" },
                        { name: "Salon de coiffure", url: "/salon-coiffure" },
                    ]),
                ]}
            />
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <About />
                <ServicesPreview />
                <Portfolio />
                <Team />
                <Pricing />
                <Testimonials />
                <BookingForm />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default SalonCoiffure;
