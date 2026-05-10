import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
  {
    q: "Je dois être auto-entrepreneur, c'est obligatoire ?",
    a: "Oui. C'est la seule façon légale pour nous de vous payer une commission. Si vous n'êtes pas encore AE, l'inscription se fait en ligne en 15 minutes sur autoentrepreneur.urssaf.fr et c'est gratuit. On vous accompagne si vous bloquez.",
  },
  {
    q: "Combien je touche exactement ?",
    a: "20 % du chiffre d'affaires HT que nous encaissons sur le projet. Sur un site à 1 990 € HT, vous touchez 398 €. Sur un projet à 3 500 €, vous touchez 700 €.",
  },
  {
    q: "Et si le client signe mais ne paie pas ?",
    a: "Pas de panique pour vous : la commission n'est due que si nous encaissons l'intégralité du paiement. Mais on a un taux d'impayés très faible : on demande un acompte à la signature et on travaille avec des clients sérieux.",
  },
  {
    q: "Je touche une commission sur la maintenance aussi ?",
    a: "Oui. 20 % de chaque échéance encaissée pendant 24 mois maximum à compter de la signature. Sur une maintenance à 39 €/mois, ça fait environ 8 €/mois × 24 = près de 200 € en plus par client.",
  },
  {
    q: "C'est quand le paiement ?",
    a: "Sous 30 jours après que nous avons encaissé l'intégralité du paiement client. Vous nous envoyez votre facture, on vous vire les fonds.",
  },
  {
    q: "Je peux travailler avec d'autres agences en même temps ?",
    a: "Oui, sauf si elles sont directement concurrentes de Ned (autre agence numérique généraliste française). Sinon vous êtes libre.",
  },
  {
    q: "Si j'arrête, que se passe-t-il ?",
    a: "Vous pouvez résilier le contrat avec 30 jours de préavis. Toutes les commissions dues vous restent acquises pour les clients déjà signés et même pour ceux qui signent dans les 12 mois suivant votre présentation.",
  },
  {
    q: "Quel est le délai entre ma présentation et la signature du client ?",
    a: "En moyenne 2 à 4 semaines selon la complexité du projet. Vous suivez l'avancement en temps réel via votre dashboard apporteur.",
  },
  {
    q: "Y a-t-il une zone géographique imposée ?",
    a: "Non. France métropolitaine, DOM-TOM, et même au-delà — Ned travaille à 100 % à distance.",
  },
];

const ApporteursFAQ = () => {
  return (
    <section
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: "var(--ned-bg-mid)" }}
      aria-labelledby="faq-title"
    >
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            id="faq-title"
            className="text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ color: "var(--ned-silver-light)", letterSpacing: "-0.03em" }}
          >
            Vos questions, nos réponses
          </h2>
        </motion.div>

        <Accordion
          type="single"
          collapsible
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: "var(--ned-bg-elevated)",
            borderColor: "var(--ned-border)",
          }}
        >
          {faq.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b last:border-b-0 px-5 md:px-6"
              style={{ borderColor: "var(--ned-border)" }}
            >
              <AccordionTrigger
                className="text-left py-5 hover:no-underline text-base md:text-lg font-medium"
                style={{ color: "var(--ned-silver-light)" }}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent
                className="pb-5 text-sm md:text-base leading-relaxed"
                style={{ color: "var(--ned-silver)" }}
              >
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default ApporteursFAQ;
