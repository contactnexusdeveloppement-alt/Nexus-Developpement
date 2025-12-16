import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nexus-logo.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Tarifs", id: "tarifs" },
    { label: "Réserver", id: "reservation" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      aria-label="Menu principal"
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 15, 30, 0.2)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        boxShadow: isScrolled ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(59, 130, 246, 0.2)' : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            className="flex items-center gap-3 cursor-pointer group bg-transparent border-none p-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Retour en haut de page"
          >
            <img 
              src={logo} 
              alt="Logo Nexus Développement - Agence digitale création sites web et automatisation à Élancourt" 
              className="w-14 h-14 drop-shadow-[0_0_15px_rgba(100,150,255,0.6)] transition-all duration-500 ease-out group-hover:scale-115 group-hover:rotate-6 group-hover:drop-shadow-[0_0_25px_rgba(100,150,255,0.9)]" 
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(100,150,255,0.8)]">
                Nexus
              </span>
              <span className="font-semibold text-sm text-blue-300 tracking-wider drop-shadow-[0_1px_8px_rgba(100,150,255,0.6)]">
                Développement
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 text-white bg-white/10 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] backdrop-blur-sm"
              >
                {link.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection('devis')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300 transform hover:scale-105 border border-blue-400/50"
            >
              Demander un devis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 bg-primary/30 backdrop-blur-md border-b border-blue-500/20" role="menu">
            <div className="flex flex-col gap-3 px-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 text-white bg-white/10 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-sm text-left"
                >
                  {link.label}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection('devis')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/50"
              >
                Demander un devis
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
