import { Scissors, Wrench, Pizza, Stethoscope, Dumbbell, Croissant } from "lucide-react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface UseCase {
  id: number;
  icon: typeof Scissors;
  sector: string;
  challenge: string;
  solution: string;
  outcome: string;
}

const useCases: UseCase[] = [
  {
    id: 1,
    icon: Scissors,
    sector: "Salons de coiffure & beauté",
    challenge:
      "Le téléphone sonne pendant les coupes, des rendez-vous sont oubliés et les créneaux disponibles sont impossibles à communiquer.",
    solution:
      "Site avec module de prise de rendez-vous 24/7, synchronisé avec l'agenda du salon, rappels SMS et confirmation par email automatiques.",
    outcome:
      "Plus de réservations capturées en dehors des heures d'ouverture, moins d'appels téléphoniques, gain de temps quotidien estimé à 1h30.",
  },
  {
    id: 2,
    icon: Wrench,
    sector: "Garages & artisans",
    challenge:
      "Les clients appellent pour vérifier les disponibilités, beaucoup raccrochent quand personne ne décroche pendant l'atelier.",
    solution:
      "Site mobile-first avec créneaux d'intervention en temps réel, demande de devis structurée et notifications instantanées au gérant.",
    outcome:
      "Captation des demandes hors horaires, taux de réponse client multiplié, qualification des leads avant le premier contact.",
  },
  {
    id: 3,
    icon: Pizza,
    sector: "Restauration & livraison",
    challenge:
      "Les commandes par téléphone monopolisent un employé en heure de pointe et les erreurs de prise de commande sont fréquentes.",
    solution:
      "Site avec menu interactif, panier, paiement Stripe en ligne ou sur place, intégration des principales plateformes de livraison.",
    outcome:
      "Service plus fluide en heure de pointe, ticket moyen plus élevé sur les commandes en ligne, fidélisation via emails de remerciement.",
  },
  {
    id: 4,
    icon: Stethoscope,
    sector: "Cabinets médicaux & paramédicaux",
    challenge:
      "Le secrétariat passe la moitié de sa journée à prendre et à confirmer des rendez-vous au téléphone.",
    solution:
      "Plateforme de réservation en ligne conforme RGPD avec rappels automatiques, gestion des créneaux par praticien, lien Doctolib si déjà utilisé.",
    outcome:
      "Réduction du no-show, secrétariat libéré pour l'accueil et la facturation, expérience patient modernisée.",
  },
  {
    id: 5,
    icon: Dumbbell,
    sector: "Coachs sportifs & studios",
    challenge:
      "Gérer manuellement les abonnements, les réservations de cours et les paiements récurrents prend des heures par semaine.",
    solution:
      "Application web avec inscription aux cours, paiement par abonnement Stripe, suivi des présences et tableau de bord coach.",
    outcome:
      "Automatisation complète du back-office, encaissement régulier sans relance manuelle, augmentation du LTV moyen.",
  },
  {
    id: 6,
    icon: Croissant,
    sector: "Boulangeries & commerces de bouche",
    challenge:
      "Les commandes spéciales (gâteaux, buffets) se font sur des bouts de papier et sont parfois perdues ou mal interprétées.",
    solution:
      "Module de commande structurée avec choix de date, options détaillées, acompte en ligne et bon de commande imprimable côté boutique.",
    outcome:
      "Zéro perte de commande, anticipation de la production, expérience client moderne qui justifie un panier plus élevé.",
  },
];

const Testimonials = () => {
  const carousel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const progressBarWidth = useTransform(x, [0, -width], ["0%", "100%"]);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  return (
    <section id="cas-usage" className="relative py-12">
      <div className="container mx-auto relative z-10 px-4">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Cas d'usage par secteur
            </span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Des challenges concrets que nos solutions résolvent au quotidien pour les TPE et PME en Île-de-France.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          ref={carousel}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            style={{ x }}
            className="flex gap-6 sm:gap-8 pb-12 px-4 md:px-12"
          >
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[85vw] md:w-[480px] snap-center select-none"
                >
                  <div className="relative h-full glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 group">

                    {/* Icon + Sector */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                        {useCase.sector}
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm leading-relaxed">
                      <div>
                        <span className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">Challenge</span>
                        <p className="text-gray-300 mt-1">{useCase.challenge}</p>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">Solution Nexus</span>
                        <p className="text-gray-300 mt-1">{useCase.solution}</p>
                      </div>
                      <div className="pt-3 border-t border-white/5">
                        <span className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">Bénéfice</span>
                        <p className="text-gray-200 mt-1 font-medium">{useCase.outcome}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scroll Progress Bar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              style={{ width: progressBarWidth }}
              className="h-full bg-cyan-500 rounded-full"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
