import { Link } from "react-router-dom";
import logo from "@/assets/nexus-logo.png";

const Footer = () => {
  return (
    <footer className="relative py-8 border-t border-blue-500/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo Nexus Développement" className="w-12 h-12" />
              <span className="text-xl font-bold text-white tracking-wide">Nexus Développement</span>
            </div>
            <p className="text-slate-400 mb-4 text-sm leading-relaxed max-w-sm">
              Votre partenaire digital pour accélérer votre transformation numérique.
              Sites web, automatisation et identité visuelle.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Création de sites</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Automatisation</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Logos</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Branding</a></li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Liens utiles</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#tarifs" className="hover:text-blue-400 transition-colors">Tarifs</a></li>
              <li><a href="#devis" className="hover:text-blue-400 transition-colors">Devis gratuit</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><Link to="/mentions-legales" className="hover:text-blue-400 transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Nexus Développement. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
