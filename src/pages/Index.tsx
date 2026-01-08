import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

// Lazy load below-the-fold components for faster initial load
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Portfolio = lazy(() => import("@/components/Portfolio"));
const Methodology = lazy(() => import("@/components/Methodology"));
const Pricing = lazy(() => import("@/components/Pricing"));
const CallBooking = lazy(() => import("@/components/CallBooking").then(m => ({ default: m.CallBooking })));
const QuoteForm = lazy(() => import("@/components/QuoteForm"));
const Contact = lazy(() => import("@/components/Contact"));
const FAQ = lazy(() => import("@/components/FAQ"));
const ChatBotWidget = lazy(() => import("@/components/chatbot/ChatBotWidget").then(m => ({ default: m.ChatBotWidget })));

// Minimal loading fallback (invisible, no layout shift)
const SectionLoader = () => <div className="min-h-[200px]" />;

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

        {/* Lazy-loaded sections */}
        <Suspense fallback={<SectionLoader />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Portfolio />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Methodology />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Pricing />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CallBooking />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <QuoteForm />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <FAQ />
        </Suspense>
        <Footer />
      </div>

      {/* Chatbot Widget */}
      <Suspense fallback={null}>
        <ChatBotWidget />
      </Suspense>
    </div>
  );
};

export default Index;
