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

const SalonCoiffure = () => {
    return (
        <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans antialiased">
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
