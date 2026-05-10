import { motion } from "framer-motion";
import { Shield, Clock, FileSignature } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Vous êtes payé, point final",
    description:
      "On fixe une commission de 20 % HT du montant encaissé. Versement sous 30 jours après que le client nous a payés. Aucune retenue, aucune surprise.",
  },
  {
    icon: Clock,
    title: "Aucun engagement, aucun quota",
    description:
      "Vous présentez 1 contact par mois ou 10, c'est vous qui voyez. Pas d'objectif imposé, pas de pénalité si vous arrêtez.",
  },
  {
    icon: FileSignature,
    title: "Un contrat propre dès le départ",
    description:
      "Vous recevez un contrat d'apporteur d'affaires juridiquement carré dès votre inscription. Tout est noir sur blanc.",
  },
];

const ApporteursWhyUs = () => {
  return (
    <section
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-deep)" }}
      aria-labelledby="why-us-title"
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
            id="why-us-title"
            className="text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
          >
            Pourquoi nous
            <br />
            (et pas une autre agence)&nbsp;?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border p-6 md:p-7 transition-colors hover:bg-[rgba(15,30,54,0.85)]"
                style={{
                  backgroundColor: "var(--ned-bg-elevated)",
                  borderColor: "var(--ned-border)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-5"
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
                  className="text-lg md:text-xl font-bold mb-3"
                  style={{ color: "var(--ned-silver-light)" }}
                >
                  {card.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--ned-silver)" }}>
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApporteursWhyUs;
