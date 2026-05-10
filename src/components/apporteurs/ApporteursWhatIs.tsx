import { motion } from "framer-motion";
import { UserPlus, Briefcase, Wallet } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Vous présentez",
    description: "Un contact via notre formulaire. 3 champs, 60 secondes.",
  },
  {
    icon: Briefcase,
    title: "On gère",
    description: "Appel, devis, négociation, projet, livraison.",
  },
  {
    icon: Wallet,
    title: "Vous encaissez",
    description: "20 % du montant total dès que le client a payé.",
  },
];

const ApporteursWhatIs = () => {
  return (
    <section
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-mid)" }}
      aria-labelledby="what-is-title"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Colonne texte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="what-is-title"
              className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
              style={{
                color: "var(--ned-silver-light)",
                letterSpacing: "-0.03em",
              }}
            >
              Apporteur d'affaires,
              <br />
              c'est quoi en vrai&nbsp;?
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--ned-silver)" }}
            >
              Pas besoin d'être commercial, pas besoin de prospecter. Vous repérez dans votre
              entourage — pro ou perso — quelqu'un qui galère avec son site, qui se lance, qui
              a besoin d'une refonte, qui veut une app. Vous nous le présentez.
            </p>
            <p
              className="text-base md:text-lg leading-relaxed mt-4"
              style={{ color: "var(--ned-silver)" }}
            >
              On prend le relais&nbsp;: on appelle, on chiffre, on livre.
              <strong style={{ color: "var(--ned-silver-light)" }}>
                {" "}
                Vous, vous touchez la commission.
              </strong>
            </p>
          </motion.div>

          {/* Colonne carte 3 étapes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl border p-6 md:p-8"
            style={{
              backgroundColor: "var(--ned-bg-elevated)",
              borderColor: "var(--ned-border)",
            }}
          >
            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border"
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
                    <div className="flex-1 pt-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span
                          className="text-xs font-mono tabular-nums tracking-wider"
                          style={{ color: "var(--ned-accent)" }}
                        >
                          0{i + 1}
                        </span>
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "var(--ned-silver-light)" }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--ned-silver)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Halo subtil */}
            <div
              className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--ned-accent-soft)" }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApporteursWhatIs;
