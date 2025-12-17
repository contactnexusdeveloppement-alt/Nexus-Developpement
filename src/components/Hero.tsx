import MagneticButton from "@/components/MagneticButton";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";

const Hero = () => {
  const typedText = useTypewriter("Accélérez votre développement digital", 80);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden pt-20">

      {/* Background elements with overflow hidden to prevent scrollbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            🚀 Agence Digitale Nouvelle Génération
          </div>

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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
          <span>Scroll</span>
          <div className="w-5 h-9 border-2 border-gray-500/50 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
