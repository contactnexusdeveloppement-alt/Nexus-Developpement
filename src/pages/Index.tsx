import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";
// Sections en import statique : l'accueil est hydraté à partir du HTML
// pré-rendu, et une frontière Suspense absente de ce HTML ferait échouer
// l'hydratation (React re-rendrait tout côté client, LCP retardé).
import Testimonials from "@/components/Testimonials";
import Portfolio from "@/components/Portfolio";
import Methodology from "@/components/Methodology";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";

// Les deux formulaires restent en lazy (calendrier, Select Radix : ~100 kB) et
// sont montés côté client après l'hydratation, derrière un placeholder qui
// existe aussi dans le HTML pré-rendu.
const CallBooking = lazy(() => import("@/components/CallBooking").then(m => ({ default: m.CallBooking })));
const QuoteForm = lazy(() => import("@/components/QuoteForm"));

const FormPlaceholder = ({ id, minHeight }: { id: string; minHeight: string }) => (
  <section id={id} className={`${minHeight} scroll-mt-32`} aria-busy="true" aria-label="Chargement du formulaire" />
);

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEO
        title="Nexus Développement — Agence Digitale Élancourt (78) | Sites Web, Apps, Automatisation"
        description="Agence digitale à Élancourt (78) : sites web, e-commerce, applications mobiles, automatisation et identité visuelle pour TPE et PME. Devis gratuit sous 24 h."
        canonical="/"
      />

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

        <ClientOnly fallback={<FormPlaceholder id="reservation" minHeight="min-h-[640px]" />}>
          <Suspense fallback={<FormPlaceholder id="reservation" minHeight="min-h-[640px]" />}>
            <CallBooking />
          </Suspense>
        </ClientOnly>
        <ClientOnly fallback={<FormPlaceholder id="devis" minHeight="min-h-[900px]" />}>
          <Suspense fallback={<FormPlaceholder id="devis" minHeight="min-h-[900px]" />}>
            <QuoteForm />
          </Suspense>
        </ClientOnly>

        <Contact />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
