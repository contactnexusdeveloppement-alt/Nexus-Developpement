import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Building, Shield, Globe, Users, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";
import { motion } from "framer-motion";

const LegalNotice = () => {
  useEffect(() => {
    document.title = "Mentions Légales | Nexus Développement";
  }, []);

  const sections = [
    {
      icon: Building,
      title: "1. Éditeur du site",
      content: (
        <div className="space-y-2 text-slate-300">
          <p><strong className="text-white">Raison sociale :</strong> Nexus Développement</p>
          <p><strong className="text-white">Forme juridique :</strong> SARL en cours d'immatriculation</p>
          <p><strong className="text-white">Capital social :</strong> 500 €</p>
          <p><strong className="text-white">Siège social :</strong> 4 rue de la Ferme, 78990 Élancourt, France</p>
          <p><strong className="text-white">SIRET :</strong> En cours d'obtention</p>
          <p><strong className="text-white">TVA Intracommunautaire :</strong> En cours d'obtention</p>
          <p><strong className="text-white">Directeur de la publication :</strong> Adam Le Charlès & Théo Jacobée</p>
        </div>
      )
    },
    {
      icon: Globe,
      title: "2. Hébergement",
      content: (
        <div className="space-y-2 text-slate-300">
          <p><strong className="text-white">Hébergeur :</strong> Netlify, Inc.</p>
          <p><strong className="text-white">Adresse :</strong> 2325 3rd Street, Suite 215, San Francisco, California 94107</p>
          <p><strong className="text-white">Site web :</strong> <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline transition-colors">https://netlify.com</a></p>
        </div>
      )
    },
    {
      icon: Shield,
      title: "3. Propriété intellectuelle",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>
        </div>
      )
    },
    {
      icon: Scale,
      title: "4. Responsabilité",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les informations communiquées sur le site sont fournies à titre indicatif, elles sont non contractuelles et ne sauraient engager la responsabilité de Nexus Développement.
            Elles peuvent être modifiées ou mises à jour sans préavis.
          </p>
          <p>
            La responsabilité de Nexus Développement ne saurait être engagée pour :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Les dommages de toute nature, directs ou indirects, résultant de l'utilisation du site.</li>
            <li>L'impossibilité d'accéder au site.</li>
            <li>Les omissions et/ou erreurs que pourrait contenir le site.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen relative font-sans text-slate-200">
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center md:justify-start">
            <Link to="/">
              <Button variant="ghost" className="mb-12 text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
              Mentions Légales
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              La transparence est la base de notre relation de confiance.
            </p>
          </motion.div>

          <div className="grid gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                    <section.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 w-full">
                    <h2 className="text-xl font-bold text-white mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3">
                      {section.title}
                    </h2>
                    {section.content}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-slate-400 mb-4">Une question supplémentaire ?</p>
              <a
                href="mailto:contact.nexus.developpement@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 transition-all duration-300 break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all text-sm sm:text-base">contact.nexus.developpement@gmail.com</span>
              </a>
            </motion.div>
          </div>

          <div className="mt-20 text-center border-t border-white/5 pt-8">
            <p className="text-slate-500 text-sm">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
