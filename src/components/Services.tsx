import { Globe, Zap, Palette, Sparkles, Settings, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import websiteImg from "@/assets/service-website.jpg";
import automationImg from "@/assets/service-automation.jpg";
import mobileImg from "@/assets/service-mobile.jpg";
import logoImg from "@/assets/service-logo.jpg";
import brandingImg from "@/assets/service-branding.jpg";
import customImg from "@/assets/service-custom.jpg";

const services = [
  {
    icon: Globe,
    title: "Création de site web",
    description: "Sites modernes, responsifs et optimisés pour convertir vos visiteurs en clients.",
    image: websiteImg,
    altText: "Création de site web moderne et responsive par Nexus Développement agence digitale Élancourt"
  },
  {
    icon: Smartphone,
    title: "Applications mobiles",
    description: "Applications iOS et Android performantes avec une expérience utilisateur optimale.",
    image: mobileImg,
    altText: "Développement d'applications mobiles iOS et Android par Nexus Développement"
  },
  {
    icon: Zap,
    title: "Automatisation de processus",
    description: "Gagnez du temps en automatisant vos tâches répétitives et optimisez vos workflows.",
    image: automationImg,
    altText: "Automatisation de processus métier et workflows par Nexus Développement"
  },
  {
    icon: Palette,
    title: "Création de logos",
    description: "Des logos uniques et mémorables qui reflètent parfaitement votre identité.",
    image: logoImg,
    altText: "Création de logo professionnel et unique par Nexus Développement"
  },
  {
    icon: Sparkles,
    title: "Branding visuel",
    description: "Chartes graphiques complètes pour une identité visuelle cohérente et professionnelle.",
    image: brandingImg,
    altText: "Stratégie de branding et identité visuelle par Nexus Développement"
  },
  {
    icon: Settings,
    title: "Services sur mesure",
    description: "Solutions personnalisées adaptées à vos besoins spécifiques et votre secteur.",
    image: customImg,
    altText: "Services de développement web sur mesure par Nexus Développement"
  }
];

const Services = () => {
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
    <section ref={sectionRef} id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            Nos Services
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Des solutions digitales complètes pour propulser votre entreprise
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden h-80 border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-700 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] group cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-10 -rotate-3"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image de fond SEO-friendly */}
              <img 
                src={service.image} 
                alt={service.altText}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/80 to-blue-950/60 group-hover:from-blue-950/98 group-hover:via-blue-900/90 transition-all duration-500" />
              
              {/* Contenu */}
              <CardContent className="relative h-full p-8 flex flex-col justify-end z-10">
                <div className="mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 group-hover:from-blue-400/40 group-hover:to-blue-500/30 transition-all duration-300 border border-blue-400/40 w-fit">
                  <service.icon className="w-10 h-10 text-blue-200 group-hover:text-blue-100 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-100 transition-colors">
                  {service.title}
                </h3>
                <p className="text-blue-100/90 group-hover:text-white transition-colors leading-relaxed">
                  {service.description}
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

export default Services;
