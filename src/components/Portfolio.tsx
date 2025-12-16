import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import bodystartImage from "@/assets/bodystart-project.png";

type Project = {
  title: string;
  description: string;
  image: string;
  url: string;
  technologies: string[];
  category: string;
  altText: string;
};

const projects: Project[] = [
  {
    title: "BodyStart",
    description: "Site de vente de programmes sportifs, alimentaires et de coaching avec plus de 100 transformations réussies",
    image: bodystartImage,
    url: "https://bodystart.com",
    technologies: ["React", "Node.js", "Stripe", "Supabase"],
    category: "Site Web",
    altText: "Capture d'écran du site BodyStart - plateforme de programmes sportifs et coaching en ligne créée par Nexus Développement"
  },
  {
    title: "Application de Gestion",
    description: "Solution complète pour la gestion d'entreprise avec tableau de bord analytics",
    image: "/placeholder.svg",
    url: "https://example.com",
    technologies: ["React", "TypeScript", "Supabase"],
    category: "Web App",
    altText: "Interface de l'application de gestion d'entreprise avec tableau de bord analytics développée par Nexus Développement"
  },
  {
    title: "Portfolio Créatif",
    description: "Site vitrine pour artiste avec galerie interactive et système de contact",
    image: "/placeholder.svg",
    url: "https://example.com",
    technologies: ["React", "Tailwind", "Animation"],
    category: "Site Vitrine",
    altText: "Exemple de portfolio créatif pour artiste avec galerie interactive réalisé par Nexus Développement"
  },
  {
    title: "Plateforme SaaS",
    description: "Application B2B pour la gestion de projets collaboratifs avec intégrations multiples",
    image: "/placeholder.svg",
    url: "https://example.com",
    technologies: ["React", "Next.js", "API", "Cloud"],
    category: "SaaS",
    altText: "Plateforme SaaS B2B pour gestion de projets collaboratifs développée par Nexus Développement"
  },
  {
    title: "Site Institutionnel",
    description: "Site corporate pour grande entreprise avec multilingue et SEO optimisé",
    image: "/placeholder.svg",
    url: "https://example.com",
    technologies: ["React", "CMS", "SEO"],
    category: "Site Corporate",
    altText: "Site institutionnel multilingue optimisé SEO pour entreprise créé par Nexus Développement"
  },
  {
    title: "Application Mobile",
    description: "App mobile cross-platform pour le suivi fitness et nutrition",
    image: "/placeholder.svg",
    url: "https://example.com",
    technologies: ["React Native", "Firebase", "API"],
    category: "Mobile",
    altText: "Application mobile fitness et nutrition cross-platform développée par Nexus Développement"
  }
];

const Portfolio = () => {
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
    <section ref={sectionRef} id="portfolio" className="py-20">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            Notre Portfolio
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Découvrez nos réalisations et laissez-vous inspirer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-2 transition-all duration-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] group cursor-pointer ${
                isVisible ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-20 rotate-2"
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                borderImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 211, 238, 0.4)) 1',
                transitionDelay: `${index * 150}ms`
              }}
              onClick={() => window.open(project.url, '_blank')}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.altText}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-blue-500/90 text-white border-none">
                  {project.category}
                </Badge>
              </div>

              <CardContent className="p-6 relative z-10">
                {/* Titre avec icône */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                </div>

                {/* Description */}
                <p className="text-blue-100/80 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>

              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-transparent" />
              </div>

              {/* Bordure animée */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-xl" />
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/90 text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Vous avez un projet en tête ?
          </p>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
