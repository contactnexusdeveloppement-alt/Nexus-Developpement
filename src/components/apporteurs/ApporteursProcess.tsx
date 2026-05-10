import { motion } from "framer-motion";

const steps = [
  {
    title: "Vous postulez ici en 2 minutes",
    description: "Formulaire simple. On valide votre profil sous 48h.",
  },
  {
    title: "Vous signez le contrat",
    description:
      "On vous envoie le contrat d'apporteur d'affaires. Vous le signez en ligne. Vous recevez votre code apporteur unique.",
  },
  {
    title: "Vous présentez vos contacts",
    description:
      "Via un formulaire dédié, vous nous transmettez le nom, le besoin et les coordonnées du prospect.",
  },
  {
    title: "On prend le relais",
    description:
      "Notre équipe appelle, qualifie, devise, négocie, signe et livre. Vous suivez l'avancement en temps réel.",
  },
  {
    title: "Vous encaissez",
    description:
      "Dès que le client a réglé, on déclenche votre paiement. Vous nous envoyez votre facture, on vous vire les fonds sous 30 jours.",
  },
];

const ApporteursProcess = () => {
  return (
    <section
      id="comment-ca-marche"
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-mid)" }}
      aria-labelledby="process-title"
    >
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            id="process-title"
            className="text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
          >
            Comment ça marche
          </h2>
          <p className="mt-4 text-base md:text-lg" style={{ color: "var(--ned-silver)" }}>
            5 étapes, zéro paperasse inutile.
          </p>
        </motion.div>

        <ol className="relative" aria-label="Étapes du programme apporteur">
          {/* Ligne verticale (rappel constellation) */}
          <div
            className="absolute left-[19px] top-3 bottom-3 w-px hidden sm:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--ned-accent), transparent)",
              opacity: 0.4,
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="relative flex gap-5 mb-8 last:mb-0"
            >
              <div
                className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border font-mono text-sm font-bold tabular-nums"
                style={{
                  backgroundColor: "var(--ned-bg-elevated)",
                  borderColor: "var(--ned-accent)",
                  color: "var(--ned-accent)",
                }}
              >
                {i + 1}
              </div>
              <div className="flex-1 pt-1.5">
                <h3
                  className="text-lg md:text-xl font-semibold mb-2"
                  style={{ color: "var(--ned-silver-light)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--ned-silver)" }}>
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ApporteursProcess;
