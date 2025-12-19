import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nexus-logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      aria-label="Menu principal"
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 15, 30, 0.8)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px -5px rgba(0, 0, 0, 0.5)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(59, 130, 246, 0.2)' : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Retour en haut de page"
          >
            <img
              src={logo}
              alt="Logo Nexus Développement"
              className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_0_15px_rgba(100,150,255,0.6)] transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-[0_0_25px_rgba(100,150,255,0.9)]"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(100,150,255,0.8)]">
                Nexus
              </span>
              <span className="font-semibold text-xs md:text-sm text-blue-300 tracking-wider drop-shadow-[0_1px_8px_rgba(100,150,255,0.6)]">
                Développement
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/5 hover:text-blue-300 focus:bg-white/5 focus:text-blue-300 transition-all duration-300 text-base font-medium">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#0A0F1E]/95 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <ListItem title="Sites Vitrine" href="/creation-site-web">
                        Sites modernes et performants pour votre présence en ligne.
                      </ListItem>
                      <ListItem title="Automatisation" href="/automatisation">
                        Optimisez vos processus et gagnez du temps précieux.
                      </ListItem>
                      <ListItem title="Applications Web" href="/applications-web">
                        Solutions logicielles puissantes accessibles par navigateur.
                      </ListItem>
                      <ListItem title="Applications Mobiles" href="/applications-mobiles">
                        Apps natives iOS et Android pour vos clients.
                      </ListItem>
                      <ListItem title="Identité Visuelle" href="/identite-visuelle">
                        Logos et branding pour une image de marque forte.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <button onClick={() => scrollToSection("tarifs")} className="text-white hover:text-blue-300 font-medium transition-colors hover:drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]">
              Tarifs
            </button>
            <button onClick={() => scrollToSection("reservation")} className="text-white hover:text-blue-300 font-medium transition-colors hover:drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]">
              Réserver
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-white hover:text-blue-300 font-medium transition-colors hover:drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]">
              Contact
            </button>

            <Button
              onClick={() => scrollToSection('devis')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-all duration-300 transform hover:scale-105 border border-blue-400/30"
            >
              Demander un devis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 bg-[#0A0F1E]/98 backdrop-blur-xl border-b border-blue-500/20 absolute top-20 left-0 right-0 shadow-2xl animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-2 p-4">
              <div className="font-bold text-blue-400 px-4 py-3 text-sm tracking-wider uppercase opacity-80">Nos Services</div>
              <Link to="/creation-site-web" className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-colors flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                Sites Vitrine <span className="text-blue-500/50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/automatisation" className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-colors flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                Automatisation <span className="text-blue-500/50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/applications-web" className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-colors flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                Applications Web <span className="text-blue-500/50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/applications-mobiles" className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-colors flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                Applications Mobiles <span className="text-blue-500/50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/identite-visuelle" className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg transition-colors flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                Identité Visuelle <span className="text-blue-500/50 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent my-4"></div>

              <button onClick={() => scrollToSection('tarifs')} className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg text-left transition-colors">Tarifs</button>
              <button onClick={() => scrollToSection('reservation')} className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg text-left transition-colors">Réserver</button>
              <button onClick={() => scrollToSection('contact')} className="px-4 py-3 text-white hover:bg-blue-500/10 hover:text-blue-300 rounded-lg text-left transition-colors">Contact</button>

              <Button
                onClick={() => scrollToSection('devis')}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-900/20"
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

interface ListItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  href: string;
  children: React.ReactNode;
}

const ListItem = ({ className, title, children, href, ...props }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-blue-500/10 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group border border-transparent hover:border-blue-500/20",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none text-blue-100 group-hover:text-blue-300 flex items-center gap-2">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-400 group-hover:text-blue-200/70 mt-2">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default Navigation;
