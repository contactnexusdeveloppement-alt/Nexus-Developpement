import { Link } from "react-router-dom";
import logo from "@/assets/nexus-logo.webp";
import { Facebook, Twitter, Instagram, Linkedin, Send, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 border-t border-blue-500/10 bg-slate-950 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img
                src={logo}
                alt="Logo Nexus Développement"
                className="w-12 h-12 transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-xl font-bold text-white tracking-wide">Nexus</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Partenaire de votre transformation digitale. Nous concevons le futur du web, une ligne de code à la fois.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "https://www.instagram.com/nexus_developpement/", label: "Instagram" },
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61584419880166&sk=about", label: "Facebook" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-900 border border-blue-500/20 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Services</h3>
            <ul className="space-y-4">
              {[
                { label: "Création de sites", href: "#services" },
                { label: "Applications Web", href: "#services" },
                { label: "Automatisation", href: "#services" },
                { label: "Consulting", href: "#services" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Entreprise</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/equipe" className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-2 group transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-400 transition-colors" />
                  Notre Équipe
                </Link>
              </li>
              <li>
                <a href="#portfolio" className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-2 group transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-400 transition-colors" />
                  Nos réalisations
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-2 group transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-400 transition-colors" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              L'actualité du digital et nos conseils tech directement dans votre boîte mail.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Votre email..."
                className="w-full bg-slate-900 border border-blue-500/20 rounded-xl py-3 px-4 text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all pr-12"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                aria-label="S'inscrire"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </div>
        </div>

        {/* Location Info - SEO Local */}
        <div className="pt-6 pb-4 text-center">
          <p className="text-slate-400 text-sm">
            Agence Web basée à <span className="text-blue-400 font-medium">Élancourt (78)</span>, au cœur de Saint-Quentin-en-Yvelines.
            <span className="block mt-1">Nous intervenons partout en France pour accompagner votre transformation digitale.</span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Nexus Développement. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-blue-400 transition-colors">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-blue-400 transition-colors">Politique de confidentialité</Link>
            <Link to="/cgu" className="hover:text-blue-400 transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
