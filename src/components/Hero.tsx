import MagneticButton from "@/components/MagneticButton";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Hero = () => {
  const fullText = "Agence Web & Mobile : Création de sites et applications sur-mesure";

  // SSR-friendly mobile detection - initialize immediately to prevent animation flash
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false; // Default to false on server-side
  });

  // Only run typewriter animation on desktop (!isMobile)
  const typedText = useTypewriter(fullText, 50, !isMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">

      {/* Background elements - reduced blur on mobile for performance */}
      <div className="absolute inset-x-0 top-0 -bottom-40 pointer-events-none min-h-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-[60px] md:blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-600/20 rounded-full blur-[60px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.4 : 0.8 }}
        >
          <div className="mb-8"></div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight min-h-[120px] sm:min-h-[160px] md:min-h-[220px]">
            <span className="bg-gradient-to-r from-white via-blue-100 to-gray-400 bg-clip-text text-transparent drop-shadow-lg">
              {typedText}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sites web ultra-modernes, applications mobiles natives et automatisation de processus.
            <span className="text-cyan-400 font-semibold block mt-2">Transformez votre vision en réalité technique.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticButton
              size="lg"
              onClick={() => scrollToSection('devis')}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all duration-300 transform hover:scale-105"
            >
              Démarrer un projet
            </MagneticButton>
            <MagneticButton
              size="lg"
              onClick={() => scrollToSection('services')}
              className="bg-white/5 backdrop-blur-sm border border-white/20 text-white font-medium px-8 py-6 text-lg rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Explorer nos services
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
