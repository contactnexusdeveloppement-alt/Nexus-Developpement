import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    company: "Salon de coiffure Élégance",
    content: "Le site permet à mes clients de prendre rendez-vous 24h/24 sans que je m'en occupe. Plus besoin de répondre au téléphone toute la journée, je peux me concentrer sur mon métier. Un vrai gain de temps !",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Gérant",
    company: "Garage Auto Services",
    content: "Grâce au système de réservation en ligne, mes clients prennent rendez-vous directement sur le site. Ils peuvent même voir les créneaux disponibles en temps réel. Fini les rendez-vous oubliés !",
    rating: 5,
  },
  {
    id: 3,
    name: "Marie Lefebvre",
    role: "Propriétaire",
    company: "Pizzeria Bella Napoli",
    content: "L'application mobile pour la commande en ligne a doublé notre chiffre d'affaires. Les clients commandent directement depuis leur téléphone, c'est ultra pratique. On ne peut plus s'en passer !",
    rating: 5,
  },
  {
    id: 4,
    name: "Dr. Pierre Rousseau",
    role: "Dentiste",
    company: "Cabinet Dentaire Sourire",
    content: "Le site web avec prise de rendez-vous automatique a révolutionné mon cabinet. Mes patients réservent en quelques clics, et je reçois une notification. Simple et efficace !",
    rating: 5,
  },
  {
    id: 5,
    name: "Julie Moreau",
    role: "Coach",
    company: "Salle de sport FitnessPro",
    content: "L'application permet à mes membres de réserver leurs cours, suivre leurs progrès et même payer leur abonnement en ligne. La gestion est devenue un jeu d'enfant !",
    rating: 5,
  },
  {
    id: 6,
    name: "Marc Legrand",
    role: "Gérant",
    company: "Boulangerie Artisanale",
    content: "Le site vitrine met en valeur mes produits avec de belles photos. Les clients peuvent même commander leurs gâteaux d'anniversaire en ligne. Mes ventes ont vraiment augmenté !",
    rating: 5,
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-20 px-4 overflow-hidden"
    >
      <div className="container mx-auto relative z-10">
        {/* Section Title */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed">
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Ils nous font confiance
            </span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez les retours de nos clients satisfaits
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full bg-gradient-to-br from-blue-950/80 to-blue-900/60 rounded-xl border border-blue-500/30 p-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-blue-400/60">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-white/90 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-auto">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-blue-400/50">
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
                    <p className="text-white font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-blue-300 text-sm">
                      {testimonial.role} - {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
