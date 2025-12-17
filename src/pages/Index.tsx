import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Methodology from "@/components/Methodology";
import Pricing from "@/components/Pricing";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import { CallBooking } from "@/components/CallBooking";
import QuoteForm from "@/components/QuoteForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ChatBotWidget } from "@/components/chatbot/ChatBotWidget";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEO title="Nexus - Agence Digitale" description="La référence en développement web et automatisation." />

      {/* Skip Link for accessibility */}
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Aller au contenu principal
      </a>

      {/* Arrière-plan animé pour tout le site */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      {/* Contenu du site */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Services />
        <Testimonials />
        <Portfolio />
        <Methodology />
        <Pricing />
        <CallBooking />
        <QuoteForm />
        <Contact />
        <Footer />
      </div>

      {/* Chatbot Widget */}
      <ChatBotWidget />
    </div>
  );
};

export default Index;
