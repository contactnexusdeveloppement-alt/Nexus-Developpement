import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import AnimatedBackground from "@/components/AnimatedBackground";
import ApporteursHero from "@/components/apporteurs/ApporteursHero";
import ApporteursWhatIs from "@/components/apporteurs/ApporteursWhatIs";
import ApporteursSimulator from "@/components/apporteurs/ApporteursSimulator";
import ApporteursWhyUs from "@/components/apporteurs/ApporteursWhyUs";
import ApporteursProcess from "@/components/apporteurs/ApporteursProcess";
import ApporteursTargets from "@/components/apporteurs/ApporteursTargets";
import ApporteursFAQ from "@/components/apporteurs/ApporteursFAQ";
import ApporteursForm from "@/components/apporteurs/ApporteursForm";
import ApporteursFinalCTA from "@/components/apporteurs/ApporteursFinalCTA";

// Pas de JobPosting : ce balisage faisait apparaître la page dans Google for
// Jobs et les agrégateurs d'offres d'emploi, d'où des candidatures d'alternance
// et de stage. Le programme est une collaboration indépendante à la commission.
const programSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Programme d'apporteurs d'affaires indépendants — Nexus Développement",
  description:
    "Programme d'apport d'affaires pour indépendants : 20 % du montant HT encaissé sur chaque projet signé. Ni emploi, ni stage, ni alternance.",
  url: "https://nexusdeveloppement.fr/apporteurs",
  publisher: { "@type": "Organization", name: "Nexus Développement", url: "https://nexusdeveloppement.fr" },
};

const Apporteurs = () => {
  /**
   * On pose la classe `.theme-apporteurs` sur <html> uniquement le temps
   * où la page est montée. Ça scope tous les tokens Ned (--ned-*) et le
   * `prefers-reduced-motion` override sans impacter le reste du site.
   * On la pose sur <html> (pas <body>) parce que le `body::after` du noise
   * est en mix-blend-mode et qu'un changement de fond sur body créait un flash.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-apporteurs");
    return () => {
      root.classList.remove("theme-apporteurs");
    };
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "var(--ned-bg-deep)" }}>
      <SEO
        title="Apporteur d'affaires indépendant — 20 % de commission | Nexus Développement"
        description="Recommandez Nexus Développement à votre réseau et touchez 20 % du montant HT encaissé sur chaque projet. Programme indépendant à la commission (ni emploi, ni stage, ni alternance), paiement sous 30 jours, contrat clair."
        canonical="/apporteurs"
        image="/og-image.png"
        schemas={[programSchema]}
      />

      {/* Skip link */}
      <a
        href="#postuler"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2"
        style={{ backgroundColor: "var(--ned-accent)", color: "#050B1F" }}
      >
        Aller au formulaire d'inscription
      </a>

      {/* Fond animé canvas (particules + lignes) — même composant que sur le reste du site.
          Visible dans le hero (qui n'a pas de bg explicite) ; les sections suivantes ont
          un backgroundColor solide qui le masque, donc pas de conflit visuel. */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <AnimatedBackground />
      </div>

      <div className="relative z-10">
        <Navigation />
        <main>
          <ApporteursHero />
          <ApporteursWhatIs />
          <ApporteursSimulator />
          <ApporteursWhyUs />
          <ApporteursProcess />
          <ApporteursTargets />
          <ApporteursFAQ />
          <ApporteursForm />
          <ApporteursFinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Apporteurs;
