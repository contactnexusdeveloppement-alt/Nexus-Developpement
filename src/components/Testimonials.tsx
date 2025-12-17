import { Star } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Gérante",
    company: "Salon Élégance",
    content: "Le site permet à mes clients de prendre rendez-vous 24h/24. Plus besoin de répondre au téléphone toute la journée, un vrai gain de temps !",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Gérant",
    company: "Garage Auto Services",
    content: "Mes clients voient les créneaux en temps réel. Fini les rendez-vous oubliés, tout est automatisé et fluide.",
    rating: 5,
  },
  {
    id: 3,
    name: "Marie Lefebvre",
    role: "Propriétaire",
    company: "Pizzeria Bella",
    content: "La commande en ligne a doublé notre chiffre d'affaires. C'est ultra pratique pour nos clients et pour nous.",
    rating: 5,
  },
  {
    id: 4,
    name: "Dr. Pierre Rousseau",
    role: "Dentiste",
    company: "Cabinet Sourire",
    content: "La prise de rendez-vous automatique a révolutionné mon cabinet. Simple, efficace et très professionnel.",
    rating: 5,
  },
  {
    id: 5,
    name: "Julie Moreau",
    role: "Coach",
    company: "FitnessPro",
    content: "Mes membres réservent leurs cours et paient en ligne. La gestion est devenue un jeu d'enfant grâce à Nexus.",
    rating: 5,
  },
  {
    id: 6,
    name: "Marc Legrand",
    role: "Artisan",
    company: "Boulangerie Artisanale",
    content: "Le site met parfaitement en valeur mes produits. Les commandes de gâteaux d'anniversaire ont explosé !",
    rating: 5,
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section id="testimonials" className="relative py-20 overflow-hidden">
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
              Ils nous font confiance
            </span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Découvrez comment nous avons transformé l'activité de nos clients
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div ref={carousel} className="relative overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            style={{ x }}
            className="flex gap-6 sm:gap-8 pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[85vw] md:w-[450px] snap-center select-none"
              >
                <div className="relative h-full glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 group">

                  {/* Glow Effect Top Right */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] group-hover:bg-cyan-500/20 transition-all duration-500" />

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-cyan-400 text-cyan-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-gray-300 mb-8 leading-relaxed relative z-10 text-lg italic pointer-events-none">
                    "{testimonial.content}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mt-auto">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-cyan-400 font-bold border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(testimonial.name)}</span>
                      )}
                    </div>

                    {/* Author Details */}
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role} <span className="text-cyan-600">•</span> {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
