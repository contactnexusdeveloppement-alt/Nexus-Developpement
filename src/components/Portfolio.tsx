import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
    altText: "Capture d'écran du site BodyStart - plateforme de programmes sportifs et coaching en ligne"
  },
  {
    title: "EcoManager",
    description: "Solution SaaS pour la gestion énergétique des entreprises avec tableau de bord temps réel",
    image: "/placeholder.svg",
    url: "#",
    technologies: ["React", "TypeScript", "D3.js", "AWS"],
    category: "Web App",
    altText: "Interface de l'application EcoManager"
  },
  {
    title: "ArtGallery",
    description: "Portfolio immersif pour un artiste peintre, galerie 3D et e-shop intégré",
    image: "/placeholder.svg",
    url: "#",
    technologies: ["Three.js", "React", "Shopify"],
    category: "Site Vitrine",
    altText: "Aperçu du portfolio ArtGallery"
  },
  {
    title: "TaskFlow",
    description: "Outil de gestion de projet collaboratif nouvelle génération pour les équipes remote",
    image: "/placeholder.svg",
    url: "#",
    technologies: ["Next.js", "Socket.io", "Tailwind"],
    category: "SaaS",
    altText: "Interface de TaskFlow"
  },
  {
    title: "CorpFinance",
    description: "Portail institutionnel sécurisé pour une banque d'affaires internationale",
    image: "/placeholder.svg",
    url: "#",
    technologies: ["React", "Security", "CMS"],
    category: "Corporate",
    altText: "Site institutionnel CorpFinance"
  },
  {
    title: "FitTrack Pro",
    description: "Application mobile de suivi fitness avec IA pour la personnalisation des entraînements",
    image: "/placeholder.svg",
    url: "#",
    technologies: ["React Native", "TensorFlow", "Firebase"],
    category: "Mobile",
    altText: "Screenshots de l'application FitTrack Pro"
  }
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
      onClick={() => window.open(project.url, '_blank')}
    >
      <div
        className="relative h-full min-h-[420px] rounded-xl bg-gray-900/40 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.3)]"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden transform transition-transform duration-300" style={{ transform: "translateZ(30px)" }}>
          <div className="absolute top-4 right-4 z-20">
            <Badge className="bg-black/50 text-cyan-300 border border-cyan-500/50 backdrop-blur-md">
              {project.category}
            </Badge>
          </div>
          <img
            src={project.image}
            alt={project.altText}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between transform transition-transform duration-300 bg-gradient-to-b from-gray-900/0 to-gray-900/80" style={{ transform: "translateZ(50px)" }}>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {project.title}
              </h3>
              <div className="p-2 rounded-full bg-white/5 text-gray-300 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-white/5">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5 transition-colors group-hover:border-cyan-500/30 group-hover:text-cyan-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Shine Effect */}
        <div
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine"
        />

        {/* Border Glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]" />
      </div>
    </motion.div>
  );
};

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Nos Réalisations
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Une sélection de nos meilleurs projets, alliant design primé et excellence technique.
          </p>
        </motion.div>

        {/* Project Grid with Perspective */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
          style={{ perspective: "1000px" }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 font-medium">
            Et bien plus encore... <button className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">Voir tout le catalogue</button>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
