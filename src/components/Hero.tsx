import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/useTypewriter";

const Hero = () => {
  const typedText = useTypewriter("Accélérez votre développement digital", 80);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden">

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-8xl font-bold mb-6 pb-4 leading-relaxed min-h-[100px] sm:min-h-[120px] md:min-h-[200px] bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(100,150,255,0.8)] break-words px-2 md:px-0">
          <span aria-live="polite" aria-atomic="true">{typedText}</span>
          <span className="animate-pulse" aria-hidden="true">|</span>
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-primary-foreground mb-10 max-w-4xl mx-auto animate-fade-in drop-shadow-[0_2px_20px_rgba(100,150,255,0.6)]">
          Sites web, applications mobiles, automatisation et identité visuelle pour toutes les entreprises
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
          <Button 
            size="lg" 
            onClick={() => scrollToSection('devis')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-10 py-7 text-xl rounded-full shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] transition-all duration-300 transform hover:scale-105"
          >
            Demander un devis
          </Button>
          <Button 
            size="lg" 
            onClick={() => scrollToSection('services')}
            className="bg-white/10 border-2 border-blue-400 text-white font-bold px-10 py-7 text-xl rounded-full hover:bg-white/20 shadow-[0_0_20px_rgba(100,150,255,0.4)] hover:shadow-[0_0_30px_rgba(100,150,255,0.6)] transition-all duration-300 transform hover:scale-105"
          >
            Découvrir nos services
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
