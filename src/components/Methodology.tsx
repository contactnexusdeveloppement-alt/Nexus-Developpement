import { Clock, Zap, Heart, DollarSign, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import processImg from "@/assets/engagement-process.webp";
import deliveryImg from "@/assets/engagement-delivery.webp";
import supportImg from "@/assets/engagement-support.webp";
import pricingImg from "@/assets/engagement-pricing.webp";
import maintenanceImg from "@/assets/engagement-maintenance.webp";

const commitments = [
  {
    icon: Zap,
    title: "Équipe Experte",
    description: "Nous avançons pas à pas avec vous sur votre projet. Vous validez chaque étape clé de la conception, ce qui garantit un résultat final parfaitement conforme à vos attentes et sans surprise.",
    image: processImg,
    altText: "Équipe professionnelle et méthodologie pas à pas"
  },
  {
    icon: Clock,
    title: "Délais Respectés",
    description: "Nous nous engageons sur une date de livraison réaliste. Notre gestion de projet rigoureuse nous permet d'anticiper les éventuels blocages et de tout mettre en œuvre pour respecter le planning annoncé.",
    image: deliveryImg,
    altText: "Respect des délais de livraison"
  },
  {
    icon: Heart,
    title: "Support 7j/7",
    description: "Vous n'êtes jamais seul. Une équipe dédiée est disponible 7 jours sur 7 pour répondre à toutes vos questions et demandes d'assistance sous 48 heures maximum.",
    image: supportImg,
    altText: "Service client disponible 7j/7"
  },
  {
    icon: DollarSign,
    title: "Devis Transparent",
    description: "Nos propositions sont claires et détaillées ligne par ligne : design, développement, fonctionnalités. Tout est validé en amont, il n'y a aucun surcoût caché ni mauvaise surprise à la facturation.",
    image: pricingImg,
    altText: "Transparence des prix"
  },
  {
    icon: Wrench,
    title: "Sérénité Technique",
    description: "Nous proposons des services de maintenance complets (mises à jour, sécurité, sauvegardes) pour assurer la pérennité de votre site et vous permettre de vous concentrer sereinement sur votre activité.",
    image: maintenanceImg,
    altText: "Services de maintenance web optionnels"
  }
];

const Methodology = () => {
  return (
    <section id="methodology" className="py-12 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Nos Engagements
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Une approche visuelle et concrète de notre savoir-faire.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {commitments.map((commitment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative h-[360px] rounded-2xl overflow-hidden cursor-pointer ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              {/* Image Background with Zoom Effect */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.img
                  src={commitment.image}
                  alt={commitment.altText}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>

              {/* Gradient Overlay - Stronger for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/30 z-10 transition-opacity duration-300" />

              {/* Hover Glow Overlay */}
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="inline-flex p-2 rounded-lg bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <commitment.icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                      {commitment.title}
                    </h3>
                  </div>

                  <p className="text-gray-200 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                    {commitment.description}
                  </p>
                </div>
              </div>

              {/* Border shine */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-cyan-500/30 rounded-2xl transition-colors duration-500 z-30 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
