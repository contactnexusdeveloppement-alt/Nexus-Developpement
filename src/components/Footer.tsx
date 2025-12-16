import { Link } from "react-router-dom";
import logo from "@/assets/nexus-logo.png";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-blue-500/30">
      {/* Overlay léger pour rendre le texte lisible sans masquer l'arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo Nexus Développement - Agence digitale création sites web et automatisation à Élancourt" className="w-14 h-14 drop-shadow-[0_0_10px_rgba(100,150,255,0.5)] transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 hover:drop-shadow-[0_0_20px_rgba(100,150,255,0.8)]" />
              <span className="text-2xl font-bold text-white">Nexus Développement</span>
            </div>
            <p className="text-white/80 mb-4">
              Votre partenaire digital pour accélérer votre transformation numérique.
              Sites web, automatisation et identité visuelle.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Création de sites</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Automatisation</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Logos</a></li>
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Branding</a></li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Liens utiles</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#tarifs" className="hover:text-cyan-300 transition-colors">Tarifs</a></li>
              <li><a href="#devis" className="hover:text-cyan-300 transition-colors">Devis gratuit</a></li>
              <li><a href="#contact" className="hover:text-cyan-300 transition-colors">Contact</a></li>
              <li><Link to="/mentions-legales" className="hover:text-cyan-300 transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Nexus Développement. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
