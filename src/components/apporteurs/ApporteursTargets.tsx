import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Smartphone, Handshake } from "lucide-react";

const targets = [
  {
    icon: GraduationCap,
    title: "Étudiants",
    description: "École de commerce, BTS, prépa — un complément de revenu sans timing imposé.",
  },
  {
    icon: Briefcase,
    title: "Indépendants B2B",
    description: "Assureurs, consultants, courtiers — un revenu additionnel sur votre réseau pro.",
  },
  {
    icon: Smartphone,
    title: "Créateurs de contenu",
    description:
      "Vos abonnés vous demandent souvent des conseils tech, transformez-les en clients.",
  },
  {
    icon: Handshake,
    title: "Tout le monde",
    description: "Avec un bon réseau. Vous connaissez des entrepreneurs ? On peut leur être utiles.",
  },
];

const ApporteursTargets = () => {
  return (
    <section
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-deep)" }}
      aria-labelledby="targets-title"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            id="targets-title"
            className="text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
          >
            Pour qui c'est fait&nbsp;?
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {targets.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border p-5 md:p-6 text-left"
                style={{
                  backgroundColor: "var(--ned-bg-elevated)",
                  borderColor: "var(--ned-border)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-4"
                  style={{
                    backgroundColor: "var(--ned-accent-soft)",
                    borderColor: "var(--ned-border)",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "var(--ned-accent)" }}
                    aria-hidden="true"
                  />
                </div>
                <h3
                  className="text-base md:text-lg font-semibold mb-2"
                  style={{ color: "var(--ned-silver-light)" }}
                >
                  {t.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ned-silver)" }}>
                  {t.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApporteursTargets;
