import { Clock, Zap, Heart, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import processImg from "@/assets/engagement-process.jpg";
import deliveryImg from "@/assets/engagement-delivery.jpg";
import supportImg from "@/assets/engagement-support.jpg";
import pricingImg from "@/assets/engagement-pricing.jpg";
import maintenanceImg from "@/assets/engagement-maintenance.jpg";

const commitments = [
  {
    icon: Zap,
    title: "Processus simple et rapide",
    description: "Une méthodologie éprouvée pour des résultats concrets en un temps record",
    image: processImg,
    altText: "Processus de développement simple et rapide chez Nexus Développement agence digitale"
  },
  {
    icon: Clock,
    title: "Livraison rapide",
    description: "Respectez vos deadlines avec nos délais de livraison optimisés",
    image: deliveryImg,
    altText: "Livraison rapide de projets digitaux par Nexus Développement"
  },
  {
    icon: Heart,
    title: "Accompagnement personnalisé",
    description: "Un suivi sur-mesure et une écoute attentive de vos besoins",
    image: supportImg,
    altText: "Accompagnement personnalisé et support client Nexus Développement"
  },
  {
    icon: DollarSign,
    title: "Prix attractifs",
    description: "Des tarifs transparents et compétitifs adaptés à tous les budgets",
    image: pricingImg,
    altText: "Tarifs attractifs et transparents agence Nexus Développement Élancourt"
  },
  {
    icon: Wrench,
    title: "Service de maintenance",
    description: "Maintenance continue de vos sites et automatisations avec support réactif disponible",
    image: maintenanceImg,
    altText: "Service de maintenance et support technique Nexus Développement"
  }
];

const Methodology = () => {
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

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            Nos Engagements
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            La qualité et votre satisfaction au cœur de notre démarche
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commitments.map((commitment, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden h-80 border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-700 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] group cursor-pointer ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image de fond SEO-friendly */}
              <img 
                src={commitment.image} 
                alt={commitment.altText}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/80 to-blue-950/60 group-hover:from-blue-950/98 group-hover:via-blue-900/90 transition-all duration-500" />
              
              {/* Contenu */}
              <CardContent className="relative h-full p-8 flex flex-col justify-end z-10 text-center">
                <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 group-hover:from-blue-400/40 group-hover:to-blue-500/30 transition-all duration-300 border border-blue-400/40 mx-auto">
                  <commitment.icon className="w-10 h-10 text-blue-200 group-hover:text-blue-100 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-100 transition-colors">
                  {commitment.title}
                </h3>
                <p className="text-blue-100/90 group-hover:text-white transition-colors leading-relaxed">
                  {commitment.description}
                </p>
              </CardContent>
              
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
