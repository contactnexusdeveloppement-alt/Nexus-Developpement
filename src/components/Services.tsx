import { Globe, Zap, Palette, Smartphone, Layout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import websiteImg from "@/assets/service-website.jpg";
import automationImg from "@/assets/service-automation.jpg";
import mobileImg from "@/assets/service-mobile.jpg";
import brandingImg from "@/assets/service-branding.jpg";
import customImg from "@/assets/service-custom.jpg";

const services = [
  {
    icon: Globe,
    title: "Sites Vitrine",
    description: "Sites modernes, responsifs et optimisés pour convertir vos visiteurs en clients.",
    image: websiteImg,
    altText: "Création de site vitrine par Nexus Développement",
    link: "/creation-site-web"
  },
  {
    icon: Zap,
    title: "Automatisation",
    description: "Gagnez du temps en automatisant vos tâches répétitives et optimisez vos workflows.",
    image: automationImg,
    altText: "Automatisation de processus par Nexus Développement",
    link: "/automatisation"
  },
  {
    icon: Layout,
    title: "Applications Web",
    description: "Solutions logicielles puissantes et sur-mesure accessibles depuis un navigateur.",
    image: customImg,
    altText: "Développement d'applications web par Nexus Développement",
    link: "/applications-web"
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles",
    description: "Applications iOS et Android performantes avec une expérience utilisateur optimale.",
    image: mobileImg,
    altText: "Développement mobile par Nexus Développement",
    link: "/applications-mobiles"
  },
  {
    icon: Palette,
    title: "Identité Visuelle",
    description: "Logos et chartes graphiques pour une identité visuelle forte et unique.",
    image: brandingImg,
    altText: "Design et identité visuelle par Nexus Développement",
    link: "/identite-visuelle"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const Services = () => {
  return (
    <section id="services" className="py-12 relative">
      {/* Glow effects background */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            Nos Services
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Des solutions digitales complètes pour propulser votre entreprise
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Link to={service.link} className="block h-full group">
                <Card className="relative overflow-hidden h-96 glass-card border-none hover:border-cyan-500/50 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                  {/* Image de fond avec overlay */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={service.image}
                      alt={service.altText}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40 group-hover:from-background group-hover:via-background/80 transition-all duration-500" />
                  </div>

                  {/* Contenu */}
                  <CardContent className="relative h-full p-8 flex flex-col justify-end z-10">
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/30 transition-all duration-300 w-fit shadow-lg">
                      <service.icon className="w-8 h-8 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                      {service.description}
                    </p>

                    {/* Call to action */}
                    <div className="mt-6 flex items-center text-cyan-400 font-semibold opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      En savoir plus
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
