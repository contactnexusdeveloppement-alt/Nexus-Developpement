import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

/**
 * Le fond animé (canvas particules) est posé au niveau page dans `Apporteurs.tsx`,
 * comme partout ailleurs sur le site (cf. Index, WebsiteCreation, etc.). On laisse
 * juste un dégradé radial subtil par-dessus pour donner du relief au hero.
 */
const ApporteursHero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
      aria-labelledby="apporteurs-hero-title"
    >
      {/* Halos radiaux subtils par-dessus le canvas de particules */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(74,158,255,0.12) 0%, rgba(74,158,255,0.04) 35%, transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(45,212,191,0.06) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-6"
          style={{ color: "var(--ned-accent)" }}
        >
          Recrutement — Apporteurs d'affaires
        </motion.p>

        <motion.h1
          id="apporteurs-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-8"
          style={{
            color: "var(--ned-silver-light)",
            letterSpacing: "-0.04em",
          }}
        >
          Recommandez.
          <br />
          On code.
          <br />
          <span style={{ color: "var(--ned-accent)" }}>Vous touchez.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
          style={{ color: "var(--ned-silver)" }}
        >
          Vous connaissez quelqu'un qui a besoin d'un site internet, d'une app ou d'une refonte ?
          Présentez-le-nous. Si on signe, vous touchez{" "}
          <strong style={{ color: "var(--ned-silver-light)" }}>20&nbsp;% du montant</strong> de la
          prestation. Pas de quota, pas d'engagement, pas de blabla.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <button
            type="button"
            onClick={() => scrollTo("postuler")}
            className="ned-cta-glow group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B1F]"
            style={{
              backgroundColor: "var(--ned-accent)",
              color: "#050B1F",
            }}
          >
            Devenir apporteur en 2 minutes
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => scrollTo("comment-ca-marche")}
            className="group inline-flex items-center gap-2 px-6 py-4 rounded-full font-medium text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B1F]"
            style={{ color: "var(--ned-silver-light)" }}
          >
            Comment ça marche ?
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs md:text-sm font-medium px-5 py-2.5 rounded-full border"
          style={{
            backgroundColor: "rgba(15, 30, 54, 0.6)",
            borderColor: "var(--ned-border)",
            color: "var(--ned-silver)",
          }}
        >
          <span>Programme officiel Ned</span>
          <span style={{ color: "var(--ned-accent)" }} aria-hidden="true">
            ·
          </span>
          <span>20&nbsp;% de commission</span>
          <span style={{ color: "var(--ned-accent)" }} aria-hidden="true">
            ·
          </span>
          <span>Paiement sous 30 jours</span>
        </motion.div>
      </div>
    </section>
  );
};

export default ApporteursHero;
