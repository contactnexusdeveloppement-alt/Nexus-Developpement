import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ApporteursFinalCTA = () => {
  return (
    <section
      className="py-24 md:py-32 px-4"
      style={{ backgroundColor: "var(--ned-bg-deep)" }}
      aria-labelledby="final-cta-title"
    >
      <div className="container mx-auto max-w-3xl text-center">
        <motion.h2
          id="final-cta-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6"
          style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.04em" }}
        >
          Vous connaissez 5 personnes
          <br />
          qui ont besoin d'un site&nbsp;?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl mb-10 leading-relaxed"
          style={{ color: "var(--ned-silver)" }}
        >
          Vous pouvez vous faire <strong style={{ color: "var(--ned-success)" }}>1&nbsp;500 à 3&nbsp;000&nbsp;€</strong>
          {" "}rien qu'avec ces 5 personnes. Le reste, c'est vous qui voyez.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-5"
        >
          <button
            type="button"
            onClick={() => {
              document
                .getElementById("postuler")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="ned-cta-glow group inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B1F]"
            style={{
              backgroundColor: "var(--ned-accent)",
              color: "#050B1F",
            }}
          >
            Postuler maintenant
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <p className="text-sm" style={{ color: "var(--ned-silver)" }}>
            Une question avant&nbsp;?{" "}
            <a
              href="mailto:contact.nexus.developpement@gmail.com"
              className="underline underline-offset-4 hover:no-underline"
              style={{ color: "var(--ned-accent)" }}
            >
              contact.nexus.developpement@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ApporteursFinalCTA;
